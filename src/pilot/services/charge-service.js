const Charge = require('../model/charge');
const Ledger = require('../model/ledger');

module.exports = class ChargeService{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }

      static async list() {

      
       
        return await Charge.find();

      
    }

    
    static async get(id) {

     
      var charge = await Charge.findById(id);
      
      
      return charge;
}


static create(cust) {

  var response = {
      flag: false,
      message: 'Error creating charge',
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


  const charge = new Charge({
    name: cust.name,
    section: cust.section,
    acctype: cust.acctype,
    accno: accno,
    code: cust.code
});



  charge
.save()
.then(async(result) => {
  console.log(result);
  response.flag = true;
  response.message = 'Charge created successfully';
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