const LoanOffer = require('../model/loanoffer');

module.exports = class LoanOfferService{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }

      static async list() {

      
       
        return await LoanOffer.find();

      
    }

    
    static async get(id) {

     
      var loanoffer = await LoanOffer.findById(id);
      
      
      return loanoffer;
}


static create(cust) {

  var response = {
      flag: false,
      message: 'Error creating Loan offer',
      payload: null
  };

  

return new Promise(async(resolve, reject) => {

  var accno = 0;

  


  const loanoffer = new LoanOffer({
    name: cust.name,
    interest: cust.interest,
    tenor: cust.tenor,
    minApprovalAmt: cust.minApprovalAmt
});



  loanoffer
.save()
.then(async(result) => {
  console.log(result);
  response.flag = true;
  response.message = 'Loan offer created successfully';
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