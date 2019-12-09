const Posting  = require('../model/posting');
const Transaction  = require('../model/transaction');
const Ledger  = require('../model/ledger');
const Bank  = require('../model/bank');

module.exports = class BankService{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }

      static async list() {

      
       
        return await Bank.find();

      
    }

    
    static async get(id) {

     
      var bank = await Bank.findById(id);
      
      
      return bank;
}


static create(cust) {

  var response = {
      flag: false,
      message: 'Error creating bank',
      payload: null
  };

  

return new Promise(async(resolve, reject) => {

  var accno = 0;

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

  await ledger.save();


  const bank = new Bank({
    name: cust.name,
    acctype: 'Asset',
    accno: accno,
    code: cust.code,
    metadata: cust.metadata
});



  bank
.save()
.then(async(result) => {
  console.log(result);
  response.flag = true;
  response.message = 'New Bank created successfully';
  response.payload = result;

  
  resolve(response);
})
.catch(err => {
  console.log(err)
  reject(error);
});
});
}

static fund(cust) {

  var response = {
      flag: false,
      message: 'Error funding',
      payload: null
  };

  

return new Promise(async(resolve, reject) => {

  // var accno = 0;

  // var lastRecord = await Ledger.findOne({accno: { $regex: '.*' + cust.code + '.*' } }).sort({ created: -1 }).limit(1);

  //       if(lastRecord == null)
  //           accno = 1;
  //       else
  //           accno = parseInt(lastRecord.accno.substr(3)) + 1;

  //       accno = this.zeroPad(accno,3);

  //       accno = cust.code + accno;

//   const ledger = new Ledger({
//       accno: accno,
//       accname: cust.name,
//       section: cust.acctype
//   });

//   await ledger.save();


//   const agent = new Agent({
//     refno: cust.refno,
//     name: cust.name,
//     acctype: cust.acctype,
//     accno: accno,
//     code: cust.code
// });




//   agent
// .save()
// .then(async(result) => {
//   console.log(result);
//   response.flag = true;
//   response.message = 'New Agent created successfully';
//   response.payload = result;

var contra = null;
var main = null;

var mainaccount = await Ledger.findOne({accno: cust.accmain});
var contraaccount = await Ledger.findOne({accno: cust.acccontra});
        main = 'DR';
        contra = 'CR';


    
        const transaction = new Transaction({
            narration: main + ": Fund Agent Wallet - " + cust.name,
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