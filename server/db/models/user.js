const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

userSchema.methods.comparePassword = async function (password) {
    console.log('password', password)
    console.log('this.password', this.password)
    return await bcrypt.compare(password, this.password);
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.generateToken = async function () {
    return jwt.sign({ id: this._id }, config.get('jwt.secret'), {
        expiresIn: config.get('jwt.expiresIn')
    });
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({ id: this._id }, config.get('jwt.refreshSecret'), {
        expiresIn: config.get('jwt.refreshExpiresIn')
    });
}

const User = mongoose.model('User', userSchema);

module.exports = User;
