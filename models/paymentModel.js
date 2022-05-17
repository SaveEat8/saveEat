var mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let Schema = mongoose.Schema;
let Payment = mongoose.Schema({

    brandId: { type :Schema.Types.ObjectId,ref:"brands"},
    restaurantId: { type :Schema.Types.ObjectId,ref:"branchs"},
    userId: { type :Schema.Types.ObjectId,ref:"users"},
    driverId: { type :Schema.Types.ObjectId,ref:"drivers"},
    orderId: { type :Schema.Types.ObjectId,ref:"productorders"},
    deleteStatus: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    paymentId:{
        type:String
    },
    paymentStatus:{
        type:String
    },
    paymentMode:{
        type:String
    },
    paymentDate:{
        type:String
    },
    totalAmount:{
        type:Number
    },
    adminAmount:{
        type:Number
    },
    restaurantAmount:{
        type:Number
    },
    commission:{
        type:Number
    },
    commissionPer:{
        type:Number
    },
    driverAmount:{
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
        type:Date
    }
}, {
    timestamps: true
})
Payment.plugin(mongoosePaginate)
Payment.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('payments', Payment);