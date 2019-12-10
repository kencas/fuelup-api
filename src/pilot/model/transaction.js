var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var TransactionSchema = new Schema(
    {
        agent: {type : Schema.Types.ObjectId, ref: 'Agent'},
        customer: {type : Schema.Types.ObjectId, ref: 'Customer'},
        amount : {type: Number, required: true, default: 0.00},
        source : {type: String, required: true, default: "USSD"},
        txRef : {type: String, required: true, default: "000"},
        narration : {type: String, required: true, default: "USSD"},
        section: {type: String, required: true, default: "User"},
        tag: {type: String, required: true, default: "DM"},
        status: {type: String, required: true, default: "Pending"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Transaction',TransactionSchema);