const mongoose = require('mongoose');

const PendingUserSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true, required: true },
  email:     { type: String, required: true, index: true },
  userData:  { type: Object, required: true },
  status:    { type: String, enum: ['pending','created','failed'], default: 'pending' }
}, { timestamps: true });

const PendingUser = mongoose.model('PendingUser', PendingUserSchema);

module.exports = PendingUser;
