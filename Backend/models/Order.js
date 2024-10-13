const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    iduser: { type: String, required: true },
    note: { type: String, required: false },
    total: { type: Number, required: true },
    status: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);