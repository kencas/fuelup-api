var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var AccTypeSchema = new Schema(
    {
        ledger: {type : Schema.Types.ObjectId, ref: 'Ledger'},
        accno: {type : String, required: true, default: 'NA'},
        name: {type : String, required: true, default: 'NA'},
        index: {type : Number, required: true, default: -1},
        type: {type : String, required: true, default: 'OP'},
        acctype: {type : String, required: true, default: 'Asset'},
        code: {type : String, required: true, default: '200'},
        created : {type: Date, default: Date.now}
    }
);





module.exports = mongoose.model('AccType',AccTypeSchema);