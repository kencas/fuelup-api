const express = require('express');
const router = express.Router();

const Customer = require('../model/customer');

const customerService = require('../services/customer-service');


router.post('/', async(req, res, next) => {

  var message = '';

  var sessionId = req.body.sessionId;
  var serviceCode = req.body.serviceCode;
  var phoneNumber = req.body.phoneNumber;
  var text = req.body.text;

  console.log(req.body);
// if(typeof text === 'undefined')
// {
//   text = '';

// }

var length = text.split('*').length;
  var txt = text.split('*');
  
  // look up - is customer? or Agent - offer 2 parts, agent -?
  if (text === '') {
      message = 'CON Welcome to MSP Finance Ltd \n';
      message += '\n';
      message += '1: Create Account \n';
      message += '2: Check Balance\n';
      message += '3: Deposit\n';
      message += '4: Withdrawal\n';
      message += '5: Change Code\n';
      message += '0: Exit';
  }

  // add device
  else if (text === '1') {
    // check if user is agent
      message = 'CON Enter Firstname';
  }
  else if (length === 2 && txt[0] === '1') {
    message = 'CON Enter Surname';
  }
  else if (length === 3 && txt[0] === '1') {
    message = 'CON Othername\n';
  //   message += 'eg. Nokia 3310';
  }
  else if (length === 4 && txt[0] === '1') {
    message = 'CON Select Account Type\n';
    message += '1) Daily Savings Scheme(DSS)\n';
    message += '2) Target Savings(TS)';
  }
  else if (length === 5 && txt[0] === '1') {

      var options = text.split('*');

      if(options[4] > 2 || options[4] < 0)
      {
          message = 'END Invalid Option';

       //Create Account

       
      }
      else
      {
          message = 'CON Proceed to Open Account?\n';
          message += '1). Yes \n 2). No';
      }
    
  }
  // else if (length === 6 && txt[0] === '1') {
  //   message = 'CON Enter Month of Birth\n';
  //   message += '1). Yes / 2). No';
  // }
  else if (length === 6 && txt[0] === '1') {

      var options = text.split('*');
    // commit to db

    if(options[5] == 1)
    {
      //message = 'END Device registered';

       //Create Account

       var data = {
           firstname: options[1], 
           surname: options[2], 
           othername: options[3], 
           acctype: options[4], 
           phoneno: phoneNumber
          };

          var result = await customerService.createUSSDAccount(data);

          message = 'END ' + result.message;
  // .then(result => {
  //     console.log(result),
  //     message = 'END ' + result.message;
  // })
  // .catch(err => {
          
  //      console.log(err),
  //      message = 'END ' + err.message;
  // });

      //  await customerService.createAccount(data);
    }
    else if(options[5]==2)
    {
      message = 'END Transaction Cancelled';
      
    }
    else
    {
      message = 'END Invalid';
    }
    

  //   db.Device.create({
  //     imei: options[1],
  //     color: options[2],
  //     model: options[3],
  //     warrant_status: options[4],
  //     insurance_status: options[5],
  //     in_stock: options[6]
  //   }).then(function(device) {
  //     console.log('device added', device);
  //   });
  console.log(options);

  }

  // Check Balance
  else if (text === '2') {
    // check is user is agent
    message = 'CON Select Account Type\n';
    message += '1) Daily Savings Scheme(DSS)\n';
    message += '2) Target Savings(TS)';
  }
  
  // else if (length === 2 && txt[0] === '2') {
  //   message = 'CON Enter sales agent email';
  // }
  // else if (length === 3 && txt[0] === '2') {
  //   message = 'CON Enter Agent sales code';
  // }
  else if (length === 2 && txt[0] === '2') 
  {
    message = 'CON Enter 4-Digit Transaction Code\n';
  }
  else if (length === 3 && txt[0] === '2') {
    
      
    var options = text.split('*');

    console.log(options);

    var data = {
      acctype: options[1], 
      transCode: options[2], 
      phoneno: phoneNumber
     };

    var result = await customerService.checkBalance(data);

    if(result.flag)
    message = 'END Acc Balance: ' +  result.payload.currency + ' ' + result.payload.availableBal;
    else
    message = 'END ' + result.message;

  //   db.Agent.create({
  //     name: options[1],
  //     primary_email: options[2],
  //     agent_sales_code: options[3],
  //     location: options[4],
  //     phone_number: phoneNumber
  //   }).then(function(agent) {
  //     console.log('agent person added', agent);
  //   });
  }


  else if (text === '3') {
    message = 'CON Select Account Type\n';
    message += '1) Daily Savings Scheme(DSS)\n';
    message += '2) Target Savings(TS)';
  }
  else if (length === 2 && txt[0] === '3') {
    message = 'CON 12-Digit Deposit Code';
  }
  else if (length === 3 && txt[0] === '3') {
    // check device authenticity
    var options = text.split('*');

    var data = {
      acctype: options[1], 
      code: options[2], 
      transType: 'CR',
      phoneno: phoneNumber,
      section: "OP",
      status: "Approved"
     };

    var result = await customerService.deposit(data);

    message = 'END ' + result.message;

    //message = 'END You do not have a genuine device';
  }


  else if (text === '4') {
    // check is user is agent
    message = 'CON Select Account Type\n';
    message += '1) Withdrawal to bank\n';
    message += '2) Withdraw Cash';
  }
  else if (length === 2 && txt[0] === '4') {
      message = 'CON Enter Phone IMEI number';
  }
  else if (length === 3 && txt[0] === '4') {
      message = 'CON Enter Buyer ID number';
  }
  else if (length === 4 && txt[0] === '4') {
      message = 'CON Enter Buyer Name';
  }
  else if (length === 5 && txt[0] === '4') {
      message = 'CON Enter Buyer Phone number';
  }
  else if (length === 6 && txt[0] === '4') {
    message = 'END Device sold';
    var options = text.split('*');

    db.Sale.create({
      sales_code: options[1],
      imei: options[2],
      buyer_id: options[3],
      buyer_name: options[4],
      buyer_phone_number: options[5]
    }).then(function(sales) {
      console.log('sales added', sales);
    });

    db.Device.findOne({
      where: { imei: options[1] }
    }).then(function(device) {
      device.update({
        sold: 'true'
      }).then(function(device) {
        console.log('device marked as sold', device);
      });
    });
  }

  else {
    message = 'END Wrong input';
    // reply with menu
  }

  res.contentType('text/plain');
  res.status(200).send(message)

});



router.get('/', async(req, res, next) => {


    var message = '';

    var sessionId = req.query.sessionId;
    var serviceCode = req.query.serviceCode;
    var phoneNumber = req.query.phoneNumber;
    var text = req.query.text;

    var banks = [
      'Access Bank',
      'Citi Bank',
      'Ecobank',
      'FCMB',
      'Fidelity Bank',
      'First Bank',
      'GTB',
      'Heritage Bank',
      'Keystone',
      'Polaris Bank',
      'Standard Chartered',
      'Sterling Bank',
      'Stanbic IBTC',
      'SunTrust Bank',
      'UBA',
      'Union Bank',
      'Unity Bank',
      'Wema Bank',
      'Zenith Bank'
    ];
  
   // console.log(req.body);
  
    var length = text.split('*').length;
    var txt = text.split('*');
  
    // look up - is customer? or Agent - offer 2 parts, agent -?
    if (text === '') {

      //page 1
        message = 'CON Welcome to MSP Finance Ltd \n';
        message += '\n';
        message += 'Select Bank\n';
        message += '1: Access Bank \n';
        message += '2: Citi Bank\n';
        message += '3: Ecobank\n';
        message += '4: Fidelity Bank\n';
        message += '5: FCMB\n';
        message += '00: Next Page\n';
        message += '0: Exit';
    }
  
    // add device
    else if (length === 1) 
    {
      // Page 2
      if(text === '00')
      {
        message = 'CON Select Bank\n';
        message += '6: First Bank \n';
        message += '7: GTB\n';
        message += '8: Heritage Bank\n';
        message += '9: Keystone\n';
        message += '10: Polaris Bank\n';
        message += '00: Next Page\n';
        message += '0: Exit';
        
      }
      else if(Number(text) >= 1 && Number(text) <= 5)
      {
        message = 'CON Enter Account No';
      }
    }
    else if (length === 2) 
    {
      // Page 3
      if(txt[1] == '00')
      {
        message = 'CON Select Bank\n';
        message += '11: Standard Chartered \n';
        message += '12: Sterling Bank\n';
        message += '13: Stanbic IBTC\n';
        message += '14: SunTrust Bank\n';
        message += '15: UBA\n';
        message += '00: Next Page\n';
        message += '0: Exit';

      }
      else if(txt[0] === '00' && Number(txt[1]) >= 6 && Number(txt[1]) <= 10)
      {
        message = 'CON Enter Account No';
      }
      else
      {
        message = 'CON Enter Amount';
      }
    }
    else if (length === 3) {
      // Page 4
      if(txt[2] == '00')
      {
        message = 'CON Select Bank\n';
        message += '16: Union Bank \n';
        message += '17: Unity Bank\n';
        message += '18: Wema Bank\n';
        message += '19: Zenith Bank\n';
        message += '20: Zenith Bank\n';
        message += '00: Next Page\n';
        message += '0: Exit';
        
      }
      else if(txt[0] === '00' && txt[1] === '00' && Number(txt[2]) >= 11 && Number(txt[2]) <= 15)
      {
        message = 'CON Enter Account No';
      }
      else if(txt[0] === '00' && Number(txt[1]) >= 6 && Number(txt[1]) <= 10)
      {
        message = 'CON Enter Amount';
      }
      else
      {
        message = 'CON Do you wish to Transfer?\n';
        message += '\n';
        message += 'Account No: ' + txt[1] + ' \n';
        message += 'Bank: ' + banks[Number(txt[0]) - 1]  + ' \n';
        message += 'Amount: ' + txt[2] + ' \n';
        message += '1). Yes \n 2). No';
      }
    }
    else if (length === 4) 
    {
      // Page 5
      if(txt[3] == '1')
      {
        

        var data = {
          bank: banks[txt[0]],
          accno: txt[1],
          amount: txt[2]
        }

        console.log(data);

        message = 'END Transfer Performed Successfully?\n';
      }
      else if(txt[0] === '00' && txt[1] === '00' && txt[2] === '00' && Number(txt[3]) >= 16 && Number(txt[3]) <= 20)
      {
        message = 'CON Enter Account No';
      }
      else if(txt[0] === '00' && txt[1] === '00' && Number(txt[2]) >= 11 && Number(txt[2]) <= 15)
      {
        message = 'CON Enter Amount';
      }
      else if(txt[0] === '00' && Number(txt[1]) >= 6 && Number(txt[1]) <= 10)
      {
        message = 'CON Do you wish to Transfer?\n';
        message += '\n';
        message += 'Account No: ' + txt[2] + ' \n';
        message += 'Bank: ' + banks[Number(txt[1]) - 1]  + ' \n';
        message += 'Amount: ' + txt[3] + ' \n';
        message += '1). Yes \n 2). No';
      }
      
    }
    else if (length === 5) 
    {
      // Page 3
      if(txt[0] === '00' && txt[1] === '00' && txt[2] === '00' && Number(txt[3]) >= 16 && Number(txt[3]) <= 20)
      {
        message = 'CON Enter Amount';
      }
      else if(txt[0] === '00' && txt[1] === '00' && Number(txt[2]) >= 11 && Number(txt[2]) <= 15)
      {
        message = 'CON Do you wish to Transfer?\n';
        message += '\n';
        message += 'Account No: ' + txt[3] + ' \n';
        message += 'Bank: ' + banks[Number(txt[2]) - 1]  + ' \n';
        message += 'Amount: ' + txt[4] + ' \n';
        message += '1). Yes \n 2). No';
      }
      else if(txt[4] == '1')
      {
        var data = {
          bank: txt[1],
          accno: txt[2],
          accno: txt[3]
        }

        console.log(data);
        message = 'END Transfer Performed Successfully?\n';
      }
      
    }
    else if (length === 6) 
    {
      // Page 3
      if(txt[0] === '00' && txt[1] === '00' && txt[2] === '00' && Number(txt[3]) >= 16 && Number(txt[3]) <= 20)
      {
        message = 'CON Do you wish to Transfer?\n';
        message += '\n';
        message += 'Account No: ' + txt[4] + ' \n';
        message += 'Bank: ' + banks[Number(txt[3]) - 1]  + ' \n';
        message += 'Amount: ' + txt[5] + ' \n';
        message += '1). Yes \n 2). No';
      }
      else if(txt[5] == '1')
      {
        var data = {
          bank: txt[2],
          accno: txt[3],
          accno: txt[4]
        }

        console.log(data);
        message = 'END Transfer Performed Successfully?\n';
      }
      
    }
    else if (length === 7) 
    {
      // Page 3
      // if(txt[0] === '00' && txt[1] === '00' && txt[2] === '00' && Number(txt[3]) >= 16 && Number(txt[3]) <= 20)
      // {
      //   message = 'CON Do you wish to Transfer?\n';
      //   message += '1). Yes \n 2). No';
      // }
      if(txt[6] == '1')
      {
        var data = {
          bank: txt[3],
          accno: txt[4],
          accno: txt[5]
        }

        console.log(data);
        message = 'END Transfer Performed Successfully?\n';
      }
      
    }
   
   
  
  
    
  
    res.contentType('text/plain');
    res.status(200).send(message)
});

module.exports = router;