var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var OrderSchema = new Schema(
    {
        customer : {type : Schema.Types.ObjectId, ref: 'Customer'},
        agent : {type : Schema.Types.ObjectId, ref: 'Agent'},
        qty : {type: String, required: true, default: 0},
        price : {type: String, required: true, default: 0.00},
        orderType: {type: String, required: true, default: "Quantity"},
        description: {type: String, required: true, default: "NA"},
        isAccepted : {type: String, required: true, default: "N"},
        isPaid : {type: String, required: true, default: "N"},
        isDelivered : {type: String, required: true, default: "N"},
        isCancelled : {type: String, required: true, default: "N"},
        isOTPValidated : {type: String, required: true, default: "N"},
        refno : {type: String, required: true, default: "NA"},
        isProcessed : {type: String, required: true, default: "N"},
        status: {type: String, required: true, default: "Pending"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Order',OrderSchema);