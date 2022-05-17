const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const db = mongoose.connection;
var Schema = mongoose.Schema;
let Cart = mongoose.Schema({

    restroId: {
        type: Schema.Types.ObjectId,
        ref: "brands"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    productData: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number,
            default: 1
        },
        choice: [],
        requirement: {
            type: String,
            default: ''
        },
        type: {
            type: String
        }
    }],
    estimated_price: {
        type: Number
    },
    estimated_time: {
        type: Number
    },
    dunzoDeliveryFee: {
        type: Number
    }

}, {
    timestamps: true
})
Cart.plugin(mongoosePaginate)
Cart.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('carts', Cart);