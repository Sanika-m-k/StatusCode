const express = require('express');
const router = express.Router();
const { verifyUser } = require('../controllers/userController');
// const { validateAuth0Token } = require('../config/auth0');

// Apply Auth0 validation middleware
router.get('/verify', verifyUser);

module.exports = router;