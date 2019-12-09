var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var AirtimeSchema = new Schema(
    {
        biller: {type : String, required: true, default: 'NA'},
        billerName: {type : String, required: true, default: 'NA'},
        phoneno: {type : String, required: true, default: 'NA'},
        amount: {type : Number, required: true, default: 0.00},
        created : {type: Date, default: Date.now}
    }
);



module.exports = mongoose.model('Airtime',AirtimeSchema);