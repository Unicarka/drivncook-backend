const truckService = require('../services/trucks');
const { parkSchema } = require('../validators/truck');

const truckController = {}

truckController.getMyRevenue = async (req, res) => {
    const truck = await truckService.getByUserId(req.user.id)
    try {
        const revenue = await truckService.getMyRevenue(truck)
        if (revenue) {
            return res.status(200).json(revenue);
        }
        return res.status(404).json({message: "Revenue not found"});
    } catch (err) {
        console.error("Error retrieving revenue: ", err.message)
        return res.status(500).json({message: "Internal server error"});
    }
}

truckController.getAllTrucks = async (req, res) => {
    try {
        const trucks = await truckService.getAllTrucks()
        if (trucks) {
            return res.status(200).json(trucks);
        }
        return res.status(404).json({message: "Trucks not found"});
    } catch (err) {
        console.error("Error retrieving trucks: ", err.message)
        return res.status(500).json({message: "Internal server error"});
    }
}

truckController.buy = async (req, res) => {
    const { message, success } = await truckService.grant(req.user.id)
    if (success) {
        return res.status(201).json({message: message});
    }
    if (message.includes('User already has a truck')) {
        return res.status(400).json({message: message});
    }
    if (message.includes('User not found')) {
        return res.status(404).json({message: message});
    }
    return res.status(500).json({message: "Internal server error"});
}

truckController.getParkings = async (req, res) => {
    try {
        const parkings = await truckService.getParkings()
        if (parkings) {
            return res.status(200).json(parkings);
        }
        return res.status(404).json({message: "Parkings not found"});
    } catch (err) {
        console.error("Error retrieving parkings: ", err.message)
        return res.status(500).json({message: "Internal server error"});
    }
}

truckController.getParkingById = async (req, res) => {
    try {
        const parking = await truckService.getParkingById(req.params.id)
        if (parking) {
            return res.status(200).json(parking);
        }
        return res.status(404).json({message: "Parking not found"});
    } catch (err) {
        console.error("Error retrieving parking: ", err.message)
        return res.status(500).json({message: "Internal server error"});
    }
}

truckController.getTruck = async (req, res) => {
    try {
        const truck = await truckService.getByUserId(req.user.id)
        if (truck) {
            return res.status(200).json(truck);
        }
        return res.status(404).json({message: "Truck not found"});
    } catch (err) {
        console.error("Error retrieving truck: ", err.message)
        return res.status(500).json({message: "Internal server error"});
    }
}

truckController.park = async (req, res) => {
    try {
        const truck = await truckService.getByUserId(req.user.id)
        if (!truck) {
            return res.status(404).json({message: "Truck not found"});
        }
        const { error } = parkSchema.validate(req.body)
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const { spotId } = req.body
        const { message, success } = await truckService.park(truck, spotId)
        if (success) {
            return res.status(200).json({message: message});
        }
        return res.status(400).json({message: message});
    } catch (err) {
        console.error("Error parking truck: ", err.message)
        return res.status(500).json({message: "Internal server error"});
    }
}

truckController.unpark = async (req, res) => {
    try {
        const truck = await truckService.getByUserId(req.user.id)
        if (!truck) {
            return res.status(404).json({message: "Truck not found"});
        }
        const { message, success } = await truckService.unpark(truck)
        if (success) {
            return res.status(200).json({message: message});
        }
        return res.status(400).json({message: message});
    } catch (err) {
        console.error("Error unparking truck: ", err.message)
        return res.status(500).json({message: "Internal server error"});
    }
}

truckController.getMySpot = async (req, res) => {
    try {
        const truck = await truckService.getByUserId(req.user.id)
        if (!truck) {
            return res.status(404).json({message: "Truck not found"});
        }
        const { parking, spot } = await truckService.getMySpot(truck)
        if (parking && spot) {
            return res.status(200).json({ parkingName: parking.name, spotNumber: spot.number });
        }
        return res.status(404).json({message: "Spot not found"});
    } catch (err) {
        if (err.message.includes('Truck not parked')) {
            return res.status(404).json({message: err.message});
        }
        console.error("Error retrieving spot: ", err.message)
        return res.status(500).json({message: "Internal server error"});
    }
}

truckController.getMyStock = async (req, res) => {
    try {
        const truck = await truckService.getByUserId(req.user.id)
        if (!truck) {
            return res.status(404).json({message: "Truck not found"});
        }
        const stock = await truckService.getMyStock(truck)
        if (stock) {
            return res.status(200).json({stock: stock});
        }
        return res.status(404).json({message: "Stock not found"});
    } catch (err) {
        console.error("Error retrieving stock: ", err.message)
        return res.status(500).json({message: "Internal server error"});
    }
}

module.exports = truckController
