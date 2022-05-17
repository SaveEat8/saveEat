const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let db = mongoose.connection;
let Schema = mongoose.Schema;
let Customerdetail = mongoose.Schema({

    brandId: { type :Schema.Types.ObjectId,ref:"brands"},
    branchId: { type :Schema.Types.ObjectId,ref:"branchs"},
    userId: { type :Schema.Types.ObjectId,ref:"users"},
    orderId: { type :Schema.Types.ObjectId,ref:"productorders"},
    areaId:{ type :Schema.Types.ObjectId,ref:"areas"}
},{
    timestamps: true
})
Customerdetail.plugin(mongoosePaginate)
Customerdetail.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('customerdetails', Customerdetail);