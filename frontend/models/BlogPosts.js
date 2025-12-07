// models/BlogPost.js
import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    url: String,
    alt: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['beginner', 'techniques', 'projects', 'tips', 'materials', 'sustainability', 'tools', 'business']
  },
  tags: [String],
  readTime: {
    type: Number, // in minutes
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  metaTitle: String,
  metaDescription: String,
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug before saving
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

// Index for better performance
blogPostSchema.index({ category: 1, status: 1, createdAt: -1 });
blogPostSchema.index({ featured: 1, status: 1 });
blogPostSchema.index({ tags: 1 });

// Static method to get posts by category
blogPostSchema.statics.getPostsByCategory = async function(category, limit = 10, page = 1) {
  const skip = (page - 1) * limit;
  return this.find({ category, status: 'published' })
    .populate('author', 'username name role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

// Static method to get featured posts
blogPostSchema.statics.getFeaturedPosts = async function(limit = 3) {
  return this.find({ featured: true, status: 'published' })
    .populate('author', 'username name role')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Instance method to increment views
blogPostSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);