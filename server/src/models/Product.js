const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required']
    },
    brand: {
        type: String,
        required: [true, 'Brand is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    originalPrice: {
        type: Number
    },
    category: {
        type: String,
        enum: ['running', 'casual', 'formal', 'sports', 'sneakers'],
        required: [true, 'Category is required']
    },
    sizes: {
        type: [Number],
        default: []
    },
    images: {
        type: [String],
        default: []
    },
    stock: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
