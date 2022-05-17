const mongoose = require("mongoose");

let Schema = mongoose.Schema;
const modelSchema = new mongoose.Schema({

    access_token: {
        type: String
    }
}, {
    timestamps: true
})

const models = new mongoose.model('dunzo_tokens', modelSchema);

module.exports = models;