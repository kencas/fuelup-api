var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var BankSchema = new Schema(
    {
        name : {type: String, required: true, default: "NA"},
        accno : {type: String, required: true, default: "NA"},
        acctype : {type: String, required: true, default: "Asset"},
        code : {type: String, required: true, default: "NA"},
        availableBal : {type: Number, required: true, default: 0.00},
        availableBal : {type: Number, required: true, default: 0.00},
        metadata : {type: Object, required: true},
        status: {type: String, required: true, default: "Approved"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Bank',BankSchema);