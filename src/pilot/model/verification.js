var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var VerificationSchema = new Schema(
    {
        phoneno : {type: String, required: true, default: "NA"},
        code : {type: String, required: true, default: "NA"},
        status : {type: String, required: true, default: "Unused"},
        consumed : {type: String, required: true, default: "N"},
        created : {type: Date, default: Date.now}
    }
);



module.exports = mongoose.model('Verification',VerificationSchema);