const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
  parking: { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true },
  number: { type: Number, required: true, min: 1 },
  isFree: { type: Boolean, default: true }
}, { timestamps: true });

parkingSpotSchema.index({ parking: 1, number: 1 }, { unique: true });

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);

module.exports = ParkingSpot;
