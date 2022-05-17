let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let Schema = mongoose.Schema;
let Notification = mongoose.Schema({

    notiTo: { type: Schema.Types.ObjectId, ref: "users" },
    driverId: { type: Schema.Types.ObjectId,ref: "drivers" },
    brandId: { type: Schema.Types.ObjectId,ref: "brands" },
    storeId: { type: Schema.Types.ObjectId,ref: "stores" },
    notiMessage:{
        type:String
    },
    notiTitle:{
        type:String
    },
    status: {
        type: String,
        enum:['Active','Inactive'],
        default:'Active'
    },
    isSeen:{
        type:Boolean,
        default:false
    },
    notiType:{
        type:String
    },
    type:{
        type:String
    },
    data:{
        type:String
    },
    deleteStatus:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
})
Notification.plugin(mongoosePaginate)
Notification.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('notifications', Notification);