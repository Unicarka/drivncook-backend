const config = require('config')
const stripe = require('stripe')(config.get('stripe.dev_secret_key'))
const truckService = require('./trucks');
const PendingUser = require('../db/models/pendingUser')
const PendingBuy = require('../db/models/pendingBuy')
const User = require('../db/models/user');


const stripeService = {}

const handleRegisterAfterPayment = async (sessionId) => {
    const pendingUser = await PendingUser.findOne({ sessionId: sessionId });
    if (pendingUser && pendingUser.status === 'pending') {
        if (await User.findOne({ email: pendingUser.userData.email })) {
            throw new Error('User already exists');
        }
        const user = await User.create(pendingUser.userData);
        if (!user) {
            throw new Error('User creation failed');
        }
        pendingUser.status = 'created';
        await pendingUser.save();
        await truckService.grant(user._id);
        return user;
    }
    return null;
}

const handleBuyAfterPayment = async (sessionId) => {
    const pendingBuy = await PendingBuy.findOne({ sessionId: sessionId });
    if (pendingBuy && pendingBuy.status === 'pending') {
        const truck = await truckService.getByUserId(pendingBuy.user);
        if (!truck) {
            throw new Error('Truck not found');
        }
        for (const product of pendingBuy.products) {
            await truck.addStockById(product.id, product.quantity);
        }
        pendingBuy.status = 'completed';
        await pendingBuy.save();
    }
}


stripeService.createCheckoutSession = async (amount, product_name, metadata, success_url) => {
    const checkoutSession = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: product_name
                    },
                    unit_amount: amount * 100,
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        success_url: success_url,
        cancel_url: config.get('stripe.cancel_url'),
        metadata: metadata
    })
    return checkoutSession
}

stripeService.createPaymentIntent = async (amount) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'eur',
    });
    return paymentIntent;
}

stripeService.webhookHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.get('stripe.webhook_secret')
    );

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent,
        );

        if (paymentIntent.status !== 'succeeded') {
            console.log('[WEBHOOK] CHECKOUT SESSION , PAYMENT FAILED', paymentIntent);
            const pendingBuy = await PendingBuy.findOne({ sessionId: session.id });
            if (pendingBuy) {
                pendingBuy.status = 'failed';
                await pendingBuy.save();
            }
            const pendingUser = await PendingUser.findOne({ sessionId: session.id });
            if (pendingUser) {
                pendingUser.status = 'failed';
                await pendingUser.save();
            }
            return res.sendStatus(400);
        }

        const purpose = session.metadata?.purpose;
        try {
            if (purpose === 'register') {
                const user = await handleRegisterAfterPayment(session.id);
                if (user) {
                    return res.sendStatus(200);
                }
            } else if (purpose === 'buy') {
                const user = await handleBuyAfterPayment(session.id);
                if (user) {
                    return res.sendStatus(200);
                }
            }
        } catch (err) {
            console.error('[WEBHOOK] CHECKOUT SESSION , ERROR', err.message);
            return res.sendStatus(500);
        }
    }

}

module.exports = stripeService