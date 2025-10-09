import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['flat', 'plot', 'villa', 'commercial']
  },
  listingType: {
    type: String,
    required: [true, 'Listing type is required'],
    enum: ['sell', 'rent'],
    default: 'sell'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  area: {
    value: {
      type: Number,
      required: [true, 'Area is required']
    },
    unit: {
      type: String,
      enum: ['sqft', 'sqm', 'acres'],
      default: 'sqft'
    }
  },
  bedrooms: {
    type: Number,
    min: 0,
    default: 0
  },
  bathrooms: {
    type: Number,
    min: 0,
    default: 0
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    area: String,
    city: {
      type: String,
      default: 'Jaipur'
    },
    state: {
      type: String,
      default: 'Rajasthan'
    },
    pincode: String,
    landmark: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    }
  },
  amenities: [{
    type: String,
    enum: ['parking', 'gym', 'swimming-pool', 'garden', 'security', 
           'power-backup', 'lift', 'club-house', 'park', 'wifi']
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    name: String,
    url: String,
    publicId: String,
    type: {
      type: String,
      enum: ['title-deed', 'tax-receipt', 'noc', 'blueprint', 'other']
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'rented', 'pending', 'inactive'],
    default: 'active'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  },
  inquiryCount: {
    type: Number,
    default: 0
  },
  featuredUntil: Date,
  verifiedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
propertySchema.index({ propertyType: 1, status: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ isFeatured: 1, status: 1 });
propertySchema.index({ viewCount: -1 });
propertySchema.index({ 'location.city': 1, 'location.area': 1 });
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ createdAt: -1 });

// Text index for search
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.address': 'text',
  'location.area': 'text'
});

// Virtual for favorites
propertySchema.virtual('favorites', {
  ref: 'Favorite',
  localField: '_id',
  foreignField: 'property'
});

// Increment view count
propertySchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

const Property = mongoose.model('Property', propertySchema);

export default Property;