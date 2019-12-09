var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var PostingSchema = new Schema(
    {
        transaction: {type : Schema.Types.ObjectId, ref: 'Transaction'},
        amount : {type: Number, required: true, default: 0.00},
        balance : {type: Number, required: true, default: 0.00},
        transType : {type: String, required: true, default: "DR"},
        acctype : {type: String, required: true, default: "Asset"},
        postMode : {type: String, required: true, default: "OP"},
        section: {type: String, required: true, default: "Main"}, 
        accno : {type: String, required: true, default: "NA"},
        accno2 : {type: String, required: true, default: "NA"},
        narration : {type: String, required: true, default: "NA"},
        created : {type: Date, default: Date.now}
    }
);



module.exports = mongoose.model('Posting',PostingSchema);