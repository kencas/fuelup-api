var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var LoanOfferSchema = new Schema(
    {
        loans: [{type : Schema.Types.ObjectId, ref: 'Loan'}],
        name : {type: String, required: true, default: "USSD"},
        status: {type: String, required: true, default: "Approved"},
        interest: {type: Number, required: true, default: 0.00},
        minApprovalAmt: {type: Number, required: true, default: 0.00},
        tenor: {type: Number, required: true, default: 15},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('LoanOffer',LoanOfferSchema);