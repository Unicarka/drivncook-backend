const Joi = require('joi')

const parkSchema = Joi.object({
    spotId: Joi.string().required()
})

module.exports = {
    parkSchema
}
