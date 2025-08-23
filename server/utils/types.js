const config = require('config')

const foodTypes = config.get('products').map(p => p.name);

const productsList = config.get('products').map(p => ({name: p.name, quantity: Number}))

module.exports = {
    foodTypes,
    productsList
}
