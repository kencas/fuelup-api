const dbConnection = require("../config/dbConnection");
const ledgerqueries = require("../queries/ledger");
const transactionqueries = require("../queries/transaction");
const postingqueries = require("../queries/posting");

module.exports = class TransactionDAO{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }


    static async postTransaction(con, data) {

        var response = {
            flag: false,
            message: 'Error creating Bank',
            payload: null
        };

        var txref = this.IDGenerator();
      
        let con = await dbConnection();

      
    try {
      await con.query("START TRANSACTION");
      

      var transaction = await con.query(
        transactionqueries.create,
        [cust.amount, cust.source, txref, cust.narration, cust.section, cust.tag, new Date('Y-m-d')]
      );

      data.postings.forEach(async (posting) => {
          
        await con.query(
          postingqueries.create,
          [transaction.insertId, posting.amount, posting.TransType, posting.acctype, posting.postmode,posting.section, posting.accno, posting.accno2, posting.narration, new Date('Y-m-d')]
        );
    });

    
      

      await con.query("COMMIT");
      response.flag = true;
      response.message = 'Updated successfully';
      response.payload = updateAccType;

      resolve(response);

    } catch (ex) {
      console.log(ex);
      await con.query("ROLLBACK");
      reject(response);
    } finally {
      await con.release();
      await con.destroy();
    }
        
      }


      static update(cust) {

        var response = {
            flag: false,
            message: 'Error updating Account type',
            payload: null
        };
      
        
      
      return new Promise(async(resolve, reject) => {
      
        let con = await dbConnection();

      
    try {
      await con.query("START TRANSACTION");
      

      var updateAccType = await con.query(
        acctypequeries.update,
        [cust.code2, cust.id]
      );

      await con.query("COMMIT");
      response.flag = true;
      response.message = 'Updated successfully';
      response.payload = updateAccType;

      resolve(response);

    } catch (ex) {
      console.log(ex);
      await con.query("ROLLBACK");
      reject(response);
    } finally {
      await con.release();
      await con.destroy();
    }
      
      
      
        
      });
      }
      

    static async list() {

      var channels = [];
      var postings = [];
      var ledger = {};
      var codes = [];
      var transactions = [];
      let con = await dbConnection();

      try {
        await con.query("START TRANSACTION");
        let todo = await con.query(channelqueries.load_all);
        todo = JSON.parse(JSON.stringify(todo));

        todo.forEach(async (channel) => {
          
          ledger = await con.query(ledgerqueries.load_single, channel.ledger_id);
          channel.ledger = ledger[0];
          channel.transactions = transactions;
          channel.postings = postings;
          channel.codes = codes;
          channels.push(channel);
      });
      await con.query("COMMIT");
        return channels;
      } catch (ex) {
        console.log(ex);
        throw ex;
      } finally {
        await con.release();
        await con.destroy();
      }
      
    }

    
    static async get(id) {

     
      return await AccType.findById(id);
      
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