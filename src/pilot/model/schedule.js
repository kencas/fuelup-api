var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var ScheduleSchema = new Schema(
    {
        accmain : {type: String, required: true, default: "NA"},
        acccontra : {type: String, required: true, default: "NA"},
        acctypemain : {type: String, required: true, default: "Asset"},
        acctypecontra : {type: String, required: true, default: "Asset"},
        name : {type: String, required: true, default: "USSD"},
        refno : {type: String, required: true, default: "NA"},
        amount : {type: Number, required: true, default: 0.00},
        status: {type: String, required: true, default: "Approved"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Schedule',ScheduleSchema);