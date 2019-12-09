var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var WalletSchema = new Schema(
    {
        customer: {type : Schema.Types.ObjectId, ref: 'Customer'},
        ledger: {type : Schema.Types.ObjectId, ref: 'Ledger'},
        amount : {type: Number, required: true, default: 0},
        name : {type: String, required: true, default: "My Wallet"},
        acctype : {type: String, required: true, default: "Liability"},
        status : {type: String, required: true, default: "Active"},
        created : {type: Date, default: Date.now}
    }
);



module.exports = mongoose.model('Wallet',WalletSchema);