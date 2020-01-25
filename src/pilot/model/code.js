var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var CodeSchema = new Schema(
    {
        data : {type: String, required: true, default: "NA"},
        agent: {type : Schema.Types.ObjectId, ref: 'Agent'},
        amount : {type: Number, required: true},
        status : {type: String, required: true, default: "Unused"},
        created : {type: Date, default: Date.now}
    }
);



module.exports = mongoose.model('Code',CodeSchema);