import User from "../models/User.js";
import keyManager from "../utils/keyManager.js";

// Get current user's key information
export const getKeyInfo = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const keyInfo = keyManager.getKeyInfo(user.publicKey);
    const isKeyPairValid = keyManager.verifyKeyPairIntegrity(user.publicKey, user.encryptedPrivateKey);

    res.status(200).json({
      success: true,
      data: {
        keyInfo,
        isKeyPairValid,
        keyFingerprint: user.keyFingerprint,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Error getting key info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get key information",
      error: error.message
    });
  }
};

// Rotate user's RSA keys
export const rotateKeys = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate new key pair
    const newKeyPair = keyManager.generateKeyPair();
    
    // Update user with new keys
    user.publicKey = newKeyPair.publicKey;
    user.encryptedPrivateKey = newKeyPair.encryptedPrivateKey;
    user.keyFingerprint = keyManager.getPublicKeyFingerprint(newKeyPair.publicKey);
    
    await user.save();

    const keyInfo = keyManager.getKeyInfo(user.publicKey);

    res.status(200).json({
      success: true,
      message: "Keys rotated successfully",
      data: {
        keyInfo,
        keyFingerprint: user.keyFingerprint,
        rotatedAt: new Date()
      }
    });

  } catch (error) {
    console.error("Error rotating keys:", error);
    res.status(500).json({
      success: false,
      message: "Failed to rotate keys",
      error: error.message
    });
  }
};

// Validate user's key pair
export const validateKeys = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isKeyPairValid = keyManager.verifyKeyPairIntegrity(user.publicKey, user.encryptedPrivateKey);
    const keyInfo = keyManager.getKeyInfo(user.publicKey);

    res.status(200).json({
      success: true,
      data: {
        isValid: isKeyPairValid,
        keyInfo,
        keyFingerprint: user.keyFingerprint
      }
    });

  } catch (error) {
    console.error("Error validating keys:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate keys",
      error: error.message
    });
  }
};

// Test encryption/decryption with current keys
export const testEncryption = async (req, res) => {
  try {
    const userId = req.userId;
    const { testMessage } = req.body;

    if (!testMessage) {
      return res.status(400).json({
        success: false,
        message: "Test message is required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Test encryption with public key
    const encrypted = keyManager.encryptWithPublicKey(testMessage, user.publicKey);
    
    // Test decryption with private key
    const decrypted = keyManager.decryptWithPrivateKey(encrypted, user.encryptedPrivateKey);

    const isSuccessful = decrypted === testMessage;

    res.status(200).json({
      success: true,
      data: {
        isSuccessful,
        originalMessage: testMessage,
        encryptedMessage: encrypted,
        decryptedMessage: decrypted,
        keyFingerprint: user.keyFingerprint
      }
    });

  } catch (error) {
    console.error("Error testing encryption:", error);
    res.status(500).json({
      success: false,
      message: "Failed to test encryption",
      error: error.message
    });
  }
};
