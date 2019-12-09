const Posting  = require('../model/posting');
const Transaction  = require('../model/transaction');
const Ledger  = require('../model/ledger');
const Agent  = require('../model/agent');
const Bank  = require('../model/bank');
const Prepaid  = require('../model/prepaid');

module.exports = class PrepaidService{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }

      static async list() {

      
       
        return await Prepaid.find();

      
    }

    
    static async get(id) {

     
      var prepaid = await Prepaid.findById(id);
      
      
      return prapaid;
}


static create(cust) {

  var response = {
      flag: false,
      message: 'Error creating agent',
      payload: null
  };

  

return new Promise(async(resolve, reject) => {

  var accno = 0;
  var accno2 = 0;

  var typemain = "";
  var typecontra = "";
  var typesettlement = "";

  var contra = null;
  var main = null;

  var lastRecord = await Ledger.findOne({accno: { $regex: '.*' + cust.code + '.*' } }).sort({ created: -1 }).limit(1);

        if(lastRecord == null)
            accno = 1;
        else
            accno = parseInt(lastRecord.accno.substr(3)) + 1;

        accno = this.zeroPad(accno,3);

        accno = cust.code + accno;

        lastRecord = await Ledger.findOne({accno: { $regex: '.*' + cust.code2 + '.*' } }).sort({ created: -1 }).limit(1);

        if(lastRecord == null)
            accno2 = 1;
        else
            accno2 = parseInt(lastRecord.accno.substr(3)) + 1;

        accno2 = this.zeroPad(accno2,3);

        accno2 = cust.code2 + accno2;

        if(cust.section == 'Income')
        {
          typemain = "Asset";
          typecontra = "Liability";
          typesettlement = "Income";

          main = 'DR';
          contra = 'CR';
        }
        else
        {
          typemain = "Asset";
          typecontra = "Asset";
          typesettlement = "Expense";

          main = 'CR';
          contra = 'DR';
        }

  var ledger = new Ledger({
      accno: accno,
      accname: cust.name,
      section: typecontra
  });

  await ledger.save();


  ledger = new Ledger({
    accno: accno2,
    accname: cust.name,
    section: typesettlement
});

await ledger.save();

  var txRef = this.IDGenerator();


  const prepaid = new Prepaid({
    refno: txRef,
    name: cust.name,
    acctypemain: typemain,
    acctypecontra: typecontra,
    acctypesettlement: typesettlement,
    accmain: cust.accno,
    acccontra: accno,
    accsettlement: accno2,
    availableBal: cust.amount,
    code: cust.code,
    code2: cust.code2,
    section: cust.section,
    amount: cust.amount,
    duration: cust.duration
});



// var mainaccount = await Ledger.findOne({accno: cust.accno});
// var contraaccount = await Ledger.findOne({accno: cust.accno});
        


    
        const transaction = new Transaction({
            narration: contra + ": New Prepaid Account - " + cust.name,
            amount: cust.amount,
            source: cust.channel,
            section: cust.section,
            tag: 'PA',
            txRef: this.IDGenerator(),
            status: cust.status
        });

        var transact = await transaction.save();


        const posting = new Posting({
            narration: main + ": New Prepaid Account - " + cust.name,
            accno: cust.accno,
            accno2: cust.accno,
            amount: cust.amount,
            transaction: transact._id,
            transType: main,
            acctype: typemain,
            postMode: 'GL',
            section: "Main"
        });

        

        await posting.save();

        const posting2 = new Posting({
            narration: contra + ": New Prepaid Account - " + cust.name,
            accno: accno,
            accno2: accno,
            amount: cust.amount,
            transaction: transact._id,
            transType: contra,
            acctype: typecontra,
            postMode: 'GL',
            section: 'Contra'
        });
        

        await posting2.save();

        var updateOps = {availableBal: cust.amount};

        var updateOps2 = {availableBal: -cust.amount};

        //await Account.update({_id: a._id},{$set: updateOps});

        if(cust.section == 'Income')
        {
          //await Prepaid.findOneAndUpdate({accno: accno}, {$inc: updateOps });

          await Bank.findOneAndUpdate({accno: cust.accno}, {$inc: updateOps });

          await Ledger.findOneAndUpdate({accno: cust.accno},{$inc: updateOps});

          await Ledger.findOneAndUpdate({accno: accno},{$inc: updateOps});
        }
        else
        {
          //await Prepaid.findOneAndUpdate({accno: accno}, {$inc: updateOps });

          await Bank.findOneAndUpdate({accno: cust.accno}, {$inc: updateOps2 });

          await Ledger.findOneAndUpdate({accno: cust.accno},{$inc: updateOps2});

          await Ledger.findOneAndUpdate({accno: accno},{$inc: updateOps});
        }



  prepaid
.save()
.then(async(result) => {
  console.log(result);
  response.flag = true;
  response.message = 'New Prepaid Record Created successfully';
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