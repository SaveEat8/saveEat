const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let db = mongoose.connection;
let Schema = mongoose.Schema;
let Mainorder = mongoose.Schema({

    userId: { type :Schema.Types.ObjectId,ref:"users"},
    storeData:[{
        storeId: { type :Schema.Types.ObjectId,ref:"brands"}
    }],
    subTotal:{
        type:Number
    },
    total:{
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
    saveAmount:{
        type:Number,
        default:0
    },
    tax:{
        type:Number
    },
    paymentId:{
        type:String
    },
    paymentMode:{
        type:String
    },
    paymentStatus:{
        type:String
    },
    saveEatFees:{
        type:Number
    },
    taxes:{
        type:Number
    }

},{
    timestamps: true
})
Mainorder.plugin(mongoosePaginate)
Mainorder.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('mainorders', Mainorder);