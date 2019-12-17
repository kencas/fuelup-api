const Customer = require('../model/customer');
const Account  = require('../model/account');
const AccType  = require('../model/acctype');
const LoanOffer  = require('../model/loanoffer');
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

    static async configurepin(cust) {

        var response = {
            flag: false,
            message: 'Error performing operation',
            payload: null
        };

        return new Promise(async(resolve, reject) => {

        
        

        
            var verification = await Verification.findOne({code: cust.code, status: "Used",phoneno: cust.phoneno});    
            
            if(verification == null)
            {
                response.message = 'Phone number not verified';
                
    
                reject(response);
                return;

            }

            var customer = await Customer.findOne({phoneno: verification.phoneno});

            customer.transcode =cust.pincode;
            customer.isconfiguredcode = 'Y';

            customer.save();

            response.flag = true;
            response.message = 'Pin code configured successfully';
            response.payload = {
                username: customer.username,
                email: customer.email,
                customerNo: customer.customerNo,
                phoneno: verification.phoneno,
                isconfiguredbvn: customer.isconfiguredbvn,
                wallet: {
                    balance: customer.wallet.amount
                }
            };
    
                resolve(response);

            });
 
    }


    static async verifypin(cust) {

        var response = {
            flag: false,
            message: 'Error performing operation',
            payload: null
        };

        return new Promise(async(resolve, reject) => {


            var customer = await Customer.findOne({phoneno: cust.phoneno,transcode: cust.pincode}).populate('wallet');

            
            if(customer != null)
            {
                response.flag = true;
                response.message = 'Pin code verified successfully';
                response.payload = {
                    phoneno: customer.phoneno,
                    customerNo: customer.customerNo,
                    email: customer.email,
                    username: customer.username,
                    isconfiguredbvn: customer.isconfiguredbvn,
                    wallet: {
                        balance: customer.wallet.amount
                    }
                };
            }
           
    
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
            isnewuser: false,
            payload: {}
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
            response.isnewuser = isnewuser;
            response.payload = cst;
    
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

        var total = 0;
        var qty = 0;

        var description = '';

        var isOTPValidated = 'N';
        var isPaid = 'N';

        return new Promise(async(resolve, reject) => {

            var customer = await Customer.findOne({phoneno: cust.phoneno});

            if(customer == null)
            {
                response.flag = false;
                response.message = 'Invalid Customer';

                reject(response);

                return;
            }   

            if(cust.validateOTP == 'Y')
            {
                var customer = await Customer.findOne({phoneno: cust.phoneno, transcode: cust.otp, isconfiguredcode: "Y"});

                if(customer == null)
                {
                    response.flag = false;
                    response.message = 'OTP Validation failed';

                    reject(response);

                    return;
                }    

                isOTPValidated = "Y";
            }
        
             

            var agent = await Agent.findOne({refno: cust.agentId});

            if(agent == null)
            {
                response.flag = false;
                response.message = 'Invalid Agent';

                reject(response);

                return;
            }   
            
            if(cust.orderType == 'Quantity')
            {
                qty = cust.qty
                total = agent.unitprice * cust.qty;
                description = 'Purchase of ' + cust.qty + ' litres of fuel';
            }
            
            else
            {
                qty = Number(cust.amount / agent.unitprice);
                total = cust.amount;
                description = 'Purchase of fuel for amount: ' + total;
            }
            

            var wallet = await Wallet.findOne({customer: customer._id});

      if(wallet.amount < Number(total))
      {
        response.flag = false;
        response.message = 'Low balance to complete transaction';

        reject(response);

        return;
      }


      wallet.amount -= Number(total);

      await wallet.save();

      isPaid = 'Y';

      var refno = this.getRandomInt(10000000001,11111111111);

      const transaction = new Transaction({
        wallet: wallet._id,
        amount: total,
        narration: "Order created - " + refno,
        txRef: refno,
        section: "User",
        tag: "CO"
    });

    await transaction.save();


            

           
                const order = new Order({
                    customer: customer._id,
                    agent: agent._id,
                    qty: qty,
                    orderType: cust.orderType,
                    isOTPValidated: isOTPValidated,
                    isPaid: isPaid,
                    price: total,
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

            await wallet.save();

            const transaction = new Transaction({
                wallet: wallet._id,
                amount: amount,
                narration: "Wallet funding - " + refno,
                txRef: refno,
                section: "User",
                tag: "DM"
            });

            await transaction.save();
            
            response.flag = true;
            response.message = "Transaction completed successfully";
            response.payload = {
                reference: refno,
                phoneno: phoneno,
                amount: amount
            };

            return response;

    }


    static async listOrder(customerId) {

        
        return await Order.findOne({customer: customerId});

        
      
    }


    static async listTransaction(customerId) {

        var wallet = await Wallet.findOne({customer: customerId});

        return await Transaction.findOne({wallet: wallet._id});

    
      
    }

    static async checkLoanEligibility(cust)
    {
        var response = {
            flag: false,
            message: 'You are not ineligible for the loan',
            payload: []
        };

        var offers = [];

        var amount = 1500;


        return new Promise(async(resolve, reject) => {
            
            var loanoffers = await LoanOffer.find({status: 'Approved'});
            var customer = await Customer.findOne({phoneno: cust.phoneno});
            var orders = await Order.find({customer: customer._id, isProcessed: 'Y'});


            if(orders.length >= 1)
            {
                for(var i = 0; i < loanoffers.length; i++)
                {
                    offers.push({
                        name: loanoffers[i].name,
                        interest: loanoffers[i].interest,
                        amount: (loanoffers[i].minApprovalAmt / 100) * amount,
                        tenor: loanoffers[i].tenor
                    });
                }

                response.flag = true;
                response.message = 'You are eligible for the loan ';
                response.payload = offers;

                resolve(response);
            }
            else
            reject(response);
            




            

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