const config = require('config')
const PendingBuy = require('../db/models/pendingBuy');
const Stripe = require('./stripe')

const foodService = {};

foodService.getAllProducts = () => {
    return config.get('products');
}

foodService.getAllWarehouses = () => {
    return config.get('warehouses');
}

foodService.getProductById = (id) => {
    const product = config.get('products').find(product => product.id === id);
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
}

foodService.getWarehouseById = (id) => {
    const warehouse = config.get('warehouses').find(warehouse => warehouse.id === id);
    if (!warehouse) {
        throw new Error('Warehouse not found');
    }
    return warehouse;
}

foodService.buyProducts = async (userId, products) => {
    let totalPrice = 0;
    try {
        for (const product of products) {
            const price = foodService.getProductById(product.id).price;
            totalPrice += price * product.quantity;
        }

        const session = await Stripe.createCheckoutSession(totalPrice, 'Food delivery', {purpose: 'buy'});

        const pendingBuy = new PendingBuy({
            sessionId: session.id,
            products: products,
            status: 'pending',
            user: userId,
            totalPrice: totalPrice
        });

        await pendingBuy.save();

        return { checkoutUrl: session.url };

    } catch (error) {
        console.error('Error buying products', error);
        throw new Error(error.message);
    }
}

module.exports = foodService;
