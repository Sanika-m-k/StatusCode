require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logging middleware

// Auth0 authentication middleware
const jwtCheck = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

// Simple route to verify the server is running
app.get('/', (req, res) => {
  res.send('StatusPage API is running!');
});

// Protected routes - require authentication
app.use('/api/protected', jwtCheck);

// Protected route that checks if the user's email is verified
app.get('/api/protected/validate-email', jwtCheck, (req, res) => {
  const user = req.auth;
  
  // In a real app, you might fetch this from Auth0 Management API
  // For this example, we'll assume the token includes the email_verified claim
  if (!user || user.email_verified === false) {
    return res.status(403).json({ 
      message: 'Email verification required' 
    });
  }
  
  res.json({ 
    message: 'Email verified successfully', 
    user: {
      sub: user.sub,
      email: user.email,
      isEmailVerified: user.email_verified
    }
  });
});

// Example protected user info endpoint
app.get('/api/protected/user', jwtCheck, (req, res) => {
  const user = req.auth;
  
  res.json({
    message: 'User info retrieved successfully',
    user: {
      sub: user.sub,
      email: user.email
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token or missing authentication' });
  }
  
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});