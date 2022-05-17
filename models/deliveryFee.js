const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const db = mongoose.connection;

const modelSchema = mongoose.Schema({
    type: {
        type: String
    },
    zero_one: {
        type: Number,
        default: 0
    },
    one_two: {
        type: Number,
        default: 0
    },
    two_three: {
        type: Number,
        default: 0
    },
    three_four: {
        type: Number,
        default: 0
    },
    four_five: {
        type: Number,
        default: 0
    },
    five_six: {
        type: Number,
        default: 0
    },
    six_seven: {
        type: Number,
        default: 0
    },
    seven_eight: {
        type: Number,
        default: 0
    },
    eight_nine: {
        type: Number,
        default: 0
    },
    nine_ten: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true
})


const model = mongoose.model('delivery_fees', modelSchema);
module.exports = model

model.findOne({}, (error, success) => {
    if (error) {
        console.log(error)
    } else {
        if (!success) {
            new model({
                type: 'saveEat_delivery_fees',
                zero_one : 0,
                one_two: 0,
                two_three: 0,
                three_four: 0,
                four_five: 0,
                five_six: 0,
                six_seven: 0,
                seven_eight: 0,
                eight_nine: 0,
                nine_ten: 0,
            }).save((error, success) => {
                if (error) {
                    console.log("Error in creating admin");
                } else {
                    console.log("Admin created successfully");
                    console.log("Admin data is==========>", success);
                }
            })
        }
    }
})