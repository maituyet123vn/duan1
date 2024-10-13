const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Thêm sản phẩm
router.post('/add', async (req, res) => {
    const { name, img, desc, idCategory, price } = req.body;
    try {
        const newProduct = new Product({ name, img, desc, idCategory, price });
        await newProduct.save();
        res.json({ msg: 'Product added successfully' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Sửa sản phẩm
router.put('/edit/:id', async (req, res) => {
    const { name, img, desc, idCategory, price } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { name, img, desc, idCategory, price }, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Hiển thị tất cả sản phẩm
router.get('/all', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Hiển thị sản phẩm theo danh mục
router.get('/category/:idCategory', async (req, res) => {
    try {
        const products = await Product.find({ idCategory: req.params.idCategory });
        res.json(products);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Hiển thị chi tiết sản phẩm
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Hiện thị 4 sản phẩm cùng danh mục
router.get('/related/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Tìm sản phẩm theo ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Tìm 4 sản phẩm khác trong cùng danh mục
        const relatedProducts = await Product.find({
            idCategory: product.idCategory,
            _id: { $ne: productId } // Không lấy sản phẩm hiện tại
        }).limit(6); // Giới hạn số lượng sản phẩm là 4

        res.json(relatedProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
