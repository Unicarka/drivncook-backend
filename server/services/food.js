const config = require('config')
const PendingBuy = require('../db/models/pendingBuy');
const Stripe = require('./stripe')
const Truck = require('./trucks')

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
        totalPrice = Math.round(totalPrice * 0.8);

        const session = await Stripe.createCheckoutSession(totalPrice, 'Food delivery', {purpose: 'buy'}, config.get('stripe.payment_success_url'));

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

foodService.sellProducts = async () => {
    const date = new Date().toISOString().slice(0, 10);
    const trucks = await Truck.getAllTrucks();
    const truckFound = trucks.filter(truck => truck.status === 'parked' && truck.stock.some(product => product.quantity > 0));
    if (truckFound.length === 0) {
        console.log(`[CRON] ${date} No truck found with products`);
        return;
    }
    const randomIndex = Math.floor(Math.random() * truckFound.length);
    const truck = truckFound[randomIndex];
    const stock = await truck.getStock();
    const product = stock.find(product => product.quantity > 0);
    if (!product) {
        console.log(`[CRON] ${date} No product found with quantity > 0`);
        return;
    }
    const randomQuantity = Math.floor(Math.random() * (product.quantity - 1)) + 1;
    await truck.sellItem(product.name, randomQuantity);
    console.log(`[CRON] ${date} Truck ${truck._id} sold ${randomQuantity} of ${product.name}`);
}

module.exports = foodService;
