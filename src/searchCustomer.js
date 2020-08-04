/** Class for searching customers from the text file and sorting them. */
module.exports.SearchCustomer = class SearchCustomer {

  /**
   * Initialises the values of radius, ranges, coordinates and calls search function.
   * @param {object} props - Props comprises of customer details array, office coordinates object.
   */
  constructor(props) {
    this.dataArr = props.customerDataArr;
    this.latitude = props.officeCords.latitude;
    this.longitude = props.officeCords.longitude;
    this.range = props.officeCords.range;
    this.earthRadius = 6371;
    this.inRangeArr = [];
    this.search = this.search.bind(this);
    this.calcDistance = this.calcDistance.bind(this);
    this.degreetoRadian = this.degreetoRadian.bind(this);
  }

  /**
   * A function to search through customers according to their distances,
   * calls calcDistance function and sortArr function
   */
  search() {
    this.dataArr.forEach((obj) => {
      if (this.calcDistance(obj))
        this.inRangeArr.push({user_id: obj.user_id, name: obj.name})
    });
    this.sortArr();
    return this.inRangeArr;
  }

  /**
   * A function to sort the customers who are in range of office <inRangeArr>.
   */
  sortArr() {
    this.inRangeArr.sort(function(a, b){return a.user_id - b.user_id});
  }

  /**
   * A function to convert degree to radians.
   * @param {number} degree - A number which is in degrees
   * @return {number} - A number converted to radians
   */
  degreetoRadian(degree) {
    return (degree * (Math.PI / 180));
  }

  /**
   * A function to calculate distance of customer from the office coordinates.
   * @param {object} coords - An object of numbers latitude and longitude of customers
   * @return {boolean} - A boolean value is returned, true if in range of office else false
   */
  calcDistance(coords) {
    const centralAngle = Math.acos(Math.sin(this.degreetoRadian(this.latitude)) * Math.sin(this.degreetoRadian(coords.latitude)) +
    Math.cos(this.degreetoRadian(this.latitude)) * Math.cos(this.degreetoRadian(coords.latitude)) *
    Math.cos(Math.abs(this.degreetoRadian(this.longitude) - this.degreetoRadian(coords.longitude))));

    return ((this.earthRadius * centralAngle) <= this.range)
  }
}
