const express = require('express')
const router = express.Router()
const truckController = require('../controllers/truckController')
const { authenticate, checkIsAdmin } = require('../middlewares/auth_check')

router.get('/all', checkIsAdmin, truckController.getAllTrucks)

router.post('/buy', authenticate, truckController.buy)

router.get('/revenue', authenticate, truckController.getMyRevenue)

router.get('/parkings', truckController.getParkings)

router.get('/parkings/:id', truckController.getParkingById)

router.post('/park', authenticate, truckController.park)

router.post('/unpark', authenticate, truckController.unpark)

router.get('/my-spot', authenticate, truckController.getMySpot)

router.get('/my-stock', authenticate, truckController.getMyStock)

module.exports = router
