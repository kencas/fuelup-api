var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var FundSchema = new Schema(
    {
        reference: {type : String, required: true, default: 'NA'},
        amount: {type : String, required: true, default: 'NA'},
        status: {type : String, required: true, default: 'NA'},
        created : {type: Date, default: Date.now}
    }
);



module.exports = mongoose.model('Fund',FundSchema);