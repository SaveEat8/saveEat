const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const db = mongoose.connection;
var Schema = mongoose.Schema;
let Cuisinecategory = mongoose.Schema({

    cuisineId: { type :Schema.Types.ObjectId,ref:"cuisines"},
    status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    },
    name:{
        type:String
    },
    deleteStatus:{
        type:Boolean,
        default:false
    }
},{
    timestamps: true
})
Cuisinecategory.plugin(mongoosePaginate)
Cuisinecategory.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('cuisinecategorys', Cuisinecategory);