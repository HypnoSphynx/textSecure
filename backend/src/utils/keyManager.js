import forge from 'node-forge';
import CryptoJS from 'crypto-js';

class KeyManager {
  constructor() {
    // Master encryption key for protecting private keys (should be in environment variables)
    this.masterKey = process.env.MASTER_ENCRYPTION_KEY || 'your-master-key-32-chars-long!!';
  }

  /**
   * Generate a new RSA key pair
   * @param {number} keySize - RSA key size (default: 2048 bits)
   * @returns {Object} - Object containing encrypted private key and public key
   */
  generateKeyPair(keySize = 2048) {
    try {
      // Generate RSA key pair
      const keypair = forge.pki.rsa.generateKeyPair({ bits: keySize });
      
      // Get public key in PEM format
      const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
      
      // Get private key in PEM format
      const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
      
      // Encrypt the private key with master key
      const encryptedPrivateKey = this.encryptWithMasterKey(privateKeyPem);
      
      return {
        publicKey: publicKeyPem,
        encryptedPrivateKey: encryptedPrivateKey
      };
    } catch (error) {
      console.error('Error generating RSA key pair:', error);
      throw new Error('Failed to generate RSA key pair');
    }
  }

  /**
   * Encrypt data with a public key
   * @param {string} data - Data to encrypt
   * @param {string} publicKeyPem - Public key in PEM format
   * @returns {string} - Encrypted data in base64 format
   */
  encryptWithPublicKey(data, publicKeyPem) {
    try {
      // Parse the public key
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
      
      // Encrypt the data
      const encrypted = publicKey.encrypt(data, 'RSAES-PKCS1-V1_5');
      
      // Convert to base64
      return forge.util.encode64(encrypted);
    } catch (error) {
      console.error('Error encrypting with public key:', error);
      throw new Error('Failed to encrypt data with public key');
    }
  }

  /**
   * Decrypt data with a private key
   * @param {string} encryptedData - Encrypted data in base64 format
   * @param {string} encryptedPrivateKeyPem - Encrypted private key
   * @returns {string} - Decrypted data
   */
  decryptWithPrivateKey(encryptedData, encryptedPrivateKeyPem) {
    try {
      // Decrypt the private key first
      const privateKeyPem = this.decryptWithMasterKey(encryptedPrivateKeyPem);
      
      // Parse the private key
      const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
      
      // Decode the encrypted data from base64
      const encryptedBytes = forge.util.decode64(encryptedData);
      
      // Decrypt the data
      const decrypted = privateKey.decrypt(encryptedBytes, 'RSAES-PKCS1-V1_5');
      
      return decrypted;
    } catch (error) {
      console.error('Error decrypting with private key:', error);
      throw new Error('Failed to decrypt data with private key');
    }
  }

  /**
   * Encrypt data with master key (for protecting private keys)
   * @param {string} data - Data to encrypt
   * @returns {string} - Encrypted data
   */
  encryptWithMasterKey(data) {
    try {
      return CryptoJS.AES.encrypt(data, this.masterKey).toString();
    } catch (error) {
      console.error('Error encrypting with master key:', error);
      throw new Error('Failed to encrypt with master key');
    }
  }

  /**
   * Decrypt data with master key
   * @param {string} encryptedData - Encrypted data
   * @returns {string} - Decrypted data
   */
  decryptWithMasterKey(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.masterKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error decrypting with master key:', error);
      throw new Error('Failed to decrypt with master key');
    }
  }

  /**
   * Validate if a public key is valid
   * @param {string} publicKeyPem - Public key in PEM format
   * @returns {boolean} - True if valid, false otherwise
   */
  validatePublicKey(publicKeyPem) {
    try {
      forge.pki.publicKeyFromPem(publicKeyPem);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get public key fingerprint for identification
   * @param {string} publicKeyPem - Public key in PEM format
   * @returns {string} - SHA-256 fingerprint
   */
  getPublicKeyFingerprint(publicKeyPem) {
    try {
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
      const der = forge.asn1.toDer(forge.pki.publicKeyToAsn1(publicKey));
      const md = forge.md.sha256.create();
      md.update(der.getBytes());
      return md.digest().toHex();
    } catch (error) {
      console.error('Error generating public key fingerprint:', error);
      throw new Error('Failed to generate public key fingerprint');
    }
  }

  /**
   * Verify key pair integrity
   * @param {string} publicKeyPem - Public key in PEM format
   * @param {string} encryptedPrivateKeyPem - Encrypted private key
   * @returns {boolean} - True if key pair is valid
   */
  verifyKeyPairIntegrity(publicKeyPem, encryptedPrivateKeyPem) {
    try {
      // Decrypt private key
      const privateKeyPem = this.decryptWithMasterKey(encryptedPrivateKeyPem);
      
      // Parse both keys
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
      const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
      
      // Test encryption/decryption with a small test message
      const testMessage = 'test';
      const encrypted = publicKey.encrypt(testMessage, 'RSAES-PKCS1-V1_5');
      const decrypted = privateKey.decrypt(encrypted, 'RSAES-PKCS1-V1_5');
      
      return decrypted === testMessage;
    } catch (error) {
      console.error('Error verifying key pair integrity:', error);
      return false;
    }
  }

  /**
   * Get key information (size, algorithm, etc.)
   * @param {string} publicKeyPem - Public key in PEM format
   * @returns {Object} - Key information
   */
  getKeyInfo(publicKeyPem) {
    try {
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
      return {
        algorithm: 'RSA',
        keySize: publicKey.n.bitLength(),
        fingerprint: this.getPublicKeyFingerprint(publicKeyPem),
        format: 'PEM'
      };
    } catch (error) {
      console.error('Error getting key info:', error);
      throw new Error('Failed to get key information');
    }
  }
}

// Create and export a singleton instance
const keyManager = new KeyManager();
export default keyManager;
