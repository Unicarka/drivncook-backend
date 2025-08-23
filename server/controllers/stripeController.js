const stripeService = require('../services/stripe')
const { createCheckoutSessionSchema } = require('../validators/stripe')

const stripeController = {}

stripeController.createCheckoutSession = async (req, res) => {
    const { error } = createCheckoutSessionSchema.validate(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }
    const { amount } = req.body
    const { product_name } = req.body
    const checkoutSession = await stripeService.createCheckoutSession(amount, product_name)
    res.json({ url: checkoutSession.url })
}

stripeController.createPaymentIntent = async (req, res) => {
    const { amount } = req.body
    if (!amount) {
        return res.status(400).json({message: 'Amount is required'});
    }
    const paymentIntent = await stripeService.createPaymentIntent(amount)
    res.json({
        clientSecret: paymentIntent.client_secret,
    })
}

stripeController.webhookHandler = (req, res) => {
    try {
        stripeService.webhookHandler(req, res)
    } catch (err) {
        console.error('Error handling webhook: ', err)
        return res.status(500).json({ message: 'Internal server error' });        
    }
    return res.status(200)
}

stripeController.success = (req, res) => {
    res.send('Success')
}

stripeController.cancel = (req, res) => {
    res.send('Cancel')
}


module.exports = stripeController
