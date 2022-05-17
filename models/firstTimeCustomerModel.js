const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let db = mongoose.connection;
let Schema = mongoose.Schema;
let Firstimecustomer = mongoose.Schema({

    storeId: { type: Schema.Types.ObjectId, ref: "brands" },
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    orderId: { type: Schema.Types.ObjectId, ref: "productorders" },
    date:{
        type:String
    }
}, {
    timestamps: true
})
Firstimecustomer.plugin(mongoosePaginate)
Firstimecustomer.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('firstimecustomers', Firstimecustomer);