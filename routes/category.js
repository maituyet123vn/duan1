const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

// Thêm danh mục
router.post('/add', async (req, res) => {
    const { name, desc } = req.body;
    try {
        const newCategory = new Category({ name, desc });
        await newCategory.save();
        res.json({ msg: 'Category added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message }); // Trả về lỗi cụ thể
    }
});

// Sửa danh mục
router.put('/edit/:id', async (req, res) => {
    const { name, desc } = req.body;
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { name, desc }, { new: true });
        res.json(category);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Hiển thị tất cả danh mục
router.get('/all', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const categories = await Category.findById(req.params.id);
        res.json(categories);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
