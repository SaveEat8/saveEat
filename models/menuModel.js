const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
var Menu = mongoose.Schema({

    brandId: { type: Schema.Types.ObjectId, ref: "brands" },
    storeId: { type: Schema.Types.ObjectId, ref: "stores" },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    adminVerificationStatus:{
        type:String,
        enum:['Pending','Approve','Disapprove'],
        default:'Pending'
    },
    menuName:{
        type:String,
        trim:true
    },
    deleteStatus:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:String
    }
},
    { timestamps: true }
);
Menu.plugin(mongoosePaginate)
module.exports = mongoose.model('menus', Menu);