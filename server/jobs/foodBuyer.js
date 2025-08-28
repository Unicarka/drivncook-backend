const foodService = require('../services/food')

function foodBuyer() {
    const now = new Date().toISOString();
    foodService.sellProducts();
}

module.exports = { foodBuyer };
