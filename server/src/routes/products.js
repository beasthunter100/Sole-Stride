const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        const filter = { isActive: true };

        // Category filter
        if (category && category !== 'all') {
            filter.category = category;
        }

        // Search filter (name or brand, case insensitive)
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        let sortObj = { createdAt: -1 }; // default: newest
        if (sort === 'price_asc') {
            sortObj = { price: 1 };
        } else if (sort === 'price_desc') {
            sortObj = { price: -1 };
        } else if (sort === 'newest') {
            sortObj = { createdAt: -1 };
        }

        const products = await Product.find(filter).sort(sortObj);

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
