const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn', 'completed'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true
  },
  payment: {
    stripePaymentIntentId: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    amount: Number,
    currency: {
      type: String,
      default: 'usd'
    },
    paymentMethod: String,
    paymentDate: Date
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Offers expire in 7 days by default
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  },
  terms: {
    type: String,
    required: true
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient querying
offerSchema.index({ property: 1, buyer: 1, status: 1 });

// Prevent multiple pending offers from the same buyer for the same property
offerSchema.index(
  { property: 1, buyer: 1, status: 'pending' },
  { unique: true, partialFilterExpression: { status: 'pending' } }
);

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer; 