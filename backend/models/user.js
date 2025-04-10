const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  auth0Id: {
    type: String,
    required: true,
    unique: true
  },
  picture: {
    type: String
  },
  organizations: [{
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    },
  }],
 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can't be added to the same organization twice
UserSchema.index({ auth0Id: 1, 'organizations.organization': 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);