let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let Schema = mongoose.Schema;
let Claimcoupon = mongoose.Schema({

    userId: { type: Schema.Types.ObjectId,ref: "users" },
    couponId: { type: Schema.Types.ObjectId,ref: "credits" },
    code:{
        type:String
    } 
}, {
    timestamps: true
})
Claimcoupon.plugin(mongoosePaginate)
Claimcoupon.plugin(mongooseAggregatePaginate);
module.exports  = mongoose.model('claimcoupons', Claimcoupon);
