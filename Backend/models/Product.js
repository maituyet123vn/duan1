const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String, required: true },
    desc: { type: String, required: true },
    idCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);
