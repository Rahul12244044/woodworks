const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['lumber', 'slab', 'plywood', 'turning_blank', 'project_kit']
  },
  species: {
    type: String,
    required: true,
    enum: ['oak', 'walnut', 'maple', 'cherry', 'pine', 'cedar', 'teak', 'mahogany', 'birch']
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  dimensions: {
    thickness: Number, // in inches
    width: Number,    // in inches
    length: Number,   // in inches
    unit: {
      type: String,
      default: 'inches'
    }
  },
  boardFeet: {
    type: Number,
    required: function() {
      return this.category === 'lumber' || this.category === 'slab';
    }
  },
  moistureContent: {
    type: Number,
    min: [0, 'Moisture content cannot be negative']
  },
  grainPattern: [{
    type: String,
    enum: ['straight', 'curly', 'birdseye', 'burl', 'quartered', 'flat_sawn']
  }],
  images: [{
    url: String,
    alt: String
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  isUniqueItem: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create index for better search performance
productSchema.index({ category: 1, species: 1, price: 1 });
productSchema.index({ grainPattern: 1 });

module.exports = mongoose.model('Product', productSchema);