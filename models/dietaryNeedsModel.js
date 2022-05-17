const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const db = mongoose.connection;
var Schema = mongoose.Schema;
let Dietaryneeds = mongoose.Schema({

    status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    },
    name:{
        type:String
    },
    nameAr:{
        type:String
    },
    deleteStatus:{
        type:Boolean,
        default:false
    }
},{
    timestamps: true
})
Dietaryneeds.plugin(mongoosePaginate)
Dietaryneeds.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('dietaryneedss', Dietaryneeds);