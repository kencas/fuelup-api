var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var OrderSchema = new Schema(
    {
        customer : {type : Schema.Types.ObjectId, ref: 'Customer'},
        agent : {type : Schema.Types.ObjectId, ref: 'Agent'},
        qty : {type: String, required: true, default: 0},
        price : {type: String, required: true, default: 0.00},
        isAccepted : {type: String, required: true, default: "N"},
        refno : {type: String, required: true, default: "NA"},
        isProcessed : {type: String, required: true, default: "N"},
        status: {type: String, required: true, default: "Pending"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Order',OrderSchema);