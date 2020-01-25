var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        orders: [{type : Schema.Types.ObjectId, ref: 'Order'}],
        username : {type: String, required: true, default: "NA"},
        password : {type: String, required: true, default: "NA"},
        role : {type: String, required: true, default: "NA"},
        created : {type: Date, default: Date.now}
    }
);



module.exports = mongoose.model('User',UserSchema);