const fetch = require('node-fetch');
const readline = require('readline');
const fs = require('fs');
const infoData = require('../assets/info');
const { SearchCustomer } = require('./SearchCustomer');

const fileTransaction = {

  customerList: [],

  customerFullData: [],

  /**
   * Calls function to get the customer data, on promise resolve
   * searches the customers to be saved, writes in a file.
   * If promise is rejected, catches and logs the error.
   * @return {promise} A promise is returned, when the search is complete it is resolved.
   */
  beginTransaction: () => {
    return fileTransaction.getCustomerData(infoData.urlPath, infoData.filePath)
      .then((data) => {
        fileTransaction.customerFullData = data;
        const searchCustomer = new SearchCustomer({
          customerDataArr: fileTransaction.customerFullData,
          officeCords: infoData.officeCords
        });
        fileTransaction.customerList = searchCustomer.search();
        fileTransaction.setCustomerData(infoData.opPath, fileTransaction.customerList);
      })
      .catch((err) => {
        console.log(err, 'There was a problem in fetching the file');
      });
  },

  /**
   * Gets customer details from given URL and creates a txt file with that data.
   * @param {string} fromUrl - URL Path from where the customer data is to be extracted.
   * @param {string} toUrl - Path to write the new customer.txt file.
   * @return {promise} A promise when the file is extracted and new one is written in the directory.
   */
  getCustomerData: (fromUrl, toUrl) => {
    return new Promise(function(resolve, reject) {
      const settings = { method: "Get" },
        custListArr = [];
      fetch(fromUrl, settings)
        .then(res => res.text())
        .then((data) => {
          // Saving the data in a file in assest folder.
          fs.writeFile(toUrl, data, function (err) {
            if (err) throw err;
            // Reading the data from file.
            const fileOpenStream = readline.createInterface({
              input: fs.createReadStream(toUrl)
            });
            // Line by line saving the data as array of objects.
            fileOpenStream.on('line', function (line) {
              custListArr.push(JSON.parse(line));
            }).on('close', function() {
              // Resolving the promise when reaches EOF.
              resolve(custListArr);
            });
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  /**
   * Create and write customer details in output file.
   * @param {string} opPath - Output path: Path of output.txt file to be created at.
   * @param {Array} data - An array of objects carrying data of customers to be written in the output.txt file e.g. {User_id and name}.
   */
  setCustomerData: (opPath, data) => {
    fs.writeFileSync(opPath, 'Customer List\n');
    data.forEach((obj) => {
      fs.writeFileSync(opPath, `UserId: ${obj.user_id}, Name: ${obj.name}\n`, { flag: "a+" });
    });
  }
}

module.exports = fileTransaction;
