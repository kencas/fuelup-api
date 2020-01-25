var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var VendorSchema = new Schema(
    {
        customer : {type : Schema.Types.ObjectId, ref: 'Customer'},
        isVerified : {type: String, required: true, default: "N"},
        status : {type: String, required: true, default: "Pending"},
        created : {type: Date, default: Date.now}
    }
);



module.exports = mongoose.model('Vendor',VendorSchema);