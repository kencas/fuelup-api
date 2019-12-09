const Posting  = require('../model/posting');
const Transaction  = require('../model/transaction');
const Ledger  = require('../model/ledger');
const Airtime  = require('../model/airtime');
const Bank  = require('../model/bank');

module.exports = class AirtimeService{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }

      static async list() {

      
       
        return await Airtime.find();

      
    }

    
    static async get(id) {

     
      var airtime = await Airtime.findById(id);
      
      
      return airtime;
}




static IDGenerator() {
	 
  var length = 8;
  var timestamp = +new Date;
  
  
  
      var ts = timestamp.toString();
      var parts = ts.split( "" ).reverse();
      var id = "";
      
      for( var i = 0; i < length; ++i ) {
         var index = this.getRandomInt( 0, parts.length - 1 );
         id += parts[index];	 
      }
      
      return id;
  

}

static getRandomInt( min, max ) {
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}


  
  }