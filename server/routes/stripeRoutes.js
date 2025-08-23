const express = require('express')
const router = express.Router()
const stripeController = require('../controllers/stripeController')

router.post('/create-payment-intent', stripeController.createPaymentIntent)

router.post('/create-checkout-session', stripeController.createCheckoutSession)

router.get('/success', stripeController.success)

router.get('/cancel', stripeController.cancel)

router.post('/webhook', express.raw({ type: 'application/json' }), stripeController.webhookHandler)

module.exports = router
