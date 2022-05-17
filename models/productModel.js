const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const db = mongoose.connection;
var Schema = mongoose.Schema;
let Product = mongoose.Schema({

    brandId: { type: Schema.Types.ObjectId, ref: "brands" },
    storeId: { type: Schema.Types.ObjectId, ref: "stores" },
    menuId: { type: Schema.Types.ObjectId, ref: "menus" },
    cuisineId: { type: Schema.Types.ObjectId, ref: "cuisines" },
    cuisineCategoryId: { type: Schema.Types.ObjectId, ref: "cuisinecategorys" },
    menuCategoryId: { type: Schema.Types.ObjectId, ref: "itemcategorys" },
    productNumber: {
        type: String
    },
    adminVerifyStatus: {
        type: String,
        enum: ['Pending', 'Approve', 'Disapprove'],
        default: 'Pending'
    },
    actualFoodType:{
        type:String,
        enum:['Selling','Fixed']
    },
    foodImage: {
        type: String
    },
    foodName: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    deleteStatus: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number
    },
    foodQuantity:{
        type:Number
    },
    priceSelection: {
        type: Boolean,
        default: false
    },
    category: [{
        categoryName: {
            type: String
        },
        min:{
            type:Number
        },
        max:{
            type:Number
        },
        choice: [{
            name: {
                type: String
            },
            price: {
                type: Number
            },
            status: {
                type: Boolean,
                default: true
            }
        }]
    }],
    foodType:{
        type:String,
        trim:true
    },
    foodTypeArray:[],
    cuisine: {
        type: String,
        trim: true
    },
    subCategory:{
        type:String
    },
    cuisineArray: [],
    sellingStatus: {
        type: Boolean,
        default: false
    },
    pauseStatus: {
        type: Boolean,
        default: false
    },
    refProductId:[{
        productId:{
            type: Schema.Types.ObjectId, ref: "products" 
        }
    }],
    isChoiceStatus:{
        type:Boolean,
        default:false
    },
    changeRequest: {
        type: Boolean,
        default: true
    },
    changeRequestApporve: {
        type: String,
        enum: ['Pending', 'Approve', 'Disapprove'],
        default: 'Pending'
    },
    changeRequestId: {
        type: String
    },
    changeRequestMsg: {
        type: String,
        default:'New Menu'
    },
    menuCategoryName: {
        type: String,
        trim: true
    },
    totalOrder: {
        type: Number,
        default: 0
    },
    avgRating:{
        type:Number,
        default:0
    },
    totalRating:{
        type:Number,
        default:0
    },
    ratingByUsers:{
        type:Number,
        default:0
    },
    discountAmount:{
        type:Number,
        default:0
    },
    quantitySell:{
        type:Number,
        default:0
    },
    leftQuantity:{
        type:Number,
        default:0
    },
    addedQuantity:{
        type:Number,
        default:0
    },
    discountPer:{
        type:Number
    },
    expiryDate:{
        type:String
    },
    expiryTime:{
        type:String
    },
    convertedExpiryDate:{
        type:Date
    },
    pickupLaterAllowance:{
        type:Boolean,
        default:false
    },
    pickupDate:{
        type:String
    },
    pickupTime:{
        type:String
    },
    convertedPickupDate:{
        type:Date
    },
    refreshStatus:{
        type:Boolean,
        default:false
    },
    offeredPrice:{
        type:Number
    },
    outOfStock:{
        type:Boolean,
        default:false
    },
    taxable:{
        type:Boolean,
        default:false
    },
    // choice: {
    //     type: Array
    // },
}, {
    timestamps: true
})
Product.plugin(mongoosePaginate)
Product.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('products', Product);