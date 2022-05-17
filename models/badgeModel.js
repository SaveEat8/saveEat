const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const db = mongoose.connection;
var Schema = mongoose.Schema;
let Badge = mongoose.Schema({

    name:{
        type:String
    },
    message:{
        type:String
    },
    image:{
        type:String
    },
    greyContent:{
        type:String
    },
    fullColorContent:{
        type:String
    },
    emojiGrey:{
        type:String
    },
    emojiColor:{
        type:String
    }
},{
    timestamps: true
})
Badge.plugin(mongoosePaginate)
Badge.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('badges', Badge);