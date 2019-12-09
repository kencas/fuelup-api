const dbConnection = require("../config/dbConnection");
const ledgerqueries = require("../queries/ledger");
const agentqueries = require("../queries/agent");

module.exports = class AgentDAO{ 
    
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

      var savedAgent = await con.query(
        agentqueries.create,
        [savedLedger.insertId, cust.name, accno, cust.acctype,cust.code,cust.refno, new Date('2018-01-01')]
      );

      await con.query("COMMIT");
      response.flag = true;
      response.message = 'New Agent Created successfully';
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


      static fund(cust) {

        var response = {
            flag: false,
            message: 'Error funding',
            payload: null
        };
      
        
      
      return new Promise(async(resolve, reject) => {
      
      var contra = null;
      var main = null;
      
      var mainaccount = await Ledger.findOne({accno: cust.accmain});
      var contraaccount = await Ledger.findOne({accno: cust.acccontra});
              main = 'DR';
              contra = 'CR';
      
      
          
              const transaction = new Transaction({
                  narration: contra + ": Fund Agent Wallet - " + cust.name,
                  amount: cust.amount,
                  source: cust.channel,
                  section: cust.section,
                  tag: 'FA',
                  txRef: this.IDGenerator(),
                  status: cust.status
              });
      
              var transact = await transaction.save();
      
      
              const posting = new Posting({
                  narration: main + ": Fund Agent Wallet -  " + cust.name,
                  accno: cust.accmain,
                  accno2: cust.accmain,
                  amount: cust.amount,
                  transaction: transact._id,
                  transType: main,
                  acctype: mainaccount.section,
                  postMode: 'GL',
                  section: "Main"
              });
      
              
      
              await posting.save();
      
              const posting2 = new Posting({
                  narration: contra + ": Fund Agent Wallet -  " + cust.name,
                  accno: cust.acccontra,
                  accno2: cust.acccontra,
                  amount: cust.amount,
                  transaction: transact._id,
                  transType: contra,
                  acctype: contraaccount.section,
                  postMode: 'GL',
                  section: 'Contra'
              });
              
      
              await posting2.save();
      
              var updateOps = {availableBal: cust.amount};
      
              var updateOps2 = {availableBal: -cust.amount};
      
              //await Account.update({_id: a._id},{$set: updateOps});
      
              await Agent.findOneAndUpdate({accno: cust.acccontra}, {$inc: updateOps });
      
              await Bank.findOneAndUpdate({accno: cust.accmain}, {$inc: updateOps });
      
              await Ledger.findOneAndUpdate({accno: cust.accmain},{$inc: updateOps});
      
              await Ledger.findOneAndUpdate({accno: cust.acccontra},{$inc: updateOps});
      
      
              response.flag = true;
              response.message = 'Transaction performed successfully';
              response.payload = {
                posting: posting,
                posting2: posting2};
      
      
              
        
              resolve(response);
          })
        .catch(err => {
          console.log(err)
          reject(error);
          });
      
      }

    static async list() {

      var agents = [];
      var postings = [];
      var ledger = {};
      var codes = [];
      let con = await dbConnection();

      try {
        await con.query("START TRANSACTION");
        let todo = await con.query(agentqueries.load_all);
        todo = JSON.parse(JSON.stringify(todo));

        todo.forEach(async (agent) => {
          
          ledger = await con.query(ledgerqueries.load_single, agent.ledger_id);
          agent.ledger = ledger[0];
          agent.postings = postings;
          agent.codes = codes;
          agents.push(agent);
      });
      await con.query("COMMIT");
        return agents;
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