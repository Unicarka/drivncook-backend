const express = require('express')
const router = express.Router()
const foodController = require('../controllers/foodController')
const { authenticate } = require('../middlewares/auth_check')

router.get('/products', foodController.getAllProducts)

router.get('/warehouses', foodController.getAllWarehouses)

router.get('/products/:id', foodController.getProductById)

router.get('/warehouses/:id', foodController.getWarehouseById)

router.post('/buy', authenticate, foodController.buyProducts)

module.exports = router
