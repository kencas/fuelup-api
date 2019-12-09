const Posting  = require('../model/posting');
const Transaction  = require('../model/transaction');
const Ledger  = require('../model/ledger');
const Agent  = require('../model/agent');
const Order = require('../model/order');

module.exports = class AgentService{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }

      static async list() {

      
       
        return await Agent.find();

      
    }

    
    static async get(id) {

     
      var agent = await Agent.findById(id);
      
      
      return agent;
}

static async getOrder(ref) {

     
  var order = await Order.findOne({refno: ref});
  
  
  return order;
}


static create(cust) {

  var response = {
      flag: false,
      message: 'Error creating agent',
      payload: null
  };

  

return new Promise(async(resolve, reject) => {

  var accno = 0;
  var acctype = "Asset";

  var lastRecord = await Ledger.findOne({accno: { $regex: '.*' + cust.code + '.*' } }).sort({ created: -1 }).limit(1);

        if(lastRecord == null)
            accno = 1;
        else
            accno = parseInt(lastRecord.accno.substr(3)) + 1;

        accno = this.zeroPad(accno,3);

        accno = cust.code + accno;

  const ledger = new Ledger({
      accno: accno,
      accname: cust.name,
      section: cust.acctype
  });

  var l = await ledger.save();


  const agent = new Agent({
    ledger: l._id,
    refno: cust.refno,
    name: cust.name,
    acctype: acctype,
    accno: accno,
    code: cust.code
});



  agent
.save()
.then(async(result) => {
  console.log(result);
  response.flag = true;
  response.message = 'New Agent created successfully';
  response.payload = result;

  
  resolve(response);
})
.catch(err => {
  console.log(err)
  reject(error);
});
});
}

static login(cust) {

  var response = {
      flag: false,
      message: 'Error logging in',
      payload: null
  };

  

return new Promise(async(resolve, reject) => {

  var accno = 0;
  var acctype = "Asset";

  var agent = await Agent.findOne({refno: cust.refno, passcode: cust.passcode });

        if(agent == null)
        {
          response.message = 'Invalid credentials!!!';
          response.payload = {};

  
            reject(response);

            return;
        }
            
        
  //console.log(result);
  response.flag = true;
  response.message = 'Agent logged in successfully';
  response.payload = {
    refno: agent.refno,
    balance: agent.availableBal
  };;

  
  resolve(response);

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