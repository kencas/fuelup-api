var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var AddressSchema = new Schema(
    {
        customer : {type : Schema.Types.ObjectId, ref: 'Customer'},
        address : {type: String, required: true, default: "NA"},
        city : {type: String, required: true, default: "NA"},
        state : {type: String, required: true, default: "NA"},
        status : {type: String, required: true, default: "Pending"},
        created : {type: Date, default: Date.now}
    }
);



module.exports = mongoose.model('Address',AddressSchema);