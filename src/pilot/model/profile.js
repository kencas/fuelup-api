var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var ProfileSchema = new Schema(
    {
        customer: {type : Schema.Types.ObjectId, ref: 'Customer'},
        firstname: {type: String, required: true, default: "NA"},
        lastname: {type: String, required: true, default: "NA"},
        gender: {type: String, required: true, default: "Female"},
        dob: {type: String, required: true, default: "NA"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Profile',ProfileSchema);