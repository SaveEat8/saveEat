const mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate');
var func = require('../utils/commonFun.js');
const Admin = mongoose.Schema({

    name: {
        type: String
    },
    userType: {
        type: String,
        enum: ['Admin', 'SubAdmin'],
        default: 'Admin'
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    profilePic: {
        type: String,
        default: "https://saveeatdev.s3.ap-south-1.amazonaws.com/admin/1629887844049-1629807360565-Save%20Eat%20Honey.png"
    },
    username: {
        type: String
    },
    role: {
        type: String
    },
    jwtToken: {
        type: String
    },
    countryCode: {
        type: String,
        default: '+91'
    },
    mobileNumber: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    emailOtp: {
        type: String
    },
    fcmToken: {
        type: String
    },
    tax: {
        type: Number,
        default: 5
    },
    fee: {
        type: Number,
        default: 2
    },
    orderNumber: {
        type: Number,
        default: 15000
    },
    storeNumber: {
        type: Number,
        default: 1000
    },
    brandNumber: {
        type: Number,
        default: 1000
    },
    brandAdminNumber: {
        type: Number,
        default: 1000
    },
    storeAdminNumber: {
        type: Number,
        default: 1000
    },
    roleId: {
        type: String
    },
    userNumber:{
        type:Number,
        default:1000
    },
    rewardNumber:{
        type:Number,
        default:1000
    },
    creditNumber:{
        type:Number,
        default:1000
    },
    refundNumber:{
        type:Number,
        default:1000
    },
    adminNumber:{
        type:String
    },
    subAdminNumber:{
        type:Number,
        default:1000
    },

    ctCredits:{
        type:Number,
        default:0
    },
    ctCreditsExpiryDays:{
        type:Number,
        default:0
    }

}, {
    timestamps: true
})

Admin.plugin(mongoosePaginate);
const AdminModel = mongoose.model('admin', Admin, 'admin');
module.exports = AdminModel
AdminModel.findOne({}, (error, success) => {
    if (error) {
        console.log(error)
    } else {
        if (!success) {
            func.bcrypt("admin123", (err, password) => {
                if (err)
                    console.log("Error is=============>", err)
                else {
                    new AdminModel({
                        email: "admin@gmail.com",
                        password: password,
                        username: "admin1234",
                        name: "Admin",
                        profilePic: "https://saveeatdev.s3.ap-south-1.amazonaws.com/admin/1629887844049-1629807360565-Save%20Eat%20Honey.png"
                    }).save((error, success) => {
                        if (error) {
                            console.log("Error in creating admin");
                        }
                        else {
                            console.log("Admin created successfully");
                            console.log("Admin data is==========>", success);
                        }
                    })
                }
            })
        }
    }
})
