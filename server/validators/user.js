const Joi = require('joi')

const userRegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required()
})

const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const userRefreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required()
})

const userLogoutSchema = Joi.object({
    refreshToken: Joi.string().required()
})

module.exports = {
    userRegisterSchema,
    userLoginSchema,
    userRefreshTokenSchema,
    userLogoutSchema
}
