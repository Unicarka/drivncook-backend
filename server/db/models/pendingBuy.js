const mongoose = require('mongoose');

const PendingBuySchema = new mongoose.Schema({
    sessionId: { type: String, unique: true, required: true },
    products: [{
            id: { type: Number, required: true },
            quantity: { type: Number, required: true }
    }],
    status: { type: String, enum: ['pending','completed','failed'], default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalPrice: { type: Number, required: true }
}, { timestamps: true });

const PendingBuy = mongoose.model('PendingBuy', PendingBuySchema);

module.exports = PendingBuy;
