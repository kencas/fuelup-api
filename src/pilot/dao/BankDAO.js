const dbConnection = require("../config/dbConnection");
const ledgerqueries = require("../queries/ledger");
const bankqueries = require("../queries/bank");

module.exports = class BankDAO{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }


    static create(cust) {

        var response = {
            flag: false,
            message: 'Error creating Bank',
            payload: null
        };
      
        
      
      return new Promise(async(resolve, reject) => {
      
        let con = await dbConnection();

        var accno = 0;

        let lastRecord = await con.query(ledgerqueries.load_code, [cust.code]);

        lastRecord = JSON.parse(JSON.stringify(lastRecord));

        console.log(lastRecord);
    
        if(lastRecord.length == 0)
            accno = 1;
        else
            accno = parseInt(lastRecord[0].accno.substr(3)) + 1;

        accno = this.zeroPad(accno,3);

        accno = cust.code + accno;



    try {
      await con.query("START TRANSACTION");
      let savedLedger = await con.query(
        ledgerqueries.create,
        [accno, cust.name, cust.code, cust.acctype]
      );

      var savedBank = await con.query(
        bankqueries.create,
        [savedLedger.insertId, cust.name, accno, cust.acctype,cust.code, new Date('2018-01-01')]
      );

      await con.query("COMMIT");
      response.flag = true;
      response.message = 'New Ledger Created successfully';
      response.payload = savedBank;

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

      var banks = [];
      var ledger = [];
      let con = await dbConnection();

      try {
        await con.query("START TRANSACTION");
        let todo = await con.query(bankqueries.load_all);
        todo = JSON.parse(JSON.stringify(todo));

        todo.forEach(async (bank) => {
          
          ledger = await con.query(ledgerqueries.load_single, bank.ledger_id);
          bank.ledger = ledger[0];
          banks.push(bank);
      });
      await con.query("COMMIT");
        return banks;
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