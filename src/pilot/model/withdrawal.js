var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var WithdrawalSchema = new Schema(
    {
        customer: {type : Schema.Types.ObjectId, ref: 'Customer'},
        transaction: {type : Schema.Types.ObjectId, ref: 'Transaction'},
        account: {type : Schema.Types.ObjectId, ref: 'Account'},
        code : {type: String, required: true, default: "NA"},
        amount : {type: Number, required: true, default: 0.00},
        channel : {type: String, required: true, default: "NA"},
        narration : {type: String, required: true, default: "USSD"},
        status: {type: String, required: true, default: "Pending"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Withdrawal',WithdrawalSchema);