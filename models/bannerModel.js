const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const db = mongoose.connection;
var Schema = mongoose.Schema;
let Banner = mongoose.Schema({

    brandId: { type: Schema.Types.ObjectId, ref: "brands" },
    status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    },
    deleteStatus:{
        type:Boolean,
        default:false
    },
    enTitle:{
        type:String
    },
    arTitle:{
        type:String
    },
    enImage:{
        type:String
    },
    arImage:{
        type:String
    },
    enDescription:{
        type:String
    },
    arDescription:{
        type:String
    },
    enOfferCode:{
        type:String
    },
    arOfferCode:{
        type:String
    },
    fromDate:{
        type:String
    },
    fromTime:{
        type:String
    },
    fromTimeAndDate:{
        type:Date
    },
    toDate:{
        type:String
    },
    toTime:{
        type:String
    },
    toActualTimeAndDate:{
        type:Date
    },
    restaurantData:[{
        restaurantId:{ type: Schema.Types.ObjectId, ref: "branchs" }
    }],
    restroData:[]
   
},{
    timestamps: true
})
Banner.plugin(mongoosePaginate)
Banner.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('banners', Banner);