const truckService = require('../services/trucks');

const truckController = {}

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

truckController.getMyTruck = async (req, res) => {
    try {
        const truck = await truckService.getByUserId(req.user.id);
        if (!truck) {
            return res.status(404).json({ message: 'Aucun camion trouvé pour cet utilisateur' });
        }
        res.json(truck);
    } catch (error) {
        console.error('Erreur lors de la récupération du camion:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
}

module.exports = truckController
