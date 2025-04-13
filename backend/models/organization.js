const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: String,
    ref: 'User',
    required: true
  },
  info: {
    type: String,
    trim: true
  },
  employeeCount: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;