// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
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
    required: true,
    min: 0
  },
  originalPrice: {
  type: Number,
  min: 0,
  default: function() {
    return this.price; // Default to price if not provided
  }
},
  category: {
    type: String,
    required: true,
    enum: ['lumber', 'slab', 'plywood', 'turning_blank', 'project_kit', 'hardwood', 'softwood', 'other']
  },
  species: {
    type: String,
    required: true
  },
  dimensions: {
    length: Number, // in cm
    width: Number,  // in cm
    thickness: Number, // in cm
    unit: {
      type: String,
      default: 'cm'
    }
  },
  boardFeet: Number,
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  featured: {
    type: Boolean,
    default: false
  },
  grainPattern: [String],
  hardness: String,
  origin: String,
  sustainability: {
    certified: Boolean,
    certification: String
  },
  moistureContent: Number,
  weight: Number, // in kg
  tags: [String],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ category: 1 });
productSchema.index({ species: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ inStock: 1 });
productSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate average rating
productSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
    this.reviewCount = this.reviews.length;
  }
  next();
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);