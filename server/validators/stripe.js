const Joi = require('joi')

const createCheckoutSessionSchema = Joi.object({
    amount: Joi.number().required(),
    product_name: Joi.string().required()
})

module.exports = {
    createCheckoutSessionSchema
}
