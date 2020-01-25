var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var CardSchema = new Schema(
    {
        application: {type : Schema.Types.ObjectId, ref: 'Application'},
        customer: {type : Schema.Types.ObjectId, ref: 'Customer'},
        cardno: {type: String, required: true, default: "NA"},
        serialNo: {type: String, required: true, default: "NA"},
        authcode: {type: String, required: true, default: "NA"},
        status: {type: String, required: true, default: "Pending"},
        activationdate : {type: Date, default: Date.now},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Card',CardSchema);