let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let Schema = mongoose.Schema;
let Brand = mongoose.Schema({

    brandId: { type: Schema.Types.ObjectId,ref: "brands" },
    roleId: { type: Schema.Types.ObjectId,ref: "roles" },
    location: {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [{ type: Number, createIndexes: true }],
    },
    businessName:{
        type:String,
        trim:true
    },
    adminVerificationStatus:{
        type:String,
        enum:['Pending','Approve','Disapprove'],
        default:'Pending'
    },
    status: {
        type: String,
        enum:['Active','Inactive'],
        default:'Inactive'
    },
    userType: {
        type: String,
        enum:['Brand','Store','Brand-Admin','Store-Admin'],
        default:'Brand'
    },
    jwtToken: {
        type: String,
        trim:true
    },
    multipleStore:{
        type:Boolean
    },
    street:{
        type:String,
        trim:true
    },
    originalName:{
        type:String
    },
    originalEmail:{
        type:String
    },

    originalMobileNumber:{
        type:String
    },
    locality:{
        type:String
    },
    countryCode:{
        type:String
    },
    mobileNumber:{
        type:String,
        trim:true
    },
    webiteLink:{
        type:String
    },
    gstinNumber:{
        type:String
    },
    pan:{
        type:String
    },
    fssaiNumber:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String,
        trim:true
    },
    deviceType:{
        type:String,
        trim:true
    },
    deviceToken:{
        type:String,
        trim:true
    },
    image:{
        type:String,
        trim:true,
        default:'https://res.cloudinary.com/a2karya80559188/image/upload/v1584446172/profile_pic_xil0c0.png'
    },
    logo:{
        type:String,
        trim:true,
        default:'https://res.cloudinary.com/a2karya80559188/image/upload/v1584446172/profile_pic_xil0c0.png'
    },
    deleteStatus:{
        type:Boolean,
        default:false
    },
    notificationStatus:{
        type:Boolean,
        default:true
    },
    latitude:{
        type:String
    },
    longitude:{
        type:String
    },
    address:{
        type:String,
        trim:true
    },
    totalRating:{
        type:Number,
        default:0
    },
    avgRating:{
        type:Number,
        default:0
    },
    ratingByUsers:{
        type:Number,
        default:0
    },
    totalOrders:{
        type:Number,
        default:0
    },
    emailOtp:{
        type:String
    },
    businessType:{
        type:String
    },
    empId:{
        type:String
    },
    name:{
        type:String
    },
    role:{
        type:String
    },
    foodType:{
        type:String,
        enum:['Veg','Non-Veg','Both']
    },
    foodTypeArray:[],
    bankName:{
        type:String
    },
    accountHolderName:{
        type:String
    },
    accountNumber:{
        type:String
    },
    ifscCode:{
        type:String
    },
    language:{
        type:String,
        default:'English'
    },
    followers:{
        type:Number,
        default:0
    },
    openStatus:{
        type:String,
        enum:['Open','Close'],
        default:'Open'
    },
    empNumber:{
        type:String
    },
    description:{
        type:String
    },
    safetyBadge:{
        type:Boolean,
        default:true
    },
    tax:{
        type:Number,
        default:5
    },
    commission:{
        type:Number,
        default:25
    },
    fixCommissionPer:{
        type:Number,
        default:15
    },
    hiddenLocationUsers:[{
        userId: { type: Schema.Types.ObjectId,ref: "users" }
    }],


    hiddenCode:{
        type:String,
        default:'false'
    },

    lastSale:{
        type:Date
    },
    hiddenStatus:{
        type:Boolean,
        default:false
    },

    brandSelfStatus: {
        type: String,
        enum:['Active','Inactive'],
        default:'Active'
    },

    // serviceType: {
    //     type: String,
    //     enum:['Both','PickUp', 'Delivery'],
    //     default:'Both'
    // },

    wallet:{
        type:Number,
        default:0
    },
    
    zohoId:{
        type:String
    }
}, {
    timestamps: true
})
Brand.index({ location: '2dsphere' });
Brand.plugin(mongoosePaginate)
Brand.plugin(mongooseAggregatePaginate);
module.exports  = mongoose.model('brands', Brand);
