const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
var Itemcategory = mongoose.Schema({

    menuId: { type: Schema.Types.ObjectId, ref: "menus" },
    brandId: { type: Schema.Types.ObjectId, ref: "brands" },
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
    name:{
        type:String,
        trim:true
    },
    deleteStatus:{
        type:Boolean,
        default:false
    }
},
    { timestamps: true }
);
Itemcategory.plugin(mongoosePaginate)
module.exports = mongoose.model('itemcategorys', Itemcategory);