const User = require('../db/models/user');

const user = {};

user.getAll = async () => {
    const users = await User.find();
    return users.map(user => ({id: user._id, email: user.email, name: user.name, role: user.role, isActive: user.isActive, createdAt: user.createdAt, updatedAt: user.updatedAt}));
}

user.findById = async (id) => {
    const user = await User.findById(id);
    return user;
}

user.findByEmail = async (email) => {
    const user = await User.findOne({email: email});
    return user;
}

user.create = async (user) => {
    const newUser = await User.create(user);
    return newUser;
}

user.update = async (id, user) => {
    const updatedUser = await User.findByIdAndUpdate(id, user);
    return updatedUser;
}

user.delete = async (id) => {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
}

user.login = async (email, password) => {
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

user.refreshToken = async (refreshToken) => {
    const user = await User.findOne({refreshToken: refreshToken});
    if (user) {
        const token = await user.generateToken();
        return {user: {id: user._id, email: user.email, name: user.name}, token};
    }
    return null;
}

user.logout = async (refreshToken) => {
    const user = await User.findOne({refreshToken: refreshToken});
    if (user) {
        user.refreshToken = null;
        await user.save();
        return {message: 'User logged out successfully'};
    }
    return null;
}

module.exports = user;
