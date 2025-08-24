const mongoose = require('mongoose');
const { foodTypes } = require('../../utils/types');

const truckSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['delivery', 'returning', 'parked'], 
    default: 'parked' 
  },

  stock: {
    type: 
        [{
            name: { type: String, enum: foodTypes, required: true },
            quantity: { type: Number, default: 0, min: 0 },
        }],
        default: () => foodTypes.map(name => ({ name, quantity: 0 }))
    },

  spot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot', default: null },
  lastMaintenanceAt: { type: Date },
  revenue: { type: Number, default: 0 }
}, { timestamps: true });

truckSchema.index({ user: 1 });
truckSchema.index({ user: 1, status: 1 });

truckSchema.methods.park = async function (spot) {
    if (this.spot) {
        this.spot.status = 'available';
        await this.spot.save();
    }
    if (spot) {
        spot.status = 'occupied';
        await spot.save();
    }
    this.spot = spot;
    this.status = 'parked';
    await this.save();
}

truckSchema.methods.unpark = async function () {
    if (this.spot) {
        this.spot.status = 'available';
        await this.spot.save();
    }
    this.spot = null;
    this.status = 'delivery';
    await this.save();
}

truckSchema.methods.return = async function () {
    if (this.spot) {
        this.spot.status = 'available';
        await this.spot.save();
    }
    this.spot = null;
    this.status = 'returning';
    await this.save();
}

truckSchema.methods.deliver = async function () {
    this.status = 'delivery';
    await this.save();
}

truckSchema.methods.returnToParking = async function () {
    this.status = 'returning';
    await this.save();
}

truckSchema.methods.addStockByName = async function (name, quantity) {
    const stock = this.stock.find(s => s.name === name);
    if (stock) {
        if (stock.quantity + quantity < 0) {
            throw new Error('Stock quantity cannot be negative');
        }
        stock.quantity += quantity;
    } else {
        this.stock.push({ name, quantity });
    }
    await this.save();
}

truckSchema.methods.addStockById = async function (id, quantity) {
    const name = foodTypes[id - 1];
    const stock = this.stock.find(s => s.name === name);
    if (stock) {
        if (stock.quantity + quantity < 0) {
            throw new Error('Stock quantity cannot be negative');
        }
        stock.quantity += quantity;
    } else {
        this.stock.push({ name, quantity });
    }
    await this.save();
}

truckSchema.methods.removeStockById = async function (id, quantity) {
    const foodName = foodTypes[id];
    const stock = this.stock.find(s => s.name === foodName);
    if (stock) {
        if (stock.quantity - quantity < 0) {
            throw new Error('Stock quantity cannot be negative');
        }
        stock.quantity -= quantity;
    } else {
        throw new Error('Stock not found');
    }
    await this.save();
}

truckSchema.methods.removeStockByName = async function (name, quantity) {
    const stock = this.stock.find(s => s.name === name);
    if (stock) {
        if (stock.quantity - quantity < 0) {
            throw new Error('Stock quantity cannot be negative');
        }
        stock.quantity -= quantity;
    } else {
        throw new Error('Stock not found');
    }
    await this.save();
}

truckSchema.methods.getStock = async function () {
    return this.stock;
}

truckSchema.methods.updateRevenue = async function (revenue) {
    this.revenue += revenue;
    await this.save();
}

truckSchema.methods.getRevenue = async function () {
    return this.revenue;
}

truckSchema.methods.resetRevenue = async function () {
    this.revenue = 0;
    await this.save();
}

const Truck = mongoose.model('Truck', truckSchema);

module.exports = Truck;
