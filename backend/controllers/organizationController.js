// server/controllers/userController.js
const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');
const User = require('../models/User');

// Verify user and create if not exists
const createOrganization = async (req, res) => {
    try {
        const { name, domain, info, employeeCount } = req.body;
        const auth0ID = req.auth.sub;
        if (!auth0ID) {
            return res.status(400).json({ message: 'userId not found in token' });
        }
    
        // Create a new organization
        let organization = new Organization({
        name,
        domain,
        info,
        owner: auth0ID,
        employeeCount
            });
    
        await organization.save();
        // Add organization ID to the user's organizations array
        await User.findOneAndUpdate(
            { auth0ID },
            { $push: { organizations: organization._id } },
            { new: true, upsert: true }
        );
        res.status(201).json({ message: 'Organization created successfully', organization });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    }

module.exports = { createOrganization };