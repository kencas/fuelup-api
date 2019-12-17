var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var LoanSchema = new Schema(
    {
        loanoffer: {type : Schema.Types.ObjectId, ref: 'LoanOffer'},
        name : {type: String, required: true, default: "USSD"},
        status: {type: String, required: true, default: "Approved"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('LoanOffer',LoanOfferSchema);