const mongoose = require("mongoose");

let Schema = mongoose.Schema;
const modelSchema = new mongoose.Schema({

    user: {
        type: Object
    },
    credits: {
        type: Number
    },
    expiryDate: {
        type: String
    },
    isCreditSend: {
        type: Boolean,
        default : false
    }
}, {
    timestamps: true
})

const models = new mongoose.model('clever_tap_credits', modelSchema);

module.exports = models;