const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { checkIsAdmin } = require('../middlewares/auth_check')
const { userRegisterSchema, userLoginSchema, userRefreshTokenSchema, userLogoutSchema } = require('../validators/user')

router.get('/', checkIsAdmin, userController.getAll)

router.get('/:id', userController.findById)

router.put('/:id', userController.updateUser)

router.delete('/:id', userController.deleteUser)

router.get('/email/:email', userController.findByEmail)

router.post('/register', (req, res, next) => {
    const { error } = userRegisterSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next()
}, userController.register)

router.post('/login', (req, res, next) => {
    const { error } = userLoginSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next()
}, userController.login)

router.post('/refresh', (req, res, next) => {
    const { error } = userRefreshTokenSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next()
}, userController.refreshToken)

router.post('/logout', (req, res, next) => {
    const { error } = userLogoutSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next()
}, userController.logout)

module.exports = router
