const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const db = mongoose.connection;
var Schema = mongoose.Schema;
let Badgeearning = mongoose.Schema({

    userId: { type :Schema.Types.ObjectId,ref:"users"},
    badgeId: { type :Schema.Types.ObjectId,ref:"badges"},
    day:{
        type:Number
    },
    month:{
        type:Number
    },
    year:{
        type:Number
    }
},{
    timestamps: true
})
Badgeearning.plugin(mongoosePaginate)
Badgeearning.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('badgeearnings', Badgeearning);