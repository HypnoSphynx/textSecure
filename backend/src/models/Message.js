import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Encrypted content using recipient's public key (for recipient to decrypt)
  encryptedContentForRecipient: {
    type: String,
    required: true
  },
  // Encrypted content using sender's public key (for sender to decrypt)
  encryptedContentForSender: {
    type: String,
    required: true
  },
  // Original content hash for integrity verification
  contentHash: {
    type: String,
    required: true
  },
  // Encryption metadata
  encryptionMetadata: {
    algorithm: {
      type: String,
      default: 'RSA-2048'
    },
    senderKeyFingerprint: {
      type: String,
      required: true
    },
    recipientKeyFingerprint: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });
messageSchema.index({ 'encryptionMetadata.senderKeyFingerprint': 1 });
messageSchema.index({ 'encryptionMetadata.recipientKeyFingerprint': 1 });

// Virtual for getting decrypted content (will be populated when needed)
messageSchema.virtual('content').get(function() {
  return this._content;
});

messageSchema.virtual('content').set(function(value) {
  this._content = value;
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
