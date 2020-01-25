
const Ledger  = require('../model/ledger');

module.exports = class LedgerService{ 
    
    constructor() {
      
    }

      static async list() {

      
       
        return await Ledger.find();

      
    }

    static async get(id) {

     
      var ledger = await Ledger.findById(id);
      //ledgers.postings = await Posting.find({transaction: transaction._id});
      
      return ledger;
}




  
  }