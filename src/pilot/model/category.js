var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        movies: [{type : Schema.Types.ObjectId, ref: 'Movie'}],
        name : {type: String, required: true},
        image : {type: String, required: true},
        created : {type: Date, default: Date.now}
    }
);



module.exports = mongoose.model('Category',CategorySchema);