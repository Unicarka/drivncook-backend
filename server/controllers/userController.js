const userService = require('../services/users')
const { userRegisterSchema } = require('../validators/user')

const userController = {}

userController.getAll = async (req, res) => {
    const users = await userService.getAll()
    res.json(users)
}

userController.findById = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({message: 'Id is required'});
    }
    const user = await userService.findById(id)
    if (user) {
        return res.json(user)
    }
    return res.status(400).json({message: 'User not found'});
}

userController.updateUser = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({message: 'Id is required'});
    }
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    if (!email && !password && !name) {
        return res.status(400).json({message: 'Email, password and name are required'});
    }
    const user = await userService.update(id, {email, password, name})
    if (user) {
        return res.json({message: 'User updated'});
    }
    return res.status(400).json({message: 'User not found'});
}

userController.deleteUser = async (req, res) => {
    const id = req.params.id
    const user = await userService.delete(id)
    if (user) {
        return res.json({message: 'User deleted'});
    }
    return res.status(400).json({message: 'User not found'});
}

userController.findByEmail = async (req, res) => {
    const email = req.params.email
    if (!email) {
        return res.status(400).json({message: 'Email is required'});
    }
    const user = await userService.findByEmail(email)
    if (user) {
        return res.json({user: {id: user.id, email: user.email, name: user.name, role: user.role}});
    }
    return res.status(400).json({message: 'User not found'});
}

userController.register = async (req, res) => {
    const { error } = userRegisterSchema.validate(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const user = await userService.register({email, password, name})
    if (user) {
        return res.json(user)
    }
    return res.status(400).json({message: 'Email already exists'});
}

userController.login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }
    const user = await userService.login(email, password)
    if (user) {
        return res.json(user)
    }
    return res.status(401).json({message: 'Invalid email or password'});
}

userController.refreshToken = async (req, res) => {
    const {refreshToken} = req.body.refreshToken
    if (!refreshToken) {
        return res.status(400).json({message: 'Refresh token is required'});
    }
    const user = await userService.refreshToken(refreshToken)
    res.json(user)
}

userController.logout = async (req, res) => {
    const {refreshToken} = req.body.refreshToken
    if (!refreshToken) {
        return res.status(400).json({message: 'Refresh token is required'});
    }
    const user = await userService.logout(refreshToken)
    if (user) {
        return res.json({message: 'Logout successful'});
    }
    return res.status(500).json({message: 'Logout failed'});
}

module.exports = userController
