// models/Order.js - Updated with return requests
import mongoose from 'mongoose';

const returnRequestSchema = new mongoose.Schema({
  returnId: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    reason: {
      type: String,
      required: true,
      enum: ['wrong-item', 'damaged', 'not-as-described', 'size-issue', 'changed-mind', 'other']
    },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'processed', 'refunded'],
      default: 'pending'
    }
  }],
  reason: {
    type: String,
    required: true,
    enum: ['wrong-item', 'damaged', 'not-as-described', 'size-issue', 'changed-mind', 'other']
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processed', 'refunded'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date,
  refundAmount: Number,
  trackingNumber: String,
  adminNotes: String
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  guestUser: {
    email: {
      type: String,
      required: function() {
        return !this.userId;
      }
    },
    name: String,
    phone: String
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    dimensions: {
      length: Number,
      width: Number,
      thickness: Number
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    returnEligible: {
      type: Boolean,
      default: true
    }
  }],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: 'United States' }
  },
  // In your models/Orders.js, update the paymentMethod enum
  paymentMethod: {
   type: String,
   required: true,
   enum: ['credit_card', 'paypal', 'apple_pay', 'google_pay', 'bank_transfer', 'cash_on_delivery']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partial_refund'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  finalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'return_requested'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    note: String,
    updatedAt: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  }],
  returnRequests: {
    type: [returnRequestSchema],
    default: [] // Add this default value
  },
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  orderType: {
    type: String,
    enum: ['user', 'guest'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Generate return ID
returnRequestSchema.statics.generateReturnId = async function() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  const todaysReturnCount = await this.countDocuments({
    requestedAt: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });
  
  const sequence = String(todaysReturnCount + 1).padStart(3, '0');
  return `RET-${year}${month}${day}-${sequence}`;
};

orderSchema.pre('save', function(next) {
  this.items.forEach(item => {
    item.subtotal = item.price * item.quantity;
  });

  this.finalAmount = this.totalAmount + this.shippingCost + this.taxAmount - this.discountAmount;
  
  if (this.userId) {
    this.orderType = 'user';
  } else {
    this.orderType = 'guest';
    if (!this.guestUser && this.shippingAddress) {
      this.guestUser = {
        email: this.shippingAddress.email,
        name: `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`,
        phone: this.shippingAddress.phone
      };
    }
  }
  
  next();
});

orderSchema.statics.generateOrderNumber = async function() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  const todaysOrderCount = await this.countDocuments({
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });
  
  const sequence = String(todaysOrderCount + 1).padStart(3, '0');
  return `WOOD-${year}${month}${day}-${sequence}`;
};

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: 1 });
orderSchema.index({ 'shippingAddress.email': 1 });
orderSchema.index({ orderType: 1 });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);