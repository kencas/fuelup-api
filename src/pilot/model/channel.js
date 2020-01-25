var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var ChannelSchema = new Schema(
    {
        transactions: [{type : Schema.Types.ObjectId, ref: 'Transaction'}],
        codes: [{type : Schema.Types.ObjectId, ref: 'Code'}],
        accno : {type: String, required: true, default: "USSD"},
        acctype : {type: String, required: true, default: "Asset"},
        name : {type: String, required: true, default: "USSD"},
        code : {type: String, required: true, default: "101"},
        availableBal : {type: Number, required: true, default: 0.00},
        status: {type: String, required: true, default: "Approved"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Channel',ChannelSchema);