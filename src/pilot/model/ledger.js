var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var LedgerSchema = new Schema(
    {
        acctypes: [{type : Schema.Types.ObjectId, ref: 'AccType'}],
        accno: {type : String, required: true, default: 'NA'},
        code: {type : String, required: true, default: 'NA'},
        accname: {type : String, required: true, default: 'NA'},
        availableBal: {type : Number, required: true, default: 0.00},
        section: {type : String, required: true, default: 'NA'},
        created : {type: Date, default: Date.now}
    }
);





module.exports = mongoose.model('Ledger',LedgerSchema);