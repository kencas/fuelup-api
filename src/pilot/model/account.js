var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var AccountSchema = new Schema(
    {
        acctype: {type : String, default: 'Liability'},
        accname : {type: String, required: true, default: 'NA'},
        accno : {type: String, required: true, default: 'NA'},
        bookBal : {type: Number, required: true, default: 0.00},
        availableBal : {type: Number, required: true, default: 0.00},
        currency : {type: String, required: true, default: 'NGN'},
        code : {type: String, required: true, default: 'NGN'},
        transcode : {type: String, required: true, default: 'NA'},
        created : {type: Date, default: Date.now}
    }
);







module.exports = mongoose.model('Account',AccountSchema);

