const Merchant = require('../model/merchant');

module.exports = class MerchantService{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }

      static async list() {

      
       
        return await Merchant.find();

      
    }

    
    static async get(id) {

     
      var merchant = await Merchant.findById(id);
      
      
      return merchant;
}


static create(cust) {

  var response = {
      flag: false,
      message: 'Error creating Merchant',
      payload: null
  };

  

return new Promise(async(resolve, reject) => {

  var accno = 0;

  


  const merchant = new Merchant({
    name: cust.name,
    address: cust.address,
    location: cust.location,
    email: cust.email,
    phoneno: cust.phoneno
});



  merchant
.save()
.then(async(result) => {
  console.log(result);
  response.flag = true;
  response.message = 'Merchant created successfully';
  response.payload = result;

  
  resolve(response);
})
.catch(err => {
  console.log(err)
  reject(error);
});
});
}




  
  }