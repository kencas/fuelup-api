const Order = require('../model/order');

module.exports = class OrderService{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }

      static async list() {

      
       
        return await Order.find().populate('merchant customer agent');

      
    }

    
    static async get(id) {

     
      var agent = await Order.findById(id);
      
      
      return agent;
}



  
  }