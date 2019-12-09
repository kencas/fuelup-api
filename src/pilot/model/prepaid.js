var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var PrepaidSchema = new Schema(
    {
        accmain : {type: String, required: true, default: "NA"},
        acccontra : {type: String, required: true, default: "NA"},
        accsettlement : {type: String, required: true, default: "NA"},
        acctypemain : {type: String, required: true, default: "Asset"},
        acctypecontra : {type: String, required: true, default: "Asset"},
        acctypesettlement : {type: String, required: true, default: "Asset"},
        name : {type: String, required: true, default: "USSD"},
        code : {type: String, required: true, default: "202"},
        code2 : {type: String, required: true, default: "502"},
        refno : {type: String, required: true, default: "NA"},
        amount : {type: Number, required: true, default: 0.00},
        availableBal : {type: Number, required: true, default: 0.00},
        duration : {type: Number, required: true, default: 1},
        section: {type: String, required: true, default: "Income"},
        status: {type: String, required: true, default: "Approved"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Prepaid',PrepaidSchema);