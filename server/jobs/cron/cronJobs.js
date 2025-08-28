const cron = require('node-cron');
const { foodBuyer } = require('../foodBuyer');

function initCronJobs() {
  cron.schedule('*/20 * * * * *', foodBuyer);
}

module.exports = initCronJobs;
