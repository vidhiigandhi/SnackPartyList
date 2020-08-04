const { fileTransaction, SearchCustomer } = require('../src');
const infoData = require('../assets/info');
const assert = require('assert');
const fs = require('fs');

describe('Customer List: app', () => {
  describe('file transaction', () => {
    it('should initiate begin transaction and get final customer list', () => {
      const spyfn = jest.spyOn(fileTransaction, 'beginTransaction');
      const { customerList } = require('../app');
      expect(spyfn).toHaveBeenCalledTimes(1);
      expect(customerList).toEqual(expect.arrayContaining(fileTransaction.customerList));
    });
    it('should get customer.txt file from the provided URL', async () => {
      const spyfn = jest.spyOn(fileTransaction, 'getCustomerData');
      await fileTransaction.beginTransaction()
        .then(() => { expect(spyfn).toBeCalledWith(infoData.urlPath, infoData.filePath); })
    });
    it('should call setCustomerData to save output.txt file', async () => {
      const spyfn = jest.spyOn(fileTransaction, 'setCustomerData');
      await fileTransaction.beginTransaction()
        .then(() => { expect(spyfn).toBeCalledWith(infoData.opPath, fileTransaction.customerList); })
    });
  });
  describe('sorting check', () => {
    it('should update customer list in sorted ascending order', () => {
      const { customerList } = require('../app');
      expect(customerList).toEqual(expect.arrayContaining(customerList.sort(function(a, b){return a.user_id - b.user_id})));
    });
  });
  describe('coordinates check', () => {
    let searchCustomer;
    let coords;
    beforeEach(() => {
      searchCustomer = new SearchCustomer({ officeCords: infoData.officeCords });
    });
    describe('positive testing', () => {
      it('should be true when coordinates be in radius of office coordinates', async () => {
        coords = { latitude: infoData.officeCords.latitude + 1, longitude: infoData.officeCords.longitude + 1 }
        const result = searchCustomer.calcDistance(coords);
        expect(result).toBeTruthy();
      });
      it('should customer be in radius of office coordinates', async () => {
        await fileTransaction.beginTransaction()
          .then(() => {
            const coordObj = fileTransaction.customerFullData.find((obj) => {
              return obj.user_id == fileTransaction.customerList[0].user_id;
            });
            const result = searchCustomer.calcDistance(coordObj);
            expect(result).toBeTruthy();
           })
      });
    });
    describe('negative testing', () => {
      it('should be false when coordinates is not in radius of office coordinates', async () => {
        coords = { latitude: infoData.officeCords.latitude + 5, longitude: infoData.officeCords.longitude - 10}
        const result = searchCustomer.calcDistance(coords);
        expect(result).toBeFalsy();
      });
      it('should throw error when no coordinates are given', async () => {
        expect(searchCustomer.calcDistance).toThrow();
      });
    });
  });
});
