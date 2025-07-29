const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  },
  propertyType: {
    type: String,
    enum: ['house', 'apartment', 'condo', 'townhouse', 'land'],
    required: true
  },
  status: {
    type: String,
    enum: ['for-sale', 'for-rent', 'sold', 'rented'],
    required: true
  },
  features: {
    bedrooms: {
      type: Number,
      required: true
    },
    bathrooms: {
      type: Number,
      required: true
    },
    area: {
      type: Number,
      required: true
    },
    parking: {
      type: Number,
      default: 0
    },
    yearBuilt: Number
  },
  images: [{
    type: String,
    required: true
  }],
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAdvertised: {
    type: Boolean,
    default: false
  },
  advertisementEndDate: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search optimization
propertySchema.index({ 
  title: 'text', 
  'location.city': 'text', 
  'location.state': 'text',
  propertyType: 1,
  status: 1,
  price: 1
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property; 