import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    // ✅ Conditionally required category
    category: {
      type: String,
      required: function () {
        return this.type === 'category';
      },
    },
    brand: {
      type: String,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
      min:1,
      max:5
    },
    numreviews: {
      type: Number,
      required: true,
      default: 0,
    },
    originalPrice: {
      type: Number,
    },
    discountPercent: { type: Number, default: 0 }, // ✅ new field

    // ✅ Product type and tag
    type: {
      type: String,
      enum: ['category', 'collection'],
      default: 'category',
      required: true,
    },
    tag: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
