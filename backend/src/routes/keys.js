import express from 'express';
import { getKeyInfo, rotateKeys, validateKeys, testEncryption } from '../controllers/keyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get current user's key information
router.get('/info', getKeyInfo);

// Validate user's key pair
router.get('/validate', validateKeys);

// Rotate user's RSA keys
router.post('/rotate', rotateKeys);

// Test encryption/decryption with current keys
router.post('/test', testEncryption);

export default router;
