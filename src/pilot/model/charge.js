var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var ChargeSchema = new Schema(
    {
        accno: {type : String, required: true, default: 'NA'},
        name: {type : String, required: true, default: 'NA'},
        availableBal: {type : Number, required: true, default: 0.00},
        section: {type : String, required: true, default: 'NA'},
        acctype: {type : String, required: true, default: 'NA'},
        code: {type : String, required: true, default: '501'},
        created : {type: Date, default: Date.now}
    }
);



module.exports = mongoose.model('Charge',ChargeSchema);