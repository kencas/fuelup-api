var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var ApplicationSchema = new Schema(
    {
        customer: {type : Schema.Types.ObjectId, ref: 'Customer'},
        name : {type: String, required: true, default: "NA"},
        address : {type: String, required: true, default: "NA"},
        city : {type: String, required: true, default: "Asset"},
        state : {type: String, required: true, default: "NA"},
        country : {type: String, required: true, default: "Nigeria"},
        status: {type: String, required: true, default: "Pending"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Application',ApplicationSchema);