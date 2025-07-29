const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  notes: [{
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    },
    note: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Ensure each user has only one wishlist
wishlistSchema.index({ user: 1 }, { unique: true });

// Ensure no duplicate properties in the wishlist
wishlistSchema.pre('save', function(next) {
  this.properties = [...new Set(this.properties)];
  next();
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist; 