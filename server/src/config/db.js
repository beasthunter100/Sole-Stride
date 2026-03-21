const mongoose = require('mongoose');
const Product = require('../models/Product');

const seedProducts = [
  {
    name: "Air Surge Pro",
    brand: "Nike",
    description: "Lightweight running shoe with responsive cushioning. Perfect for daily training and long-distance runs.",
    price: 4999,
    originalPrice: 6999,
    category: "running",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
    stock: 50,
    rating: 4.5,
    numReviews: 128
  },
  {
    name: "Classic Street",
    brand: "Adidas",
    description: "Iconic casual sneaker with premium leather upper. A timeless silhouette for everyday wear.",
    price: 3499,
    originalPrice: 4499,
    category: "casual",
    sizes: [39, 40, 41, 42, 43, 44],
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600"],
    stock: 35,
    rating: 4.3,
    numReviews: 89
  },
  {
    name: "Urban Runner X",
    brand: "Puma",
    description: "Street-ready running shoe combining performance tech with bold design.",
    price: 2999,
    originalPrice: 3999,
    category: "sneakers",
    sizes: [38, 39, 40, 41, 42, 43],
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600"],
    stock: 40,
    rating: 4.1,
    numReviews: 64
  },
  {
    name: "BoardFlex 2.0",
    brand: "Vans",
    description: "Skate-inspired sneaker with vulcanized sole and reinforced toe cap.",
    price: 2499,
    originalPrice: 3199,
    category: "casual",
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600"],
    stock: 60,
    rating: 4.4,
    numReviews: 102
  },
  {
    name: "MaxSpeed Elite",
    brand: "Nike",
    description: "Professional track shoe engineered for maximum speed. Carbon plate technology.",
    price: 8999,
    originalPrice: 10999,
    category: "sports",
    sizes: [39, 40, 41, 42, 43, 44],
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"],
    stock: 20,
    rating: 4.8,
    numReviews: 47
  },
  {
    name: "Oxford Premier",
    brand: "Clarks",
    description: "Handcrafted leather oxford with cushioned insole. Ideal for office and formal events.",
    price: 5499,
    originalPrice: 6999,
    category: "formal",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600"],
    stock: 25,
    rating: 4.6,
    numReviews: 38
  },
  {
    name: "TrailBlaze GTX",
    brand: "Merrell",
    description: "Waterproof trail running shoe with aggressive grip outsole for tough terrain.",
    price: 6499,
    originalPrice: 7999,
    category: "running",
    sizes: [40, 41, 42, 43, 44, 45],
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"],
    stock: 30,
    rating: 4.7,
    numReviews: 73
  },
  {
    name: "CourtKing Low",
    brand: "Converse",
    description: "Classic canvas low-top. The original streetwear sneaker that never goes out of style.",
    price: 1999,
    originalPrice: 2499,
    category: "sneakers",
    sizes: [37, 38, 39, 40, 41, 42, 43, 44],
    images: ["https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600"],
    stock: 80,
    rating: 4.2,
    numReviews: 156
  }
];

const seedDB = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(seedProducts);
      console.log('Database seeded with 8 products');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    await seedDB();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
