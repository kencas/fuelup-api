var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var LoanSchema = new Schema(
    {
        customer: {type : Schema.Types.ObjectId, ref: 'Customer'},
        loanoffer: {type : Schema.Types.ObjectId, ref: 'LoanOffer'},
        refno: {type: String, required: true, default: "NA"},
        repaymentdate : {type: Date, default: Date.now},
        amount : {type: Number, required: true, default: 0},
        status: {type: String, required: true, default: "Active"},
        created : {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('Loan',LoanSchema);