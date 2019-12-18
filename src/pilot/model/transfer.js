var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var TransferSchema = new Schema(
    {
        fromId: {type : Schema.Types.ObjectId, ref: 'Customer'},
        toId: {type : Schema.Types.ObjectId, ref: 'Customer'},
        description: {type: String, required: true, default: "USSD"},
        amount: {type: Number, required: true, default: 0},
        fromTag: {type: String, required: true, default: "NA"},
        toTag: {type: String, required: true, default: "NA"},
        status: {type: String, required: true, default: "Approved"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Transfer',TransferSchema);