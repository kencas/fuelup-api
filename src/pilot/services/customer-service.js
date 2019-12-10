const Customer = require('../model/customer');
const Account  = require('../model/account');
const AccType  = require('../model/acctype');
const Posting  = require('../model/posting');
const Transaction  = require('../model/transaction');
const Order  = require('../model/order');
const Ledger  = require('../model/ledger');
const Fund  = require('../model/fund');
const Agent  = require('../model/agent');
const Withdrawal = require('../model/withdrawal');
const Wallet = require('../model/wallet');
const Verification = require('../model/verification');

const axios = require('axios');

var SECRET_KEY = 'sk_test_57f4d416f35162f07d67679b57d8536031e7fe08';

const paystack = require('paystack')(SECRET_KEY);

module.exports = class CustomerService{ 

    
    
    constructor() {
      
    }

    static zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
      }


    static async get(id) {

        var customer = await Customer.findById(id);

        customer.accounts = await Account.find({customer: id}).populate('acctype');
        return customer;
      
    }

    static async initverification(cust) {

        var response = {
            flag: false,
            message: 'Error Verification',
            payload: null
        };

        return new Promise(async(resolve, reject) => {

        
        const verification = new Verification({
            code: this.getRandomInt(1000, 9999 ),
            phoneno: cust.phoneno
        });

        
            var v = await verification.save();        

            response.flag = true;
            response.message = 'Verification code sent successfully';
            response.payload = v;
    
                resolve(response);

            });
 
    }


    static async initfunding(cust) {

        var response = {
            flag: false,
            message: 'Error funding',
            payload: null
        };

        return new Promise(async(resolve, reject) => {

            var reference = this.getRandomInt(1000, 9999 ) + "" + Math.floor(Date.now() / 1000);
        
        const funding = new Fund({
            amount: cust.amount,
            reference: reference,
            phoneno: cust.phoneno
        });

        
            var fund = await funding.save();        

            response.flag = true;
            response.message = 'Funding initialized successfully';
            response.payload = {
                amount: cust.amount,
                reference: reference,
                phoneno: cust.phoneno
            };

            //console.log(response);
    
                resolve(response);

            });
 
    }



    static async verifyOTP(cust) {

        var response = {
            flag: false,
            message: 'Error Verification',
            payload: null
        };

        return new Promise(async(resolve, reject) => {
        
            var verification = await Verification.findOne({phoneno: cust.phoneno, code: cust.code, status: "Unused"});

            if(verification == null)
            {
                response.flag = false;
                response.message = 'Invalid Verification code';

                reject(response);
            }    

            verification.status = 'Used';
            
            var v = await verification.save();

            var c = await Customer.findOne({phoneno: cust.phoneno});

            var isnewuser = true;
            var isconfiguredcode = 'N';
            var cst = {};

            if(c != null)
            {
                isnewuser = false;
                isconfiguredcode = c.isconfiguredcode;
                cst = {
                    username: c.username,
                    customerNo: c.customerNo,
                    phoneno: c.phoneno,
                    isconfiguredcode : c.isconfiguredcode,
                    email: c.email,
                    code: cust.code
                };
            }

            response.flag = true;
            response.message = 'Phone Number verified successfully';
            response.payload = {
                isnewuser : isnewuser,
                cst: cst
            };
    
            resolve(response);
        });
 
    }

    
    static create(cust) {

        var isNewCustomer = false;
        var isNewAccount = false;

        var response = {
            flag: false,
            message: 'Error signing up',
            payload: null
        };

        

      return new Promise(async(resolve, reject) => {
        


        var c = await Customer.findOne({phoneno: cust.phoneno});

        if(c == null)
        {
            isNewCustomer = true;
        }


        var ver = await Verification.findOne({phoneno: cust.phoneno, code: cust.code, consumed: 'N'});

        if(ver == null)
        {
            response.flag = false;
            response.message = 'Phone number not verified!';

            reject(response);

            return;
        }


        if(isNewCustomer)
        {
            var accno = 0;

            var code = 201;

            var acctype = 'Liability';

            var lastRecord = await Account.findOne({accno: { $regex: '.*' + code + '.*' } }).sort({ created: -1 }).limit(1);

            if(lastRecord == null)
                accno = 1;
            else
                accno = parseInt(lastRecord.accno.substr(3)) + 1;

            accno = this.zeroPad(accno,7);

            accno = code + accno;

            ver.consumed = 'Y';

            await ver.save();


            const account = new Account({
                accno: accno,
                accname: cust.username,
                code: code,
                acctype: acctype
            });

           
            var a = await account.save();

            var customerno = this.getRandomInt(10000000001,11111111111);

            const customer = new Customer({
                username: cust.username,
                email: cust.email,
                phoneno: cust.phoneno,
                customerNo: customerno
            });
            
            var c = await customer.save();

            const wallet = new Wallet({
                account: a._id,
                customer: c._id,
                acctype: acctype,
                code: code
            });

            var w = await wallet.save();

            response.flag = true;
            response.message = 'Account created successfully';
            response.payload = c;

            console.log(response);
            resolve(response);
        }
        else
        {
            response.flag = false;
            response.message = 'Account already exist!!';

            reject(response);
        }

            

        
    //     customer
    // .save()
    // .then(async(result) => {
    //     console.log(result);
    //     response.flag = true;
    //     response.message = 'Customer created successfully';
    //     response.payload = result;

        
    //     resolve(response);
    // })
    // .catch(err => {
    //     console.log(err)
    //     reject(error);
    // });
      });
    }


    static async createOrder(cust) {

        var response = {
            flag: false,
            message: 'Error creating order',
            payload: null
        };

        return new Promise(async(resolve, reject) => {
        
            var customer = await Customer.findOne({phoneno: cust.phoneno});

            if(customer == null)
            {
                response.flag = false;
                response.message = 'Invalid Customer';

                reject(response);
            }    

            var refno = this.getRandomInt(10000000001,11111111111);

            const order = new Order({
                customer: customer._id,
                qty: cust.qty,
                refno: refno
            });

            var o = await order.save();

            response.flag = false;
            response.message = 'Order with reference no ' + refno + ' created successfully';
            response.payload = {
                refno: refno
            };
    
            resolve(response);
        });
 
    }

    static verifytransaction(cust) {

        var response = {
            flag: false,
            message: 'Error signing up',
            payload: null
        };

        const self = this;

        

      return new Promise(async(resolve, reject) => {
        


        var SECRET_KEY = 'sk_test_57f4d416f35162f07d67679b57d8536031e7fe08';

        // var headers = {
        //     Authorization: 'Bearer ' . SECRET_KEY
        // };
        

        // axios.get('https://api.paystack.co/transaction/verify/' + cust.reference, { headers: headers })
        // .then(async(response) => {
        //     var result = response.data;
        //     if(result.flag)
        //     var customer = await this.fundWallet(cust.phoneno, (result.data.amount / 100), cust.reference);
            
        //   console.log(result);
        //   resolve(customer);
        // }, (error) => {
        //   console.log(error);
        //   reject(error);
        // });

        paystack.transaction.verify(cust.reference)
        .then(async function(body) {
            console.log(body);
                if(body.status){
                    var customer = await self.fundwallet(cust.phoneno, (body.data.amount / 100), body.data.reference);
                    resolve(customer);
                }
                
      })
      .catch(function(error) {
          console.log(error);
          reject(error);
      });
            

      
      });
    }


    static async fundwallet(phoneno, amount, refno) {

        
        var isNewAccount = false;

        var response = {
            flag: false,
            message: 'Error signing up',
            payload: null
        };

        

     
    
        var c = await Fund.findOne({phoneno: phoneno, reference: refno, status: "Pending"});

        if(c == null)
        {
            response.message = "Invalid transaction";

            return response;
        }

            c.status = "Processed";
       
            await c.save();

            var cd = await Customer.findOne({phoneno: phoneno});

            var wallet = await Wallet.findOne({customer: cd._id});

            wallet.amount += amount;

            wallet.save();
            
            response.flag = true;
            response.message = "Transaction completed successfully";
            response.payload = c;

            return response;

    }


    static async checkBalance(data) {

        var response = {
            flag: false,
            message: 'User record not found',
            payload: null
        };

        var acctype = await AccType.findOne({index: data.acctype});

        if(acctype == null)
        {
            response.message = 'Invalid selection';
            return response;
        }
       
        var customer = await Customer.findOne({phoneno: data.phoneno});

        if(customer == null)
        {
            return response;
        }

        
        var account = await Account.findOne({customer: customer._id, acctype: acctype._id});

        if(account == null)
        {
            response.message = 'Account type not found';
            return response;
        }

        if(account.transCode != data.transCode)
        {
            response.message = 'Invalid Transaction Code';
            return response;
        }

        response.flag = true;
        response.payload = account;

        console.log(response);5

        return response;

      
    }

    

  static async deposit(cust) {



    var response = {
        flag: false,
        message: 'Transaction Error',
        payload: null
    };

    var contra = null;

    if(cust.transType == 'DR')
        contra = 'CR';
    else
        contra = 'DR';

    var code = await Code.findOne({data: cust.code, status: 'Unused'});

    if(code == null)
    {
        response.message = 'Invalid Deposit Code';
        return response;
    }

    var agent = await Agent.findOne({_id: code.agent});

    if(agent == null)
    {
        response.message = 'Invalid Agent';
        return response;
    }

    var c = await Customer.findOne({phoneno: cust.phoneno});

    if(c == null)
    {
        response.message = 'User not registered on the Platform';
        return response;
    }

    var acctype = await AccType.findOne({index: cust.acctype});

    if(acctype == null)
    {
        response.message = 'Invalid selection';
        return response;
    }

    var a = await Account.findOne({acctype: acctype._id, customer: c._id});

    if(a == null)
    {
        response.message = 'Account not found';
        return response;
    }


    
        const transaction = new Transaction({
            narration: cust.transType + ": USSD Transaction - " + c.firstname + " " + c.surname,
            amount: code.amount,
            source: cust.channel,
            section: cust.section,
            tag: 'DM',
            txRef: this.IDGenerator(),
            status: cust.status
        });

        var transact = await transaction.save();


        const posting = new Posting({
            narration: cust.transType + ": USSD Transaction - " + c.firstname + " " + c.surname,
            accno: a.accno,
            accno2: acctype.accno,
            amount: code.amount,
            transaction: transact._id,
            transType: cust.transType,
            acctype: agent.acctype,
            postMode: cust.section,
            section: "Main"
        });

        

        await posting.save();

        const posting2 = new Posting({
            narration: contra + ": USSD Transaction - " + c.firstname + " " + c.surname,
            accno: agent.accno,
            accno2: agent.accno,
            amount: code.amount,
            transaction: transact._id,
            transType: contra,
            acctype: agent.acctype,
            postMode: 'GL',
            section: 'Contra'
        });
        

        await posting2.save();

        var updateOps = {availableBal: code.amount};

        var updateOps2 = {availableBal: -code.amount};

        //await Account.update({_id: a._id},{$set: updateOps});

        await Account.findByIdAndUpdate({_id: a._id}, {$inc: updateOps });

        await Ledger.findOneAndUpdate({accno: acctype.accno},{$inc: updateOps});

        await Ledger.findOneAndUpdate({accno: agent.accno},{$inc: updateOps2});

        await Agent.findOneAndUpdate({accno: agent.accno},{$inc: updateOps2});

        response.flag = true;
        response.message = 'Deposit Transaction performed successfully';
        response.payload = posting;

        console.log(response);
        
    
    

    return response;

}


static async withdraw(cust) {



    var response = {
        flag: false,
        message: 'Transaction Error',
        payload: null
    };

    
    var c = await Customer.findOne({phoneno: cust.phoneno});

    if(c == null)
    {
        response.message = 'User not registered on the Platform';
        return response;
    }

    var acctype = await AccType.findOne({index: cust.acctype});

    if(acctype == null)
    {
        response.message = 'Invalid account Type';
        return response;
    }

    var a = await Account.findOne({acctype: acctype._id, customer: c._id});

    if(a == null)
    {
        response.message = 'Account not found';
        return response;
    }

    var code = this.IDGenerator();

    const withdraw = new Withdrawal({
        customer: c._id,
        amount: cust.amount,
        code: code,
        account: a._id
    });
    

    await withdraw.save();

        response.flag = true;
        response.message = 'Request Processed Successfully\n. Your Withdrawal code is '+ code;
        response.payload = withdraw;

        console.log(response);
        
    
    

    return response;

}


static async buy_airtime(cust) {


    // var response = {
    //     flag: false,
    //     message: 'Transaction Error',
    //     payload: null
    // };

    // var contra = null;

    
    //     contra = 'CR';
   

    // var agent = await Agent.findOne({accno: cust.agentaccno});

    // if(agent == null)
    // {
    //     response.message = 'Invalid Biller Agent';
    //     return response;
    // }

    // var c = await Customer.findOne({phoneno: cust.phoneno});

    // if(c == null)
    // {
    //     response.message = 'User not registered on the Platform';
    //     return response;
    // }

    // var acctype = await AccType.findOne({index: cust.acctype});

    // if(acctype == null)
    // {
    //     response.message = 'Invalid selection';
    //     return response;
    // }

    // var a = await Account.findOne({acctype: acctype._id, customer: c._id});

    // if(a == null)
    // {
    //     response.message = 'Account not found';
    //     return response;
    // }


    
    //     const transaction = new Transaction({
    //         narration: cust.transType + ": USSD Transaction - " + c.firstname + " " + c.surname,
    //         amount: code.amount,
    //         source: cust.channel,
    //         section: cust.section,
    //         tag: 'DM',
    //         txRef: this.IDGenerator(),
    //         status: cust.status
    //     });

    //     var transact = await transaction.save();


    //     const posting = new Posting({
    //         narration: cust.transType + ": USSD Transaction - " + c.firstname + " " + c.surname,
    //         accno: a.accno,
    //         accno2: acctype.accno,
    //         amount: cust.amount,
    //         transaction: transact._id,
    //         transType: "DR",
    //         acctype: agent.acctype,
    //         postMode: "OP",
    //         section: "Main"
    //     });

        

    //     await posting.save();

    //     const posting2 = new Posting({
    //         narration: contra + ": USSD Transaction - " + c.firstname + " " + c.surname,
    //         accno: agent.accno,
    //         accno2: agent.accno,
    //         amount: cust.amount,
    //         transaction: transact._id,
    //         transType: contra,
    //         acctype: agent.acctype,
    //         postMode: 'GL',
    //         section: 'Contra'
    //     });
        

    //     await posting2.save();

    //     var updateOps = {availableBal: code.amount};

    //     var updateOps2 = {availableBal: -code.amount};

    //     //await Account.update({_id: a._id},{$set: updateOps});

    //     await Account.findByIdAndUpdate({_id: a._id}, {$inc: updateOps });

    //     await Ledger.findOneAndUpdate({accno: acctype.accno},{$inc: updateOps});

    //     await Ledger.findOneAndUpdate({accno: agent.accno},{$inc: updateOps2});

    //     await Agent.findOneAndUpdate({accno: agent.accno},{$inc: updateOps2});

    //     response.flag = true;
    //     response.message = 'Deposit Transaction performed successfully';
    //     response.payload = posting;

    //     console.log(response);
        
    
    

    // return response;

    var response = {
        flag: false,
        message: 'Error signing up',
        payload: null
    };

    

  return new Promise(async(resolve, reject) => {
    const airtime = new Airtime({
        biller: cust.biller,
        billerName: cust.billerName,
        amount: cust.amount,
        phoneno: cust.phoneno
    });


    

 airtime
.save()
.then(async(result) => {
    console.log(result);
    response.flag = true;
    response.message = 'Airtime purchase performed successfully';
    response.payload = result;

    
    resolve(response);
})
.catch(err => {
    console.log(err)
    reject(error);
});
        

  
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