const dbConnection = require("../config/dbConnection");
const queries = require("../queries/ledger");

module.exports = class LedgerDAO{ 
    
    constructor() {
      
    }

    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }


    static create(cust) {

        var response = {
            flag: false,
            message: 'Error creating bank',
            payload: null
        };
      
        
      
      return new Promise(async(resolve, reject) => {
      
        let con = await dbConnection();

        var accno = 0;

        let lastRecord = await con.query(queries.load_code, [cust.code]);

        lastRecord = JSON.parse(JSON.stringify(lastRecord));

        console.log(lastRecord);
    
        if(lastRecord == null)
            accno = 1;
        else
            accno = parseInt(lastRecord[0].accno.substr(3)) + 1;

        accno = this.zeroPad(accno,3);

        accno = cust.code + accno;



    try {
      await con.query("START TRANSACTION");
      let savedTodo = await con.query(
        queries.create,
        [accno, cust.accname, cust.code, cust.section]
      );
      await con.query("COMMIT");
      response.flag = true;
      response.message = 'New Ledger Created successfully';
      response.payload = savedTodo;

      resolve(response);

    } catch (ex) {
      await con.query("ROLLBACK");
      reject(response);
    } finally {
      await con.release();
      await con.destroy();
    }
      
      
      
        
      });
      }
      

    static async list() {

      let con = await dbConnection();

      try {
        await con.query("START TRANSACTION");
        let todo = await con.query(queries.load_all);
        await con.query("COMMIT");
        todo = JSON.parse(JSON.stringify(todo));
        return todo;
      } catch (ex) {
        console.log(ex);
        throw ex;
      } finally {
        await con.release();
        await con.destroy();
      }
      
    }

    
    static async get(id) {

     
      return await AccType.findById(id);
      
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