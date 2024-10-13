const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
    idproduct: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    idorder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' } // Liên kết tới đơn hàng
}, { timestamps: true });

module.exports = mongoose.model('OrderDetail', orderDetailSchema);