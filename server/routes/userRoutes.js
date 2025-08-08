const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { authenticate, checkIsAdmin } = require('../middlewares/auth_check')

router.get('/', checkIsAdmin, userController.getAll)

router.get('/:id', userController.findById)

router.put('/:id', userController.updateUser)

router.delete('/:id', userController.deleteUser)

router.get('/email/:email', userController.findByEmail)

router.post('/register', userController.register)

router.post('/login', userController.login)

router.post('/refresh', userController.refreshToken)

router.post('/logout', userController.logout)

module.exports = router
