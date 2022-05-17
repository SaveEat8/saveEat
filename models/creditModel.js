let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let Schema = mongoose.Schema;
let Credit = mongoose.Schema({

    userId: { type: Schema.Types.ObjectId,ref: "users" },
    creditNumber:{
        type:String
    },
    creditTitle:{
        type:String,
        trim:true
    },
    creditCode:{
        type:String,
        trim:true
    },  
    creditType:{
        type: String,
        enum: ['Direct', 'Code'],
        default: 'Direct'
    },
    transectionType:{
        type: String,
        enum: ['Credit', 'Debit'],
        default: 'Credit'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive','Expired', 'Used'],
        default: 'Active'
    },
    remaningFrequency: {
        type: Number,
        trim:true
    },
    totalFrequency:{
        type: Number,
        trim:true
    },
    creditAmount: {
        type: Number,
        trim:true
    },
    description:{
        type: String,
        trim:true
    },
    fromDate: {
        type: Date,
    },
    toDate:{
        type:Date
    },
    convertedFrom:{
        type:Date
    },
    convertedTo:{
        type:Date
    },

    expiryDate:{
        type:String
    },
    
}, {
    timestamps: true
})
Credit.plugin(mongoosePaginate)
Credit.plugin(mongooseAggregatePaginate);
module.exports  = mongoose.model('credits', Credit);
