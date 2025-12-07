import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // Make name optional
  name: {
    type: String,
    trim: true
  },
  // These should be required
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer'
  },
  // ADD THIS: Active status field for admin panel
  active: {
    type: Boolean,
    default: true
  },
  // ADD THIS: Last login tracking
  lastLogin: {
    type: Date,
    default: null
  },
  notifications: {
    orderUpdates: { 
      type: Boolean, 
      default: true 
    },
    promotionalEmails: { 
      type: Boolean, 
      default: true 
    },
    newProducts: { 
      type: Boolean, 
      default: true 
    },
    projectIdeas: { 
      type: Boolean, 
      default: true 
    }
  },
  settings: {
    emailVerified: { 
      type: Boolean, 
      default: false 
    },
    twoFactorEnabled: { 
      type: Boolean, 
      default: false 
    },
    privacyLevel: { 
      type: String, 
      enum: ['public', 'private', 'friends'], 
      default: 'private' 
    }
  },
  addresses: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    type: {
      type: String,
      enum: ['shipping', 'billing'],
      default: 'shipping'
    },
    name: String,
    street: String,
    apartment: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
    isDefault: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // FIXED: Moved orders to the correct position (outside addresses)
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, {
  timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Set virtuals in JSON output
userSchema.set('toJSON', { virtuals: true });

// Pre-save middleware to automatically set name from firstName + lastName
userSchema.pre('save', function(next) {
  // Always set name from firstName + lastName
  if (this.firstName && this.lastName) {
    this.name = `${this.firstName} ${this.lastName}`;
  }
  
  // Ensure addresses have proper ObjectIds
  if (this.addresses) {
    this.addresses.forEach(addr => {
      if (!addr._id) {
        addr._id = new mongoose.Types.ObjectId();
      }
    });
  }
  
  next();
});

// Clear any existing model to avoid caching issues
delete mongoose.connection.models['User'];

export default mongoose.models.User || mongoose.model('User', userSchema);