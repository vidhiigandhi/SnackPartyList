const fileTransaction = require('./src/fileTransaction');
var customerList = [];

fileTransaction.beginTransaction()
  .then(() => {
    customerList = fileTransaction.customerList;
  });

module.exports.customerList = customerList;
