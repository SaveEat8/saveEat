let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let Schema = mongoose.Schema;
let Group = mongoose.Schema({

    brandId: { type: Schema.Types.ObjectId, ref: "brands" },
    groupName:{
        type:String
    },
    bankName:{
        type:String
    },
    accountHolderName:{
        type:String
    },
    accountNumber:{
        type:String
    },
    ifscCode:{
        type:String
    },
    storeData:[],
    status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    }
}, {
    timestamps: true
})
Group.plugin(mongoosePaginate)
Group.plugin(mongooseAggregatePaginate);
module.exports  = mongoose.model('groups', Group);
