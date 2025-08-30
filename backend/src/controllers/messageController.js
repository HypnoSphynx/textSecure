import Message from "../models/Message.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import keyManager from "../utils/keyManager.js";
import CryptoJS from "crypto-js";

// Test endpoint to verify API is working
export const testMessages = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Messages API is working",
      userId: req.userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Test endpoint error",
      error: error.message
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.userId;

    // Validate input
    if (!recipientId || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Recipient ID and message content are required"
      });
    }

    // Check if recipient exists and has RSA keys
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found"
      });
    }

    if (!recipient.publicKey) {
      return res.status(400).json({
        success: false,
        message: "Recipient does not have valid encryption keys"
      });
    }

    // Get sender with public key
    const sender = await User.findById(senderId);
    if (!sender || !sender.publicKey) {
      return res.status(400).json({
        success: false,
        message: "Sender does not have valid encryption keys"
      });
    }

    // Prevent sending message to self
    if (senderId === recipientId) {
      return res.status(400).json({
        success: false,
        message: "Cannot send message to yourself"
      });
    }

    // Encrypt the message content with recipient's public key
    const encryptedContentForRecipient = keyManager.encryptWithPublicKey(content.trim(), recipient.publicKey);
    
    // Encrypt the message content with sender's public key (for sender to decrypt later)
    const encryptedContentForSender = keyManager.encryptWithPublicKey(content.trim(), sender.publicKey);
    
    // Generate content hash for integrity verification
    const contentHash = CryptoJS.SHA256(content.trim()).toString();

    // Create and save message
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      encryptedContentForRecipient: encryptedContentForRecipient,
      encryptedContentForSender: encryptedContentForSender,
      contentHash: contentHash,
      encryptionMetadata: {
        algorithm: 'RSA-2048',
        senderKeyFingerprint: sender.keyFingerprint,
        recipientKeyFingerprint: recipient.keyFingerprint,
        timestamp: new Date()
      }
    });

    await message.save();

    // Populate sender and recipient details
    await message.populate([
      { path: 'sender', select: 'username' },
      { path: 'recipient', select: 'username' }
    ]);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: {
        ...message.toObject(),
        content: content.trim() // Include original content in response for sender
      }
    });

  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message
    });
  }
};

// Get conversation between two users
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Get current user with private key for decryption
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found"
      });
    }

    // Get messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId }
      ]
    })
    .populate('sender', 'username')
    .populate('recipient', 'username')
    .sort({ createdAt: 1 });

    // Decrypt messages for the current user
    const decryptedMessages = messages.map(message => {
      const messageObj = message.toObject();
      
      try {
        // Decrypt content based on whether current user is sender or recipient
        if (message.recipient._id.toString() === currentUserId.toString()) {
          // Current user is recipient - decrypt with recipient's private key
          const decryptedContent = currentUser.decryptMessage(message.encryptedContentForRecipient);
          messageObj.content = decryptedContent;
          
          // Verify content integrity
          const expectedHash = CryptoJS.SHA256(decryptedContent).toString();
          if (expectedHash !== message.contentHash) {
            messageObj.contentIntegrityWarning = true;
          }
        } else {
          // Current user is sender - decrypt with sender's private key
          const decryptedContent = currentUser.decryptMessage(message.encryptedContentForSender);
          messageObj.content = decryptedContent;
          
          // Verify content integrity
          const expectedHash = CryptoJS.SHA256(decryptedContent).toString();
          if (expectedHash !== message.contentHash) {
            messageObj.contentIntegrityWarning = true;
          }
        }
      } catch (error) {
        console.error("Error decrypting message:", error);
        messageObj.content = "[Message could not be decrypted]";
        messageObj.decryptionError = true;
      }
      
      return messageObj;
    });

    res.status(200).json({
      success: true,
      data: decryptedMessages
    });

  } catch (error) {
    console.error("Error getting conversation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get conversation",
      error: error.message
    });
  }
};

// Get all conversations for current user
export const getConversations = async (req, res) => {
  try {
    const currentUserId = req.userId;
    console.log('Getting conversations for user:', currentUserId);

    // First, let's try a simpler approach
    const messages = await Message.find({
      $or: [
        { sender: currentUserId },
        { recipient: currentUserId }
      ]
    })
    .populate('sender', 'username')
    .populate('recipient', 'username')
    .sort({ createdAt: -1 });

    console.log('Found messages:', messages.length);

    // Group messages by conversation partner
    const conversationMap = new Map();
    
    messages.forEach(message => {
      const currentUserIdStr = currentUserId.toString();
      const senderIdStr = message.sender._id.toString();
      const recipientIdStr = message.recipient._id.toString();
      
      const partnerId = senderIdStr === currentUserIdStr 
        ? recipientIdStr 
        : senderIdStr;
      
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          _id: senderIdStr === currentUserIdStr ? message.recipient : message.sender,
          lastMessage: message,
          unreadCount: 0
        });
      } else {
        // Update unread count for messages sent to current user
        if (recipientIdStr === currentUserIdStr && !message.isRead) {
          conversationMap.get(partnerId).unreadCount++;
        }
      }
    });

    const conversations = Array.from(conversationMap.values());
    console.log('Processed conversations:', conversations.length);

    res.status(200).json({
      success: true,
      data: conversations
    });

  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get conversations",
      error: error.message
    });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.userId;

    const message = await Message.findOneAndUpdate(
      {
        _id: messageId,
        recipient: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found or already read"
      });
    }

    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: message
    });

  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark message as read",
      error: error.message
    });
  }
};
