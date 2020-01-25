const Customer = require('../model/customer');
const Account  = require('../model/account');
const AccType  = require('../model/acctype');
const Posting  = require('../model/posting');
const Transaction  = require('../model/transaction');
const Code  = require('../model/code');
const Ledger  = require('../model/ledger');
const Channel  = require('../model/channel');

module.exports = class TransactionService{ 
    
    constructor() {
      
    }

      static async listPosting(accno) {

        var posts = [];
        var balance = 0;
       
        var postings = await Posting.find({accno2: accno}).populate('transaction');

        for(var i=0;i < postings.length; i++)
        {
          if(postings[i].acctype == 'Asset' || postings[i].acctype == 'Expense')
          {
            if(postings[i].transType == 'DR')
              balance += postings[i].amount;
            else
              balance -= postings[i].amount;
          }
          else
          {
            if(postings[i].transType == 'CR')
              balance += postings[i].amount;
            else
              balance -= postings[i].amount;
          }
            
          postings[i].balance = balance;
          posts.push(postings[i]);
        }

        return posts;
    }


    static async listPostings(accno) {

      var posts = [];
      var balance = 0;
       
      var postings = await Posting.find({accno: accno}).populate('transaction');

      for(var i=0;i < postings.length; i++)
        {
          if(postings[i].acctype == 'Asset' || postings[i].acctype == 'Expense')
          {
            if(postings[i].transType == 'DR')
              balance += postings[i].amount;
            else
              balance -= postings[i].amount;
          }
          else
          {
            if(postings[i].transType == 'CR')
              balance += postings[i].amount;
            else
              balance -= postings[i].amount;
          }
            
          postings[i].balance = balance;
          posts.push(postings[i]);
        }

        return posts;
  }

    static async listTransactions(limit) {

      
       
      return await Transaction.find().limit(limit).populate('channel');

    
  }

    static async list() {

      
       
      return await Transaction.find().populate('channel');

    
  }

    static async get(id) {

     
      var transaction = await Transaction.findById(id);
      transaction.postings = await Posting.find({transaction: transaction._id});
      
      return transaction;
}





  
  }