const Customer = require('../model/customer');
const Account  = require('../model/account');
const Transfer  = require('../model/transfer');
const LoanOffer  = require('../model/loanoffer');
const Transaction  = require('../model/transaction');
const Order  = require('../model/order');
const Loan  = require('../model/loan');
const Fund  = require('../model/fund');
const Agent  = require('../model/agent');
const Vendor = require('../model/vendor');
const Profile = require('../model/profile');
const Card = require('../model/card');
const Application = require('../model/application');
const Wallet = require('../model/wallet');
const Verification = require('../model/verification');
const FCM = require('fcm-node');
const axios = require('axios');

    
var serverKey = require('../config/fuelupuserapp-firebase-adminsdk-hqc16-210d7c0399.json') //put the generated private key path here    


var SECRET_KEY = 'sk_test_57f4d416f35162f07d67679b57d8536031e7fe08';

const paystack = require('paystack')(SECRET_KEY);

module.exports = class CustomerService{ 

    
    
    constructor() {
      
    }

    static async list() {
      
       
        return await Customer.find();

      
    }

    static async sendMessage(to,title, body, payload)
    {
        
    
    var fcm = new FCM(serverKey)
 
    var message = { 
        to: to, 
        collapse_key: 'pushkey',
        
        notification: {
            title: title, 
            body: body
        },
        
        data: payload
    }
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!")
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
    }

    static zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
      }

      static async listOrder(customerId) {

        var orders = [];
        var agent = {};
        var ord = {};
        var customer = await Customer.findOne({customerNo: customerId});
              //console.log(customer);
        var order = await Order.find({customer: customer._id});
      
        for(var i = 0; i < order.length; i++)
        {
            ord = order[i];
            agent = await Agent.findById(ord.agent);
            

            orders.push({
                refno: ord.refno,
                qty: ord.qty,
                price: ord.price,
                orderType: ord.orderType,
                description: ord.description,
                isAccepted: ord.isAccepted,
                isPaid: ord.isPaid,
                isDelivered: ord.isDelivered,
                isCancelled: ord.isCancelled,
                isOTPValidated: ord.isOTPValidated,
                isProcessed: ord.isProcessed,
                status: ord.status,
                agent: {
                    refno: agent.refno,
                    name: agent.name
                }
            });
        }
       

        return orders;
      
      }


    static async get(id) {

        var customer = await Customer.findById(id);

        var wallet = await Wallet.findOne({customer: id});

        // return {
        //     customer: customer,
        //     wallet: wallet
        // };

        customer.wallet = wallet;
        return customer;
      
    }

    static async initverification(cust) {

        var response = {
            flag: false,
            message: 'Error Verification',
            payload: {}
        };

        return new Promise(async(resolve, reject) => {


            var code = this.getRandomInt(1000, 9999 );
        
        const verification = new Verification({
            code: code,
            phoneno: cust.phoneno,
            countrycode: cust.countrycode
        });

        
            var v = await verification.save();    

            var message = 'Your Verification code is ' + code;
            
            await axios.get('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail=kencas4@gmail.com&subacct=Fuelup360&subacctpwd=fuelup@4real&message=' + message + '&sender=Fuelup360&sendto=' + cust.phoneno + '&msgtype=0');
            // .then(function (response) {
            //     console.log(response);
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   })
            //   .finally(function () {
            //     // always executed
            //   });


            response.flag = true;
            response.message = message
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

        var cardstatus = 'Pending';
        var cardcreated = "Na";
        var cardactivationdate = "NA";
        var cardno = "NA";

        return new Promise(async(resolve, reject) => {

        
        

        
            var verification = await Verification.findOne({code: cust.code, status: "Used",phoneno: cust.phoneno});    
            
            if(verification == null)
            {
                response.message = 'Phone number not verified';
                
    
                reject(response);
                return;

            }

            var customer = await Customer.findOne({phoneno: verification.phoneno}).populate('wallet');

            var wallet = await Wallet.findOne({customer: customer._id});

            var vendor = await Vendor.findOne({customer: customer._id});
            var card = await Card.findOne({customer: customer._id});
            
            customer.transcode = cust.pincode;
            customer.isconfiguredcode = 'Y';

            customer.save();

            response.flag = true;
            response.message = 'Pin code configured successfully';
            response.payload = {
                firstname: customer.firstname,
                lastname: customer.lastname,
                gender: customer.gender,
                username: customer.username,
                email: customer.email,
                customerNo: customer.customerNo,
                phoneno: verification.phoneno,
                isconfiguredbvn: customer.isconfiguredbvn,
                canchangepin: customer.canchangepin,
                wallet: {
                    balance: wallet.amount
                },
                vendor: vendor,
                card: {
                    cardno: cardno,
                    status: cardstatus,
                    created: cardcreated,
                    activationdate: cardactivationdate
                    }
            };
    
                resolve(response);

            });
 
    }


    static async changepin(cust) {

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

            var customer = await Customer.findOne({phoneno: verification.phoneno}).populate('wallet');

            var wallet = await Wallet.findOne({customer: customer._id});
            var vendor = await Vendor.findOne({customer: customer._id});
            var card = await Card.findOne({customer: customer._id});


            customer.transcode = cust.pincode;
            customer.isconfiguredcode = 'Y';

            customer.save();

            response.flag = true;
            response.message = 'Pin code changed successfully';
            response.payload = {
                firstname: customer.firstname,
                lastname: customer.lastname,
                gender: customer.gender,
                username: customer.username,
                email: customer.email,
                customerNo: customer.customerNo,
                phoneno: verification.phoneno,
                isconfiguredbvn: customer.isconfiguredbvn,
                canchangepin: customer.canchangepin,
                wallet: {
                    balance: wallet.amount
                },
                vendor: vendor,
                card: {
                    cardno: card.cardno,
                    activationdate: card.activationdate,
                    created: card.created,
                    status: card.status,

                }
            };
    
                resolve(response);

            });
 
    }


    static async verifypin(cust) {

        var response = {
            flag: false,
            message: 'Pin verification failed',
            payload: {}
        };

        var cardstatus = 'Pending';
        var cardcreated = "Na";
        var cardactivationdate = "NA";
        var cardno = "NA";

        console.log(cust);

        return new Promise(async(resolve, reject) => {


            var customer = await Customer.findOne({phoneno: cust.phoneno,transcode: cust.pincode}).populate('vendor');

            

            if(customer != null)
            {

                customer.pushToken = cust.token;

                await customer.save();

                var wallet = await Wallet.findOne({customer: customer._id});

                var vendor = await Vendor.findOne({customer: customer._id});
                var card = await Card.findOne({customer: customer._id});

                response.flag = true;
                response.message = 'Pin code verified successfully';
                response.payload = {
                    firstname: customer.firstname,
                    lastname: customer.lastname,
                    gender: customer.gender,
                    phoneno: customer.phoneno,
                    customerNo: customer.customerNo,
                    email: customer.email,
                    username: customer.username,
                    isconfiguredbvn: customer.isconfiguredbvn,
                    wallet: {
                        balance: wallet.amount
                    },
                    vendor: vendor,
                    card: {
                        cardno: cardno,
                        status: cardstatus,
                        created: cardcreated,
                        activationdate: cardactivationdate
                    }
                };

                resolve(response);
            }
            else
                reject(response);
           
    
                

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
                return;
            }    

            verification.status = 'Used';
            
            var v = await verification.save();

            var c = await Customer.findOne({phoneno: cust.phoneno});

            var isnewuser = true;
            var isconfiguredcode = 'N';
            var cst = {};

            if(c != null)
            {
                var wallet = await Wallet.findOne({customer: c._id});

                c.pushToken = cust.token;

                await c.save();

                isnewuser = false;
                isconfiguredcode = c.isconfiguredcode;
                cst = {
                    username: c.username,
                    customerNo: c.customerNo,
                    phoneno: c.phoneno,
                    isconfiguredcode : c.isconfiguredcode,
                    isconfiguredbvn : c.isconfiguredbvn,
                    email: c.email,
                    code: cust.code,
                    wallet: {
                        balance: wallet.amount
                    }
                };
            }

            response.flag = true;
            response.message = 'Phone Number verified successfully';
            response.isnewuser = isnewuser;
            response.payload = cst;
    
            resolve(response);
        });
 
    }

    static async login(cust) {

        var response = {
            flag: false,
            message: 'Error Verification',
            isnewuser: false,
            payload: {}
        };

        return new Promise(async(resolve, reject) => {
        
            var customer = await Customer.findOne({phoneno: cust.phoneno, password: cust.password});

            if(customer == null)
            {
                response.flag = false;
                response.message = 'Invalid user';

                reject(response);
                return;
            }    

            

            var isnewuser = true;
            var isconfiguredcode = 'N';
            var cst = {};

            if(customer != null)
            {
                var wallet = await Wallet.findOne({customer: customer._id});

                
                isconfiguredcode = customer.isconfiguredcode;
                cst = {
                    username: customer.username,
                    customerNo: customer.customerNo,
                    phoneno: customer.phoneno,
                    isconfiguredcode : customer.isconfiguredcode,
                    isconfiguredbvn : customer.isconfiguredbvn,
                    email: customer.email,
                   wallet: {
                        balance: wallet.amount
                    }
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
                customerNo: customerno,
                countrycode: cust.countrycode
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
            response.payload = {
                username: cust.username,
                email: cust.email,
                customerNo: customerno,
                phoneno: cust.phoneno
            };

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

    static signup(cust) {

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


        // var ver = await Verification.findOne({phoneno: cust.phoneno, code: cust.code, consumed: 'N'});

        // if(ver == null)
        // {
        //     response.flag = false;
        //     response.message = 'Phone number not verified!';

        //     reject(response);

        //     return;
        // }


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

            // ver.consumed = 'Y';

            // await ver.save();


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
                customerNo: customerno,
                countrycode: cust.countrycode,
                password: cust.password
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
            response.payload = {
                username: cust.username,
                email: cust.email,
                customerNo: customerno,
                phoneno: cust.phoneno
            };

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


    static update(cust) {

       

        var response = {
            flag: false,
            message: 'Error updating profile',
            payload: null
        };

        

      return new Promise(async(resolve, reject) => {
        


        var customer = await Customer.findOne({phoneno: cust.phoneno});

        if(customer == null)
        {
            response.flag = false;
            response.message = 'Customer not found';

            reject(response);
        }


        customer.firstname = cust.firstname;
        customer.lastname = cust.lastname;
        customer.gender = cust.gender;
        customer.email = cust.email;

        await customer.save();

        var wallet = await Wallet.findOne({customer: customer._id});

        var vendor = await Vendor.findOne({customer: customer._id});
        var card = await Card.findOne({customer: customer._id});

        response.flag = true;
        response.message = 'Customer details updated successfully';
        response.payload = {
            firstname: customer.firstname,
            lastname: customer.lastname,
            gender: customer.gender,
            username: customer.username,
            email: customer.email,
            customerNo: customer.customerNo,
            phoneno: customer.phoneno,
            isconfiguredbvn: customer.isconfiguredbvn,
            canchangepin: customer.canchangepin,
            wallet: {
                balance: wallet.amount
            },
            vendor: vendor,
            card: {
                cardno: card.cardno,
                activationdate: card.activationdate,
                created: card.created,
                status: card.status,

            }
        };
        
        resolve(response);
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
                    description: description,
                    refno: refno
                });
    
            

            var o = await order.save();

            

            response.flag = true;
            response.message = 'Order with reference no ' + refno + ' created successfully';
            response.payload = {
                refno: refno,
                balance: wallet.amount
            };
    
            resolve(response);
        });
 
    }

    static verifytransaction(cust) {

        var response = {
            flag: false,
            message: 'Error verifying transaction',
            payload: null
        };

        const self = this;

        

      return new Promise(async(resolve, reject) => {
        


        var SECRET_KEY = 'sk_test_57f4d416f35162f07d67679b57d8536031e7fe08';

        

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

            var balance = Number(wallet.amount)

            balance += Number(amount);

            wallet.amount = balance;

            await wallet.save();

            const transaction = new Transaction({
                wallet: wallet._id,
                amount: amount,
                narration: "Wallet funding - " + refno,
                txRef: refno,
                section: "User",
                tag: "DM",
                status: "Active"
                
            });

            await transaction.save();
            
            response.flag = true;
            response.message = "Transaction completed successfully";
            response.payload = {
                reference: refno,
                phoneno: phoneno,
                amount: amount,
                balance: balance
            };

            return response;

    }


    static async transfermoney(cust) {

        
        var isNewAccount = false;

        var response = {
            flag: false,
            message: 'Error performing transaction',
            payload: null
        };

        

        var refno = this.getRandomInt(10000000001,11111111111);

        var isOTPValidated = 'N';

        
      return new Promise(async(resolve, reject) => {


        if(cust.validateOTP == 'Y')
            {
                var customer = await Customer.findOne({phoneno: cust.fromId, transcode: cust.otp, isconfiguredcode: "Y"});

                if(customer == null)
                {
                    response.flag = false;
                    response.message = 'OTP Validation failed';

                    reject(response);

                    return;
                }    

                isOTPValidated = "Y";
            }
    
        var c = await Customer.findOne({phoneno: cust.fromId});

        if(c == null)
        {
            response.message = "Invalid sender id";

            reject(response);
        }

           
        var c2 = await Customer.findOne({phoneno: cust.toId});

        if(c2 == null)
        {
            response.message = "Invalid receipient id";

            reject(response);
        }
            
            var wallet = await Wallet.findOne({customer: c._id});

            if(wallet.amount < cust.amount)
            {
                response.message = "Low balance to complete operation";
    
                reject(response);
            }

            wallet.amount -= cust.amount;

            await wallet.save();


            var wallet2 = await Wallet.findOne({customer: c2._id});

            wallet2.amount += cust.amount;

            await wallet2.save();

            const transaction = new Transaction({
                wallet: wallet._id,
                amount: cust.amount,
                narration: "Fund Transfer - " + refno,
                txRef: refno,
                section: "User",
                tag: "TU",
                isOTPValidated: isOTPValidated,
                refno: refno,
                status: "Active"
            });

            await transaction.save();

            const transaction2 = new Transaction({
                wallet: wallet2._id,
                amount: cust.amount,
                narration: "Fund Received from " + c.username + " - " + refno,
                txRef: refno,
                section: "User",
                tag: "RU",
                status: "Active"
            });

            await transaction2.save();


            const transfer = new Transfer({
                fromId: c._id,
                toId: c2._id,
                amount: cust.amount,
                description: "Transfer to User - " + c2.username,
                fromTag: "User",
                toTag: "User",
                status: "Approved"
            });

            await transfer.save();
            
            response.flag = true;
            response.message = "Transaction completed successfully";
            response.payload = {
                refno: refno,
                fromId: cust.fromId,
                toId: cust.toId,
                amount: cust.amount,
                balance: wallet.amount,
                description: "Transfer to User - " + c2.username
            };

            resolve(response);

        });

    }


    static async applyfuelcard(cust) {

        
        var isNewAccount = false;

        var response = {
            flag: false,
            message: 'Error performing transaction',
            payload: null
        };

        

        var refno = this.getRandomInt(10000000001,11111111111);

        var isOTPValidated = 'Y';
        var amount = 0;

        
      return new Promise(async(resolve, reject) => {


    
        var c = await Customer.findOne({phoneno: cust.phoneno});

        if(c == null)
        {
            response.message = "Invalid Customer";

            reject(response);
        }

        var card = await Card.find({customer: c._id});

        if(card != null)
        {
            amount = 1000;

            var wallet = await Wallet.findOne({customer: c._id});

            if(wallet.amount < amount)
            {
                response.message = "Low balance to complete operation";
    
                reject(response);
            }

            wallet.amount -= amount;

            await wallet.save();

            const transaction = new Transaction({
                wallet: wallet._id,
                amount: amount,
                narration: "Apply Fuel Card - " + refno,
                txRef: refno,
                section: "User",
                tag: "FC",
                isOTPValidated: isOTPValidated,
                refno: refno,
                status: "Active"
            });

            await transaction.save();
        }
           
        
            
            


            const application = new Application({
                customer: c._id,
                name: cust.name,
                address: cust.address,
                city: cust.city,
                state: cust.state
            });

            var app = await application.save();

            card = new Card({
                customer: c._id,
                application: app._id
            });

            await card.save();
            
            response.flag = true;
            response.message = "Application submitted successfully";
            response.payload = cust;

            resolve(response);

        });

    }

    static async getUser(phoneno) {

        var response = {
            flag: false,
            message: 'User not found',
            payload: null
        };


        var c =  await Customer.findOne({phoneno: phoneno}).select('username phoneno customerNo');

        if( c != null)
        {
            response.message = 'User found';
            response.flag = true;
            response.payload = c;
        }
        

        return response;
      
    }


    static async logToken(cust) {

       


        var c =  await Customer.findOne({phoneno: phoneno});

        c.pushToken = cust.token;

        await c.save();
        

       
      
    }




    // static async listOrder(customerId) {

        
    //     return await Order.findOne({customer: customerId});

        
      
    // }


    static async listTransaction(customerId) {

        var customer = await Customer.findOne({customerNo: customerId});

        var wallet = await Wallet.findOne({customer: customer._id});

        return await Transaction.find({wallet: wallet._id}).select('amount source txRef narration section tag status created _id');

    
      
    }

    static async listLoan(customerId) {

        var customer = await Customer.findOne({customerNo: customerId});

        return await Loan.find({customer: customer._id}).populate('loanoffer');

    
      
    }

    static diff_minutes(dt2, dt1) 
    {
   
     var diff =(dt2.getTime() - dt1.getTime()) / 1000;
     diff /= 60;
     return (diff / 60);
     
    }

    static async checkLoanEligibility(cust)
    {
        var response = {
            flag: false,
            message: 'You are not eligible for the loan',
            payload: []
        };

        var offers = [];

        var amount = 1500;

        //console.log(cust);


        return new Promise(async(resolve, reject) => {
            
            var loanoffers = await LoanOffer.find({status: 'Approved'});
            var customer = await Customer.findOne({phoneno: cust.phoneno});
            var orders = await Order.find({customer: customer._id});


            if(orders.length >= 1)
            {
                for(var i = 0; i < loanoffers.length; i++)
                {
                    offers.push({
                        _id: loanoffers[i]._id,
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


    static async applyloan(cust)
    {
        var response = {
            flag: false,
            message: 'Error applying loan',
            payload: []
        };


        return new Promise(async(resolve, reject) => {
            
            var c = await Customer.findOne({phoneno: cust.phoneno});

            var today = new Date();
            var repayment = new Date();
            repayment.setDate(today.getDate() + cust.tenor);

            var refno = this.getRandomInt(10000000001,11111111111);

            const loan = new Loan({
                customer: c._id,
                refno: refno,
                loanoffer: cust.loanoffer,
                repaymentdate: repayment,
                amount: Number(cust.amount + ((cust.interest / 100) *  cust.amount))
            });

            var l = await loan.save();

            var wallet = await Wallet.findOne({customer: c._id});

            wallet.amount += cust.amount;

            var w = await wallet.save();

            var isOTPValidated = 'Y';

            const transaction = new Transaction({
                wallet: wallet._id,
                amount: cust.amount,
                narration: "Loan Approved - " + refno,
                txRef: refno,
                section: "User",
                tag: "AL",
                isOTPValidated: isOTPValidated,
                refno: refno,
                status: "Active"
            });

            await transaction.save();

            response.flag = true;
                response.message = 'Loan application performed successfully';
                response.payload = {
                    refno: refno,
                    amount: l.amount,
                    balance: w.amount
                };

                resolve(response);
            

        });

    }


    static async repayloan(cust)
    {
        var response = {
            flag: false,
            message: 'Error repaying loan',
            payload: []
        };


        return new Promise(async(resolve, reject) => {
            
            var loan = await Loan.findOne({refno: cust.refno});

           if(loan == null)
           {
               response.message = "Loan details not found!";

               reject(response);
           }

            var wallet = await Wallet.findOne({customer: loan.customer});

            if(loan.amount > wallet.amount)
           {
               response.message = "Low balance to repay loan. Please fund wallet and retry!";

               reject(response);
           }

           var refno = this.getRandomInt(10000000001,11111111111);

           loan.status = 'Closed';

           await loan.save();
           
            wallet.amount -= loan.amount;

            var w = await wallet.save();

            var isOTPValidated = 'Y';

            const transaction = new Transaction({
                wallet: wallet._id,
                amount: loan.amount,
                narration: "Loan Repayment - " + refno,
                txRef: refno,
                section: "User",
                tag: "RL",
                isOTPValidated: isOTPValidated,
                refno: loan.refno,
                status: "Active"
            });

            await transaction.save();

            response.flag = true;
                response.message = 'Loan repayment performed successfully';
                response.payload = {
                    refno: refno,
                    amount: l.amount,
                    balance: w.amount
                };

                resolve(response);
            

        });

    }

    // static async listTransaction(customerNo) {

    //     var customer = await Customer.findOne({customerNo: customerNo});

    //     var wallet = await Wallet.findOne({customer: customer._id});
              
    //     return await Transaction.find({wallet: wallet._id});
      
        
      
    //   }


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