const foodService = require('../services/food')
const { buyProductsSchema } = require('../validators/food')

const foodController = {};

foodController.getAllProducts = (req, res) => {
    const products = foodService.getAllProducts();
    res.json(products);
}

foodController.getAllWarehouses = (req, res) => {
    const warehouses = foodService.getAllWarehouses();
    res.json(warehouses);
}

foodController.getProductById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = foodService.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

foodController.getWarehouseById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const warehouse = foodService.getWarehouseById(id);
        res.json(warehouse);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

foodController.buyProducts = async (req, res) => {
    try {
        const { error } = buyProductsSchema.validate(req.body);
        if (error) {
            throw new Error(error.details[0].message);
        }
        const userId = req.user.id;
        const products = req.body.products;
        const { checkoutUrl } = await foodService.buyProducts(userId, products);
        res.json({ checkoutUrl });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = foodController;
