const joi = require('joi')

const buyProductsSchema = joi.object({
    products: joi.array().items(joi.object({
        id: joi.number().required(),
        quantity: joi.number().required()
    })).required()
})

module.exports = {
    buyProductsSchema
}
