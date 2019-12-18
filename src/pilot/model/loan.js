var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var LoanSchema = new Schema(
    {
        loanoffer: {type : Schema.Types.ObjectId, ref: 'LoanOffer'},
        name : {type: String, required: true, default: "USSD"},
        repaymentDate : {type: Date, default: Date.now},
        amount : {type: Number, required: true, default: 0},
        status: {type: String, required: true, default: "Active"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Loan',LoanSchema);