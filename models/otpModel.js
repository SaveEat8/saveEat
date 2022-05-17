let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let Schema = mongoose.Schema;
let Otp = mongoose.Schema({

    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    deleteStatus:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String
    },
    email:{
        type:String
    },
    mobileNumber:{
        type:String
    }
}, {
    timestamps: true
})
Otp.plugin(mongoosePaginate)
Otp.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('otps', Otp);