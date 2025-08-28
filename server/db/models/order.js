const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  name: { type: String, required: true },
  itemPrice: { type: Number, required: true },
  quantity: { type: Number, min: 1, required: true },
  totalItemPrice: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [orderItemSchema], required: true },
  currency: { type: String, default: 'eur' },
  amountTotal:    { type: Number, required: true },
}, { timestamps: true });

orderSchema.index({ user: 1 });
orderSchema.index({ truck: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
