const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const db = mongoose.connection;
var Schema = mongoose.Schema;
let Productearning = mongoose.Schema({

    brandId: { type :Schema.Types.ObjectId,ref:"brands"},
    userId: { type :Schema.Types.ObjectId,ref:"users"},
    productId: { type :Schema.Types.ObjectId,ref:"products"},
    orderId: { type :Schema.Types.ObjectId,ref:"productorders"},
    cost:{
        type:Number
    },
    amount:{
        type:Number
    },
    quantity:{
        type:Number
    },
    day:{
        type:Number
    },
    month:{
        type:Number
    },
    year:{
        type:Number
    },
    orderDate:{
        type:String
    },
    status:{
        type:String,
        default:'Active'
    },
    sellingStatus:{
        type:Boolean
    },
    commission:{
        type:Number
    },
    settingType:{
        type:String
    }
},{
    timestamps: true
})
Productearning.plugin(mongoosePaginate)
Productearning.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('productearnings', Productearning);