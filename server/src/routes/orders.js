const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes protected
router.use(protect);

// POST /api/orders — Create order
router.post('/', async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items provided' });
        }

        // Validate shipping address
        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone ||
            !shippingAddress.addressLine1 || !shippingAddress.city ||
            !shippingAddress.state || !shippingAddress.pincode) {
            return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
        }

        // Calculate subtotal
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = subtotal > 500 ? 0 : 50;
        const totalAmount = subtotal + shippingCost;

        const order = await Order.create({
            user: req.user.id,
            items,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD',
            subtotal,
            shippingCost,
            totalAmount
        });

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/orders/mine — Get current user's orders
router.get('/mine', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('items.product', 'name images price');

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/orders/:id — Get order by id
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Verify user owns this order
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
