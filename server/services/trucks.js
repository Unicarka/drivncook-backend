const Truck = require('../db/models/truck');
const User = require('../db/models/user');

const truckService = {};

truckService.getByUserId = async (userId) => {
    return await Truck.findOne({user: userId});
}

truckService.getById = async (truckId) => {
    return await Truck.findById(truckId);
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

module.exports = truckService;
