const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const db = mongoose.connection;
var Schema = mongoose.Schema;
let Deliveryslot = mongoose.Schema({

    storeId: { type :Schema.Types.ObjectId,ref:"stores"},
    brandId: { type :Schema.Types.ObjectId,ref:"brands"},
    saleWindowOpen:{
        type:String
    },
    saleWindowClose:{
        type:String
    },
    pickupWindowOpen:{
        type:String
    },
    pickupWindowClose:{
        type:String
    },
    day:{
        type:String
    },
    status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    },
    deleteStatus:{
        type:Boolean,
        default:false
    },
    timezone:{
        type:String
    },
    runningStatus:{
        type:Boolean,
        default:true
    }
},{
    timestamps: true
})
Deliveryslot.plugin(mongoosePaginate)
Deliveryslot.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('deliveryslots', Deliveryslot);