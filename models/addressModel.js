let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let Schema = mongoose.Schema;
let Address = mongoose.Schema({

    userId: { type: Schema.Types.ObjectId,ref: "user" },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    deleteStatus:{
        type:Boolean,
        default:false
    },
    address:{
        type:String,
        trim:true
    },
    landmark:{
        type:String
    },
    latitude:{
        type:Number
    },
    longitude:{
        type:Number
    },
    buildingAndApart:{
        type:String
    },
    addressType:{
        type:String
    },
    defaultStatus:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
})
Address.plugin(mongoosePaginate)
Address.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('addresss', Address);