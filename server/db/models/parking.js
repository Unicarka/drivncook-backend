const mongoose = require('mongoose');
const ParkingSpot = require('./parkingSpot');

const parkingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  capacity: { type: Number, default: 100 }
}, { timestamps: true });

parkingSchema.methods.getAvailableSpot = async function() {
  return await ParkingSpot.findOne({ parking: this._id, status: 'available' });
}

const Parking = mongoose.model('Parking', parkingSchema);

module.exports = Parking;
