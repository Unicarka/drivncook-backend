const PendingUser = require('../db/models/pendingUser');
const User = require('../db/models/user');
const Stripe = require('./stripe')
const config = require('config');

const userService = {};

userService.getAll = async () => {
    const users = await User.find();
    return users.map(user => ({id: user._id, email: user.email, name: user.name, role: user.role, isActive: user.isActive, createdAt: user.createdAt, updatedAt: user.updatedAt}));
}

userService.findById = async (id) => {
    const user = await User.findById(id);
    return user;
}

userService.findByEmail = async (email) => {
    const user = await User.findOne({email: email});
    return user;
}

userService.create = async (user) => {
    const newUser = await User.create(user);
    return newUser;
}

userService.update = async (id, user) => {
    const updatedUser = await User.findByIdAndUpdate(id, user);
    return updatedUser;
}

userService.delete = async (id) => {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
}

userService.register = async (user) => {
    const existingUser = await User.findOne({email: user.email});
    if (existingUser) {
        return null;
    }

    const session = await Stripe.createCheckoutSession(config.get('inscription_fee.amount'), config.get('inscription_fee.product_name'), {purpose: 'register'}, config.get('stripe.register_success_url'));


    await PendingUser.create({
        sessionId: session.id,
        email: user.email,
        userData: user,
        status: 'pending'
    })

    return { checkoutUrl: session.url };
}

userService.login = async (email, password) => {
    const user = await User.findOne({email: email});
    if (user) {
        const isPasswordValid = await user.comparePassword(password);
        if (isPasswordValid) {
            const token = await user.generateToken();
            const refreshToken = await user.generateRefreshToken();
            return {user: {id: user._id, email: user.email, name: user.name, role: user.role}, token, refreshToken};
        }
    }
    return null;
}

userService.refreshToken = async (refreshToken) => {
    const user = await User.findOne({refreshToken: refreshToken});
    if (user) {
        const token = await user.generateToken();
        return {user: {id: user._id, email: user.email, name: user.name}, token};
    }
    return null;
}

userService.logout = async (refreshToken) => {
    const user = await User.findOne({refreshToken: refreshToken});
    if (user) {
        user.refreshToken = null;
        await user.save();
        return {message: 'User logged out successfully'};
    }
    return null;
}

module.exports = userService;
