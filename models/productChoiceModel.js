const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let db = mongoose.connection;
let Schema = mongoose.Schema;
let Productchoice = mongoose.Schema({

    productId: { type :Schema.Types.ObjectId,ref:"products"},
    choiceId: { type :Schema.Types.ObjectId,ref:"choicecategorys"},

},{
    timestamps: true
})
Productchoice.plugin(mongoosePaginate)
Productchoice.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('productchoices', Productchoice);