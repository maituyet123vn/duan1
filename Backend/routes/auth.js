const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Đăng ký
router.post('/register', async (req, res) => {
    const { fullname, username, password, email, address, phone } = req.body;

    try {
        // Kiểm tra nếu tên người dùng đã tồn tại
        const user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới
        const newUser = new User({ fullname, username, password: hashedPassword, email, phone, address });
        await newUser.save();
        res.json({ msg: 'User registered successfully', userId: newUser._id });
    } catch (err) {
        console.error(err); // Ghi lại lỗi
        res.status(500).json({ msg: 'Server error' });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: 3600 });
        res.json({ token, user });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Thay đổi thông tin cá nhân
router.put('/update', async (req, res) => {
    const { fullname, email } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { fullname, email }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
