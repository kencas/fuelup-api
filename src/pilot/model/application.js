var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var ApplicationSchema = new Schema(
    {
        customer : {type : Schema.Types.ObjectId, ref: 'Customer'},
        phoneno : {type: String, required: true, default: "NA"},
        bvn : {type: String, required: true, default: "NA"},
        amount : {type: Number, required: true, default: 0},
        duration : {type: Number, required: true, default: 0},
        status : {type: String, required: true, default: "Pending"},
        created : {type: Date, default: Date.now}
    }
);



module.exports = mongoose.model('Application',ApplicationSchema);