const express = require('express');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const router = express.Router();

// Xem tất cả đơn hàng theo status
router.get('/status/:status', async (req, res) => {
    try {
        const orders = await Order.find({ status: req.params.status });
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Xem tất cả đơn hàng theo idUser
router.get('/user/:idUser', async (req, res) => {
    try {
        const { idUser } = req.params;

        if (!idUser) {
            return res.status(400).send('User ID is required');
        }

        // Truy vấn với tên trường chính xác
        const orders = await Order.find({ iduser: idUser });

        if (!orders.length) {
            return res.status(404).send('No orders found for this user');
        }

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.post('/orders', async (req, res) => {
    const { iduser, note, total, status, orderDetails } = req.body;

    try {
        // Tạo đơn hàng mới
        const newOrder = new Order({ iduser, note, total, status });
        const savedOrder = await newOrder.save();

        // Tạo chi tiết đơn hàng
        const details = orderDetails.map(detail => ({
            idproduct: detail.idproduct,
            price: detail.price,
            quantity: detail.quantity,
            idorder: savedOrder._id // Liên kết với đơn hàng vừa tạo
        }));

        await OrderDetail.insertMany(details); // Thêm nhiều chi tiết cùng lúc

        res.status(201).json({ order: savedOrder, details });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
});

// Xem chi tiết đơn hàng
router.get('/detail/:idOrder', async (req, res) => {
    try {
        const orderDetails = await OrderDetail.find({ idOrder: req.params.idOrder }).populate('idProduct');
        res.json(orderDetails);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
