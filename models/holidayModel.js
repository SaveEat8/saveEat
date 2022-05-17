const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const db = mongoose.connection;
var Schema = mongoose.Schema;
let Holiday = mongoose.Schema({

    storeId: { type :Schema.Types.ObjectId,ref:"stores"},
    brandId: { type :Schema.Types.ObjectId,ref:"brands"},
    startDate:{
        type:String
    },
    endDate:{
        type:String
    },
    convertedStartDate:{
        type:Date
    },
    convertedEndDate:{
        type:Date
    },
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
    },
    title:{
        type:String,
        default:'New exception'
    },
    newSDate:{},
    newEDate:{}
},{
    timestamps: true
})
Holiday.plugin(mongoosePaginate)
Holiday.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('holidays', Holiday);