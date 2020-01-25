const Channel = require('../model/channel');
const Ledger = require('../model/ledger');

module.exports = class ChannelService{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }

      static async list() {

      
       
        return await Channel.find();

      
    }

    
    static async get(id) {

     
      var channel = await Channel.findById(id);
      
      
      return channel;
}


static create(cust) {

  var response = {
      flag: false,
      message: 'Error creating channel',
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


  const channel = new Channel({
    name: cust.name,
    acctype: cust.acctype,
    accno: accno,
    code: cust.code
});



  channel
.save()
.then(async(result) => {
  console.log(result);
  response.flag = true;
  response.message = 'Channel created successfully';
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