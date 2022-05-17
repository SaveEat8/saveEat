const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const db = mongoose.connection;
var Schema = mongoose.Schema;
let Choicecategory = mongoose.Schema({

    brandId: { type: Schema.Types.ObjectId, ref: "brands" },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    deleteStatus: {
        type: Boolean,
        default: false
    },
    categoryName: {
        type: String
    },
    min: {
        type: Number
    },
    max: {
        type: Number
    },
    choice: [{
        name: {
            type: String
        },
        price: {
            type: Number
        },
        status: {
            type: String,
            default: 'Active'
        },
        foodType:{
            type:String
        }
    }]
}, {
    timestamps: true
})
Choicecategory.plugin(mongoosePaginate)
Choicecategory.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('choicecategorys', Choicecategory);