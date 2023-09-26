const moment = require('moment');
const defaultStartDate = moment().startOf('day');
const quotaEndDate = defaultStartDate.clone().add(1, 'days');

console.log(defaultStartDate, quotaEndDate);
