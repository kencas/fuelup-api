const Card = require('../model/card');

module.exports = class CardService{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }

      static async list() {

      
       
        return await Card.find().populate('customer');;

      
    }

    
    static async get(id) {

     
      var card = await Card.findById(id);
      
      
      return card;
}


static create(cust) {

  var response = {
      flag: false,
      message: 'Error creating Card',
      payload: null
  };

  

return new Promise(async(resolve, reject) => {

  var accno = 0;

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

card
.save()
.then(async(result) => {
console.log(result);
response.flag = true;
response.message = 'Card application successful';
response.payload = result;


resolve(response);
})
.catch(err => {
console.log(err)
reject(error);
});
        }

        else{
          reject(response);
        }
           
        
            
            


            

});
}




  
  }