const express = require('express')
const router = express.Router()
const truckController = require('../controllers/truckController')
const { authenticate } = require('../middlewares/auth_check')

router.post('/buy', authenticate, truckController.buy)
router.get('/my-truck', authenticate, truckController.getMyTruck)

module.exports = router
