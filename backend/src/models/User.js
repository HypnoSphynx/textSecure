import mongoose from "mongoose";
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";
import keyManager from "../utils/keyManager.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  // RSA Key fields - optional initially, will be generated during save
  publicKey: {
    type: String,
    required: false
  },
  encryptedPrivateKey: {
    type: String,
    required: false
  },
  keyFingerprint: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Encryption key (in production, this should be in environment variables)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-secret-key-32-chars-long!!";

// Salt rounds for bcrypt (10-12 is recommended for production)
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

// Function to hash password using bcrypt with salt
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Password hashing failed");
  }
};

// Function to encrypt data
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

// Function to decrypt data
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedData; // Return original if decryption fails
  }
};

// Pre-save middleware to hash password, encrypt sensitive data, and generate RSA keys
userSchema.pre("save", async function(next) {
  try {
    if (this.isModified("password")) {
      this.password = await hashPassword(this.password);
    }
    
    // Only encrypt if the field is not already encrypted (check if it contains encrypted format)
    if (this.isModified("mobileNumber") && this.mobileNumber && !this.mobileNumber.includes('U2F')) {
      this.mobileNumber = encryptData(this.mobileNumber);
    }
    
    if (this.isModified("email") && this.email && !this.email.includes('U2F')) {
      this.email = encryptData(this.email);
    }
    
    if (this.isModified("district") && this.district && !this.district.includes('U2F')) {
      this.district = encryptData(this.district);
    }

    // Generate RSA keys if they don't exist
    if (!this.publicKey || !this.encryptedPrivateKey || !this.keyFingerprint) {
      try {
        const keyPair = keyManager.generateKeyPair();
        this.publicKey = keyPair.publicKey;
        this.encryptedPrivateKey = keyPair.encryptedPrivateKey;
        this.keyFingerprint = keyManager.getPublicKeyFingerprint(keyPair.publicKey);
        console.log(`Generated RSA keys for user: ${this.username}`);
      } catch (error) {
        console.error(`Error generating RSA keys for user ${this.username}:`, error);
        // Don't fail the save operation if RSA key generation fails
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to decrypt data when retrieving
userSchema.methods.decryptUserData = function() {
  const userObj = this.toObject();
  
  try {
    // Decrypt sensitive fields
    if (userObj.mobileNumber) {
      userObj.mobileNumber = decryptData(userObj.mobileNumber);
    }
    
    if (userObj.email) {
      userObj.email = decryptData(userObj.email);
    }
    
    if (userObj.district) {
      userObj.district = decryptData(userObj.district);
    }
  } catch (error) {
    console.error("Error decrypting user data:", error);
    // If decryption fails, return the data as-is
  }
  
  // Remove password and private key from response
  delete userObj.password;
  delete userObj.encryptedPrivateKey;
  
  return userObj;
};

// Instance method to compare password using bcrypt
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

// Instance method to decrypt messages using user's private key
userSchema.methods.decryptMessage = function(encryptedMessage) {
  try {
    if (!this.encryptedPrivateKey) {
      throw new Error("User does not have a private key");
    }
    return keyManager.decryptWithPrivateKey(encryptedMessage, this.encryptedPrivateKey);
  } catch (error) {
    console.error("Error decrypting message:", error);
    throw new Error("Failed to decrypt message");
  }
};

// Static method to encrypt message for a user using their public key
userSchema.statics.encryptMessageForUser = function(userId, message) {
  return this.findById(userId).then(user => {
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.publicKey) {
      throw new Error("User does not have a public key");
    }
    return keyManager.encryptWithPublicKey(message, user.publicKey);
  });
};

const User = mongoose.model("User", userSchema);

export default User;