import mongoose from "mongoose";
import User from "../models/User.js";
import keyManager from "./keyManager.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Migration function to add RSA keys to existing users
const migrateUsers = async () => {
  try {
    console.log("Starting user migration to add RSA keys...");
    
    // Find all users without RSA keys
    const usersWithoutKeys = await User.find({
      $or: [
        { publicKey: { $exists: false } },
        { publicKey: null },
        { encryptedPrivateKey: { $exists: false } },
        { encryptedPrivateKey: null },
        { keyFingerprint: { $exists: false } },
        { keyFingerprint: null }
      ]
    });

    console.log(`Found ${usersWithoutKeys.length} users without RSA keys`);

    if (usersWithoutKeys.length === 0) {
      console.log("All users already have RSA keys. Migration complete.");
      return;
    }

    // Generate RSA keys for each user
    for (const user of usersWithoutKeys) {
      try {
        console.log(`Generating RSA keys for user: ${user.username}`);
        
        // Generate new key pair
        const keyPair = keyManager.generateKeyPair();
        console.log(`✓ Key pair generated for ${user.username}`);
        
        // Update user with new keys
        user.publicKey = keyPair.publicKey;
        user.encryptedPrivateKey = keyPair.encryptedPrivateKey;
        user.keyFingerprint = keyManager.getPublicKeyFingerprint(keyPair.publicKey);
        
        // Save user
        await user.save();
        console.log(`✓ User ${user.username} saved with RSA keys`);
        
        // Verify key pair integrity
        const isValid = keyManager.verifyKeyPairIntegrity(user.publicKey, user.encryptedPrivateKey);
        if (isValid) {
          console.log(`✓ Key pair verified for user: ${user.username}`);
        } else {
          console.error(`✗ Key pair verification failed for user: ${user.username}`);
        }
        
        // Test encryption/decryption
        const testMessage = "Test message for key verification";
        const encrypted = keyManager.encryptWithPublicKey(testMessage, user.publicKey);
        const decrypted = keyManager.decryptWithPrivateKey(encrypted, user.encryptedPrivateKey);
        
        if (testMessage === decrypted) {
          console.log(`✓ Encryption/decryption test passed for ${user.username}`);
        } else {
          console.error(`✗ Encryption/decryption test failed for ${user.username}`);
        }
        
      } catch (error) {
        console.error(`Error generating keys for user ${user.username}:`, error);
      }
    }

    console.log("User migration completed successfully!");
    
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  connectDB().then(() => {
    migrateUsers();
  });
}

export default migrateUsers;
