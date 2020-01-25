
const Transaction  = require('../model/transaction');
const Customer  = require('../model/customer');
const Account  = require('../model/account');

module.exports = class ReportService{ 
    
    constructor() {
      
    }

      static async dashboard() {

      
       
        var transaction = await Transaction.count({status: "Approved"});

        var customer = await Customer.count();

        var account = await Account.count();

        var report = {
        transaction: transaction,
        customer: customer,
        account: account
      }

      return report;
    }

    static async get(id) {

     
      var ledger = await Ledger.findById(id);
      //ledgers.postings = await Posting.find({transaction: transaction._id});
      
      return ledger;
}




  
  }