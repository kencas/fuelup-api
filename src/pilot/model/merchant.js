var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var MerchantSchema = new Schema(
    {
        agents: [{type : Schema.Types.ObjectId, ref: 'Agent'}],
        name : {type: String, required: true, default: "USSD"},
        address : {type: String, required: true, default: "NA"},
        location : {type: String, required: true, default: "NA"},
        email : {type: String, required: true, default: "0000"},
        phoneno : {type: String, required: true, default: "NA"},
        status: {type: String, required: true, default: "Approved"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Merchant',MerchantSchema);