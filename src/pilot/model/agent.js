var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var AgentSchema = new Schema(
    {
        codes: [{type : Schema.Types.ObjectId, ref: 'Code'}],
        ledger: {type : Schema.Types.ObjectId, ref: 'Ledger'},
        refno : {type: String, required: true, default: "NA"},
        accno : {type: String, required: true, default: "USSD"},
        acctype : {type: String, required: true, default: "Asset"},
        name : {type: String, required: true, default: "USSD"},
        code : {type: String, required: true, default: "205"},
        passcode : {type: String, required: true, default: "0000"},
        availableBal : {type: Number, required: true, default: 0.00},
        unitprice : {type: Number, required: true, default: 145.00},
        status: {type: String, required: true, default: "Approved"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Agent',AgentSchema);