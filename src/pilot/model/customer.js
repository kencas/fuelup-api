var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var CustomerSchema = new Schema(
    {
        addresses: [{type : Schema.Types.ObjectId, ref: 'Address'}],
        customer: [{type : Schema.Types.ObjectId, ref: 'Customer'}],
        wallet: {type : Schema.Types.ObjectId, ref: 'Wallet'},
        customerNo : {type: String, required: true, default: 'NA'},
        username : {type: String, required: true, default: 'NA'},
        gender : {type: String, required: true, default: 'NA'},
        email  : {type: String, required: true, default: 'NA'},
        phoneno  : {type: String, required: true, default: 'NA'},
        transcode : {type: String, required: true, default: 'NA'},
        bvn : {type: String, required: true, default: 'NA'},
        image : {type: String, required: true, default: 'NA'},
        isconfiguredcode : {type: String, required: true, default: 'N'},
        isconfiguredbvn : {type: String, required: true, default: 'N'},
        created : {type: Date, default: Date.now}
    }
);





module.exports = mongoose.model('Customer',CustomerSchema);