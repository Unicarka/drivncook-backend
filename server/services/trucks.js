const Truck = require('../db/models/truck');
const User = require('../db/models/user');
const Parking = require('../db/models/parking')
const ParkingSpot = require('../db/models/parkingSpot')

const truckService = {};

truckService.getAllTrucks = async () => {
    return await Truck.find();
}

truckService.getByUserId = async (userId) => {
    return await Truck.findOne({user: userId});
}

truckService.getById = async (truckId) => {
    return await Truck.findById(truckId);
}

truckService.getParkingById = async (parkingId) => {
    const allSpots = await ParkingSpot.find({parking: parkingId});
    const freeSpots = allSpots.filter(spot => spot.isFree === true);
    const parking = await Parking.findById(parkingId);
    return { ...parking.toObject(), freeSpots };
}

truckService.getParkings = async () => {
    return await Parking.find();
}

truckService.park = async (truck, spotId) => {
    const spot = await ParkingSpot.findById(spotId);
    if (spot) {
        if (spot.isFree) {
            const truckCurrentSpot = await ParkingSpot.findById(truck.spot);
            if (truckCurrentSpot) {
                truckCurrentSpot.isFree = true;
                await truckCurrentSpot.save();
            }
            spot.isFree = false;
            spot.truck = truck._id;
            await spot.save();
            truck.spot = spot._id;
            await truck.save();
            return {message: 'Truck parked successfully', success: true};
        }
        return {message: 'Spot not available', success: false};
    }
    return {message: 'Spot not found or not available', success: false};
}

truckService.unpark = async (truck) => {
    const spot = await ParkingSpot.findById(truck.spot);
    if (spot) {
        spot.isFree = true;
        spot.truck = null;
        await spot.save();
        truck.spot = null;
        await truck.save();
        return {message: 'Truck unparked successfully', success: true};
    }
    return {message: 'Spot not found or not available', success: false};
}

truckService.getMySpot = async (truck) => {
    const spot = await ParkingSpot.findById(truck.spot);
    if (!spot) {
        throw new Error('Truck not parked');
    }
    const parkingId = spot.parking;
    const parking = await Parking.findById(parkingId);
    return {parking, spot};
}

truckService.grant = async (userId) => {
    const user = await User.findById(userId);
    if (user) {
        if (user.truck) {
            return {message: 'User already has a truck', success: false};
        }
        try {
            const truck = await Truck.create({user: user._id});
            user.truck = truck._id;
            await user.save();
            return {message: 'Truck granted successfully to ' + user.email, success: true};
        } catch (err) {
            console.error('Error granting truck to user:', err);
            return {message: 'Internal server error', success: false};
        }
    }
    return {message: 'User not found', success: false}
}

truckService.getMyStock = async (truck) => {
    const stock = truck.stock
    return stock;
}

module.exports = truckService;
