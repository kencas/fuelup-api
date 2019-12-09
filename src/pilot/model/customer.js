var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var CustomerSchema = new Schema(
    {
        addresses: [{type : Schema.Types.ObjectId, ref: 'Address'}],
        customer: [{type : Schema.Types.ObjectId, ref: 'Customer'}],
        customerNo : {type: String, required: true, default: 'NA'},
        username : {type: String, required: true, default: 'NA'},
        gender : {type: String, required: true, default: 'NA'},
        email  : {type: String, required: true, default: 'NA'},
        phoneno  : {type: String, required: true, default: 'NA'},
        transcode : {type: String, required: true, default: 'NA'},
        isconfiguredcode : {type: String, required: true, default: 'N'},
        created : {type: Date, default: Date.now}
    }
);





module.exports = mongoose.model('Customer',CustomerSchema);