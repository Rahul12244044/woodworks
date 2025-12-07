// models/Subscriber.js
import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  },
  preferences: {
    weeklyTips: { type: Boolean, default: true },
    projectIdeas: { type: Boolean, default: true },
    toolReviews: { type: Boolean, default: true },
    specialOffers: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Index for better performance
subscriberSchema.index({ active: 1 });

export default mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);