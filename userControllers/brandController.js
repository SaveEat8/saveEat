const User = require('../models/userModel.js');
const Brand = require('../models/brandModel.js');
const Store = require('../models/storeModel.js');
const Support = require('../models/supportModel.js');
const Openinghours = require('../models/openingHoursModel.js');
const Notification = require('../models/notificationModel.js');
const Product = require('../models/productModel.js');
const Cuisine = require('../models/cuisineModel.js');
const Cuisinecategory = require('../models/cuisineCategoryModel.js');
const Menu = require('../models/menuModel.js');
const Itemcategory = require('../models/itemCategoryModel.js');
const Fileupload = require('../utils/fileUpload.js');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const moment = require('moment')
const date = require('date-and-time');

const _ = require('lodash');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const response = require("../utils/httpResponseMessage");
const SendMail = require('../utils/sendMail.js');
const Sendnotification = require('../utils/notification.js');
const fs = require('fs');
const xlsxFile = require('read-excel-file/node');
const Order = require('../models/productOrderModel.js');
const momentZone = require('moment-timezone');
const Payment = require('../models/paymentModel.js');
const Productearning = require('../models/productEarningModel.js');
const Customerdata = require('../models/customerForBrandModel.js');
const Otp = require('../models/otpModel.js');
const Holiday = require('../models/holidayModel.js');
const Socialmedia = require('../models/socialMediaLinkModel.js');
const Staticmodel = require('../models/staticModel.js');
const Faq = require('../models/faqModel.js');
const Group = require('../models/groupModel.js');
const Access = require('../models/accessModel.js');
const Role = require('../models/roleModel.js');
const Admin = require('../models/adminModel.js');
const Newusers = require('../models/firstTimeCustomerModel.js');
const Rescuefood = require('../models/rescuedFoodModel.js');
const Sellingmodel = require('../models/sellingModel.js');
const Badgeearning = require('../models/badgeEarningModel.js');
const Badge = require('../models/badgeModel.js');
const geodist = require('geodist');
const Favorite = require('../models/favouriteModel.js');
const Choicecategory = require('../models/choiceCategoryModel.js');
const Productchoice = require('../models/productChoiceModel.js');
const Cart = require('../models/cartModel.js');
const Star = require('../models/starModel.js');
const Reward = require('../models/rewardModel.js');
const authKey = '368530A5a091JQRL6167bdd1P1'
const request = require('request');
const ZOHO = require('../models/zohoModel.js')
const DUNZO = require('../models/dunzoTokenModel.js')
const Coins = require('../models/creditModel.js');




module.exports = {


    //==============================================Check mobile and email================================//

    checkBrandMobileAndEmail: async (req, res) => {

        try {
            response.log("Request for check mobile and email is============>", req.body);
            let checkEmail = await Brand.findOne({ email: (req.body.email).toLowerCase(), userType: 'Brand' })
            if (checkEmail) {
                response.log("Email is already exist");
                return response.responseHandlerWithMessage(res, 409, "Email is already exist");
            }
            let otp = Math.floor(100000 + Math.random() * 900000)
            let checkOtp = await Otp.findOne({ email: (req.body.email).toLowerCase() })
            if (checkOtp) {
                await Otp.findByIdAndRemove({ _id: checkOtp._id })
            }
            let otpObj = new Otp({
                email: (req.body.email).toLowerCase(),
                otp: otp
            })
            let otpData = otpObj.save()
            response.log(`Otp has been sent to your email ${(req.body.email).toLowerCase()} successfully.`, otpData);
            response.responseHandlerWithMessage(res, 200, `Otp has been sent to your email ${(req.body.email).toLowerCase()} successfully.`);
            let sms = `Please do not share with anyone.`
            let subject = `Save Eat`
            SendMail.sendSignupOtp((req.body.email).toLowerCase(), subject, otp, sms, (error10, result10) => {
                response.log("Email sent")
            })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Verify Otp===========================================//

    verifyOtp: async (req, res) => {

        try {
            response.log("Request for verify otp is============>", req.body);
            let otpQuery = { $and: [{ email: (req.body.email).toLowerCase() }, { otp: req.body.otp }] }
            let checkOtp = await Otp.findOne(otpQuery)
            if (checkOtp) {
                await Otp.findByIdAndRemove({ _id: checkOtp._id })
                response.log("Otp verified successfully");
                return response.responseHandlerWithMessage(res, 200, `Otp verified successfully`);
            }
            if (!checkOtp) {
                response.log("Invalid Otp");
                return response.responseHandlerWithMessage(res, 501, "Invalid Otp");
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Verify email otp=====================================//

    verifyEmailOtp: async (req, res) => {

        try {
            response.log("Request for verify email otp is============>", req.body);
            let otpQuery = { $and: [{ email: (req.body.email).toLowerCase() }, { otp: req.body.otp }] }
            let checkOtp = await Otp.findOne(otpQuery)
            if (checkOtp) {
                await Otp.findByIdAndRemove({ _id: checkOtp._id })
                await Brand.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { email: req.body.email } }, { new: true })
                response.log("Email updated successfully");
                return response.responseHandlerWithMessage(res, 200, `Email updated successfully`);
            }
            if (!checkOtp) {
                response.log("Invalid Otp");
                return response.responseHandlerWithMessage(res, 501, "Invalid Otp");
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Verify mobile otp===================================//

    verifyMobileOtp: async (req, res) => {

        try {
            response.log("Request for verify mobile otp is============>", req.body);
            let otpQuery = { $and: [{ mobile: req.body.mobile }, { otp: req.body.otp }] }
            let checkOtp = await Otp.findOne(otpQuery)
            if (checkOtp) {
                await Otp.findByIdAndRemove({ _id: checkOtp._id })
                await Brand.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { mobile: req.body.mobile } }, { new: true })
                response.log("Mobile updated successfully");
                return response.responseHandlerWithMessage(res, 200, `Mobile updated successfully`);
            }
            if (!checkOtp) {
                response.log("Invalid Otp");
                return response.responseHandlerWithMessage(res, 501, "Invalid Otp");
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Check Email=========================================//

    checkEmail: async (req, res) => {

        try {
            response.log("Request for check email is============>", req.body);
            let checkEmail = await Brand.findOne({ email: (req.body.email).toLowerCase(), userType: 'Brand' })
            if (checkEmail) {
                response.log("Email is already exist");
                return response.responseHandlerWithMessage(res, 409, "Email is already exist");
            }
            let otp = Math.floor(100000 + Math.random() * 900000)
            let checkOtp = await Otp.findOne({ email: (req.body.email).toLowerCase() })
            response.log("Otp is=========>", otp)
            if (checkOtp) {
                await Otp.findByIdAndRemove({ _id: checkOtp._id })
            }
            let otpObj = new Otp({
                email: (req.body.email).toLowerCase(),
                otp: otp
            })
            let otpData = otpObj.save()
            response.log(`Otp has been sent to your email ${(req.body.email).toLowerCase()} successfully.`, otpData);
            response.responseHandlerWithMessage(res, 200, `Otp has been sent to your email ${(req.body.email).toLowerCase()} successfully.`);
            let sms = `Please do not share with anyone.`
            let subject = `Save Eat`
            SendMail.sendSignupOtp((req.body.email).toLowerCase(), subject, otp, sms, (error10, result10) => {
                response.log("Email sent")
            })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Check mobile========================================//

    checkMobile: async (req, res) => {

        try {
            response.log("Request for check mobile is============>", req.body);
            let checkMobile = await Brand.findOne({ mobileNumber: req.body.mobileNumber, userType: 'Brand' })
            if (checkMobile) {
                response.log("Mobile number is already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number is already exist");
            }
            let otp = Math.floor(100000 + Math.random() * 900000)
            let checkOtp = await Otp.findOne({ mobileNumber: req.body.mobileNumber })
            response.log("Otp is=========>", otp)
            if (checkOtp) {
                await Otp.findByIdAndRemove({ _id: checkOtp._id })
            }
            let otpObj = new Otp({
                mobileNumber: req.body.mobileNumber,
                otp: otp
            })
            // var io = require('socket.io-client');
            // var socket = io.connect('https://saveeat.in:3035', { reconnect: true });
            // socket.on('connection', (socket) => {
            //     console.log('Connected!');
            // });
            // let abc={
            //     roomId:'611e0005ce03814f85474461',
            //     data:'abhishek'
            // }
            // socket.emit('sendOrder', abc);
            let templateId = '1307163465267342780'
            let msg = `Dear Customer, ${otp} is your one time password (OTP). Please enter the OTP to proceed. Thank you, Team SaveEat`
            let otpData = await otpObj.save()
            response.log(`Otp has been sent to your mobile ${req.body.mobileNumber} successfully.`, otpData);
            response.responseHandlerWithMessage(res, 200, `Otp has been sent to your mobile ${req.body.mobileNumber} successfully.`);
            // request(`https://api.msg91.com/api/sendhttp.php?mobiles=91${req.body.mobileNumber}&sender=savEat&message=${msg}&authkey=${authKey}&route=4&country=91&DLT_TE_ID=${templateId}`, async (error, resp, body) => {
            //     response.log('body:', body);
            // });
            request(`https://api.msg91.com/api/sendhttp.php?authkey=${authKey}&sender=savEat&mobiles=91${req.user.mobileNumber}&route=4&message=${msg}&DLT_TE_ID=${templateId}`, async (error, resp, body) => {
                response.log('body:', body);
            });
            // let data=await Order.findOne({_id:"617a3f8e4910ed6d7ae80a94"})
            // let checkRestro=await Brand.findOne({_id:"611e0005ce03814f85474461"})
            // let checkUser=await User.findOne({_id:"614337c64a0df22d433a029c"})
            // let rescusedFood=data.rescusedFood
            // let orderNumber=data.orderNumber
            // let businessName=checkRestro.businessName
            // let createdAt=moment(data.createdAt).format('LLLL');
            // let orderDeliveredTime=moment(data.orderDeliveredTime).format('LLLL');
            // let status=data.status
            // let address=checkRestro.address
            // let newOrderData=JSON.stringify(data.orderData)
            // let subTotal=data.subTotal
            // let taxes=data.taxes
            // let saveEatFees=data.saveEatFees
            // let total=data.total
            // let saveAmount=data.saveAmount
            // let subject='Order Invoice'
            // let emailData={
            //     rescusedFood:rescusedFood,
            //     orderNumber:orderNumber,
            //     businessName:businessName,
            //     createdAt:createdAt,
            //     orderDeliveredTime:orderDeliveredTime,
            //     status:status,
            //     address:address,
            //     subTotal:subTotal,
            //     taxes:taxes,
            //     saveEatFees:saveEatFees,
            //     total:total,
            //     saveAmount:saveAmount,

            // }
            // SendMail.orderInvoice((checkUser.email).toLowerCase(), subject,emailData,newOrderData,status,createdAt,address, (error10, result10) => {
            //     response.log("Email sent")
            // })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Brand logout==========================================//

    brandLogout: async (req, res) => {

        try {
            let checkBrand = await Brand.findOne({ "_id": req.body.brandId })
            if (!checkBrand) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let result = await Brand.findByIdAndUpdate({ "_id": req.body.brandId }, { $set: { jwtToken: "", deviceToken: '' } }, { new: true })
            response.log("Logout successfully", result)
            return response.responseHandlerWithMessage(res, 200, "Logout successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Brand login for panel==================================//

    brandLoginForPanel: async (req, res) => {

        try {
            response.log("Request for brand signin is=============>", req.body);
            req.checkBody('password', 'Something went wrong').notEmpty();
            req.checkBody('email', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let query = {
                $and: [
                    {
                        $or: [
                            { "userType": "Brand" },
                            { "userType": "Brand-Admin" }
                        ]
                    },
                    {
                        email: (req.body.email).toLowerCase()
                    }
                ]
            }
            let checkUser = await Brand.findOne(query)
            if (!checkUser) {
                console.log("Invalid Brand Id===>325");
                response.log("Invalid credentials1");
                return response.responseHandlerWithMessage(res, 401, "Invalid credentials");
            }
            if (checkUser.adminVerificationStatus == 'Pending') {
                response.log("You have blocked by administrator")
                return response.responseHandlerWithMessage(res, 423, "Your account verification status is pending. Please wait for admin approval.");
            }
            if (checkUser.adminVerificationStatus == 'Disapprove') {
                response.log("You have blocked by administrator")
                return response.responseHandlerWithMessage(res, 423, "Your account has been disapprove by admin. Please conatct with admin for furture process.");
            }
            if (checkUser.deleteStatus == true) {
                response.log("You have blocked by administrator")
                return response.responseHandlerWithMessage(res, 423, "You have terminated your account. Are you sure you want to re-open your existing account?");
            }
            var passVerify = await bcrypt.compareSync(req.body.password, checkUser.password);
            if (!passVerify) {
                console.log("Invalid Brand Id===>343");
                response.log("Invalid credentials2");
                return response.responseHandlerWithMessage(res, 401, "Invalid credentials");
            }

            if (checkUser.status == 'Inactive') {
                response.log("You have blocked by administrator")
                // return response.responseHandlerWithMessage(res, 423, "Your account have been disabled by administrator due to any suspicious activity");
                return response.responseHandlerWithMessage(res, 423, "Please contact SaveEat to get your account approved");
            }

            if (checkUser.userType == "Brand-Admin") {
                let checkBrand = await Brand.findOne({ _id: checkUser.brandId, userType: 'Brand' })
                if (!checkBrand) {
                    console.log("Invalid Brand Id===>355");
                    response.log("Invalid credentials2");
                    return response.responseHandlerWithMessage(res, 401, "Invalid credentials");
                }
                if (checkBrand.status == 'Inactive') {
                    response.log("You have blocked by administrator")
                    return response.responseHandlerWithMessage(res, 423, "Your account have been disabled by administrator due to any suspicious activity");
                }
            }
            let jwtToken = jwt.sign({ "_id": checkUser._id }, `sUpER@SecReT`);
            let result2 = await Brand.findByIdAndUpdate({ "_id": checkUser._id }, { $set: { "jwtToken": jwtToken, deviceToken: req.body.deviceToken, deviceType: 'Panel' } }, { new: true, lean: true })
            if (result2.userType == "Brand-Admin") {
                let roleData = await Role.findOne({ _id: result2.roleId }).select('modules accessibility roleTitle')
                result2.roleData = roleData
            }
            response.log("You have successfully logged in.", result2)
            delete (result2.password)
            return response.responseHandlerWithData(res, 200, "You have successfully logged in", result2);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Brand detail==========================================//

    getBrandDetails: async (req, res) => {

        try {
            response.log("Request for get brand detail is==============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkUser = await Brand.findOne({ "_id": req.body.brandId }).lean()
            if (!checkUser) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let followersCount = await Favorite.find({ brandId: req.body.brandId }).count()
            checkUser.followersCount = followersCount
            if (checkUser.userType == "Brand-Admin") {
                let roleData = await Role.findOne({ _id: checkUser.roleId }).select('modules accessibility roleTitle')
                checkUser.roleData = roleData
            }
            response.log("Details found successfully", checkUser);
            delete (checkUser.password)
            return response.responseHandlerWithData(res, 200, "Details found successfully", checkUser);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Get brand detail for panel==============================//

    getBrandDetailsForPanel: async (req, res) => {

        try {
            response.log("Request for get brand detail is==============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkUser = await Brand.findOne({ "_id": req.body.brandId }).lean()
            if (!checkUser) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Details found successfully", checkUser);
            delete (checkUser.password)
            return response.responseHandlerWithData(res, 200, "Details found successfully", checkUser);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Brand notification count===============================//

    getBrandNotificationCount: async (req, res) => {

        try {
            response.log("Request for get brand notification count is=============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let query = { $and: [{ brandId: req.body.brandId }, { isSeen: false }] }
            let result = await Notification.find(query).count()
            response.log("Notification count is==========>", result)
            return response.responseHandlerWithData(res, 200, "Notification Count Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Brnad notification settings=============================//

    updateBrandNotificationStatus: async (req, res) => {

        try {
            response.log("Request for update notification setting is============>", req.body);
            req.checkBody('notificationStatus', 'Something went wrong').notEmpty();
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                notificationStatus: req.body.notificationStatus
            }
            let result = await Brand.findByIdAndUpdate({ "_id": req.body.brandId }, { $set: obj }, { new: true })
            if (!result) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Notification settings updated successfully", result);
            return response.responseHandlerWithMessage(res, 200, "Notification settings updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //============================================Update account status==================================//

    updateBrandAccountStatus: async (req, res) => {

        try {
            response.log("Request for update status setting is============>", req.body);
            req.checkBody('status', 'Something went wrong').notEmpty();
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Brand.findOne({ _id: req.body.brandId })
            if (!checkBrand) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            if (checkBrand.adminVerificationStatus == "Pending") {
                response.log("You can not update status utill admin approve your account.");
                return response.responseHandlerWithMessage(res, 501, "You can not update status until admin approve your account.");
            }
            let obj = {
                brandSelfStatus: req.body.status
            }
            let result = await Brand.findByIdAndUpdate({ "_id": req.body.brandId }, { $set: obj }, { new: true })
            if (!result) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Status updated successfully", result);
            return response.responseHandlerWithMessage(res, 200, "Status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // //==========================================update brand service========================================//
    updateBrandServiceStatus: async (req, res) => {

        try {
            response.log("Request for update status setting is============>", req.body);
            req.checkBody('serviceType', 'Something went wrong').notEmpty();
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Brand.findOne({ _id: req.body.brandId })
            if (!checkBrand) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            if (checkBrand.adminVerificationStatus == "Pending") {
                response.log("You can not update status utill admin approve your account.");
                return response.responseHandlerWithMessage(res, 501, "You can not update status until admin approve your account.");
            }
            let obj = {
                serviceType: req.body.serviceType
            }
            let result = await Brand.findByIdAndUpdate({ "_id": req.body.brandId }, { $set: obj }, { new: true })
            if (!result) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Status updated successfully", result);
            return response.responseHandlerWithMessage(res, 200, "Status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Update brand language==================================//

    updateBrandLanguage: async (req, res) => {

        try {
            response.log("Request for language notification setting is============>", req.body);
            req.checkBody('language', 'Something went wrong').notEmpty();
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                language: req.body.language
            }
            let result = await Brand.findByIdAndUpdate({ "_id": req.body.brandId }, { $set: obj }, { new: true })
            if (!result) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Language updated successfully", result);
            return response.responseHandlerWithMessage(res, 200, "Language updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Brand notification list==================================//

    brandNotificationList: async (req, res) => {

        try {
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let result = await Notification.find({ brandId: req.body.brandId }).sort({ createdAt: -1 }).limit(30)
            response.log("Notification list found successfully", result);
            response.responseHandlerWithData(res, 200, "Notification List Found Successfully", result);
            let searchQuery = { $and: [{ brandId: req.body.brandId }, { isSeen: false }] }
            await Notification.updateMany(searchQuery, { $set: { isSeen: true } })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Delete notification============================//

    deleteBrandNotification: async (req, res) => {

        try {
            response.log("Request for delete notification is=============>", req.body);
            req.checkBody('notificationId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let deleteNoti = await Notification.findByIdAndRemove({ _id: req.body.notificationId })
            if (!deleteNoti) {
                response.log("Invalid notification Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Notification deleted successfully", deleteNoti)
            return response.responseHandlerWithMessage(res, 200, `Notification deleted successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Clear notification================================//

    clearBrandNotification: async (req, res) => {

        try {
            response.log("Request for clear notification is=============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            await Notification.deleteMany({ brandId: req.body.brandId })
            response.log("Notification deleted successfully")
            return response.responseHandlerWithMessage(res, 200, `Notification(s) deleted successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Brand forgot password==============================//

    checkEmailForForgotBrand: async (req, res) => {

        try {
            response.log("Request for forgot password===========>", req.body);
            req.checkBody('email', 'Your email address is invalid. Please enter a valid address.').isEmail().notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            req.body.email = req.body.email.toLowerCase()
            let checkEmail = await Brand.findOne({ email: req.body.email })
            if (!checkEmail) {
                response.log("Don't have any account with this email.")
                return response.responseHandlerWithMessage(res, 500, "Don't have any account with this email.");
            }
            let otp = Math.floor(100000 + Math.random() * 900000)
            let checkOtp = await Otp.findOne({ email: (req.body.email).toLowerCase() })
            if (checkOtp) {
                await Otp.findByIdAndRemove({ _id: checkOtp._id })
            }
            let otpObj = new Otp({
                email: (req.body.email).toLowerCase(),
                otp: otp
            })
            otpObj.save()
            response.log(`Otp has been sent to your email ${(req.body.email).toLowerCase()} successfully.`, checkEmail._id);
            response.responseHandlerWithData(res, 200, `Otp has been sent to your email ${(req.body.email).toLowerCase()} successfully.`, checkEmail._id);
            let sms = `Please do not share with anyone.`
            let subject = `Save Eat`
            SendMail.sendForgotOtp1((req.body.email).toLowerCase(), subject, otp, sms, (error10, result10) => {
                response.log("Email sent")
            })
        } catch (error) {
            response.log("Error is============>", error)
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Brand reset password================================//

    brandResetPassword: async (req, res) => {

        try {
            req.checkBody('password', 'Something went wrong.').notEmpty();
            req.checkBody('brandId', 'Something went wrong.').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let searchQuery = { $and: [{ _id: req.body.brandId }, { emailOtp: req.body.otp }] }
            let checkBrand = await Brand.findOne(searchQuery)
            if (!checkBrand) {
                response.log("Link has been expired")
                return response.responseHandlerWithMessage(res, 500, 'Link has been expired');
            }
            req.body.password = bcrypt.hashSync(req.body.password, 10)
            let result = await Brand.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { password: req.body.password } }, { new: true })
            response.log("Password reset successfully", result)
            return response.responseHandlerWithMessage(res, 200, 'Password reset successfully');
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Get branch detail=====================================//

    getStoreDetails: async (req, res) => {

        try {
            let checkUser = await Brand.findOne({ "_id": req.body.storeId }).lean()
            if (!checkUser) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Details found successfully", checkUser);
            delete (checkUser.password)
            return response.responseHandlerWithData(res, 200, "Details found successfully", checkUser);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Change password======================================//

    brandChangePassword: async (req, res) => {

        try {
            req.checkBody('oldPassword', 'Something went wrong').notEmpty();
            req.checkBody('newPassword', 'Something went wrong').notEmpty();
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Brand.findOne({ _id: req.body.brandId })
            if (!checkBrand) {
                response.log("Something went wrong")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let passVerify = await bcrypt.compareSync(req.body.oldPassword, checkBrand.password);
            response.log("Password verification status is===========>", passVerify);
            if (!passVerify) {
                response.log("Old password is not correct");
                return response.responseHandlerWithMessage(res, 400, "Old password is incorrect.");
            }
            req.body.newPassword = bcrypt.hashSync(req.body.newPassword, salt);
            let userData = await Brand.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { "password": req.body.newPassword } }, { new: true })
            response.log("Password changed successfully", userData);
            return response.responseHandlerWithMessage(res, 200, "Password has been changed successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }

    },

    //===========================================User Signup===============================================//

    brandSignup: async (req, res) => {

        try {
            response.log("Request for user signup is=============>", req.body)
            req.checkBody('password', 'Something went wrong').notEmpty();
            req.checkBody('businessName', 'Something went wrong').notEmpty();
            req.checkBody('multipleStore', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('businessType', 'Something went wrong').notEmpty();
            // req.checkBody('gstinNumber', 'Something went wrong').notEmpty();
            req.checkBody('pan', 'Something went wrong').notEmpty();
            req.checkBody('fssaiNumber', 'Something went wrong').notEmpty();
            req.checkBody('email', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkEmail = await Brand.findOne({ email: (req.body.email).toLowerCase(), userType: 'Brand' })
            if (checkEmail) {
                response.log("Email is already exist");
                return response.responseHandlerWithMessage(res, 409, "Email is already exist");
            }
            let empNumber = ''
            let checkAdmin = await Admin.findOne({ "userType": "Admin" })
            let newNumber = Number(checkAdmin.brandNumber) + 1
            empNumber = `RS${newNumber}`
            req.body.password = await bcrypt.hashSync(req.body.password, salt);
            let foodTypeArray = []
            if (req.body.foodType == "Veg") {
                foodTypeArray = ['Veg']
            }
            if (req.body.foodType == "Non-Veg") {
                foodTypeArray = ['Non-Veg']
            }
            if (req.body.foodType == "Both") {
                foodTypeArray = ['Veg', 'Non-Veg']
            }
            let signupObj = new Brand({
                email: (req.body.email).toLowerCase(),
                businessName: req.body.businessName,
                empNumber: empNumber,
                password: req.body.password,
                multipleStore: req.body.multipleStore,
                street: req.body.street,
                locality: req.body.locality,
                webiteLink: req.body.webiteLink,
                gstinNumber: req.body.gstinNumber,
                fssaiNumber: req.body.fssaiNumber,
                deviceType: req.body.deviceType,
                deviceToken: req.body.deviceToken,
                businessType: req.body.businessType,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                address: req.body.address,
                mobileNumber: req.body.mobileNumber,
                pan: req.body.pan,
                foodType: req.body.foodType,
                userType: 'Brand',
                foodTypeArray: foodTypeArray,
                adminVerificationStatus: "Approve",
                location: { "type": "Point", "coordinates": [Number(req.body.longitude), Number(req.body.latitude)] }
            })
            let signupData = await signupObj.save()
            let notiObj = new Notification({
                brandId: signupData._id,
                notiTitle: `${req.body.firstName}! You are welcome.`,
                notiMessage: `Hi! Thanks for signing up. You are welcome.`,
                notiType: 'welcome',
                type: 'Brand'
            })
            await notiObj.save()
            response.log("You have successfully signed up", signupData)
            response.responseHandlerWithData(res, 200, `You have successfully signed up`, signupData);
            await Admin.findByIdAndUpdate({ _id: checkAdmin._id }, { $set: { brandNumber: newNumber } }, { new: true })
            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            for (let i = 0; i < days.length; i++) {
                let obj = new Openinghours({
                    brandId: signupData._id,
                    saleWindowOpen: "08:00",
                    saleWindowClose: "23:00",
                    pickupWindowOpen: "08:00",
                    pickupWindowClose: "23:00",
                    timezone: req.body.timezone,
                    day: days[i]
                })
                await obj.save()
            }

            //zoho
            let dataString = {
                "data": [
                    {
                        "Brand_Store_ID": empNumber,
                        "Bank_Name": "",
                        "Bank_Account_Number": "",
                        "Bank_Address": "",
                        "IFSC_Code": "",
                        "Bank_Name1": "",
                        "Eatery_Code": empNumber,
                        "Brand_Name": req.body.businessName,
                        // "Eatery_City": 1,
                        "Eatery_Street":req.body.street,
                        "Followers": 0,
                        "Food_Type": req.body.foodType,
                        "FSSAI": parseInt(req.body.fssaiNumber),
                        "Full_Price_Commission": 0,
                        "GSTIN": req.body.gstinNumber,
                        "Locality": req.body.locality,
                        "Login_Email":(req.body.email).toLowerCase(),
                        "PAN": req.body.pan,
                        "Panel_Created_On": date.format(signupData.createdAt, "YYYY-MM-DD"),
                        "Street": req.body.street,
                        "Account_Name":req.body.businessName,
                        "Surplus_Commission": 0,
                    }
                ]
            }
            let result = await ZOHO.findOne()
            var headers = {
                'Authorization': `Zoho-oauthtoken ${result.access_token}`
            };
            var options = {
                url: `https://www.zohoapis.in/crm/v2/Accounts`,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dataString)
            };

            request(options,async  function (error, res1, body) {
                if (!error) {
                    var obj = JSON.parse(body)
                    let data = {...obj};
                    response.log('===========================================Saved================================================>',data.data[0].details.id);
                    await Brand.findByIdAndUpdate({ _id: signupData._id }, { $set: { zohoId: data.data[0].details.id} }, { new: true })
                }else{
                    response.log('===========================================Not Saved================================================',error);
                }
            });
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Update brand========================================//

    updateBrand: async (req, res) => {

        try {
            response.log("Request for update brand is=============>", req.body)
            req.checkBody('originalName', 'Something went wrong').notEmpty();
            req.checkBody('originalEmail', 'Something went wrong').notEmpty();
            req.checkBody('originalMobileNumber', 'Something went wrong').notEmpty();
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            let checkEmail = await Brand.findOne({ originalEmail: (req.body.originalEmail).toLowerCase(), userType: 'Brand', _id: { $ne: req.body.brandId } })
            if (checkEmail) {
                response.log("Email is already exist");
                return response.responseHandlerWithMessage(res, 409, "Email is already exist");
            }
            let checkBrand = await Brand.findOne({ _id: req.body.brandId })
            if (!checkBrand) {
                response.log("Something went wrong")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let checkMobile = await Brand.findOne({ originalMobileNumber: req.body.originalMobileNumber, userType: 'Brand', _id: { $ne: req.body.brandId } })
            if (checkMobile) {
                response.log("Mobile number already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number already exist");
            }
            let obj = {
                originalEmail: (req.body.originalEmail).toLowerCase(),
                originalName: req.body.originalName,
                originalMobileNumber: req.body.originalMobileNumber
            }
            let updateData = await Brand.findByIdAndUpdate({ _id: req.body.brandId }, { $set: obj }, { new: true, lean: true })
            response.log("Profile updated successfully", updateData)
            return response.responseHandlerWithMessage(res, 200, `Profile updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Update brand logo=====================================//

    updateBrandLogoImage: async (req, res) => {

        try {
            response.log("Request for update image is=============>", req.body)
            response.log("Request for update image  is=============>", req.files)
            req.checkBody('type', 'Something went wrong').notEmpty();
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Brand.findOne({ _id: req.body.brandId })
            if (!checkBrand) {
                response.log("Something went wrong");
                return response.responseHandlerWithMessage(res, 409, "Something went wrong");
            }
            let logo = checkBrand.logo
            if (req.body.type == "Logo") {
                if (req.body.logo) {
                    logo = await Fileupload.uploadBase(req.body.logo, "user/");
                    response.log("image", logo)
                }
            }

            let image = checkBrand.image
            if (req.body.type == "Image") {
                if (req.body.image) {
                    image = await Fileupload.uploadBase(req.body.image, "user/");
                    response.log("image", image)
                }
            }
            let obj = {
                image: image,
                logo: logo,
            }
            await Brand.findByIdAndUpdate({ _id: req.body.brandId }, { $set: obj }, { new: true })
            response.log("Image updated successfully")
            return response.responseHandlerWithData(res, 200, `Image updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    //==============================================Update store logo====================================//

    updateStoreLogoImage: async (req, res) => {

        try {
            response.log("Request for update image is=============>", req.body)
            response.log("Request for update image  is=============>", req.files)
            req.checkBody('type', 'Something went wrong').notEmpty();
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkStore = await Brand.findOne({ _id: req.body.storeId })
            if (!checkStore) {
                response.log("Something went wrong");
                return response.responseHandlerWithMessage(res, 409, "Something went wrong");
            }
            let logo = checkStore.logo
            if (req.body.type == "Logo") {
                if (req.files.logo) {
                    logo = await Fileupload.upload(req.files.logo, "user/");
                    response.log("image", logo)
                }
            }

            let image = checkStore.image
            if (req.body.type == "Image") {
                if (req.files.image) {
                    image = await Fileupload.upload(req.files.image, "user/");
                    response.log("image", image)
                }
            }
            let obj = {
                image: image,
                logo: logo,
            }
            await Brand.findByIdAndUpdate({ _id: req.body.storeId }, { $set: obj }, { new: true })
            response.log("Image updated successfully")
            return response.responseHandlerWithData(res, 200, `Image updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    //=============================================Update brand profile==================================//

    updateBrandProfile: async (req, res) => {

        try {
            response.log("Request for update brand profile is=============>", req.body)
            req.checkBody('businessName', 'Something went wrong').notEmpty();
            req.checkBody('businessType', 'Something went wrong').notEmpty();
            req.checkBody('gstinNumber', 'Something went wrong').notEmpty();
            req.checkBody('fssaiNumber', 'Something went wrong').notEmpty();
            req.checkBody('mobileNumber', 'Something went wrong').notEmpty();
            req.checkBody('foodType', 'Something went wrong').notEmpty();
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('email', 'Something went wrong').notEmpty();
            req.checkBody('address', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkEmail = await Brand.findOne({ email: (req.body.email).toLowerCase(), userType: 'Brand', _id: { $ne: req.body.brandId } })
            if (checkEmail) {
                response.log("Email is already exist");
                return response.responseHandlerWithMessage(res, 409, "Email is already exist");
            }
            let checkMobile = await Brand.findOne({ mobileNumber: req.body.mobileNumber, userType: 'Brand', _id: { $ne: req.body.brandId } })
            if (checkMobile) {
                response.log("Mobile number already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number already exist");
            }
            let foodTypeArray = []
            if (req.body.foodType == "Veg") {
                foodTypeArray = ['Veg']
            }
            if (req.body.foodType == "Non-Veg") {
                foodTypeArray = ['Non-Veg']
            }
            if (req.body.foodType == "Both") {
                foodTypeArray = ['Veg', 'Non-Veg']
            }
            let brandObj = {
                email: (req.body.email).toLowerCase(),
                businessName: req.body.businessName,
                street: req.body.street,
                locality: req.body.locality,
                webiteLink: req.body.webiteLink,
                gstinNumber: req.body.gstinNumber,
                fssaiNumber: req.body.fssaiNumber,
                businessType: req.body.businessType,
                foodType: req.body.foodType,
                mobileNumber: req.body.mobileNumber,
                foodTypeArray: foodTypeArray,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                address: req.body.address,
                location: { "type": "Point", "coordinates": [Number(req.body.longitude), Number(req.body.latitude)] }
            }
            let updateData = await Brand.findByIdAndUpdate({ _id: req.body.brandId }, { $set: brandObj }, { new: true })
            response.log("Profile updated successfully", updateData)
            //zoho
            response.log('===========================================ZOHO Works================================================');
            let dataString = {
                "data": [
                    {
                        "Eatery_Street":req.body.street,
                        "Food_Type": req.body.foodType,
                        "FSSAI": parseInt(req.body.fssaiNumber),
                        "Full_Price_Commission": 0,
                        "GSTIN": req.body.gstinNumber,
                        "Locality": req.body.locality,
                        "PAN": req.body.pan,
                        "Street": req.body.street
                    }
                ]
            }
            let result = await ZOHO.findOne()
            var headers = {
                'Authorization': `Zoho-oauthtoken ${result.access_token}`
            };
            var options = {
                url: `https://www.zohoapis.in/crm/v2/Accounts/${checkEmail.zohoId}`,
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(dataString)
            };
            request(options,async  function (error, res1, body) {
                if (!error) {
                    // let data = JSON.stringify(data)
                    var obj = JSON.parse(body)
                    let data = {...obj};
                    response.log('===========================================Saved================================================>',data);
                }else{
                    response.log('===========================================Not Saved================================================',error);
                }
            });
            return response.responseHandlerWithMessage(res, 200, `Profile updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Add holiday=========================================//

    addHoliday: async (req, res) => {

        try {
            response.log("Request for add holiday is==============>", req.body);
            req.checkBody('type', 'Something went wrong').notEmpty();
            req.checkBody('startDate', 'Something went wrong').notEmpty();
            req.checkBody('endDate', 'Something went wrong').notEmpty();
            req.checkBody('saleWindowOpen', 'Something went wrong').notEmpty();
            req.checkBody('saleWindowClose', 'Something went wrong').notEmpty();
            req.checkBody('pickupWindowOpen', 'Something went wrong').notEmpty();
            req.checkBody('pickupWindowClose', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            req.checkBody('title', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let convertedStartDate = moment(`${req.body.startDate} ${req.body.saleWindowOpen}`)
            let convertedEndDate = moment(`${req.body.endDate} ${req.body.saleWindowClose}`)
            if (req.body.type == "Store") {
                let checkStore = await Brand.findOne({ _id: req.body.storeId })
                if (!checkStore) {
                    response.log("Invalid store Id")
                    return response.responseHandlerWithMessage(res, 503, "Something went wrong");
                }
                let obj = new Holiday({
                    brandId: req.body.storeId,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    saleWindowOpen: req.body.saleWindowOpen,
                    saleWindowClose: req.body.saleWindowClose,
                    pickupWindowOpen: req.body.pickupWindowOpen,
                    pickupWindowClose: req.body.pickupWindowClose,
                    title: req.body.title,
                    timezone: req.body.timezone,
                    status: req.body.status,
                    newSDate: req.body.newSDate,
                    newEDate: req.body.newEDate,
                    convertedStartDate: convertedStartDate,
                    convertedEndDate: convertedEndDate
                })
                await obj.save()
                response.log("Holiday added successfully")
                return response.responseHandlerWithMessage(res, 200, `Holiday added successfully`);
            }
            if (req.body.type == "Brand") {
                let obj = new Holiday({
                    brandId: req.body.brandId,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    saleWindowOpen: req.body.saleWindowOpen,
                    saleWindowClose: req.body.saleWindowClose,
                    pickupWindowOpen: req.body.pickupWindowOpen,
                    pickupWindowClose: req.body.pickupWindowClose,
                    title: req.body.title,
                    timezone: req.body.timezone,
                    status: req.body.status,
                    newSDate: req.body.newSDate,
                    newEDate: req.body.newEDate,
                    convertedStartDate: convertedStartDate,
                    convertedEndDate: convertedEndDate
                })
                await obj.save()
                response.log("Holiday added successfully")
                return response.responseHandlerWithMessage(res, 200, `Holiday added successfully`);
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================================Update holiday===================================//

    updateHoliday: async (req, res) => {

        try {
            response.log("Request for update holiday is==============>", req.body);
            req.checkBody('startDate', 'Something went wrong').notEmpty();
            req.checkBody('endDate', 'Something went wrong').notEmpty();
            req.checkBody('saleWindowOpen', 'Something went wrong').notEmpty();
            req.checkBody('saleWindowClose', 'Something went wrong').notEmpty();
            req.checkBody('pickupWindowOpen', 'Something went wrong').notEmpty();
            req.checkBody('pickupWindowClose', 'Something went wrong').notEmpty();
            req.checkBody('holidayId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let convertedStartDate = moment(`${req.body.startDate} ${req.body.saleWindowOpen}`)
            let convertedEndDate = moment(`${req.body.endDate} ${req.body.saleWindowClose}`)
            let checkHoliday = await Holiday.findOne({ _id: req.body.holidayId })
            if (!checkHoliday) {
                response.log("Invalid holiday Id")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let obj = {
                endDate: req.body.endDate,
                startDate: req.body.startDate,
                saleWindowOpen: req.body.saleWindowOpen,
                saleWindowClose: req.body.saleWindowClose,
                pickupWindowOpen: req.body.pickupWindowOpen,
                pickupWindowClose: req.body.pickupWindowClose,
                newSDate: req.body.newSDate,
                newEDate: req.body.newEDate,
                convertedStartDate: convertedStartDate,
                convertedEndDate: convertedEndDate
            }
            await Holiday.findByIdAndUpdate({ _id: req.body.holidayId }, { $set: obj }, { new: true })
            response.log("Holiday updated successfully")
            return response.responseHandlerWithMessage(res, 200, `Holiday updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Update holiday title=============================//

    updateHolidayTitle: async (req, res) => {

        try {
            response.log("Request for update holiday is==============>", req.body);
            req.checkBody('holidayId', 'Something went wrong').notEmpty();
            req.checkBody('title', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                title: req.body.title,
            }
            await Holiday.findByIdAndUpdate({ _id: req.body.holidayId }, { $set: obj }, { new: true })
            response.log("Holiday updated successfully")
            return response.responseHandlerWithMessage(res, 200, `Holiday updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Holiday list=======================================//

    holidayList: async (req, res) => {

        try {
            response.log("Request for get holiday list is==============>", req.body);
            req.checkBody('type', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            if (req.body.type == "Brand") {
                let result = await Holiday.find({ brandId: req.body.brandId })
                response.log("Holiday List Found", result)
                return response.responseHandlerWithData(res, 200, "Holiday List Found", result);
            }
            if (req.body.type == "Store") {
                let result = await Holiday.find({ brandId: req.body.storeId })
                response.log("Holiday List Found", result)
                return response.responseHandlerWithData(res, 200, "Holiday List Found", result);
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================================Update holiday status============================//

    updateHolidayStatus: async (req, res) => {

        try {
            response.log("Request for update holiday status us============>", req.body);
            req.checkBody('holidayId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkHoliday = await Holiday.findOne({ _id: req.body.holidayId })
            if (!checkHoliday) {
                response.log("Invalid holiday Id")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let obj = {
                status: req.body.status
            }
            await Holiday.findByIdAndUpdate({ _id: req.body.holidayId }, { $set: obj }, { new: true })
            response.log("Status updated successfully")
            return response.responseHandlerWithMessage(res, 200, `Status updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Update opening hours============================//

    updateOpeningHours: async (req, res) => {

        try {
            response.log("Request for update opening hours is==============>", req.body);
            req.checkBody('saleWindowOpen', 'Something went wrong').notEmpty();
            req.checkBody('saleWindowClose', 'Something went wrong').notEmpty();
            req.checkBody('pickupWindowOpen', 'Something went wrong').notEmpty();
            req.checkBody('pickupWindowClose', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            req.checkBody('hoursId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkHours = await Openinghours.findOne({ _id: req.body.hoursId })
            if (!checkHours) {
                response.log("Invalid hours Id")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let obj = {
                saleWindowOpen: req.body.saleWindowOpen,
                saleWindowClose: req.body.saleWindowClose,
                pickupWindowOpen: req.body.pickupWindowOpen,
                pickupWindowClose: req.body.pickupWindowClose,
                status: req.body.status
            }
            await Openinghours.findByIdAndUpdate({ _id: req.body.hoursId }, { $set: obj }, { new: true })
            response.log("Time updated successfully")
            return response.responseHandlerWithMessage(res, 200, `Time updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Hours list=======================================//

    hoursList: async (req, res) => {

        try {
            response.log("Request for get hours list is==============>", req.body);
            req.checkBody('type', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            if (req.body.type == "Brand") {
                let result = await Openinghours.find({ brandId: req.body.brandId })
                response.log("Hours List Found", result)
                return response.responseHandlerWithData(res, 200, "Hours List Found", result);
            }
            if (req.body.type == "Store") {
                let result = await Openinghours.find({ brandId: req.body.storeId })
                response.log("Hours List Found", result)
                return response.responseHandlerWithData(res, 200, "Hours List Found", result);
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Hours by day======================================//

    hoursByDay: async (req, res) => {

        try {
            response.log("Request for get hours list is==============>", req.body);
            req.checkBody('day', 'Something went wrong').notEmpty();
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let result = await Openinghours.findOne({ brandId: req.body.brandId, day: req.body.day })
            response.log("Hours List Found", result)
            return response.responseHandlerWithData(res, 200, "Hours List Found", result);

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Update hours status==============================//

    updateHoursStatus: async (req, res) => {

        try {
            response.log("Request for update hours status us============>", req.body);
            req.checkBody('hoursId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkHours = await Openinghours.findOne({ _id: req.body.hoursId })
            if (!checkHours) {
                response.log("Invalid hours Id")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let obj = {
                status: req.body.status
            }
            await Openinghours.findByIdAndUpdate({ _id: req.body.hoursId }, { $set: obj }, { new: true })
            response.log("Status updated successfully")
            return response.responseHandlerWithMessage(res, 200, `Status updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Add store========================================//

    addStore: async (req, res) => {

        try {
            response.log("Request for add store is=============>", req.body)
            req.checkBody('businessName', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('businessType', 'Something went wrong').notEmpty();
            req.checkBody('gstinNumber', 'Something went wrong').notEmpty();
            req.checkBody('fssaiNumber', 'Something went wrong').notEmpty();
            req.checkBody('email', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkEmail = await Brand.findOne({ email: (req.body.email).toLowerCase(), userType: 'Store' })
            if (checkEmail) {
                response.log("Email is already exist");
                return response.responseHandlerWithMessage(res, 409, "Email is already exist");
            }
            let checkMobile = await Brand.findOne({ mobileNumber: req.body.mobileNumber, userType: 'Store' })
            if (checkMobile) {
                response.log("Mobile number is already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number is already exist");
            }
            let empNumber = ''
            let checkAdmin = await Admin.findOne({ "userType": "Admin" })
            let newNumber = Number(checkAdmin.storeNumber) + 1
            empNumber = `SD${newNumber}`
            let foodTypeArray = []
            if (req.body.foodType == "Veg") {
                foodTypeArray = ['Veg']
            }
            if (req.body.foodType == "Non-Veg") {
                foodTypeArray = ['Non-Veg']
            }
            if (req.body.foodType == "Both") {
                foodTypeArray = ['Veg', 'Non-Veg']
            }
            let signupObj = new Brand({
                email: (req.body.email).toLowerCase(),
                businessName: req.body.businessName,
                mobileNumber: req.body.mobileNumber,
                street: req.body.street,
                locality: req.body.locality,
                webiteLink: req.body.webiteLink,
                gstinNumber: req.body.gstinNumber,
                fssaiNumber: req.body.fssaiNumber,
                businessType: req.body.businessType,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                address: req.body.address,
                foodType: req.body.foodType,
                userType: 'Store',
                brandId: req.body.brandId,
                foodTypeArray: foodTypeArray,
                empNumber: empNumber,
                location: { "type": "Point", "coordinates": [Number(req.body.longitude), Number(req.body.latitude)] }
            })
            let signupData = await signupObj.save()
            response.log("You have successfully signed up", signupData)
            response.responseHandlerWithData(res, 200, `Store created successfully`, signupData._id);
            await Admin.findByIdAndUpdate({ _id: checkAdmin._id }, { $set: { storeNumber: newNumber } }, { new: true })
            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            for (let i = 0; i < days.length; i++) {
                let obj = new Openinghours({
                    brandId: signupData._id,
                    saleWindowOpen: "08:00",
                    saleWindowClose: "23:00",
                    pickupWindowOpen: "08:00",
                    pickupWindowClose: "23:00",
                    timezone: req.body.timezone,
                    day: days[i]
                })
                await obj.save()
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Update store====================================//

    updateStore: async (req, res) => {

        try {
            response.log("Request for update store is=============>", req.body)
            req.checkBody('businessName', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('businessType', 'Something went wrong').notEmpty();
            req.checkBody('gstinNumber', 'Something went wrong').notEmpty();
            req.checkBody('fssaiNumber', 'Something went wrong').notEmpty();
            req.checkBody('email', 'Something went wrong').notEmpty();
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkEmail = await Brand.findOne({ email: (req.body.email).toLowerCase(), userType: 'Store', _id: { $ne: req.body.storeId } })
            if (checkEmail) {
                response.log("Email is already exist");
                return response.responseHandlerWithMessage(res, 409, "Email is already exist");
            }
            let checkMobile = await Brand.findOne({ mobileNumber: req.body.mobileNumber, userType: 'Store', _id: { $ne: req.body.storeId } })
            if (checkMobile) {
                response.log("Mobile number is already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number is already exist");
            }
            let foodTypeArray = []
            if (req.body.foodType == "Veg") {
                foodTypeArray = ['Veg']
            }
            if (req.body.foodType == "Non-Veg") {
                foodTypeArray = ['Non-Veg']
            }
            if (req.body.foodType == "Both") {
                foodTypeArray = ['Veg', 'Non-Veg']
            }
            let storeObj = {
                email: (req.body.email).toLowerCase(),
                businessName: req.body.businessName,
                mobileNumber: req.body.mobileNumber,
                street: req.body.street,
                locality: req.body.locality,
                webiteLink: req.body.webiteLink,
                gstinNumber: req.body.gstinNumber,
                fssaiNumber: req.body.fssaiNumber,
                businessType: req.body.businessType,
                foodType: req.body.foodType,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                address: req.body.address,
                foodTypeArray: foodTypeArray,
                location: { "type": "Point", "coordinates": [Number(req.body.longitude), Number(req.body.latitude)] }
            }
            let storeData = await Brand.findByIdAndUpdate({ _id: req.body.storeId }, { $set: storeObj }, { new: true })
            response.log("Detail update successfully", storeData)
            response.responseHandlerWithMessage(res, 200, `Detail updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Delete store=====================================//

    deleteStore: async (req, res) => {

        try {
            response.log("Request for holiday delete is============>", req.body);
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                deleteStatus: true
            }
            let deleteStore = await Brand.findByIdAndUpdate({ _id: req.body.storeId }, { $set: obj }, { new: true })
            if (!deleteStore) {
                response.log("Invalid store Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Store deleted successfully", deleteStore)

            let data = await Brand.deleteMany({ brandId: ObjectId(req.body.storeId) })
            if (!data) {
                response.log("Invalid sub-admin Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }

            return response.responseHandlerWithMessage(res, 200, "Store deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Update store status==============================//

    updateStoreStatus: async (req, res) => {

        try {
            response.log("Request for update holiday status us============>", req.body);
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                status: req.body.status
            }
            let updateData = await Brand.findOneAndUpdate({ _id: req.body.storeId }, { $set: obj }, { new: true })

            // let updateData = await Brand.findByIdAndUpdate({ _id: req.body.storeId }, { $set: obj }, { new: true })
            if (!updateData) {
                response.log("Invalid status Id")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            response.log("Status updated successfully")
            return response.responseHandlerWithMessage(res, 200, `Status updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================================Delete branch==================================//

    deleteHoliday: async (req, res) => {

        try {
            response.log("Request for holiday delete is============>", req.body);
            req.checkBody('holidayId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let deleteHolidayData = await Holiday.findByIdAndRemove({ _id: req.body.holidayId })
            if (!deleteHolidayData) {
                response.log("Invalid holiday Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Holiday deleted successfully", deleteHolidayData)
            return response.responseHandlerWithMessage(res, 200, "Holiday deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Social media list================================//

    socialMediaList: async (req, res) => {

        try {
            response.log("Request for get social medial list is==============>", req.body);
            let result = await Socialmedia.find({})
            response.log("Social List Found", result)
            return response.responseHandlerWithData(res, 200, "Social List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Static content====================================//

    getStaticDataList: async (req, res) => {

        try {
            response.log("Request for get static list is==============>", req.body);
            let result = await Staticmodel.find({})
            response.log("Content List Found", result)
            return response.responseHandlerWithData(res, 200, "Content List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================================Get faq========================================//

    getFaqList: async (req, res) => {

        try {
            response.log("Request for get faq list is==============>", req.body);
            let result = await Faq.find({})
            response.log("Faq List Found", result)
            return response.responseHandlerWithData(res, 200, "Faq List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Get static data===================================//

    getStaticDataByType: async (req, res) => {

        try {
            response.log("Request for get static list is==============>", req.body);
            let result = await Staticmodel.findOne({ type: req.body.type })
            response.log("Content List Found", result)
            return response.responseHandlerWithData(res, 200, "Content List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Add payout========================================//

    addPayout: async (req, res) => {

        try {
            response.log("Request for add payout is==========>", req.body);
            req.checkBody('type', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            if (req.body.type == "Brand") {
                let getBrand = await Brand.findOne({_id: req.body.brandId})
                let obj = {
                    bankName: req.body.bankName,
                    accountHolderName: req.body.accountHolderName,
                    accountNumber: req.body.accountNumber,
                    ifscCode: req.body.ifscCode
                }
                let brandData = await Brand.findByIdAndUpdate({ _id: req.body.brandId }, { $set: obj }, { new: true })
                if (!brandData) {
                    response.log("Invalid brand Id");
                    return response.responseHandlerWithMessage(res, 501, "Something went wrong");
                }
                //zoho
                response.log('===========================================ZOHO Works================================================');
                let dataString = {
                    "data": [
                        {
                            "Bank_Name": req.body.accountHolderName,
                            "Bank_Name1": req.body.bankName,
                            "Bank_Account_Number": req.body.accountNumber,
                            "IFSC_Code": req.body.ifscCode
                        }
                    ]
                }
                let result = await ZOHO.findOne()
                var headers = {
                    'Authorization': `Zoho-oauthtoken ${result.access_token}`
                };
                var options = {
                    url: `https://www.zohoapis.in/crm/v2/Accounts/${getBrand.zohoId}`,
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(dataString)
                };
                request(options,async  function (error, res1, body) {
                    if (!error) {
                        // let data = JSON.stringify(data)
                        var obj = JSON.parse(body)
                        let data = {...obj};
                        response.log('===========================================Saved================================================>',body);
                    }else{
                        response.log('===========================================Not Saved================================================',body);
                    }
                });
                response.log("Payout updated successfully", brandData)
                return response.responseHandlerWithMessage(res, 200, "Payout updated successfully");

            }
            if (req.body.type == "Store") {
                let obj = {
                    bankName: req.body.bankName,
                    accountHolderName: req.body.accountHolderName,
                    accountNumber: req.body.accountNumber,
                    ifscCode: req.body.ifscCode
                }
                let storeData = await Brand.findByIdAndUpdate({ _id: req.body.storeId }, { $set: obj }, { new: true })
                if (!storeData) {
                    response.log("Invalid store Id");
                    return response.responseHandlerWithMessage(res, 501, "Something went wrong");
                }
                response.log("Payout updated successfully", storeData)
                return response.responseHandlerWithMessage(res, 200, "Payout updated successfully");

            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Create group=====================================//

    createGroup: async (req, res) => {

        try {
            response.log("Request for create group is=========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('groupName', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Brand.findOne({ _id: req.body.brandId })
            if (!checkBrand) {
                response.log("Invalid brand Id")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let obj = new Group({
                groupName: req.body.groupName,
                brandId: req.body.brandId
            })
            await obj.save()
            response.log("Group created successfully")
            return response.responseHandlerWithMessage(res, 200, "Group created successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //============================================Create group payout=================================//

    createGroupPayout: async (req, res) => {

        try {
            response.log("Request for create group payout is==========>", req.body);
            req.checkBody('groupId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                bankName: req.body.bankName,
                accountHolderName: req.body.accountHolderName,
                accountNumber: req.body.accountNumber,
                ifscCode: req.body.ifscCode
            }
            let groupData = await Group.findByIdAndUpdate({ _id: req.body.groupId }, { $set: obj }, { new: true })
            if (!groupData) {
                response.log("Invalid group Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Payout updated successfully", groupData)
            return response.responseHandlerWithMessage(res, 200, "Payout updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Add store group payout=============================//

    addStoreGroupPayout: async (req, res) => {

        try {
            response.log("Request for create group payout is==========>", req.body);
            req.checkBody('groupId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let storeData = req.body.storeData
            let groupData = await Group.findByIdAndUpdate({ _id: req.body.groupId }, { $set: { storeData: storeData } }, { new: true })
            if (!groupData) {
                response.log("Invalid group Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Payout updated successfully")
            return response.responseHandlerWithMessage(res, 200, "Payout updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Group list========================================//

    getGroupList: async (req, res) => {

        try {
            response.log("Request for get group list is==============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Brand.findOne({ _id: req.body.brandId })
            if (!checkBrand) {
                response.log("Invalid brand Id")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let result = await Group.find({ brandId: req.body.brandId })
            response.log("Group List Found", result)
            return response.responseHandlerWithData(res, 200, "Group List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Get group details================================//

    getGroupDetails: async (req, res) => {

        try {
            response.log("Request for item get is==========>", req.body);
            req.checkBody('groupId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkGroup = await Group.findOne({ "_id": req.body.groupId })
            if (!checkGroup) {
                response.log("Invalid group Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Details found successfully", checkGroup);
            return response.responseHandlerWithData(res, 200, "Details found successfully", checkGroup);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Access list=======================================//

    getAccessList: async (req, res) => {

        try {
            response.log("Request for get access list is==============>", req.body);
            let result = await Access.find({})
            response.log("Access List Found", result)
            return response.responseHandlerWithData(res, 200, "Access List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //============================================Add role===========================================//

    addRole: async (req, res) => {

        try {
            response.log("Request for add role is==========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Brand.findOne({ _id: req.body.brandId })
            if (!checkBrand) {
                response.log("Invalid brand Id")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let obj = new Role({
                roleTitle: req.body.roleTitle,
                description: req.body.description,
                roleNumber: `${new Date().getTime()}`,
                modules: req.body.modules,
                accessibility: req.body.accessibility,
                brandId: req.body.brandId
            })
            await obj.save()
            response.log("Role created successfully")
            return response.responseHandlerWithMessage(res, 200, "Role created successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Delete role=======================================//

    deleteRole: async (req, res) => {

        try {
            response.log("Request for role delete is============>", req.body);
            req.checkBody('roleId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let deleteRole = await Role.findByIdAndRemove({ _id: req.body.roleId })
            if (!deleteRole) {
                response.log("Invalid role Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Role deleted successfully", deleteRole)
            return response.responseHandlerWithMessage(res, 200, "Role deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Update role status==================================//

    updateRoleStatus: async (req, res) => {

        try {
            response.log("Request for role delete is============>", req.body);
            req.checkBody('roleId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                status: req.body.status
            }
            let updateRole = await Role.findByIdAndUpdate({ _id: req.body.roleId }, { $set: obj }, { new: true })
            if (!updateRole) {
                response.log("Invalid role Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Role status updated successfully", updateRole)
            return response.responseHandlerWithMessage(res, 200, "Role status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Get role list=======================================//

    getRoleList: async (req, res) => {

        try {
            response.log("Request for get role list is==============>", req.body);
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let result = await Role.find({ brandId: req.body.brandId }).lean()
            for (let i = 0; i < result.length; i++) {
                let checkStaffBrand = await Brand.find({ roleId: result[i]._id }).count()
                let checkStaffStore = await Brand.find({ roleId: result[i]._id }).count()
                result[i].staffCount = checkStaffBrand + checkStaffStore
            }
            response.log("Role List Found", result)
            return response.responseHandlerWithData(res, 200, "Role List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Get role list for subadmin==========================//

    getRoleListForSubAdmin: async (req, res) => {

        try {
            response.log("Request for get role list is==============>", req.body);
            let result = await Role.find({ brandId: req.body.brandId, status: 'Active' }).lean()
            response.log("Role List Found", result)
            return response.responseHandlerWithData(res, 200, "Role List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //============================================Add sub-admin======================================//

    addSubadmin: async (req, res) => {

        try {
            response.log("Request for add sub-admin is============>", req.body);
            req.checkBody('name', 'Something went wrong').notEmpty();
            req.checkBody('email', 'Something went wrong').notEmpty();
            req.checkBody('mobileNumber', 'Something went wrong').notEmpty();
            req.checkBody('password', 'Something went wrong').notEmpty();
            req.checkBody('type', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            if (req.body.type == "Brand") {
                let checkMobile = await Brand.findOne({ mobileNumber: req.body.mobileNumber, userType: 'Brand-Admin' })
                if (checkMobile) {
                    response.log("Mobile number already exist")
                    return response.responseHandlerWithMessage(res, 503, "Mobile number already exist");
                }
                let checkEmail = await Brand.findOne({ email: (req.body.email).toLowerCase(), userType: 'Brand-Admin' })
                if (checkEmail) {
                    response.log("Email already exist")
                    return response.responseHandlerWithMessage(res, 503, "Email already exist");
                }
                let checkAdmin = await Admin.findOne({ userType: 'Admin' })
                let empNumber = `SUA${checkAdmin.brandAdminNumber}`
                let newNumber = Number(checkAdmin.brandAdminNumber) + 1
                let mypass = req.body.password
                req.body.password = await bcrypt.hashSync(req.body.password, salt);
                let obj = new Brand({
                    brandId: req.body.brandId,
                    name: req.body.name,
                    empId: empNumber,
                    password: req.body.password,
                    email: (req.body.email).toLowerCase(),
                    roleId: req.body.roleId,
                    adminVerificationStatus: 'Approve',
                    mobileNumber: req.body.mobileNumber,
                    latitude: Number(28.99999),
                    longitude: Number(78.9999),
                    userType: 'Brand-Admin',
                    status: 'Active',
                    location: { "type": "Point", "coordinates": [Number(78.9999), Number(28.99999)] }
                })
                let data = await obj.save()
                response.log("Admin created successfully", data)
                response.responseHandlerWithMessage(res, 200, `Admin created successfully`);
                await Admin.findByIdAndUpdate({ _id: checkAdmin._id }, { $set: { brandAdminNumber: newNumber } }, { new: true })
                let subject = "Credentails"
                SendMail.sendCredentialsHtmlEmail((req.body.email).toLowerCase(), subject, (req.body.email).toLowerCase(), req.body.name, mypass, (error10, result10) => {
                    response.log("mail send is==========>", result10);
                })
            }
            if (req.body.type == "Store") {
                let checkMobile = await Brand.findOne({ mobileNumber: req.body.mobileNumber, userType: 'Store-Admin' })
                if (checkMobile) {
                    response.log("Mobile number already exist")
                    return response.responseHandlerWithMessage(res, 503, "Mobile number already exist");
                }
                let checkEmail = await Brand.findOne({ email: (req.body.email).toLowerCase(), userType: 'Store-Admin' })
                if (checkEmail) {
                    response.log("Email already exist")
                    return response.responseHandlerWithMessage(res, 503, "Email already exist");
                }
                let checkAdmin = await Admin.findOne({ userType: 'Admin' })
                let empNumber = `SUA${checkAdmin.storeAdminNumber}`
                let newNumber = Number(checkAdmin.storeAdminNumber) + 1
                let mypass = req.body.password
                req.body.password = await bcrypt.hashSync(req.body.password, salt);
                let obj = new Brand({
                    brandId: req.body.storeId,
                    name: req.body.name,
                    empId: empNumber,
                    password: req.body.password,
                    email: (req.body.email).toLowerCase(),
                    roleId: req.body.roleId,
                    adminVerificationStatus: 'Approve',
                    mobileNumber: req.body.mobileNumber,
                    latitude: Number(28.99999),
                    longitude: Number(78.9999),
                    userType: 'Store-Admin',
                    location: { "type": "Point", "coordinates": [Number(78.9999), Number(28.99999)] }
                })
                let data = await obj.save()
                response.log("Admin created successfully", data)
                response.responseHandlerWithMessage(res, 200, `Admin created successfully`);
                await Admin.findByIdAndUpdate({ _id: checkAdmin._id }, { $set: { storeAdminNumber: newNumber } }, { new: true })
                let subject = "Credentails"
                SendMail.sendCredentialsHtmlEmail((req.body.email).toLowerCase(), subject, (req.body.email).toLowerCase(), req.body.name, mypass, (error10, result10) => {
                    response.log("mail send is==========>", result10);
                })
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Upate sub-admin====================================//

    updateSubAdmin: async (req, res) => {

        try {
            response.log("Request for update sub-admin is============>", req.body);
            req.checkBody('name', 'Something went wrong').notEmpty();
            req.checkBody('email', 'Something went wrong').notEmpty();
            req.checkBody('mobileNumber', 'Something went wrong').notEmpty();
            req.checkBody('subAdminId', 'Something went wrong').notEmpty();
            req.checkBody('type', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            if (req.body.type == "Brand") {
                let checkMobile = await Brand.findOne({ mobileNumber: req.body.mobileNumber, userType: 'Sub-Admin', _id: { $ne: req.body.subAdminId } })
                if (checkMobile) {
                    response.log("Mobile number already exist")
                    return response.responseHandlerWithMessage(res, 503, "Mobile number already exist");
                }
                let checkEmail = await Brand.findOne({ email: req.body.email, userType: 'Sub-Admin', _id: { $ne: req.body.subAdminId } })
                if (checkEmail) {
                    response.log("Email already exist")
                    return response.responseHandlerWithMessage(res, 503, "Email already exist");
                }
                let obj = {
                    name: req.body.name,
                    email: req.body.email,
                    mobileNumber: req.body.mobileNumber,
                    roleId: ObjectId(req.body.roleId)
                }

                let data = await Brand.findOneAndUpdate({ _id: req.body.subAdminId }, { $set: obj }, { new: true })
                // let data = await Brand.findByIdAndUpdate({ _id: req.body.subAdminId }, { $set: obj }, { new: true })
                response.log("Admin updated successfully", data)
                return response.responseHandlerWithMessage(res, 200, `Admin updated successfully`);
            }
            if (req.body.type == "Store") {
                let checkMobile = await Brand.findOne({ mobileNumber: req.body.mobileNumber, userType: 'Sub-Admin', _id: { $ne: req.body.subAdminId } })
                // let checkMobile = await Store.findOne({ mobileNumber: req.body.mobileNumber, userType: 'Sub-Admin', _id: { $ne: req.body.subAdminId } })
                if (checkMobile) {
                    response.log("Mobile number already exist")
                    return response.responseHandlerWithMessage(res, 503, "Mobile number already exist");
                }
                // let checkEmail = await Store.findOne({ email: req.body.email, userType: 'Sub-Admin', _id: { $ne: req.body.subAdminId } })

                let checkEmail = await Brand.findOne({ email: req.body.email, userType: 'Sub-Admin', _id: { $ne: req.body.subAdminId } })
                if (checkEmail) {
                    response.log("Email already exist")
                    return response.responseHandlerWithMessage(res, 503, "Email already exist");
                }
                let obj = {
                    name: req.body.name,
                    email: req.body.email,
                    mobileNumber: req.body.mobileNumber,
                    roleId: ObjectId(req.body.roleId)
                }
                // let data = await Store.findByIdAndUpdate({ _id: req.body.subAdminId }, { $set: obj }, { new: true })
                let data = await Brand.findByIdAndUpdate({ _id: req.body.subAdminId }, { $set: obj }, { new: true })
                response.log("Admin updated successfully", data)
                return response.responseHandlerWithMessage(res, 200, `Admin updated successfully`);
            }

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Sub-admin list=====================================//

    subAdminList: async (req, res) => {

        try {
            response.log("Request for get hours list is==============>", req.body);
            req.checkBody('type', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            if (req.body.type == "Brand") {
                let result = await Brand.find({ brandId: req.body.brandId, userType: 'Brand-Admin' }).populate({ path: 'roleId', select: 'roleTitle' })
                response.log("Hours List Found", result)
                return response.responseHandlerWithData(res, 200, "Hours List Found", result);
            }
            if (req.body.type == "Store") {
                let result = await Brand.find({ brandId: req.body.storeId, userType: 'Store-Admin' }).populate({ path: 'roleId', select: 'roleTitle' })
                response.log("Hours List Found", result)
                return response.responseHandlerWithData(res, 200, "Hours List Found", result);
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Delete sub-admin=====================================//

    deleteSubAdmin: async (req, res) => {

        try {
            response.log("Request for sub-admin delete is============>", req.body);
            req.checkBody('subAdminId', 'Something went wrong').notEmpty();
            req.checkBody('type', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            if (req.body.type == "Brand") {
                let data = await Brand.findByIdAndRemove({ _id: req.body.subAdminId })
                if (!data) {
                    response.log("Invalid sub-admin Id");
                    return response.responseHandlerWithMessage(res, 501, "Something went wrong");
                }
                response.log("Admin deleted successfully", data)
                return response.responseHandlerWithMessage(res, 200, "Admin deleted successfully");
            }
            if (req.body.type == "Store") {
                let data = await Brand.findByIdAndRemove({ _id: req.body.subAdminId })
                if (!data) {
                    response.log("Invalid sub-admin Id");
                    return response.responseHandlerWithMessage(res, 501, "Something went wrong");
                }
                response.log("Admin deleted successfully", data)
                return response.responseHandlerWithMessage(res, 200, "Admin deleted successfully");
            }

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Update status sub-admin=============================//

    updateStatusSubAdmin: async (req, res) => {

        try {
            response.log("Request for sub-admin delete is============>", req.body);
            req.checkBody('subAdminId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            req.checkBody('type', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            if (req.body.type == "Brand") {
                let data = await Brand.findOneAndUpdate({ _id: req.body.subAdminId }, { $set: { status: req.body.status } }, { new: true })
                // let data = await Brand.findByIdAndUpdate({ _id: req.body.subAdminId }, { $set: { status: req.body.status } }, { new: true })
                if (!data) {
                    response.log("Invalid sub-admin Id");
                    return response.responseHandlerWithMessage(res, 501, "Something went wrong");
                }
                response.log("Admin status updated successfully", data)
                return response.responseHandlerWithMessage(res, 200, "Admin status updated successfully");
            }
            if (req.body.type == "Store") {
                let data = await Brand.findByIdAndUpdate({ _id: req.body.subAdminId }, { $set: { status: req.body.status } }, { new: true })
                if (!data) {
                    response.log("Invalid sub-admin Id");
                    return response.responseHandlerWithMessage(res, 501, "Something went wrong");
                }
                response.log("Admin status updated successfully", data)
                return response.responseHandlerWithMessage(res, 200, "Admin status updated successfully");
            }

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Get sub-admin detail================================//

    getSubAdminDetails: async (req, res) => {

        try {
            if (req.body.type == "Brand") {
                let checkUser = await Brand.findOne({ "_id": req.body.subAdminId }).lean()
                if (!checkUser) {
                    response.log("Invalid User Id");
                    return response.responseHandlerWithMessage(res, 501, "Invalid Token");
                }
                response.log("Details found successfully", checkUser);
                delete (checkUser.password)
                return response.responseHandlerWithData(res, 200, "Details found successfully", checkUser);
            }
            if (req.body.type == "Store") {
                let checkUser = await Brand.findOne({ "_id": req.body.subAdminId }).lean()
                if (!checkUser) {
                    response.log("Invalid User Id");
                    return response.responseHandlerWithMessage(res, 501, "Invalid Token");
                }
                response.log("Details found successfully", checkUser);
                delete (checkUser.password)
                return response.responseHandlerWithData(res, 200, "Details found successfully", checkUser);
            }

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Store list==========================================//

    storeList: async (req, res) => {

        try {
            response.log("Request for get store list is==============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let result = await Brand.find({ brandId: req.body.brandId, userType: 'Store', deleteStatus: false })
            response.log("Store List Found", result)
            return response.responseHandlerWithData(res, 200, "Store List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Store for payout===================================//

    storeListForPayout: async (req, res) => {

        try {
            response.log("Request for get hours list is==============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('groupId', 'Something went wrong').notEmpty();
            let storeList = []
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let result = await Brand.find({ brandId: req.body.brandId, userType: 'Store' }).select('businessName')
            for (let i = 0; i < result.length; i++) {
                let checkPayout = await Group.findOne({ _id: req.body.groupId, storeData: { $in: [(result[i]._id).toString()] } })
                if (!checkPayout) {
                    let obj = {
                        businessName: result[i].businessName,
                        status: false,
                        storeId: (result[i]._id).toString()
                    }
                    storeList.push(obj)
                }
                if (checkPayout) {
                    let obj = {
                        businessName: result[i].businessName,
                        status: true,
                        storeId: (result[i]._id).toString()
                    }
                    storeList.push(obj)
                }
            }
            response.log("Store List Found", storeList)
            return response.responseHandlerWithData(res, 200, "Store List Found", storeList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Add menu==========================================//

    addMenu: async (req, res) => {

        try {
            response.log("Request for add menu is==============>", req.body);
            req.checkBody('menuName', 'Something went wrong').notEmpty();
            req.checkBody('type', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            if (req.body.type == "Brand") {
                let menuObj = new Menu({
                    menuName: req.body.menuName,
                    brandId: req.body.brandId,
                    status: 'Inactive'
                })
                let menuData = await menuObj.save()
                response.log("Menu added successfully")
                return response.responseHandlerWithData(res, 200, `Menu added successfully`, menuData);
            }
            if (req.body.type == "Store") {
                let menuObj = new Menu({
                    menuName: req.body.menuName,
                    brandId: req.body.storeId,
                    status: 'Inactive'
                })
                let menuData = await menuObj.save()
                response.log("Menu added successfully")
                return response.responseHandlerWithData(res, 200, `Menu added successfully`, menuData);
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Update menu========================================//

    updateMenu: async (req, res) => {

        try {
            response.log("Request for update menu is===========>", req.body);
            req.checkBody('menuName', 'Something went wrong').notEmpty();
            req.checkBody('menuId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkMenu = await Menu.findOne({ _id: req.body.menuId })
            if (!checkMenu) {
                response.log("Invalid menu Id")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let menuObj = {
                menuName: req.body.menuName
            }
            await Menu.findByIdAndUpdate({ _id: req.body.menuId }, { $set: menuObj }, { new: true })
            response.log("Menu updated successfully")
            return response.responseHandlerWithMessage(res, 200, `Menu updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Menu detail=======================================//

    getMenuDetails: async (req, res) => {

        try {
            response.log("Request for menu get is==========>", req.body);
            req.checkBody('menuId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkMenu = await Menu.findOne({ "_id": req.body.menuId })
            if (!checkMenu) {
                response.log("Invalid menu Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Details found successfully", checkMenu);
            return response.responseHandlerWithData(res, 200, "Details found successfully", checkMenu);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Delete menu========================================//

    deleteMenu: async (req, res) => {

        try {
            response.log("Request for sub-admin delete is============>", req.body);
            req.checkBody('menuId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let data = await Menu.findByIdAndRemove({ _id: req.body.menuId })
            if (!data) {
                response.log("Invalid menu Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Menu deleted successfully", data)
            return response.responseHandlerWithMessage(res, 200, "Menu deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Menu list==========================================//

    menuList: async (req, res) => {

        try {
            response.log("Request for get menu list is==============>", req.body);
            let queryCheck = {}
            if (req.body.type == "Brand") {
                queryCheck = { brandId: req.body.brandId }
            }
            if (req.body.type == "Store") {
                queryCheck = { brandId: req.body.storeId }
            }
            let result = await Menu.find(queryCheck).lean()
            for (let i = 0; i < result.length; i++) {
                let checkItems = await Product.find({ menuId: result[i]._id }).count()
                result[i].totalItems = checkItems
            }
            response.log("Menu List Found", result)
            return response.responseHandlerWithData(res, 200, "Menu List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Update menu status==================================//

    updateStatusMenu: async (req, res) => {

        try {
            response.log("Request for sub-admin delete is============>", req.body);
            req.checkBody('status', 'Something went wrong').notEmpty();
            req.checkBody('type', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            if (req.body.type == "Brand") {
                if (req.body.status == "Active") {
                    let data = await Menu.findByIdAndUpdate({ _id: req.body.menuId }, { $set: { status: req.body.status } }, { new: true })
                    if (!data) {
                        response.log("Invalid menu Id");
                        return response.responseHandlerWithMessage(res, 501, "Something went wrong");
                    }
                    let query = { $and: [{ brandId: req.body.brandId }, { _id: { $ne: req.body.menuId } }] }
                    await Menu.updateMany(query, { $set: { status: 'Inactive' } })
                    response.log("Menu status updated successfully", data)
                    return response.responseHandlerWithMessage(res, 200, "Menu status updated successfully");
                }
                if (req.body.status == "Inactive") {
                    let data = await Menu.findByIdAndUpdate({ _id: req.body.menuId }, { $set: { status: req.body.status } }, { new: true })
                    if (!data) {
                        response.log("Invalid menu Id");
                        return response.responseHandlerWithMessage(res, 501, "Something went wrong");
                    }
                    response.log("Menu status updated successfully", data)
                    return response.responseHandlerWithMessage(res, 200, "Menu status updated successfully");
                }

            }
            if (req.body.type == "Store") {
                if (req.body.status == "Active") {
                    let data = await Menu.findByIdAndUpdate({ _id: req.body.menuId }, { $set: { status: req.body.status } }, { new: true })
                    if (!data) {
                        response.log("Invalid menu Id");
                        return response.responseHandlerWithMessage(res, 501, "Something went wrong");
                    }
                    let query = { $and: [{ brandId: req.body.storeId }, { _id: { $ne: req.body.menuId } }] }
                    await Menu.updateMany(query, { $set: { status: 'Inactive' } })
                    response.log("Menu status updated successfully", data)
                    return response.responseHandlerWithMessage(res, 200, "Menu status updated successfully");
                }
                if (req.body.status == "Inactive") {
                    let data = await Menu.findByIdAndUpdate({ _id: req.body.menuId }, { $set: { status: req.body.status } }, { new: true })
                    if (!data) {
                        response.log("Invalid menu Id");
                        return response.responseHandlerWithMessage(res, 501, "Something went wrong");
                    }
                    response.log("Menu status updated successfully", data)
                    return response.responseHandlerWithMessage(res, 200, "Menu status updated successfully");
                }
            }

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Add item=========================================//

    addItem: async (req, res) => {

        try {
            response.log("Request for add item is===============>", req.body);
            req.checkBody('menuId', 'Something went wrong').notEmpty();
            req.checkBody('foodName', 'Something went wrong').notEmpty();
            req.checkBody('price', 'Something went wrong').notEmpty();
            req.checkBody('foodQuantity', 'Something went wrong').notEmpty();
            req.checkBody('foodType', 'Something went wrong').notEmpty();
            req.checkBody('cuisineId', 'Something went wrong').notEmpty();
            req.checkBody('cuisineCategoryId', 'Something went wrong').notEmpty();
            req.checkBody('menuCategoryId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let cuisine = await Cuisine.findOne({ _id: req.body.cuisineId })
            let cuisineCategory = await Cuisinecategory.findOne({ _id: req.body.cuisineCategoryId })
            let imageUrl = ""
            if (req.body.foodImage) {
                imageUrl = await Fileupload.uploadBase(req.body.foodImage, "user/");
            }
            let checkItemName = await Product.findOne({ menuId: req.body.menuId, foodName: req.body.foodName })
            if (checkItemName) {
                response.log("Product already exist");
                return response.responseHandlerWithMessage(res, 501, "Product already exist");
            }
            let foodTypeArray = []
            if (req.body.foodType == "Veg") {
                foodTypeArray = ['Veg']
            }
            if (req.body.foodType == "Non-Veg") {
                foodTypeArray = ['Non-Veg']
            }
            if (req.body.foodType == "Both") {
                foodTypeArray = ['Veg', 'Non-Veg']
            }
            let newCat = req.body.category
            let changeRequestId = Math.floor(1000 + Math.random() * 9000);
            let itemObj = new Product({
                menuId: req.body.menuId,
                menuCategoryName: req.body.menuCategoryName,
                foodName: req.body.foodName,
                description: req.body.description,
                foodQuantity: req.body.foodQuantity,
                price: req.body.price,
                foodType: req.body.foodType,
                subCategory: cuisineCategory.name,
                cuisine: cuisine.name,
                foodImage: imageUrl,
                changeRequestId: changeRequestId,
                changeRequestMsg: 'New Menu',
                cuisineId: req.body.cuisineId,
                cuisineCategoryId: req.body.cuisineCategoryId,
                foodTypeArray: foodTypeArray,
                category: newCat.category,
                taxable: req.body.taxable,
                menuCategoryId: req.body.menuCategoryId
            })
            let productData = await itemObj.save()
            response.log("Item added successfully")
            response.responseHandlerWithMessage(res, 200, "Item added successfully");
            let choiceData = req.body.selectedItems
            for (let i = 0; i < choiceData.length; i++) {
                let saveObj = new Productchoice({
                    productId: productData._id,
                    choiceId: choiceData[i]
                })
                await saveObj.save()
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Start selling====================================//

    startSelling: async (req, res) => {

        try {
            response.log("Request for start selling is===========>", req.body);
            req.checkBody('expiryDate', 'Something went wrong').notEmpty();
            req.checkBody('expiryTime', 'Something went wrong').notEmpty();
            req.checkBody('itemId', 'Something went wrong').notEmpty();
            req.checkBody('pickupLaterAllowance', 'Something went wrong').notEmpty();
            req.checkBody('discountPer', 'Something went wrong').notEmpty();
            req.checkBody('quantity', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let convertedExpiryDate = moment(`${req.body.expiryDate} ${req.body.expiryTime}`)
            let checkItem = await Product.findOne({ _id: req.body.itemId })
            if (!checkItem) {
                response.log("Invalid item Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }

            console.log("checkItem=================================>", checkItem)



            let date = moment().format('YYYY-MM-DD')
            let today = new Date();
            let month = today.getUTCMonth() + 1;
            let day = today.getUTCDate();
            let year = today.getUTCFullYear();
            let leftQuantity = 0
            let newLetf = Number(checkItem.leftQuantity) + Number(req.body.addedQuantity) - Number(req.body.leftQty)
            if (newLetf > 0) {
                leftQuantity = newLetf
            }
            let myDiscount = Number(req.body.discountPer) / 100
            let discountAmount = Number(Number(checkItem.price) * myDiscount).toFixed(0)
            if (req.body.pickupLaterAllowance == true) {
                console.log("")
                let convertedPickupDate = moment(`${req.body.pickupDate} ${req.body.pickupTime}`)
                let obj = {
                    convertedPickupDate: convertedPickupDate,
                    discountPer: req.body.discountPer,
                    expiryDate: req.body.expiryDate,
                    expiryTime: req.body.expiryTime,
                    pickupDate: req.body.pickupDate,
                    pickupTime: req.body.pickupTime,
                    convertedExpiryDate: convertedExpiryDate,
                    quantitySell: req.body.quantity,
                    leftQuantity: leftQuantity,
                    isChoiceStatus: false,
                    sellingStatus: true,
                    pickupLaterAllowance: req.body.pickupLaterAllowance,
                    addedQuantity: Number(req.body.quantity),
                    discountAmount: discountAmount,
                    pauseStatus: req.body.pauseStatus,
                    offeredPrice: Number(Number(checkItem.price) - Number(discountAmount)).toFixed(0)

                }

                let updateItem = await Product.findByIdAndUpdate({ _id: req.body.itemId }, { $set: obj }, { new: true })
                let menuData = await Menu.findOne({ status: 'Active', _id: updateItem.menuId })
                console.log("menuData=====>", menuData)
                let newDatess = new Date()

                let UpdateBrandData = await Brand.findOneAndUpdate({ _id: ObjectId(menuData.brandId) }, { $set: { lastSale: convertedExpiryDate } }, { new: true })
                // let UpdateBrandData = await Brand.findOneAndUpdate({ _id: ObjectId(menuData.brandId) }, { $set: { lastSale: newDatess } }, { new: true })

                let checkSelling = await Sellingmodel.findOne({ productId: req.body.itemId })
                if (checkSelling) {
                    let sellingObj = {
                        day: day,
                        brandId: menuData.brandId,
                        productId: req.body.itemId,
                        month: month,
                        quantity: Number(req.body.quantity),
                        year: year,
                        date: date,
                        status: 'Start',
                        startDate: new Date(),
                        endDate: convertedExpiryDate,
                        amount: (Number(checkItem.price) - Number(discountAmount)).toFixed(0)
                    }
                    await Sellingmodel.findByIdAndUpdate({ _id: checkSelling._id }, { $set: sellingObj }, { new: true })
                }
                if (!checkSelling) {
                    let sellingObj = new Sellingmodel({
                        brandId: menuData.brandId,
                        productId: req.body.itemId,
                        day: day,
                        month: month,
                        year: year,
                        date: date,
                        status: 'Start',
                        quantity: Number(req.body.quantity),
                        startDate: new Date(),
                        endDate: convertedExpiryDate,
                        amount: (Number(checkItem.price) - Number(discountAmount)).toFixed(0)
                    })
                    await sellingObj.save()
                }
                response.log("Item ready to sell", updateItem)
                response.responseHandlerWithMessage(res, 200, `Your product ${updateItem.foodName} is ready to sell. You can pause selling anytime!`);
                let checkFav = await Favorite.find({ brandId: menuData.brandId })
                response.log("checkFav", checkFav)
                if (checkFav.length > 0) {
                    let todayDateNow = new Date()
                    todayDateNow.setHours(00, 00, 00, 000);
                    let todayDate = new Date()
                    todayDate.setHours(23, 59, 59, 999);
                    let checkSellingItems = await Sellingmodel.find({ brandId: menuData.brandId, createdAt: { $gte: todayDateNow }, createdAt: { $lte: todayDate } }).count()
                    response.log("sdasasd", checkSellingItems)


                    if (checkSellingItems == 3) {
                        for (let k = 0; k < checkFav.length; k++) {
                            let notiUser = await User.findOne({ _id: checkFav[k].userId })
                            let restaurantData = await Brand.findOne({ _id: checkFav[k].brandId })
                            let notiTitle = `${notiUser.name}! You missed something new`
                            let notiMessage = `Your favorite restaurant ${restaurantData.businessName} is added some items. Tap to order.`
                            let notiType = `itemsAdded`
                            let newId = updateItem.menuId
                            Sendnotification.sendNotificationForAndroid(notiUser.deviceToken, notiTitle, notiMessage, notiType, newId, notiUser.deviceType, (error10, result10) => {
                                response.log("Notification Sent");
                            })
                            return
                        }
                    }
                }
            }
            if (req.body.pickupLaterAllowance == false) {

                let obj = {

                    discountPer: req.body.discountPer,
                    expiryDate: req.body.expiryDate,
                    expiryTime: req.body.expiryTime,
                    convertedExpiryDate: convertedExpiryDate,
                    quantitySell: req.body.quantity,
                    // leftQuantity: Number(req.body.leftQty),
                    leftQuantity: leftQuantity,
                    isChoiceStatus: false,
                    sellingStatus: true,
                    pickupLaterAllowance: req.body.pickupLaterAllowance,
                    addedQuantity: Number(req.body.quantity),
                    discountAmount: discountAmount,
                    pauseStatus: req.body.pauseStatus,
                    offeredPrice: (Number(checkItem.price) - Number(discountAmount)).toFixed(0)

                }
                let updateItem = await Product.findByIdAndUpdate({ _id: req.body.itemId }, { $set: obj }, { new: true })
                let menuData = await Menu.findOne({ status: 'Active', _id: updateItem.menuId })
                console.log("menuData=====>", menuData)
                let newDatess = new Date()

                let UpdateBrandData = await Brand.findOneAndUpdate({ _id: ObjectId(menuData.brandId) }, { $set: { lastSale: convertedExpiryDate } }, { new: true })
                // let UpdateBrandData = await Brand.findOneAndUpdate({ _id: ObjectId(menuData.brandId) }, { $set: { lastSale: newDatess } }, { new: true })

                let checkSelling = await Sellingmodel.findOne({ productId: req.body.itemId })
                if (checkSelling) {
                    let sellingObj = {
                        day: day,
                        brandId: menuData.brandId,
                        productId: req.body.itemId,
                        month: month,
                        year: year,
                        date: date,
                        status: 'Start',
                        quantity: Number(req.body.quantity),
                        startDate: new Date(),
                        endDate: convertedExpiryDate,
                        amount: (Number(checkItem.price) - Number(discountAmount)).toFixed(0)
                    }
                    await Sellingmodel.findByIdAndUpdate({ _id: checkSelling._id }, { $set: sellingObj }, { new: true })
                }
                if (!checkSelling) {
                    let sellingObj = new Sellingmodel({
                        brandId: menuData.brandId,
                        productId: req.body.itemId,
                        day: day,
                        month: month,
                        year: year,
                        date: date,
                        quantity: Number(req.body.quantity),
                        status: 'Start',
                        startDate: new Date(),
                        endDate: convertedExpiryDate,
                        amount: (Number(checkItem.price) - Number(discountAmount)).toFixed(0)
                    })
                    await sellingObj.save()
                }
                response.log("Item ready to sell", updateItem)
                response.responseHandlerWithMessage(res, 200, `Your product ${updateItem.foodName} is ready to sell. You can pause selling anytime!`);
                let checkFav = await Favorite.find({ brandId: menuData.brandId })
                if (checkFav.length > 0) {
                    let todayDateNow = new Date()
                    todayDateNow.setHours(00, 00, 00, 000);
                    let todayDate = new Date()
                    todayDate.setHours(23, 59, 59, 999);
                    let checkSellingItems = await Sellingmodel.find({ brandId: menuData.brandId, createdAt: { $gte: todayDateNow }, createdAt: { $lte: todayDate } }).count()
                    if (checkSellingItems == 3) {
                        for (let k = 0; k < checkFav.length; k++) {
                            let notiUser = await User.findOne({ _id: checkFav[k].userId })
                            let restaurantData = await Brand.findOne({ _id: checkFav[k].brandId })
                            let notiTitle = `${notiUser.name}! You missed something new`
                            let notiMessage = `Your favorite restaurant ${restaurantData.businessName} is added some items. Tap to order.`
                            let notiType = `itemsAdded`
                            let newId = updateItem.menuId
                            Sendnotification.sendNotificationForAndroid(notiUser.deviceToken, notiTitle, notiMessage, notiType, newId, notiUser.deviceType, (error10, result10) => {
                                response.log("Notification Sent");
                            })
                            return
                        }
                    }
                }
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Pause selling===================================//

    pauseSelling: async (req, res) => {

        try {
            response.log("Request for pause selling is===========>", req.body);
            req.checkBody('itemId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let date = moment().format('YYYY-MM-DD')
            let today = new Date();
            let month = today.getUTCMonth() + 1;
            let day = today.getUTCDate();
            let year = today.getUTCFullYear();
            let obj = {
                pauseStatus: true
            }

            // =========================================================================================//



            //==========================================================================================//
            let updateItem = await Product.findByIdAndUpdate({ _id: req.body.itemId }, { $set: obj }, { new: true })
            response.log("Item ready to sell", updateItem)
            response.responseHandlerWithData(res, 200, `Your product ${updateItem.foodName} has been paused successfully. You can start selling anytime!`, updateItem);
            let menuData = await Menu.findOne({ status: 'Active', _id: updateItem.menuId })
            let checkSelling = await Sellingmodel.findOne({ productId: req.body.itemId })
            if (checkSelling) {
                let sellingObj = {
                    day: day,
                    brandId: menuData.brandId,
                    month: month,
                    year: year,
                    date: date,
                    status: 'Stop'
                }
                await Sellingmodel.findByIdAndUpdate({ _id: checkSelling._id }, { $set: sellingObj }, { new: true })
            }
            if (!checkSelling) {
                let sellingObj = new Sellingmodel({
                    brandId: menuData.brandId,
                    day: day,
                    month: month,
                    year: year,
                    date: date,
                    status: 'Stop'
                })
                await sellingObj.save()
            }

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Update item===================================//

    updateItem: async (req, res) => {

        try {
            response.log("Request for add item is===============>", req.body);
            req.checkBody('itemId', 'Something went wrong').notEmpty();
            req.checkBody('foodName', 'Something went wrong').notEmpty();
            req.checkBody('price', 'Something went wrong').notEmpty();
            req.checkBody('menuCategoryId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let cuisine = await Cuisine.findOne({ _id: req.body.cuisineId })
            let cuisineCategory = await Cuisinecategory.findOne({ _id: req.body.cuisineCategoryId })
            let checkItem = await Product.findOne({ _id: req.body.itemId })
            if (!checkItem) {
                response.log("Invalid item Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            // if(checkItem){

            //     if(checkItem.sellingStatus == true){
            //         if(checkItem.price !== req.body.price){
            //             response.log("Invalid item Id");
            //             return response.responseHandlerWithMessage(res, 501, "This item is already on sale,remove first from sale then edit");
            //         }
            //     }

            // }
            let imageUrl = checkItem.foodImage
            if (req.body.foodImage) {
                imageUrl = await Fileupload.uploadBase(req.body.foodImage, "user/");
            }
            let foodTypeArray = []
            if (req.body.foodType == "Veg") {
                foodTypeArray = ['Veg']
            }
            if (req.body.foodType == "Non-Veg") {
                foodTypeArray = ['Non-Veg']
            }
            if (req.body.foodType == "Both") {
                foodTypeArray = ['Veg', 'Non-Veg']
            }
            let newCat = req.body.category
            let changeRequestId = Math.floor(1000 + Math.random() * 9000);
            let itemObj = {
                menuCategoryName: req.body.menuCategoryName,
                foodName: req.body.foodName,
                description: req.body.description,
                foodQuantity: req.body.foodQuantity,
                price: req.body.price,
                foodType: req.body.foodType,
                foodImage: imageUrl,
                subCategory: cuisineCategory.name,
                cuisine: cuisine.name,
                changeRequestId: changeRequestId,
                changeRequestApporve: "Pending",
                changeRequestMsg: 'Menu Update',
                cuisineId: req.body.cuisineId,
                cuisineCategoryId: req.body.cuisineCategoryId,
                foodTypeArray: foodTypeArray,
                category: newCat.category,
                taxable: req.body.taxable,
                menuCategoryId: req.body.menuCategoryId
            }
            await Product.findByIdAndUpdate({ _id: req.body.itemId }, { $set: itemObj }, { new: true })
            response.log("Item updated successfully")
            response.responseHandlerWithMessage(res, 200, "Item updated successfully");
            await Productchoice.deleteMany({ productId: req.body.itemId })
            let choiceData = req.body.selectedItems
            for (let i = 0; i < choiceData.length; i++) {
                let saveObj = new Productchoice({
                    productId: req.body.itemId,
                    choiceId: choiceData[i]
                })
                await saveObj.save()
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Item list======================================//

    itemList: async (req, res) => {

        try {
            response.log("Request for get ietm list is==============>", req.body);
            req.checkBody('menuId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let result = await Product.find({ menuId: req.body.menuId, deleteStatus: false })
            response.log("Item List Found", result)
            return response.responseHandlerWithData(res, 200, "Item List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Item list for sell fixed==========================//

    itemListForSellFixed: async (req, res) => {

        try {
            response.log("Request for get ietm list is==============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Brand.findOne({ _id: req.body.brandId })
            if (!checkBrand) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let checkMenu = await Menu.findOne({ brandId: req.body.brandId, status: 'Active', deleteStatus: false })
            if (!checkMenu) {
                response.log("Invalid menu Id");
                return response.responseHandlerWithMessage(res, 501, "There is no menu active to start selling. Please add or active the menu!");
            }
            // let result = await Product.find({ menuId: checkMenu._id, deleteStatus: false, sellingStatus: false })

            let result = await Product.aggregate([
                {
                    $match: {
                        menuId: checkMenu._id,
                        deleteStatus: false,
                        sellingStatus: false
                    }
                },
                {
                    $lookup: {
                        from: 'itemcategorys',
                        localField: 'menuCategoryId',
                        foreignField: '_id',
                        as: 'menuInfo'
                    }
                },
                {
                    $unwind: {
                        path: "$menuInfo"
                    }
                }
            ])

            response.log("Item List Found", result)
            return response.responseHandlerWithData(res, 200, "Item List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Item list for sell==============================//

    itemListForSell: async (req, res) => {

        try {
            response.log("Request for get ietm list is==============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Brand.findOne({ _id: req.body.brandId })
            if (!checkBrand) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let checkMenu = await Menu.findOne({ brandId: req.body.brandId, status: 'Active', deleteStatus: false })
            if (!checkMenu) {
                response.log("Invalid menu Id");
                return response.responseHandlerWithMessage(res, 501, "Menu is not available");
            }

            // ====================================================================================//

            let result1 = await Product.find({ menuId: checkMenu._id, deleteStatus: false, sellingStatus: true })

            for (let i = 0; i < result1.length; i++) {
                if (result1[i].leftQuantity == 0) {

                    let obj = { sellingStatus: false, discountAmount: 0, discountPer: 0, offeredPrice: 0, pauseStatus: false, leftQuantity: 0, quantitySell: 0, addedQuantity: 0, expiryDate: '', expiryTime: '', pickupLaterAllowance: false }
                    let checkItem = await Product.findByIdAndUpdate({ "_id": result1[i]._id }, { $set: obj }, { new: true })
                    if (!checkItem) {
                        response.log("Invalid item Id");
                        return response.responseHandlerWithMessage(res, 501, "Invalid Token");
                    }
                    await Sellingmodel.remove({ productId: result1[i]._id })
                    let deleteItem = await Cart.findOneAndUpdate({ "productData.productId": result1[i]._id }, { $pull: { productData: { productId: result1[i]._id } } }, { safe: true, new: true })
                    if (deleteItem) {
                        if (deleteItem.productData.length == 0) {
                            await Cart.findByIdAndRemove({ _id: deleteItem._id })
                        }
                    }
                }
            }

            //=================================================================================//
            // let result = await Product.find({ menuId: checkMenu._id, deleteStatus: false, sellingStatus: true })

            let result = await Product.aggregate([
                {
                    $match: {
                        menuId: checkMenu._id,
                        deleteStatus: false,
                        sellingStatus: true
                    }
                },
                {
                    $lookup: {
                        from: 'itemcategorys',
                        localField: 'menuCategoryId',
                        foreignField: '_id',
                        as: 'menuInfo'
                    }
                },
                {
                    $unwind: {
                        path: "$menuInfo"
                    }
                }
            ])


            console.log("result=== result =================>", result)
            response.log("Item List Found", result)
            return response.responseHandlerWithData(res, 200, "Item List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Item list by menu==============================//

    itemListByMenu: async (req, res) => {

        try {
            response.log("Request for get item list is==============>", req.body);
            req.checkBody('menuId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let result = await Product.find({ menuId: req.body.menuId, deleteStatus: false, sellingStatus: false })
            response.log("Item List Found", result)
            return response.responseHandlerWithData(res, 200, "Item List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Cuisine list========================================//

    getCuisineList: async (req, res) => {

        try {
            response.log("Request for get cuisine list is============>", req.body);
            let list = []
            let cuisineList = await Cuisine.find({ status: 'Active', deleteStatus: false })
            for (let i = 0; i < cuisineList.length; i++) {
                let obj = {
                    item_id: i,
                    item_text: cuisineList[i].cusineNameEn
                }
                list.push(obj)
            }
            response.log("Cuisine list found successfully", list)
            return response.responseHandlerWithData(res, 200, `Cuisine list found successfully`, list);

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Add menu category================================//

    addItemCategory: async (req, res) => {

        try {
            response.log("Request for add item category is================>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('name', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkQuery = { $and: [{ brandId: req.body.brandId }, { name: req.body.name }] }
            let checkMenuCategory = await Itemcategory.findOne(checkQuery)
            if (checkMenuCategory) {
                response.log("Category already exist")
                return response.responseHandlerWithMessage(res, 503, "Category already exist");
            }
            let obj = new Itemcategory({
                brandId: req.body.brandId,
                name: req.body.name,
            })
            await obj.save()
            response.log("Category added successfully")
            return response.responseHandlerWithMessage(res, 200, "Category added successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Update menu category===============================//

    updateItemCategory: async (req, res) => {

        try {
            response.log("Request for add menu category is================>", req.body);
            req.checkBody('name', 'Something went wrong').notEmpty();
            req.checkBody('categoryId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkCategory = await Itemcategory.findOne({ _id: req.body.categoryId })
            if (!checkCategory) {
                response.log("Invalid category Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let checkQuery = { $and: [{ name: req.body.name }, { brandId: req.body.brandId }, { _id: { $ne: req.body.categoryId } }] }
            let checkMenuCategory = await Itemcategory.findOne(checkQuery)
            if (checkMenuCategory) {
                response.log("Category already exist")
                return response.responseHandlerWithMessage(res, 503, "Category already exist");
            }
            let obj = {
                name: req.body.name,
            }
            await Itemcategory.findByIdAndUpdate({ _id: req.body.categoryId }, { $set: obj }, { new: true })
            await Product.updateMany({ menuCategoryName: checkCategory.name }, { $set: { menuCategoryName: req.body.name } }, { new: true })
            response.log("Category updated successfully")
            return response.responseHandlerWithMessage(res, 200, "Category updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Delete menu category=============================//

    deleteItemCategory: async (req, res) => {

        try {
            response.log("Request for delete item category is==========>", req.body);
            req.checkBody('categoryId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkCategory = await Itemcategory.findByIdAndRemove({ "_id": req.body.categoryId })
            if (!checkCategory) {
                response.log("Invalid category Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            await Product.updateMany({ brandId: checkCategory.brandId, menuCategoryName: checkCategory.name }, { $set: { deleteStatus: true } }, { new: true })
            response.log("Category deleted successfully", checkCategory);
            return response.responseHandlerWithMessage(res, 200, "Category deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Item delete=======================================//

    deleteItem: async (req, res) => {

        try {
            response.log("Request for delete item is==========>", req.body);
            req.checkBody('itemId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = { sellingStatus: false, discountAmount: 0, discountPer: 0, offeredPrice: 0, pauseStatus: false, leftQuantity: 0, quantitySell: 0, addedQuantity: 0, expiryDate: '', expiryTime: '', pickupLaterAllowance: false }
            // let checkItem = await Product.findByIdAndUpdate({ "_id": req.body.itemId }, { $set: obj }, { new: true })
            let checkItem = await Product.findOneAndUpdate({ "_id": req.body.itemId }, { $set: obj }, { new: true })

            if (!checkItem) {
                response.log("Invalid item Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            await Sellingmodel.remove({ productId: req.body.itemId })
            let deleteItem = await Cart.findOneAndUpdate({ "productData.productId": req.body.itemId }, { $pull: { productData: { productId: req.body.itemId } } }, { safe: true, new: true })
            if (deleteItem) {
                if (deleteItem.productData.length == 0) {
                    await Cart.findByIdAndRemove({ _id: deleteItem._id })
                }
            }

            response.log("Item deleted successfully", checkItem);
            return response.responseHandlerWithMessage(res, 200, "Item deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //============================================Get menu category===============================//

    getItemCategory: async (req, res) => {

        try {
            response.log("Request for get menu category is==============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let categoryList = await Itemcategory.find({ brandId: req.body.brandId }).sort({ createdAt: -1 })
            response.log("Category list found successfully", categoryList);
            return response.responseHandlerWithData(res, 200, "Category list found successfully", categoryList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //============================================Item data=======================================//

    getItemDetails: async (req, res) => {

        try {
            response.log("Request for item get is==========>", req.body);
            req.checkBody('itemId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkItem = await Product.findOne({ "_id": req.body.itemId })
            if (!checkItem) {
                response.log("Invalid item Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Details found successfully", checkItem);
            return response.responseHandlerWithData(res, 200, "Details found successfully", checkItem);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Data import=====================================//

    // uploadExcel: async (req, res) => {

    //     try {
    //         response.log("Request for import data is============>", req.body)
    //         req.checkBody('brandId', 'Something went wrong').notEmpty();
    //         const errors = req.validationErrors();
    //         if (errors) {
    //             let error = errors[0].msg;
    //             response.log("Field is missing")
    //             return response.responseHandlerWithMessage(res, 503, error);
    //         }
    //         let checkBrand = await Brand.findOne({ "_id": req.body.brandId })
    //         if (!checkBrand) {
    //             response.log("Invalid brand Id");
    //             return response.responseHandlerWithMessage(res, 501, "Invalid Token");
    //         }
    //         let rows = await xlsxFile(req.files.file.path)
    //         response.log("Rows here=======>", rows)
    //         for (let i = 1; i < rows.length; i++) {

    //             if (rows[i][0]) {
    //                 let itemCategory = rows[i][3]
    //                 let menuCategoryId = ""
    //                 let checkItemCategory = await Itemcategory.findOne({ name: itemCategory, brandId: req.body.brandId })
    //                 if (!checkItemCategory) {
    //                     let obj = new Itemcategory({
    //                         brandId: req.body.brandId,
    //                         name: itemCategory,
    //                     })
    //                     let itemCategoryData = await obj.save()
    //                     menuCategoryId = itemCategoryData._id
    //                 }
    //                 if (checkItemCategory) {
    //                     menuCategoryId = checkItemCategory._id
    //                 }
    //                 let foodTypeArray = []
    //                 let foodType = rows[i][4]
    //                 foodTypeArray.push(rows[i][4])
    //                 let cuisine = rows[i][6]
    //                 let cuisineCategoryName = rows[i][7]
    //                 let cuisineId = ''
    //                 let cuisineCategoryId = ''
    //                 let checkCuisine = await Cuisine.findOne({ name: cuisine })
    //                 if (checkCuisine) {
    //                     cuisineId = checkCuisine._id
    //                     let checkSubCategory = await Cuisinecategory.findOne({ cuisineId: checkCuisine._id, name: cuisineCategoryName })
    //                     if (checkSubCategory) {
    //                         cuisineCategoryId = checkSubCategory._id
    //                         let productObj = new Product({
    //                             foodImage: rows[i][0],
    //                             foodName: rows[i][1],
    //                             description: rows[i][2],
    //                             foodTypeArray: foodTypeArray,
    //                             foodType: foodType,
    //                             taxable: rows[i][5],
    //                             cuisine: cuisine,
    //                             subCategory: cuisineCategoryName,
    //                             menuCategoryId: menuCategoryId,
    //                             foodQuantity: rows[i][8],
    //                             price: rows[i][9],
    //                             menuId: req.body.menuId,
    //                             cuisineId: cuisineId,
    //                             cuisineCategoryId: cuisineCategoryId,
    //                             // choice:rows[i][10].split(',')
    //                         })
    //                         await productObj.save()
    //                         console.log('productObj-------------------',productObj)
    //                     }
    //                 }
    //             }
    //         }
    //         return response.responseHandlerWithMessage(res, 200, "Data imported successfully");
    //     } catch (error) {
    //         response.log("Error is=========>", error);
    //         return response.responseHandlerWithMessage(res, 500, "Internal server error");
    //     }
    // },

    uploadExcel: async (req, res) => {

        try {
            response.log("Request for import data is============>", req.body)
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Brand.findOne({ "_id": req.body.brandId })
            if (!checkBrand) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let rows = await xlsxFile(req.files.file.path)
            response.log("Rows here=======>", rows)
            for (let i = 1; i < rows.length; i++) {
                if (rows[i][0]) {                                 
                    let itemCategory = rows[i][3]
                    let menuCategoryId = ""
                    let choiceCategoryId = ""
                    let checkItemCategory = await Itemcategory.findOne({ name: itemCategory, brandId: req.body.brandId })
                    let choiceCategory = rows[i][10] == null ? '': rows[i][10].split(',')
                    choiceCategory = choiceCategory == ''? '' : choiceCategory.map(e => {
                        return e.trim()
                    })
                    // if(choiceCategory.length > 0){
                    //     for(c of choiceCategory){
                    //         let checkCategory = await Choicecategory.findOne({ categoryName: c, brandId: req.body.brandId })   
                    //         if(checkCategory){
                    //         // response.log('choiceCategoryId-------------------------------==================>',checkCategory)                    
                    //         choiceCategoryId = checkCategory._id
                    //         }                       
                    //     }                        
                    // }
                    if (!checkItemCategory) {
                        let obj = new Itemcategory({
                            brandId: req.body.brandId,
                            name: itemCategory,
                        })
                        let itemCategoryData = await obj.save()
                        menuCategoryId = itemCategoryData._id
                    }
                    if (checkItemCategory) {
                        menuCategoryId = checkItemCategory._id
                    }
                    let foodTypeArray = []
                    let foodType = rows[i][4]
                    foodTypeArray.push(rows[i][4])
                    let cuisine = rows[i][6]
                    let cuisineCategoryName = rows[i][7]
                    let cuisineId = ''
                    let cuisineCategoryId = ''
                    let checkCuisine = await Cuisine.findOne({ name: cuisine })
                    if (checkCuisine) {
                        cuisineId = checkCuisine._id
                        let checkSubCategory = await Cuisinecategory.findOne({ cuisineId: checkCuisine._id, name: cuisineCategoryName })
                        if (checkSubCategory) {
                            cuisineCategoryId = checkSubCategory._id
                            let productObj = new Product({
                                foodImage: rows[i][0],
                                foodName: rows[i][1],
                                description: rows[i][2],
                                foodTypeArray: foodTypeArray,
                                foodType: foodType,
                                taxable: rows[i][5],
                                cuisine: cuisine,
                                subCategory: cuisineCategoryName,
                                menuCategoryId: menuCategoryId,
                                foodQuantity: rows[i][8],
                                price: rows[i][9],
                                menuId: req.body.menuId,
                                cuisineId: cuisineId,
                                cuisineCategoryId: cuisineCategoryId
                            })
                            let productSave = await productObj.save()
                            console.log('productSave-------------------=========================================>>',productSave._id)
                            if(productSave){
                                if(choiceCategory == ''){
                            console.log('productSave-------------------=========================================>>',productSave._id)

                                    // let getChoiceList = await Choicecategory.aggregate([{
                                    //     $match: {
                                    //         categoryName: {
                                    //             $in: choiceCategory
                                    //         },
                                    //         brandId: ObjectId(`${req.body.brandId}`)
                                    //     }
                                    // }])
                                    // if (getChoiceList) {
                                    //     for (c of getChoiceList) {
                                    //         let saveProductChoice = await Productchoice.insertMany({
                                    //             productId: productSave._id,
                                    //             choiceId: c._id
                                    //         })
                                    //     }
                                    // }
                                }else{
                                    let getChoiceList = await Choicecategory.aggregate([{
                                        $match: {
                                            categoryName: {
                                                $in: choiceCategory
                                            },
                                            brandId: ObjectId(`${req.body.brandId}`)
                                        }
                                    }])
                                    if (getChoiceList) {
                                        for (c of getChoiceList) {
                                            let saveProductChoice = await Productchoice.insertMany({
                                                productId: productSave._id,
                                                choiceId: c._id
                                            })
                                        }
                                    }                                    
                                }
                            }                    
                        }
                    }
                }
            }
            return response.responseHandlerWithMessage(res, 200, "Data imported successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Upload choice excel==============================//

    uploadChoiceExcel: async (req, res) => {

        try {
            response.log("Request for import data is============>", req.body)
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Brand.findOne({ "_id": req.body.brandId })
            if (!checkBrand) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let rows = await xlsxFile(req.files.file.path)
            response.log("Rows here=======>", rows)
            for (let i = 1; i < rows.length; i++) {
                let choiceCategory = rows[i][0]
                let checkCategory = await Choicecategory.findOne({ categoryName: choiceCategory, brandId: req.body.brandId })
                if (!checkCategory) {
                    let choiceArray = []
                    let choiceObj = {
                        name: rows[i][4],
                        price: rows[i][5],
                        foodType: rows[i][6],
                        status: rows[i][7]
                    }
                    choiceArray.push(choiceObj)
                    let obj = new Choicecategory({
                        brandId: req.body.brandId,
                        categoryName: choiceCategory,
                        min: rows[i][1],
                        max: rows[i][2],
                        status: rows[i][3],
                        choice: choiceArray
                    })
                    await obj.save()
                }
                if (checkCategory) {
                    let choiceObj = {
                        name: rows[i][4],
                        price: rows[i][5],
                        foodType: rows[i][6],
                        status: rows[i][7]
                    }
                    await Choicecategory.findByIdAndUpdate({ _id: checkCategory._id }, { $push: { choice: choiceObj } }, { new: true })
                }
            }
            return response.responseHandlerWithMessage(res, 200, "Data imported successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Create menu item excel===========================//

    createMenuItemExcel: async (req, res) => {

        try {
            response.log("Request for create dmc is=========>", req.body)
            let result = await Product.find({ menuId: req.body.menuId, deleteStatus: false })
            response.log("Mneu List Found", result)
            if (result.length == 0) {
                return response.responseHandlerWithMessage(res, 400, "Excel can not be create. Beacause record found.");

            }
            var data = '';
            data = data + "Category" + '\t' + "Product Name" + '\t' + "Product Name (Arabic)" + '\t' + "Description" + '\t' + "Description (Arabic)" + '\t' + "Price" + '\t' + "Image" + '\n';
            for (var i = 0; i < result.length; i++) {
                data = data + result[i].menuCategoryName + '\t' + result[i].productName + '\t' + result[i].productNameAr + '\t' + result[i].description + '\t' + result[i].descriptionAr + '\t' + result[i].price + '\t' + result[i].productImage + '\n';
            }
            var fileName = Date.now() + '.xls';
            response.log("File name is===========>", fileName);
            fs.appendFile("./excel/" + fileName, data, (err) => {
                if (err) {
                    response.log("Error is=========>", err)
                }
                else {
                    response.log("Excel created==========>", `http://3.140.159.167:3032/api/v1/admin/getExcel/${fileName}`)
                }
            })
            let link = `https://saveeat.in:3035/api/v1/admin/getExcel/${fileName}`
            let obj = {
                link: link,
                fileName: fileName
            }
            return response.responseHandlerWithData(res, 200, "Excel has been generated successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //======================================Menu list for excel================================//

    menuListForExcel: async (req, res) => {

        try {
            response.log("Request for get menu list is==============>", req.body);
            let result = await Menu.find({ brandId: req.body.brandId })
            response.log("Menu List Found", result)
            return response.responseHandlerWithData(res, 200, "Menu List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================cron Api===================================//

    cronApis: async (req, res) => {

        try {
            response.log("Cron running here")
            productDelete()
        } catch (error) {
            response.log("Error is=========>", error);
        }
    },

    //==============================================Unvisit users notification===================//

    unvisitUsersNotification: async (req, res) => {

        try {
            response.log("Cron running here")
            checkOrderEveryDay()
        } catch (error) {
            response.log("Error is=========>", error);
        }
    },

    //=============================================Order list for brand==========================//

    // getOrderListForBrand: async (req, res) => {

    //     try {
    //         response.log("Request for get order is===========>", req.body);
    //         let storeIdArray = []
    //         let restaurantList = req.body.restaurantIdData
    //         for (let i = 0; i < restaurantList.length; i++) {
    //             storeIdArray.push(ObjectId(restaurantList[i]._id))
    //         }
    //         var skip = 0
    //         let limit = Number(req.body.limit)
    //         if (Number(req.body.pageNumber)) {
    //             skip = (Number(req.body.pageNumber) - 1) * Number(limit)
    //         }
    //         let orderQuery = {}
    //         if (req.body.orderStatus == "All") {
    //             orderQuery = {
    //                 storeId: { $in: storeIdArray }
    //             }
    //         }
    //         if (req.body.orderStatus == "Pending") {
    //             orderQuery = {
    //                 storeId: { $in: storeIdArray },
    //                 status: 'Pending'
    //             }
    //         }
    //         if (req.body.orderStatus == "Accepted") {
    //             orderQuery = {
    //                 storeId: { $in: storeIdArray },
    //                 status: 'Accepted'
    //             }
    //         }
    //         if (req.body.orderStatus == "Delivered") {
    //             orderQuery = {
    //                 storeId: { $in: storeIdArray },
    //                 status: 'Delivered'
    //             }
    //         }
    //         if (req.body.orderStatus == "Cancelled") {
    //             orderQuery = {
    //                 storeId: { $in: storeIdArray },
    //                 status: 'Cancelled'
    //             }
    //         }
    //         if (req.body.orderStatus == "Rejected") {
    //             orderQuery = {
    //                 storeId: { $in: storeIdArray },
    //                 status: 'Rejected'
    //             }
    //         }
    //         if (req.body.pickupSorting == true) {
    //             orderQuery =
    //             {
    //                 $and: [
    //                     {
    //                         $or: [
    //                             { "status": "Pending" },
    //                             { "status": "Accepted" }
    //                         ]
    //                     },
    //                     {
    //                         storeId: { $in: storeIdArray }
    //                     }
    //                 ]
    //             }
    //         }
    //         let sort = { createdAt: -1 }
    //         if (req.body.timeframe == "Today") {
    //             let startTodayDate = new Date(moment().format())
    //             startTodayDate.setHours(00, 00, 00, 000);
    //             let todayDate = new Date()
    //             todayDate.setHours(23, 59, 59, 999);
    //             orderQuery.createdAt = { $gte: startTodayDate, $lte: todayDate }
    //         }
    //         if (req.body.timeframe == "Week") {
    //             let weekDate = new Date(moment().startOf('isoWeek').format())
    //             weekDate.setHours(00, 00, 00, 000);
    //             let todayDate = new Date()
    //             todayDate.setHours(23, 59, 59, 999);
    //             orderQuery.createdAt = { $gte: weekDate, $lte: todayDate }
    //         }
    //         if (req.body.timeframe == "Month") {
    //             let monthDate = new Date(moment().clone().startOf('month').format())
    //             monthDate.setHours(00, 00, 00, 000);
    //             let todayDate = new Date()
    //             todayDate.setHours(23, 59, 59, 999);
    //             orderQuery.createdAt = { $gte: monthDate, $lte: todayDate }
    //         }
    //         if (req.body.timeframe == "Year") {
    //             let yearDate = new Date(moment().startOf('year').format())
    //             yearDate.setHours(00, 00, 00, 000);
    //             let todayDate = new Date()
    //             todayDate.setHours(23, 59, 59, 999);
    //             orderQuery.createdAt = { $gte: yearDate, $lte: todayDate }
    //         }
    //         if (req.body.fromDate && req.body.toDate) {
    //             let yearDate = new Date(moment(req.body.fromDate).format())
    //             yearDate.setHours(00, 00, 00, 000);
    //             let todayDate = new Date(req.body.toDate)
    //             todayDate.setHours(23, 59, 59, 999);
    //             orderQuery.createdAt = { $gte: yearDate, $lte: todayDate }
    //         }
    //         if (req.body.pickupSorting == true) {
    //             sort = { convertedPickupDate: 1 }
    //             limit = 100
    //         }
    //         if (req.body.refundStatus == "Not-Applicable" || req.body.refundStatus == "Pending" || req.body.refundStatus == "Refunded" || req.body.refundStatus == "Rejected" || req.body.refundStatus == "In-process") {
    //             orderQuery.refundStatus = req.body.refundStatus
    //         }
    //         let orderList = await Order.aggregate([
    //             {
    //                 $match: orderQuery
    //             },
    //             {
    //                 $lookup:
    //                 {
    //                     from: "brands",
    //                     localField: "storeId",
    //                     foreignField: "_id",
    //                     as: "restaurantData"
    //                 }
    //             },
    //             {
    //                 $unwind: {
    //                     path: "$restaurantData",
    //                     preserveNullAndEmptyArrays: true
    //                 }
    //             },
    //             {
    //                 $lookup:
    //                 {
    //                     from: "users",
    //                     localField: "userId",
    //                     foreignField: "_id",
    //                     as: "userData"
    //                 }
    //             },
    //             {
    //                 $unwind: {
    //                     path: "$userData",
    //                     preserveNullAndEmptyArrays: true
    //                 }
    //             },
    //             {
    //                 "$project": {
    //                     "_id": 1,
    //                     "orderType": 1,
    //                     "status": 1,
    //                     "ratingStatus": 1,
    //                     "saveAmount": 1,
    //                     "roundOff": 1,
    //                     "paymentStatus": 1,
    //                     "storeId": 1,
    //                     "userId": 1,
    //                     "orderNumber": 1,
    //                     "subTotal": 1,
    //                     "total": 1,
    //                     "tax": 1,
    //                     "pickupDate": 1,
    //                     "pickupTime": 1,
    //                     "orderData": 1,
    //                     "convertedPickupDate": 1,
    //                     "timezone": 1,
    //                     "createdAt": 1,
    //                     "updatedAt": 1,
    //                     "userData.countryCode": 1,
    //                     "userData.mobileNumber": 1,
    //                     "userData.name": 1,
    //                     "refundStatus": 1,
    //                     "commissionPer": 1,
    //                     "storeProceeds": 1,
    //                     "commissionPer": 1,
    //                     "totalCommissionAmount": 1,
    //                     "taxWithCommission": "$totalCommissionAmount",
    //                     "commission": "$totalCommissionAmount",
    //                     "showStoreAmount": 1,
    //                     "taxes": 1

    //                 }
    //             },
    //             { "$sort": sort },
    //             { $skip: skip },
    //             { $limit: limit }
    //         ])
    //         let total = await Order.find(orderQuery).count()
    //         let obj = {
    //             orderList: orderList,
    //             total: total
    //         }
    //         response.log("Order list found successfully", obj);
    //         return response.responseHandlerWithData(res, 200, "Order list found successfully", obj);
    //     } catch (error) {
    //         response.log("Error is=========>", error);
    //         return response.responseHandlerWithMessage(res, 500, "Internal server error");
    //     }
    // },

    getOrderListForBrand: async (req, res) => {

        try {
            response.log("Request for get order is===========>", req.body);
            let storeIdArray = []
            let restaurantList = req.body.restaurantIdData
            for (let i = 0; i < restaurantList.length; i++) {
                storeIdArray.push(ObjectId(restaurantList[i]._id))
            }
            var skip = 0
            let limit = Number(req.body.limit)
            if (Number(req.body.pageNumber)) {
                skip = (Number(req.body.pageNumber) - 1) * Number(limit)
            }
            let orderQuery = {}
            if (req.body.orderStatus == "All") {
                orderQuery = {
                    storeId: { $in: storeIdArray }
                }
            }
            if (req.body.orderStatus == "Pending") {
                orderQuery = {
                    storeId: { $in: storeIdArray },
                    status: 'Pending'
                }
            }
            if (req.body.orderStatus == "Accepted") {
                orderQuery = {
                    storeId: { $in: storeIdArray },
                    status: 'Accepted'
                }
            }
            if (req.body.orderStatus == "Delivered") {
                orderQuery = {
                    storeId: { $in: storeIdArray },
                    status: 'Delivered'
                }
            }
            if (req.body.orderStatus == "Cancelled") {
                orderQuery = {
                    storeId: { $in: storeIdArray },
                    status: 'Cancelled'
                }
            }
            if (req.body.orderStatus == "Rejected") {
                orderQuery = {
                    storeId: { $in: storeIdArray },
                    status: 'Rejected'
                }
            }
            if (req.body.pickupSorting == true) {
                orderQuery =
                {
                    $and: [
                        {
                            $or: [
                                { "status": "Pending" },
                                { "status": "Accepted" }
                            ]
                        },
                        {
                            storeId: { $in: storeIdArray }
                        }
                    ]
                }
            }
            let sort = { createdAt: -1 }
            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                startTodayDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                orderQuery.createdAt = { $gte: startTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                weekDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                orderQuery.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                monthDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                orderQuery.createdAt = { $gte: monthDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Year") {
                let yearDate = new Date(moment().startOf('year').format())
                yearDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                orderQuery.createdAt = { $gte: yearDate, $lte: todayDate }
            }
            if (req.body.fromDate && req.body.toDate) {
                let yearDate = new Date(moment(req.body.fromDate).format())
                yearDate.setHours(00, 00, 00, 000);
                let todayDate = new Date(req.body.toDate)
                todayDate.setHours(23, 59, 59, 999);
                orderQuery.createdAt = { $gte: yearDate, $lte: todayDate }
            }
            if (req.body.pickupSorting == true) {
                sort = { convertedPickupDate: 1 }
                limit = 100
            }
            if (req.body.refundStatus == "Not-Applicable" || req.body.refundStatus == "Pending" || req.body.refundStatus == "Refunded" || req.body.refundStatus == "Rejected" || req.body.refundStatus == "In-process") {
                orderQuery.refundStatus = req.body.refundStatus
            }
            let orderList = await Order.aggregate([
                {
                    $match: orderQuery
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "restaurantData"
                    }
                },
                {
                    $unwind: {
                        path: "$restaurantData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userData"
                    }
                },
                {
                    $unwind: {
                        path: "$userData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "orderType": 1,
                        "status": 1,
                        "ratingStatus": 1,
                        "saveAmount": 1,
                        "roundOff": 1,
                        "paymentStatus": 1,
                        "storeId": 1,
                        "userId": 1,
                        "orderNumber": 1,
                        "subTotal": 1,
                        "total": 1,
                        "tax": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "orderData": 1,
                        "convertedPickupDate": 1,
                        "timezone": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "userData.countryCode": 1,
                        "userData.mobileNumber": 1,
                        "userData.name": 1,
                        "refundStatus": 1,
                        "commissionPer": 1,
                        "storeProceeds": 1,
                        "commissionPer": 1,
                        "totalCommissionAmount": 1,
                        "taxWithCommission": "$totalCommissionAmount",
                        "commission": "$totalCommissionAmount",
                        "showStoreAmount": 1,
                        "taxes": 1,
                        deliveryDate:1,
                        deliveryTime:1,
                        driverNumber:1,
                        driverName:1,
                        deliveryFee:1,
                        dunzoDeliveryFee:1,
                        orderServiceType:1,
                        dunzoTaskId:1,
                        addressData:1,
                        dunzoDriverState:1,
                        dunzoDriverStateTimeline:1,
                        dunzoData:1,
                        trackingUrl:1,
                        orderDeliveredTime:1

                    }
                },
                { "$sort": sort },
                { $skip: skip },
                { $limit: limit }
            ])
            let total = await Order.find(orderQuery).count()
            let obj = {
                orderList: orderList,
                total: total
            }
            response.log("Order list found successfully", obj);
            return response.responseHandlerWithData(res, 200, "Order list found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Cancel order=================================//

    // caneclOrder: async (req, res) => {

    //     try {
    //         response.log("Request for reject order is============>", req.body);
    //         req.checkBody('orderId', 'Something went wrong').notEmpty();
    //         const errors = req.validationErrors();
    //         if (errors) {
    //             let error = errors[0].msg;
    //             response.log("Field is missing")
    //             return response.responseHandlerWithMessage(res, 503, error);
    //         }
    //         let data = await Order.findByIdAndUpdate({ _id: req.body.orderId }, { $set: { status: "Rejected", orderRejectedTime: new Date() } }, { new: true })
    //         if (!data) {
    //             response.log("Invalid order Id");
    //             return response.responseHandlerWithMessage(res, 501, "Something went wrong");
    //         }
    //         let checkUser = await User.findOne({ _id: data.userId })
    //         let notiTitle = `Order Cancelled`
    //         let notiMessage = `Your order ${data.orderNumber} has been cancelled by the restaurant!`
    //         let notiType = `orderReject`
    //         let newId = req.body.orderId
    //         response.log("Order rejected successfully", data)
    //         response.responseHandlerWithMessage(res, 200, "Order rejected successfully");
    //         //zoho
    //         let getOrder = await Order.findOne({ _id: req.body.orderId })
    //         response.log('===========================================ZOHO Works================================================');
    //         let dataString = {
    //             "data": [
    //                 {
    //                     // yyyy-MM-dd'T'hh:mm:ss
    //                     "Order_Rejected_Date_Time": date.format(new Date(),"MMM DD, YYYY hh:mm A"),
    //                     "Order_Status" : "Rejected"
    //                 }
    //             ]
    //         }
    //         let result = await ZOHO.findOne()
    //         var headers = {
    //             'Authorization': `Zoho-oauthtoken ${result.access_token}`
    //         };
    //         var options = {
    //             url: `https://www.zohoapis.in/crm/v2/Customer_Orders/${getOrder.zohoId}`,
    //             method: 'PUT',
    //             headers: headers,
    //             body: JSON.stringify(dataString)
    //         };
    //         request(options,async  function (error, res1, body) {
    //             if (!error) {
    //                 // let data = JSON.stringify(data)
    //                 var obj = JSON.parse(body)
    //                 let data = {...obj};
    //                 response.log('===========================================Saved================================================>',data);
    //             }else{
    //                 response.log('===========================================Not Saved================================================',error);
    //             }
    //         });
    //         let templateId = '1307163465584744190'
    //         // request(`https://api.msg91.com/api/sendhttp.php?mobiles=91${checkUser.mobileNumber}&sender=savEat&message=Your SaveEat order ${data.orderNumber} has been cancelled because your order could not be prepared at this time. We apologize for the inconvenience.&authkey=${authKey}&route=4&country=91&DLT_TE_ID=${templateId}`, async (error, resp, body) => {
    //         //     response.log('body:', body);
    //         // });
    //         request(`https://api.msg91.com/api/sendhttp.php?authkey=${authKey}&sender=savEat&mobiles=91${checkUser.mobileNumber}&route=4&message=Your SaveEat order ${data.orderNumber} has been cancelled because your order could not be prepared at this time. We apologize for the inconvenience.&DLT_TE_ID=${templateId}`, async (error, resp, body) => {
    //         response.log('body:', body);
    //         });
    //         Sendnotification.sendNotificationForAndroid(checkUser.deviceToken, notiTitle, notiMessage, notiType, newId, checkUser.deviceType, (error10, result10) => {
    //             response.log("Notification Sent");
    //         })
    //         return

    //     } catch (error) {
    //         response.log("Error is=========>", error);
    //         return response.responseHandlerWithMessage(res, 500, "Internal server error");
    //     }
    // },

    caneclOrder: async (req, res) => {

        try {
            response.log("Request for reject order is============>", req.body);
            req.checkBody('orderId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let data = await Order.findOneAndUpdate({
                _id: req.body.orderId
            }, {
                    status: "Rejected",
                    orderRejectedTime: new Date(),
                    $push: {
                        dunzoDriverStateTimeline: {
                            state: "Rejected"
                        }
                    }
            }, {
                new: true
            })
            if (!data) {
                response.log("Invalid order Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let checkUser = await User.findOne({ _id: data.userId })
            let getOrder = await Order.findOne({ _id: req.body.orderId })

            let newData = JSON.stringify(getOrder.orderData)
            let orderData = JSON.parse(newData)
            for (let i = 0; i < orderData.length; i++) {
                if (orderData[i].productData.sellingStatus == true) {
                    let checkProduct = await Product.findOne({ _id: orderData[i].productId })
                    let leftQuantity = Number(checkProduct.leftQuantity) + Number(orderData[i].quantity)
                    await Product.findByIdAndUpdate({ _id: orderData[i].productId }, { $set: { leftQuantity: leftQuantity } }, { new: true })
                }
            }


            // let notiTitle = `Order Cancelled`
            let notiTitle = `Your order has been cancelled by our partner.`
            // let notiMessage = `Your order ${data.orderNumber} has been cancelled by the restaurant!`
            let notiMessage = `We're sorry!! For reasons unavoidable your order ${data.orderNumber} has been cancelled by our partner. `
            let notiType = `orderReject`
            let newId = req.body.orderId
            let orderType = getOrder.orderServiceType
            response.log("Order rejected successfully", data)
            response.responseHandlerWithMessage(res, 200, "Order rejected successfully");
            //zoho
            response.log('===========================================ZOHO Works================================================');
            let dataString = {
                "data": [
                    {
                        // yyyy-MM-dd'T'hh:mm:ss
                        "Order_Rejected_Date_Time": date.format(new Date(),"MMM DD, YYYY hh:mm A"),
                        "Order_Status" : "Rejected"
                    }
                ]
            }
            let result = await ZOHO.findOne()
            var headers = {
                'Authorization': `Zoho-oauthtoken ${result.access_token}`
            };
            var options = {
                url: `https://www.zohoapis.in/crm/v2/Customer_Orders/${getOrder.zohoId}`,
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(dataString)
            };
            request(options,async  function (error, res1, body) {
                if (!error) {
                    // let data = JSON.stringify(data)
                    var obj = JSON.parse(body)
                    let data = {...obj};
                    response.log('===========================================Saved================================================>',data);
                }else{
                    response.log('===========================================Not Saved================================================',error);
                }
            });
            let templateId = '1307163465584744190'
            request(`https://api.msg91.com/api/sendhttp.php?mobiles=${checkUser.mobileNumber}&sender=Sender&message=Your SaveEat order #${data.orderNumber} has been cancelled because your order could not be prepared at this time. We apologize for the inconvenience.&authkey=${authKey}&route=4&country=91&DLT_TE_ID=${templateId}`, async (error, resp, body) => {
                response.log('body:', body);
            });
                Sendnotification.sendNotificationForAndroid(checkUser.deviceToken, notiTitle, notiMessage, notiType, newId, checkUser.deviceType, orderType,  (error10, result10) => {
                response.log("Notification Sent");
            })

            //generate refund
            let mainAdmin = await Admin.findOne({ userType: "Admin" })
            let subAdminId = (mainAdmin.creditNumber)
            let obj = new Coins({
            userId: ObjectId(checkUser._id),
            creditNumber: "CR" + subAdminId,
            creditTitle: "Refund",
            // creditCode: req.body.creditCode,
            creditType: 'Direct',
            remaningFrequency: getOrder.total,
            // totalFrequency: req.body.totalFrequency,
            creditAmount: getOrder.total,

            description: "Refund",

            // fromDate: req.body.fromDate,
            // expiryDate: req.body.expiryDate
            })

            await obj.save()

            let subAdminIds = (mainAdmin.creditNumber) + 1
            await Admin.findByIdAndUpdate({ _id: mainAdmin._id }, { $set: { "creditNumber": subAdminIds } }, { new: true, lean: true })

            let totalCreaditedAmount = Number(checkUser.walletAmount)+Number(getOrder.total)
            let updateCredit = await User.findOneAndUpdate({ _id: ObjectId(checkUser._id) }, { $set: { "walletAmount": totalCreaditedAmount } }, { new: true, lean: true })
            if(updateCredit){
            // let notiTitle2 = `${checkUser.name}! You received ${getOrder.total} amount in your wallet.`
            let notiTitle2 = `${getOrder.total} Credits refunded to your account.`
            let notiMessage2 = `We have refunded ${getOrder.total} credits in your account. Use them before they expire.`
            let notiType = 'credit'
            let newId = checkUser._id
            let deviceToken = checkUser.deviceToken
            let deviceType = checkUser.deviceType


            Sendnotification.sendNotificationForAndroid(deviceToken,notiTitle2, notiMessage2, notiType, newId, deviceType, (error10, result10) => {
                response.log("Notification Sent");
            })
            } 


            //dunzo
            response.log('===========================================DUNZO Works================================================');
            let dunzoResult = await DUNZO.findOne()

            let dataString1 = {
                "cancellation_reason": "Changed my mind"
            }
            var headers = {
                'Authorization': `${dunzoResult.access_token}`,
                'client-id': '515a5dd7-7f13-4efa-b840-b568deec494d'
            };
            var options = {
                url: `https://api.dunzo.in/api/v1/tasks/${getOrder.dunzoTaskId}/_cancel`,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dataString1)
            };
            request(options, async function (error, res1, body) {
                if (!error) {
                    response.log('====================================Task Cancelled=========')
                } else {
                    console.log('===========================================Not get================================================', error);
                }
            });
            return

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Accept order===============================//

    // acceptOrder: async (req, res) => {

    //     try {
    //         response.log("Request for reject order is============>", req.body);
    //         req.checkBody('orderId', 'Something went wrong').notEmpty();
    //         const errors = req.validationErrors();
    //         if (errors) {
    //             let error = errors[0].msg;
    //             response.log("Field is missing")
    //             return response.responseHandlerWithMessage(res, 503, error);
    //         }
    //         let data = await Order.findByIdAndUpdate({ _id: req.body.orderId }, { $set: { status: "Accepted", orderAcceptedTime: new Date() } }, { new: true })
    //         if (!data) {
    //             response.log("Invalid order Id");
    //             return response.responseHandlerWithMessage(res, 501, "Something went wrong");
    //         }
    //         let checkUser = await User.findOne({ _id: data.userId })
    //         let notiTitle = `Order Accepted`
    //         let notiMessage = `Your order ${data.orderNumber} has been accepted by the restaurant!`
    //         let notiType = `orderAccept`
    //         let newId = req.body.orderId
    //         response.log("Order accepted successfully", data)
    //         response.responseHandlerWithMessage(res, 200, "Order accepted successfully");
    //         let getOrder = await Order.findOne({ _id: req.body.orderId })
    //         let getStoreData = await Brand.findOne({ _id: getOrder.storeId.toString() })
    //         if (getStoreData.wallet > 0) {
    //             let walletCheck = getStoreData.wallet - getOrder.totalCommissionAmount
    //             if( walletCheck < 0){
    //                 let updateBrandWallet = await Brand.findByIdAndUpdate({
    //                     _id: getOrder.storeId.toString()
    //                 }, {
    //                     $set: {
    //                         wallet: 0
    //                     }
    //                 }, {
    //                     new: true
    //                 })                 
    //             }else{
    //             let updateBrandWallet = await Brand.findByIdAndUpdate({
    //                 _id: getOrder.storeId.toString()
    //             }, {
    //                 $inc: {
    //                   wallet: -getOrder.totalCommissionAmount
    //                 }
    //               })
    //             }
    //         } else {
    //             let updateBrandWallet = await Brand.findByIdAndUpdate({
    //                 _id: getOrder.storeId.toString()
    //             }, {
    //                 $set: {
    //                     wallet: 0
    //                 }
    //             }, {
    //                 new: true
    //             })
    //         }
    //         //zoho
    //         response.log('===========================================ZOHO Works================================================');
    //         let dataString = {
    //             "data": [
    //                 {
    //                     "Order_Accepted_Date_Time": date.format(new Date(),"MMM DD, YYYY hh:mm A"),
    //                     "Order_Status" : "Accepted"
    //                 }
    //             ]
    //         }
    //         let result = await ZOHO.findOne()
    //         var headers = {
    //             'Authorization': `Zoho-oauthtoken ${result.access_token}`
    //         };
    //         var options = {
    //             url: `https://www.zohoapis.in/crm/v2/Customer_Orders/${getOrder.zohoId}`,
    //             method: 'PUT',
    //             headers: headers,
    //             body: JSON.stringify(dataString)
    //         };
    //         request(options,async  function (error, res1, body) {
    //             if (!error) {
    //                 // let data = JSON.stringify(data)
    //                 var obj = JSON.parse(body)
    //                 let data = {...obj};
    //                 response.log('===========================================Saved================================================>',data);
    //             }else{
    //                 response.log('===========================================Not Saved================================================',error);
    //             }
    //         });
    //         Sendnotification.sendNotificationForAndroid(checkUser.deviceToken, notiTitle, notiMessage, notiType, newId, checkUser.deviceType, (error10, result10) => {
    //             response.log("Notification Sent");
    //         })
    //     } catch (error) {
    //         response.log("Error is=========>", error);
    //         return response.responseHandlerWithMessage(res, 500, "Internal server error");
    //     }
    // },

    //===========================================Order ready for pickup========================//

    acceptOrder: async (req, res) => {

        try {
            response.log("Request for reject order is============>", req.body);
            req.checkBody('orderId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let data = await Order.findOneAndUpdate({
                _id: req.body.orderId
            }, {
                    status: "Accepted",
                    orderAcceptedTime: new Date(),
                    $push: {
                        dunzoDriverStateTimeline: {
                            state: "Accepted"
                        }
                    }
            }, {
                new: true
            })
            if (!data) {
                response.log("Invalid order Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let checkUser = await User.findOne({ _id: data.userId })
            let getOrder = await Order.findOne({ _id: req.body.orderId })
            let notiMessage 
            let notiTitle
            if(getOrder.orderServiceType == 'pickup'){
                notiTitle = `Order Accepted`
                notiMessage = `Your order ${data.orderNumber} has been accepted by the restaurant!`
            }else{
                notiTitle = `Your order has been confirmed for delivery`
                notiMessage = `The order ${data.orderNumber} is being prepared and we'll update you once it's picked up by our delivery partner. `
            }
            // let notiTitle = `Order Accepted`
            // let notiTitle = `Your order has been confirmed for delivery`
            // let notiMessage = `Your order ${data.orderNumber} has been accepted by the restaurant!`
            // let notiMessage = `The order ${data.orderNumber} is being prepared and we'll update you once it's picked up by our delivery partner. `
            let notiType = `orderAccept`
            let newId = req.body.orderId
            let orderType = getOrder.orderServiceType
            response.log("Order accepted successfully", data)
            response.responseHandlerWithMessage(res, 200, "Order accepted successfully");
            let getStoreData = await Brand.findOne({ _id: getOrder.storeId.toString() })
            if (getStoreData.wallet > 0) {
                let walletCheck = getStoreData.wallet - getOrder.totalCommissionAmount
                if( walletCheck < 0){
                    let updateBrandWallet = await Brand.findByIdAndUpdate({
                        _id: getOrder.storeId.toString()
                    }, {
                        $set: {
                            wallet: 0
                        }
                    }, {
                        new: true
                    })                 
                }else{
                let updateBrandWallet = await Brand.findByIdAndUpdate({
                    _id: getOrder.storeId.toString()
                }, {
                    $inc: {
                      wallet: -getOrder.totalCommissionAmount
                    }
                  })
                }
            } else {
                let updateBrandWallet = await Brand.findByIdAndUpdate({
                    _id: getOrder.storeId.toString()
                }, {
                    $set: {
                        wallet: 0
                    }
                }, {
                    new: true
                })
            }
            //zoho
            response.log('===========================================ZOHO Works================================================');
            let dataString = {
                "data": [
                    {
                        "Order_Accepted_Date_Time": date.format(new Date(),"MMM DD, YYYY hh:mm A"),
                        "Order_Status" : "Accepted"
                    }
                ]
            }
            let result = await ZOHO.findOne()
            var headers = {
                'Authorization': `Zoho-oauthtoken ${result.access_token}`
            };
            var options = {
                url: `https://www.zohoapis.in/crm/v2/Customer_Orders/${getOrder.zohoId}`,
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(dataString)
            };
            request(options,async  function (error, res1, body) {
                if (!error) {
                    // let data = JSON.stringify(data)
                    var obj = JSON.parse(body)
                    let data = {...obj};
                    response.log('===========================================Saved================================================>',data);
                }else{
                    response.log('===========================================Not Saved================================================',error);
                }
            });
            Sendnotification.sendNotificationForAndroid(checkUser.deviceToken, notiTitle, notiMessage, notiType, newId, checkUser.deviceType, orderType, (error10, result10) => {
                response.log("Notification Sent");
            })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Order ready for pickup========================//
    
    // readyForPickupOrder: async (req, res) => {

    //     try {
    //         response.log("Request for reject order is============>", req.body);
    //         req.checkBody('orderId', 'Something went wrong').notEmpty();
    //         const errors = req.validationErrors();
    //         if (errors) {
    //             let error = errors[0].msg;
    //             response.log("Field is missing")
    //             return response.responseHandlerWithMessage(res, 503, error);
    //         }
    //         let data = await Order.findByIdAndUpdate({ _id: req.body.orderId }, { $set: { status: "Order Ready for pickup", orderReadyForPickupTime: new Date() } }, { new: true })
    //         if (!data) {
    //             response.log("Invalid order Id");
    //             return response.responseHandlerWithMessage(res, 501, "Something went wrong");
    //         }
    //         let checkUser = await User.findOne({ _id: data.userId })
    //         let checkOrder = await Order.findOne({ _id: req.body.orderId })
    //         let notiTitle = `Order ready for pickup`
    //         let notiMessage = `Your order ${data.orderNumber} is ready for pickup!`
    //         let notiType = `orderReadyForPickup`
    //         let newId = req.body.orderId
    //         response.log("Order status updated successfully", data)
    //         response.responseHandlerWithMessage(res, 200, "Order status updated successfully");
    //         //zoho
    //         response.log('===========================================ZOHO Works================================================');
    //         let dataString = {
    //             "data": [
    //                 {
    //                     "Order_Status": 'Order Ready for pickup'
    //                 }
    //             ]
    //         }
    //         let result = await ZOHO.findOne()
    //         var headers = {
    //             'Authorization': `Zoho-oauthtoken ${result.access_token}`
    //         };
    //         var options = {
    //             url: `https://www.zohoapis.in/crm/v2/Customer_Orders/${checkOrder.zohoId}`,
    //             method: 'PUT',
    //             headers: headers,
    //             body: JSON.stringify(dataString)
    //         };
    //         request(options,async  function (error, res1, body) {
    //             if (!error) {
    //                 // let data = JSON.stringify(data)
    //                 var obj = JSON.parse(body)
    //                 let data = {...obj};
    //                 response.log('===========================================Saved================================================>',body);
    //             }else{
    //                 response.log('===========================================Not Saved================================================',body);
    //             }
    //         });
    //         Sendnotification.sendNotificationForAndroid(checkUser.deviceToken, notiTitle, notiMessage, notiType, newId, checkUser.deviceType, (error10, result10) => {
    //             response.log("Notification Sent");
    //         })
    //     } catch (error) {
    //         response.log("Error is=========>", error);
    //         return response.responseHandlerWithMessage(res, 500, "Internal server error");
    //     }
    // },

    //============================================Order delivered================================//

    readyForPickupOrder: async (req, res) => {

        try {
            response.log("Request for reject order is============>", req.body);
            req.checkBody('orderId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let data = await Order.findOneAndUpdate({
                _id: req.body.orderId
            }, {
                    status: "Order Ready for pickup",
                    orderReadyForPickupTime: new Date(),
                    $push: {
                        dunzoDriverStateTimeline: {
                            state: "Order Ready for pickup"
                        }
                    }
            }, {
                new: true
            })
            if (!data) {
                response.log("Invalid order Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let checkUser = await User.findOne({ _id: data.userId })
            let checkOrder = await Order.findOne({ _id: req.body.orderId })
            let notiTitle = `Order ready for pickup`
            // let notiTitle = `Your order has been confirmed for delivery`
            let notiMessage = `Your order ${data.orderNumber} is ready for pickup!`
            // let notiMessage = `The order ${data.orderNumber} is being prepared and we'll update you once it's picked up by our delivery partner. `
            let notiType = `orderReadyForPickup`
            let newId = req.body.orderId
            let orderType = checkOrder.orderServiceType
            response.log("Order status updated successfully", data)
            response.responseHandlerWithMessage(res, 200, "Order status updated successfully");
            //zoho
            response.log('===========================================ZOHO Works================================================');
            let dataString = {
                "data": [
                    {
                        "Order_Status": 'Order Ready for pickup'
                    }
                ]
            }
            let result = await ZOHO.findOne()
            var headers = {
                'Authorization': `Zoho-oauthtoken ${result.access_token}`
            };
            var options = {
                url: `https://www.zohoapis.in/crm/v2/Customer_Orders/${checkOrder.zohoId}`,
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(dataString)
            };
            request(options,async  function (error, res1, body) {
                if (!error) {
                    // let data = JSON.stringify(data)
                    var obj = JSON.parse(body)
                    let data = {...obj};
                    response.log('===========================================Saved================================================>',body);
                }else{
                    response.log('===========================================Not Saved================================================',body);
                }
            });
            Sendnotification.sendNotificationForAndroid(checkUser.deviceToken, notiTitle, notiMessage, notiType, newId, checkUser.deviceType, orderType, (error10, result10) => {
                response.log("Notification Sent");
            })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },


    // orderDelivered: async (req, res) => {

    //     try {
    //         response.log("Request for reject order is============>", req.body);
    //         req.checkBody('orderId', 'Something went wrong').notEmpty();
    //         req.checkBody('otp', 'Something went wrong').notEmpty();
    //         const errors = req.validationErrors();
    //         if (errors) {
    //             let error = errors[0].msg;
    //             response.log("Field is missing")
    //             return response.responseHandlerWithMessage(res, 503, error);
    //         }
    //         let date = moment().format('YYYY-MM-DD')
    //         let today = new Date();
    //         let month = today.getUTCMonth() + 1;
    //         let day = today.getUTCDate();
    //         let year = today.getUTCFullYear();
    //         let checkOtp = await Order.findOne({ _id: req.body.orderId, pin: req.body.otp })
    //         if (!checkOtp) {
    //             response.log("Invalid OTP");
    //             return response.responseHandlerWithMessage(res, 501, "Invalid OTP");
    //         }
    //         let amount = Number(checkOtp.total) * 2 / 100
    //         let commissionAmount = Number(checkOtp.total) - amount
    //         let obj = {
    //             status: "Delivered",
    //             orderDeliveredTime: new Date(),
    //             commissionAmount: amount,
    //             adminAmount: amount,
    //             storeAmount: commissionAmount
    //         }
    //         let data = await Order.findByIdAndUpdate({ _id: req.body.orderId }, { $set: obj }, { new: true })
    //         if (!data) {
    //             response.log("Invalid order Id");
    //             return response.responseHandlerWithMessage(res, 501, "Something went wrong");
    //         }
    //         let checkFirstUser = await Newusers.findOne({ userId: data.userId, storeId: data.storeId })
    //         if (!checkFirstUser) {
    //             let newUserObj = new Newusers({
    //                 userId: data.userId,
    //                 storeId: data.storeId,
    //                 orderId: req.body.orderId,
    //                 date: date
    //             })
    //             await newUserObj.save()
    //         }
    //         let orderData = data.orderData
    //         for (let i = 0; i < orderData.length; i++) {
    //             let settingType = ''
    //             let commission = 0
    //             let amount = 0
    //             let quantity = 0
    //             let cost = 0
    //             if (orderData[i].productData.sellingStatus == true) {
    //                 settingType = 'Selling'
    //                 commission = checkOtp.commissionPer
    //                 cost = orderData[i].productData.offeredPrice
    //                 amount = orderData[i].productData.offeredPrice
    //                 quantity = orderData[i].quantity
    //             }
    //             if (orderData[i].productData.sellingStatus == false) {
    //                 settingType = 'Fixed'
    //                 commission = checkOtp.fixCommissionPer
    //                 cost = orderData[i].productData.price
    //                 amount = orderData[i].productData.price
    //                 quantity = orderData[i].quantity
    //             }
    //             let earningObj = new Productearning({
    //                 brandId: data.storeId,
    //                 userId: checkOtp.userId,
    //                 productId: orderData[i].productId,
    //                 orderId: req.body.orderId,
    //                 cost: cost,
    //                 sellingStatus: orderData[i].productData.sellingStatus,
    //                 day: day,
    //                 month: month,
    //                 year: year,
    //                 orderDate: date,
    //                 amount: amount,
    //                 quantity: quantity,
    //                 commission: commission,
    //                 settingType: settingType
    //             })
    //             await earningObj.save()
    //         }
    //         let rescuedObj = new Rescuefood({
    //             userId: data.userId,
    //             storeId: data.storeId,
    //             orderId: req.body.orderId,
    //             rescueFood: checkOtp.rescusedFood,
    //             day: day,
    //             month: month,
    //             year: year
    //         })
    //         await rescuedObj.save()
    //         if (checkOtp.total >= 500) {
    //             let checkReward = await Reward.findOne({ userId: checkOtp.userId, claimedStatus: 'Unclaimed' })
    //             if (!checkReward) {
    //                 let checkOneStar = await Star.findOne({ userId: checkOtp.userId })
    //                 if (checkOneStar) {
    //                     let oldDate = new Date(checkOneStar.createdAt)
    //                     oldDate.setMonth(oldDate.getMonth() + 30)
    //                     oldDate.setHours(00, 00, 00, 000);
    //                     let todatDate = new Date()
    //                     if (oldDate > todatDate) {
    //                         let checkAllStar = await Star.find({ userId: checkOtp.userId, createdAt: { $lte: oldDate } }).count()
    //                         if (checkAllStar < 5) {
    //                             let starObj = new Star({
    //                                 userId: checkOtp.userId,
    //                                 orderId: req.body.orderId,
    //                                 day: day,
    //                                 month: month,
    //                                 year: year
    //                             })
    //                             await starObj.save()
    //                         }
    //                         let newCount = await Star.find({ userId: checkOtp.userId, createdAt: { $lte: oldDate } }).count()
    //                         if (newCount == 5) {
    //                             let checkAdmin = await Admin.findOne({ userType: 'Admin' })
    //                             let rewardNumber = `RE${checkAdmin.rewardNumber}`
    //                             let newNumber = checkAdmin.rewardNumber + 1
    //                             let rewardObj = new Reward({
    //                                 userId: checkOtp.userId,
    //                                 claimedStatus: 'Unclaimed',
    //                                 rewardNumber: rewardNumber
    //                             })
    //                             await rewardObj.save()
    //                             await Admin.findByIdAndUpdate({ _id: checkAdmin._id }, { $set: { rewardNumber: newNumber } }, { new: true })
    //                         }
    //                     }
    //                     if (oldDate < todatDate) {
    //                         let newCount = await Star.find({ userId: checkOtp.userId, createdAt: { $lte: oldDate } }).count()
    //                         if (newCount < 5) {
    //                             await Star.deleteMany({ userId: checkOtp.userId })
    //                             let starObj = new Star({
    //                                 userId: checkOtp.userId,
    //                                 orderId: req.body.orderId,
    //                                 day: day,
    //                                 month: month,
    //                                 year: year
    //                             })
    //                             await starObj.save()
    //                         }
    //                     }
    //                 }
    //                 if (!checkOneStar) {
    //                     let starObj = new Star({
    //                         userId: checkOtp.userId,
    //                         orderId: req.body.orderId,
    //                         day: day,
    //                         month: month,
    //                         year: year
    //                     })
    //                     await starObj.save()
    //                 }
    //             }
    //         }
    //         let checkUser = await User.findOne({ _id: data.userId })
    //         let notiTitle = `Order Delivered`
    //         let notiMessage = `Your order ${data.orderNumber} has been delivered!`
    //         let notiType = `orderDelivered`
    //         let newId = req.body.orderId
    //         response.log("Order delivered successfully", data)
    //         //zoho
    //         response.log('===========================================ZOHO Works================================================');
    //         let dataString = {
    //             "data": [
    //                 {
    //                     "Order_Status": 'Delivered'
    //                 }
    //             ]
    //         }
    //         let result = await ZOHO.findOne()
    //         var headers = {
    //             'Authorization': `Zoho-oauthtoken ${result.access_token}`
    //         };
    //         var options = {
    //             url: `https://www.zohoapis.in/crm/v2/Customer_Orders/${checkOtp.zohoId}`,
    //             method: 'PUT',
    //             headers: headers,
    //             body: JSON.stringify(dataString)
    //         };
    //         request(options,async  function (error, res1, body) {
    //             if (!error) {
    //                 // let data = JSON.stringify(data)
    //                 var obj = JSON.parse(body)
    //                 let data = {...obj};
    //                 response.log('===========================================Saved================================================>',body);
    //             }else{
    //                 response.log('===========================================Not Saved================================================',body);
    //             }
    //         });
    //         response.responseHandlerWithMessage(res, 200, "Order delivered successfully");
    //         let templateId = '1307163465609993586'
    //         // request(`https://api.msg91.com/api/sendhttp.php?mobiles=91${checkUser.mobileNumber}&sender=savEat&message=Your SaveEat order #${checkOtp.orderNumber} was delivered on time. Order from your favorite restaurants and enjoy our speedy delivery.&authkey=${authKey}&route=4&country=91&DLT_TE_ID=${templateId}`, async (error, resp, body) => {
    //         //     response.log('body:', body);
    //         // });
    //         request(`https://api.msg91.com/api/sendhttp.php?authkey=${authKey}&sender=savEat&mobiles=91${checkUser.mobileNumber}&route=4&message=Your SaveEat order #${checkOtp.orderNumber} was delivered on time. Order from your favorite restaurants and enjoy our speedy delivery.&DLT_TE_ID=${templateId}`, async (error, resp, body) => {
    //             response.log('body:', body);
    //         });
    //         let orderQuery = { userId: data.userId, status: "Delivered", month: month, year: year }
    //         let checkOrderCount = await Order.find(orderQuery).count()
    //         if (checkOrderCount >= 5 && checkOrderCount < 11) {
    //             let lordOfThePlanet = await Badge.findOne({ name: 'Lord of the Planet' })
    //             if (lordOfThePlanet) {
    //                 let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: lordOfThePlanet._id })
    //                 if (!badgeEarning) {
    //                     let earningObj = new Badgeearning({
    //                         userId: data.userId,
    //                         badgeId: lordOfThePlanet._id,
    //                         day: day,
    //                         month: month,
    //                         year: year
    //                     })
    //                     await earningObj.save()
    //                 }
    //             }
    //         }
    //         if (checkOrderCount >= 10 && checkOrderCount < 15) {
    //             let kingCorn = await Badge.findOne({ name: 'King Corn' })
    //             if (kingCorn) {
    //                 let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: kingCorn._id })
    //                 if (!badgeEarning) {
    //                     let earningObj = new Badgeearning({
    //                         userId: data.userId,
    //                         badgeId: kingCorn._id,
    //                         day: day,
    //                         month: month,
    //                         year: year
    //                     })
    //                     await earningObj.save()
    //                 }
    //             }
    //         }
    //         if (checkOrderCount >= 15) {
    //             let conqueror = await Badge.findOne({ name: 'Conqueror' })
    //             if (conqueror) {
    //                 let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: conqueror._id })
    //                 if (!badgeEarning) {
    //                     let earningObj = new Badgeearning({
    //                         userId: data.userId,
    //                         badgeId: conqueror._id,
    //                         day: day,
    //                         month: month,
    //                         year: year
    //                     })
    //                     await earningObj.save()
    //                 }
    //             }
    //         }
    //         if (data.saveAmount >= 500 && data.saveAmount < 1000) {
    //             let littleSaver = await Badge.findOne({ name: 'Little Saver' })
    //             if (littleSaver) {
    //                 let earningObj = new Badgeearning({
    //                     userId: data.userId,
    //                     badgeId: littleSaver._id,
    //                     day: day,
    //                     month: month,
    //                     year: year
    //                 })
    //                 await earningObj.save()
    //             }
    //         }
    //         if (data.saveAmount >= 1000) {
    //             let superSaver = await Badge.findOne({ name: 'Super Saver' })
    //             if (superSaver) {
    //                 let earningObj = new Badgeearning({
    //                     userId: data.userId,
    //                     badgeId: superSaver._id,
    //                     day: day,
    //                     month: month,
    //                     year: year
    //                 })
    //                 await earningObj.save()
    //             }
    //         }
    //         let rescusedFoodTotalSum = await Rescuefood.aggregate([
    //             {
    //                 $match: {
    //                     userId: ObjectId(data.userId),
    //                     month: month,
    //                     year: year
    //                 }
    //             },
    //             {
    //                 "$group": {
    //                     _id: "$userId",
    //                     foodSum: { "$sum": "$rescueFood" }
    //                 }
    //             }
    //         ])
    //         let newFoodSum = rescusedFoodTotalSum[0].foodSum
    //         if (newFoodSum >= 5 && newFoodSum < 15) {
    //             let foodLover = await Badge.findOne({ name: 'Food Lover' })
    //             if (foodLover) {
    //                 let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: foodLover._id })
    //                 if (!badgeEarning) {
    //                     let earningObj = new Badgeearning({
    //                         userId: data.userId,
    //                         badgeId: foodLover._id,
    //                         day: day,
    //                         month: month,
    //                         year: year
    //                     })
    //                     await earningObj.save()
    //                 }
    //             }
    //         }
    //         if (newFoodSum >= 15 && newFoodSum < 25) {
    //             let carbonCapturer = await Badge.findOne({ name: 'Carbon Capturer' })
    //             if (carbonCapturer) {
    //                 let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: carbonCapturer._id })
    //                 if (!badgeEarning) {
    //                     let earningObj = new Badgeearning({
    //                         userId: data.userId,
    //                         badgeId: carbonCapturer._id,
    //                         day: day,
    //                         month: month,
    //                         year: year
    //                     })
    //                     await earningObj.save()
    //                 }
    //             }
    //         }
    //         if (newFoodSum >= 25 && newFoodSum < 50) {
    //             let treeLover = await Badge.findOne({ name: 'Tree Lover' })
    //             if (treeLover) {
    //                 let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: treeLover._id })
    //                 if (!badgeEarning) {
    //                     let earningObj = new Badgeearning({
    //                         userId: data.userId,
    //                         badgeId: treeLover._id,
    //                         day: day,
    //                         month: month,
    //                         year: year
    //                     })
    //                     await earningObj.save()
    //                 }
    //             }
    //         }
    //         if (newFoodSum >= 50) {
    //             let co2Minator = await Badge.findOne({ name: 'Co2 Minator' })
    //             if (co2Minator) {
    //                 let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: co2Minator._id })
    //                 if (!badgeEarning) {
    //                     let earningObj = new Badgeearning({
    //                         userId: data.userId,
    //                         badgeId: co2Minator._id,
    //                         day: day,
    //                         month: month,
    //                         year: year
    //                     })
    //                     await earningObj.save()
    //                 }
    //             }
    //         }
    //         if (data.saveAmount >= 500 && data.saveAmount < 1000) {
    //             let littleSaver = await Badge.findOne({ name: 'Little Saver' })
    //             if (littleSaver) {
    //                 let earningObj = new Badgeearning({
    //                     userId: data.userId,
    //                     badgeId: littleSaver._id,
    //                     day: day,
    //                     month: month,
    //                     year: year
    //                 })
    //                 await earningObj.save()
    //             }
    //         }
    //         if (data.saveAmount >= 1000) {
    //             let superSaver = await Badge.findOne({ name: 'Super Saver' })
    //             if (superSaver) {
    //                 let earningObj = new Badgeearning({
    //                     userId: data.userId,
    //                     badgeId: superSaver._id,
    //                     day: day,
    //                     month: month,
    //                     year: year
    //                 })
    //                 await earningObj.save()
    //             }
    //         }
    //         let todayDay = moment().format('dddd');
    //         if (todayDay == "Sunday") {
    //             let pastSeven = []
    //             let pastThree = []
    //             for (let i = 0; i < 7; i++) {
    //                 let d = new Date()
    //                 let convertedDate = d.setDate(d.getDate() - i);
    //                 let newMonth = convertedDate.getUTCMonth() + 1;
    //                 let newDay = convertedDate.getUTCDate();
    //                 let newYear = today.getUTCFullYear();
    //                 let checkOrder = await Order.findOne({ userId: data.userId, status: 'Delivered', month: newMonth, day: newDay, year: newYear })
    //                 if (checkOrder) {
    //                     pastSeven.push(i)
    //                 }
    //             }
    //             for (let i = 0; i < 3; i++) {
    //                 let d = new Date()
    //                 let convertedDate = d.setDate(d.getDate() - i);
    //                 let newMonth = convertedDate.getUTCMonth() + 1;
    //                 let newDay = convertedDate.getUTCDate();
    //                 let newYear = today.getUTCFullYear();
    //                 let checkOrder = await Order.findOne({ userId: data.userId, status: 'Delivered', month: newMonth, day: newDay, year: newYear })
    //                 if (checkOrder) {
    //                     pastThree.push(i)
    //                 }
    //             }
    //             if (pastThree.length == 3) {
    //                 let champion = await Badge.findOne({ name: 'Champion' })
    //                 if (champion) {
    //                     let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, day: day, badgeId: champion._id })
    //                     if (!badgeEarning) {
    //                         let earningObj = new Badgeearning({
    //                             userId: data.userId,
    //                             badgeId: champion._id,
    //                             day: day,
    //                             month: month,
    //                             year: year
    //                         })
    //                         await earningObj.save()
    //                     }
    //                 }
    //             }
    //             if (pastThree.length == 7) {
    //                 let weekendWarrior = await Badge.findOne({ name: 'Weekend Warrior' })
    //                 if (weekendWarrior) {
    //                     let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, day: day, badgeId: weekendWarrior._id })
    //                     if (!badgeEarning) {
    //                         let earningObj = new Badgeearning({
    //                             userId: data.userId,
    //                             badgeId: weekendWarrior._id,
    //                             day: day,
    //                             month: month,
    //                             year: year
    //                         })
    //                         await earningObj.save()
    //                     }
    //                 }
    //             }
    //         }
    //         Sendnotification.sendNotificationForAndroid(checkUser.deviceToken, notiTitle, notiMessage, notiType, newId, checkUser.deviceType, (error10, result10) => {
    //             response.log("Notification Sent");
    //         })
    //         let checkRestro = await Brand.findOne({ _id: data.storeId })
    //         let rescusedFood = data.rescusedFood
    //         let orderNumber = data.orderNumber
    //         let businessName = checkRestro.businessName
    //         let createdAt = moment(data.createdAt).format('LLLL');
    //         let orderDeliveredTime = moment(data.orderDeliveredTime).format('LLLL');
    //         let status = data.status
    //         let address = checkRestro.address
    //         let newOrderData = JSON.stringify(data.orderData)
    //         let subTotal = data.subTotal
    //         let taxes = data.taxes
    //         let saveEatFees = data.saveEatFees
    //         let total = data.total
    //         let saveAmount = data.saveAmount
    //         let subject = 'Order Invoice'
    //         let emailData = {
    //             rescusedFood: rescusedFood,
    //             orderNumber: orderNumber,
    //             businessName: businessName,
    //             createdAt: createdAt,
    //             orderDeliveredTime: orderDeliveredTime,
    //             status: status,
    //             address: address,
    //             subTotal: subTotal,
    //             taxes: taxes,
    //             saveEatFees: saveEatFees,
    //             total: total,
    //             saveAmount: saveAmount,

    //         }
    //         SendMail.orderInvoice((checkUser.email).toLowerCase(), subject, emailData, newOrderData, status, createdAt, address, (error10, result10) => {
    //             response.log("Email sent")
    //         })
    //     } catch (error) {
    //         response.log("Error is=========>", error);
    //         return response.responseHandlerWithMessage(res, 500, "Internal server error");
    //     }
    // },

    orderDelivered: async (req, res) => {

        try {
            response.log("Request for reject order is============>", req.body);
            req.checkBody('orderId', 'Something went wrong').notEmpty();
            req.checkBody('otp', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let date = moment().format('YYYY-MM-DD')
            let today = new Date();
            let month = today.getUTCMonth() + 1;
            let day = today.getUTCDate();
            let year = today.getUTCFullYear();
            let checkOtp = await Order.findOne({ _id: req.body.orderId, pin: req.body.otp })
            if (!checkOtp) {
                response.log("Invalid OTP");
                return response.responseHandlerWithMessage(res, 501, "Invalid OTP");
            }
            let amount = Number(checkOtp.total) * 2 / 100
            let commissionAmount = Number(checkOtp.total) - amount
            let obj = {
                status: "Delivered",
                orderDeliveredTime: new Date(),
                commissionAmount: amount,
                adminAmount: amount,
                storeAmount: commissionAmount
            }
            let data = await Order.findByIdAndUpdate({ _id: req.body.orderId }, { $set: obj }, { new: true })
            if (!data) {
                response.log("Invalid order Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let checkFirstUser = await Newusers.findOne({ userId: data.userId, storeId: data.storeId })
            if (!checkFirstUser) {
                let newUserObj = new Newusers({
                    userId: data.userId,
                    storeId: data.storeId,
                    orderId: req.body.orderId,
                    date: date
                })
                await newUserObj.save()
            }
            let orderData = data.orderData
            for (let i = 0; i < orderData.length; i++) {
                let settingType = ''
                let commission = 0
                let amount = 0
                let quantity = 0
                let cost = 0
                if (orderData[i].productData.sellingStatus == true) {
                    settingType = 'Selling'
                    commission = checkOtp.commissionPer
                    cost = orderData[i].productData.offeredPrice
                    amount = orderData[i].productData.offeredPrice
                    quantity = orderData[i].quantity
                }
                if (orderData[i].productData.sellingStatus == false) {
                    settingType = 'Fixed'
                    commission = checkOtp.fixCommissionPer
                    cost = orderData[i].productData.price
                    amount = orderData[i].productData.price
                    quantity = orderData[i].quantity
                }
                let earningObj = new Productearning({
                    brandId: data.storeId,
                    userId: checkOtp.userId,
                    productId: orderData[i].productId,
                    orderId: req.body.orderId,
                    cost: cost,
                    sellingStatus: orderData[i].productData.sellingStatus,
                    day: day,
                    month: month,
                    year: year,
                    orderDate: date,
                    amount: amount,
                    quantity: quantity,
                    commission: commission,
                    settingType: settingType
                })
                await earningObj.save()
            }
            let rescuedObj = new Rescuefood({
                userId: data.userId,
                storeId: data.storeId,
                orderId: req.body.orderId,
                rescueFood: checkOtp.rescusedFood,
                day: day,
                month: month,
                year: year
            })
            await rescuedObj.save()
            if (checkOtp.total >= 500) {
                let checkReward = await Reward.findOne({ userId: checkOtp.userId, claimedStatus: 'Unclaimed' })
                if (!checkReward) {
                    let checkOneStar = await Star.findOne({ userId: checkOtp.userId })
                    if (checkOneStar) {
                        let oldDate = new Date(checkOneStar.createdAt)
                        oldDate.setMonth(oldDate.getMonth() + 30)
                        oldDate.setHours(00, 00, 00, 000);
                        let todatDate = new Date()
                        if (oldDate > todatDate) {
                            let checkAllStar = await Star.find({ userId: checkOtp.userId, createdAt: { $lte: oldDate } }).count()
                            if (checkAllStar < 5) {
                                let starObj = new Star({
                                    userId: checkOtp.userId,
                                    orderId: req.body.orderId,
                                    day: day,
                                    month: month,
                                    year: year
                                })
                                await starObj.save()
                            }
                            let newCount = await Star.find({ userId: checkOtp.userId, createdAt: { $lte: oldDate } }).count()
                            if (newCount == 5) {
                                let checkAdmin = await Admin.findOne({ userType: 'Admin' })
                                let rewardNumber = `RE${checkAdmin.rewardNumber}`
                                let newNumber = checkAdmin.rewardNumber + 1
                                let rewardObj = new Reward({
                                    userId: checkOtp.userId,
                                    claimedStatus: 'Unclaimed',
                                    rewardNumber: rewardNumber
                                })
                                await rewardObj.save()
                                await Admin.findByIdAndUpdate({ _id: checkAdmin._id }, { $set: { rewardNumber: newNumber } }, { new: true })
                            }
                        }
                        if (oldDate < todatDate) {
                            let newCount = await Star.find({ userId: checkOtp.userId, createdAt: { $lte: oldDate } }).count()
                            if (newCount < 5) {
                                await Star.deleteMany({ userId: checkOtp.userId })
                                let starObj = new Star({
                                    userId: checkOtp.userId,
                                    orderId: req.body.orderId,
                                    day: day,
                                    month: month,
                                    year: year
                                })
                                await starObj.save()
                            }
                        }
                    }
                    if (!checkOneStar) {
                        let starObj = new Star({
                            userId: checkOtp.userId,
                            orderId: req.body.orderId,
                            day: day,
                            month: month,
                            year: year
                        })
                        await starObj.save()
                    }
                }
            }
            let checkUser = await User.findOne({ _id: data.userId })
            let notiTitle = `Order Delivered`
            let notiMessage = `Your order ${data.orderNumber} has been delivered!`
            let notiType = `orderDelivered`
            let newId = req.body.orderId
            let orderType = checkOtp.orderServiceType
            response.log("Order delivered successfully", data)
            //zoho
            response.log('===========================================ZOHO Works================================================');
            let dataString = {
                "data": [
                    {
                        "Order_Status": 'Delivered'
                    }
                ]
            }
            let result = await ZOHO.findOne()
            var headers = {
                'Authorization': `Zoho-oauthtoken ${result.access_token}`
            };
            var options = {
                url: `https://www.zohoapis.in/crm/v2/Customer_Orders/${checkOtp.zohoId}`,
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(dataString)
            };
            request(options,async  function (error, res1, body) {
                if (!error) {
                    // let data = JSON.stringify(data)
                    var obj = JSON.parse(body)
                    let data = {...obj};
                    response.log('===========================================Saved================================================>',body);
                }else{
                    response.log('===========================================Not Saved================================================',body);
                }
            });
            response.responseHandlerWithMessage(res, 200, "Order delivered successfully");
            let templateId = '1307163465609993586'
            request(`https://api.msg91.com/api/sendhttp.php?mobiles=${checkUser.mobileNumber}&sender=Sender&message=Your SaveEat order #${checkOtp.orderNumber} was delivered on time. Order from your favorite restaurants and enjoy our speedy delivery.&authkey=${authKey}&route=4&country=91&DLT_TE_ID=${templateId}`, async (error, resp, body) => {
                response.log('body:', body);
            });
            let orderQuery = { userId: data.userId, status: "Delivered", month: month, year: year }
            let checkOrderCount = await Order.find(orderQuery).count()
            if (checkOrderCount >= 5 && checkOrderCount < 11) {
                let lordOfThePlanet = await Badge.findOne({ name: 'Lord of the Planet' })
                if (lordOfThePlanet) {
                    let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: lordOfThePlanet._id })
                    if (!badgeEarning) {
                        let earningObj = new Badgeearning({
                            userId: data.userId,
                            badgeId: lordOfThePlanet._id,
                            day: day,
                            month: month,
                            year: year
                        })
                        await earningObj.save()
                    }
                }
            }
            if (checkOrderCount >= 10 && checkOrderCount < 15) {
                let kingCorn = await Badge.findOne({ name: 'King Corn' })
                if (kingCorn) {
                    let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: kingCorn._id })
                    if (!badgeEarning) {
                        let earningObj = new Badgeearning({
                            userId: data.userId,
                            badgeId: kingCorn._id,
                            day: day,
                            month: month,
                            year: year
                        })
                        await earningObj.save()
                    }
                }
            }
            if (checkOrderCount >= 15) {
                let conqueror = await Badge.findOne({ name: 'Conqueror' })
                if (conqueror) {
                    let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: conqueror._id })
                    if (!badgeEarning) {
                        let earningObj = new Badgeearning({
                            userId: data.userId,
                            badgeId: conqueror._id,
                            day: day,
                            month: month,
                            year: year
                        })
                        await earningObj.save()
                    }
                }
            }
            if (data.saveAmount >= 500 && data.saveAmount < 1000) {
                let littleSaver = await Badge.findOne({ name: 'Little Saver' })
                if (littleSaver) {
                    let earningObj = new Badgeearning({
                        userId: data.userId,
                        badgeId: littleSaver._id,
                        day: day,
                        month: month,
                        year: year
                    })
                    await earningObj.save()
                }
            }
            if (data.saveAmount >= 1000) {
                let superSaver = await Badge.findOne({ name: 'Super Saver' })
                if (superSaver) {
                    let earningObj = new Badgeearning({
                        userId: data.userId,
                        badgeId: superSaver._id,
                        day: day,
                        month: month,
                        year: year
                    })
                    await earningObj.save()
                }
            }
            let rescusedFoodTotalSum = await Rescuefood.aggregate([
                {
                    $match: {
                        userId: ObjectId(data.userId),
                        month: month,
                        year: year
                    }
                },
                {
                    "$group": {
                        _id: "$userId",
                        foodSum: { "$sum": "$rescueFood" }
                    }
                }
            ])
            let newFoodSum = rescusedFoodTotalSum[0].foodSum
            if (newFoodSum >= 5 && newFoodSum < 15) {
                let foodLover = await Badge.findOne({ name: 'Food Lover' })
                if (foodLover) {
                    let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: foodLover._id })
                    if (!badgeEarning) {
                        let earningObj = new Badgeearning({
                            userId: data.userId,
                            badgeId: foodLover._id,
                            day: day,
                            month: month,
                            year: year
                        })
                        await earningObj.save()
                    }
                }
            }
            if (newFoodSum >= 15 && newFoodSum < 25) {
                let carbonCapturer = await Badge.findOne({ name: 'Carbon Capturer' })
                if (carbonCapturer) {
                    let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: carbonCapturer._id })
                    if (!badgeEarning) {
                        let earningObj = new Badgeearning({
                            userId: data.userId,
                            badgeId: carbonCapturer._id,
                            day: day,
                            month: month,
                            year: year
                        })
                        await earningObj.save()
                    }
                }
            }
            if (newFoodSum >= 25 && newFoodSum < 50) {
                let treeLover = await Badge.findOne({ name: 'Tree Lover' })
                if (treeLover) {
                    let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: treeLover._id })
                    if (!badgeEarning) {
                        let earningObj = new Badgeearning({
                            userId: data.userId,
                            badgeId: treeLover._id,
                            day: day,
                            month: month,
                            year: year
                        })
                        await earningObj.save()
                    }
                }
            }
            if (newFoodSum >= 50) {
                let co2Minator = await Badge.findOne({ name: 'Co2 Minator' })
                if (co2Minator) {
                    let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, badgeId: co2Minator._id })
                    if (!badgeEarning) {
                        let earningObj = new Badgeearning({
                            userId: data.userId,
                            badgeId: co2Minator._id,
                            day: day,
                            month: month,
                            year: year
                        })
                        await earningObj.save()
                    }
                }
            }
            if (data.saveAmount >= 500 && data.saveAmount < 1000) {
                let littleSaver = await Badge.findOne({ name: 'Little Saver' })
                if (littleSaver) {
                    let earningObj = new Badgeearning({
                        userId: data.userId,
                        badgeId: littleSaver._id,
                        day: day,
                        month: month,
                        year: year
                    })
                    await earningObj.save()
                }
            }
            if (data.saveAmount >= 1000) {
                let superSaver = await Badge.findOne({ name: 'Super Saver' })
                if (superSaver) {
                    let earningObj = new Badgeearning({
                        userId: data.userId,
                        badgeId: superSaver._id,
                        day: day,
                        month: month,
                        year: year
                    })
                    await earningObj.save()
                }
            }
            let todayDay = moment().format('dddd');
            if (todayDay == "Sunday") {
                let pastSeven = []
                let pastThree = []
                for (let i = 0; i < 7; i++) {
                    let d = new Date()
                    let convertedDate = d.setDate(d.getDate() - i);
                    let newMonth = convertedDate.getUTCMonth() + 1;
                    let newDay = convertedDate.getUTCDate();
                    let newYear = today.getUTCFullYear();
                    let checkOrder = await Order.findOne({ userId: data.userId, status: 'Delivered', month: newMonth, day: newDay, year: newYear })
                    if (checkOrder) {
                        pastSeven.push(i)
                    }
                }
                for (let i = 0; i < 3; i++) {
                    let d = new Date()
                    let convertedDate = d.setDate(d.getDate() - i);
                    let newMonth = convertedDate.getUTCMonth() + 1;
                    let newDay = convertedDate.getUTCDate();
                    let newYear = today.getUTCFullYear();
                    let checkOrder = await Order.findOne({ userId: data.userId, status: 'Delivered', month: newMonth, day: newDay, year: newYear })
                    if (checkOrder) {
                        pastThree.push(i)
                    }
                }
                if (pastThree.length == 3) {
                    let champion = await Badge.findOne({ name: 'Champion' })
                    if (champion) {
                        let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, day: day, badgeId: champion._id })
                        if (!badgeEarning) {
                            let earningObj = new Badgeearning({
                                userId: data.userId,
                                badgeId: champion._id,
                                day: day,
                                month: month,
                                year: year
                            })
                            await earningObj.save()
                        }
                    }
                }
                if (pastThree.length == 7) {
                    let weekendWarrior = await Badge.findOne({ name: 'Weekend Warrior' })
                    if (weekendWarrior) {
                        let badgeEarning = await Badgeearning.findOne({ userId: data.userId, month: month, year: year, day: day, badgeId: weekendWarrior._id })
                        if (!badgeEarning) {
                            let earningObj = new Badgeearning({
                                userId: data.userId,
                                badgeId: weekendWarrior._id,
                                day: day,
                                month: month,
                                year: year
                            })
                            await earningObj.save()
                        }
                    }
                }
            }
            Sendnotification.sendNotificationForAndroid(checkUser.deviceToken, notiTitle, notiMessage, notiType, newId, checkUser.deviceType, orderType, (error10, result10) => {
                response.log("Notification Sent");
            })
            let checkRestro = await Brand.findOne({ _id: data.storeId })
            let rescusedFood = data.rescusedFood
            let orderNumber = data.orderNumber
            let businessName = checkRestro.businessName
            let createdAt = moment(data.createdAt).format('LLLL');
            let orderDeliveredTime = moment(data.orderDeliveredTime).format('LLLL');
            let status = data.status
            let address = checkRestro.address
            let newOrderData = JSON.stringify(data.orderData)
            let subTotal = data.subTotal
            let taxes = data.taxes
            let saveEatFees = data.saveEatFees
            let total = data.total
            let saveAmount = data.saveAmount
            let subject = 'Order Invoice'
            let emailData = {
                rescusedFood: rescusedFood,
                orderNumber: orderNumber,
                businessName: businessName,
                createdAt: createdAt,
                orderDeliveredTime: orderDeliveredTime,
                status: status,
                address: address,
                subTotal: subTotal,
                taxes: taxes,
                saveEatFees: saveEatFees,
                total: total,
                saveAmount: saveAmount,

            }
            SendMail.orderInvoice((checkUser.email).toLowerCase(), subject, emailData, newOrderData, status, createdAt, address, (error10, result10) => {
                response.log("============================================+Email sent+========================================================")
            })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Customer list for report========================//

    customerListForReport: async (req, res) => {

        try {
            let storeIdArray = []
            let restaurantList = req.body.restaurantIdData
            for (let i = 0; i < restaurantList.length; i++) {
                storeIdArray.push(ObjectId(restaurantList[i]._id))
            }
            let orderQuery = {}
            let favQuery = {}
            orderQuery = {
                storeId: { $in: storeIdArray }
            }
            favQuery = {
                brandId: { $in: storeIdArray }
            }
            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                startTodayDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                orderQuery.createdAt = { $gte: startTodayDate, $lte: todayDate }
                favQuery.createdAt = { $gte: startTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                weekDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                orderQuery.createdAt = { $gte: weekDate, $lte: todayDate }
                favQuery.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                monthDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                orderQuery.createdAt = { $gte: monthDate, $lte: todayDate }
                favQuery.createdAt = { $gte: monthDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Year") {
                let yearDate = new Date(moment().startOf('year').format())
                yearDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                orderQuery.createdAt = { $gte: yearDate, $lte: todayDate }
                favQuery.createdAt = { $gte: yearDate, $lte: todayDate }
            }
            if (req.body.fromDate && req.body.toDate) {
                let yearDate = new Date(moment(req.body.fromDate).format())
                yearDate.setHours(00, 00, 00, 000);
                let todayDate = new Date(req.body.toDate)
                todayDate.setHours(23, 59, 59, 999);
                orderQuery.createdAt = { $gte: yearDate, $lte: todayDate }
                favQuery.createdAt = { $gte: yearDate, $lte: todayDate }
            }
            let min = 0
            let max = 1000000000000000
            if (req.body.min && req.body.max) {
                min = Number(req.body.min)
                max = Number(req.body.max)
            }
            let customerList = await Order.aggregate([
                {
                    $match: orderQuery
                },
                {
                    "$group": {
                        _id: "$userId",
                        count: { $count: {} },
                        revenue: { "$sum": "$total" },
                        userId: { $first: "$userId" },
                        orderId: { $first: "$_id" },
                    }
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userData"
                    }
                },
                {
                    $unwind: {
                        path: "$userData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "productorders",
                        let: {
                            userId: "$userId"
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$userId", "$$userId"] },
                                    ],
                                },
                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "convertedPickupDate": 1,
                                "orderDate": 1,
                                "createdAt": 1,
                            }
                        }, { $sort: { createdAt: 1 } }, { $limit: 1 }],
                        as: "firstOrder"
                    }
                },
                {
                    $unwind: {
                        path: "$firstOrder",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        "userData.name": 1,
                        "userData.email": 1,
                        "userData.mobileNumber": 1,
                        "revenue": { $trunc: ["$revenue", 2] },
                        "count": 1,
                        "userId": 1,
                        "orderId": 1,
                        "firstOrder": 1,
                        "totalUsers": 1
                    }
                },
                {
                    $project: {
                        "userData.name": 1,
                        "userData.email": 1,
                        "userData.mobileNumber": 1,
                        "revenue": 1,
                        "count": 1,
                        "userId": 1,
                        "orderId": 1,
                        "firstOrder": 1,
                        "totalUsers": 1
                    }
                },
                {
                    $match: {
                        revenue: { "$gte": min },
                        revenue: { "$lte": max }
                    }
                }
            ])
            let totalFollowers = await Favorite.find(favQuery).count()
            let obj = {
                totalFollowers: totalFollowers,
                customerList: customerList,
                customers: customerList.length
            }
            response.log("Customer list found successfully", obj)
            return response.responseHandlerWithData(res, 200, "Customer list found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Cuisine list====================================//

    cuisineList: async (req, res) => {

        try {
            response.log("Request for get cuisine list is=========>", req.body);
            let list = await Cuisine.find({ status: 'Active', deleteStatus: false }).sort({ createdAt: -1 })
            response.log("List found successfully", list)
            return response.responseHandlerWithData(res, 200, "List found successfully", list);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Cuisine category list==========================//

    cuisineCategoryList: async (req, res) => {

        try {
            response.log("Request for get cuisine category list is=========>", req.body);
            let list = await Cuisinecategory.find({ status: 'Active', cuisineId: req.body.cuisineId, deleteStatus: false }).sort({ createdAt: -1 })
            response.log("List found successfully", list)
            return response.responseHandlerWithData(res, 200, "List found successfully", list);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Add choice=======================================//

    addChoice: async (req, res) => {

        try {
            response.log("Request for add choice is===========>", req.body);
            req.checkBody('itemId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkItem = await Product.findOne({ _id: req.body.itemId })
            if (!checkItem) {
                response.log("Invalid item Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            if (req.body.itemData.length > 0) {
                let prodData = req.body.itemData
                for (let i = 0; i < prodData.length; i++) {
                    if (prodData[i].action == "Add") {
                        let newObj = {
                            refreshStatus: true
                        }
                        let refProductId = [{
                            productId: req.body.itemId
                        }]
                        await Product.findByIdAndUpdate({ _id: prodData[i].itemId }, { $set: newObj }, { new: true })
                        await Product.findByIdAndUpdate({ _id: prodData[i].itemId }, { $push: { refProductId: refProductId } }, { new: true })
                    }
                    if (prodData[i].action == "Delete") {
                        await Product.findOneAndUpdate({ "_id": prodData[i].itemId, "refProductId.productId": req.body.itemId }, { $pull: { refProductId: { productId: req.body.itemId } } }, { safe: true, new: true })
                    }
                }
            }
            response.log("Items added in choice successfully")
            return response.responseHandlerWithMessage(res, 200, `Items added in choice successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Add badge==========================================//

    addBadge: async (req, res) => {

        try {
            response.log("Request for add badge is==========>", req.body);
            let obj = new Badge({
                name: req.body.name,
                message: req.body.message,
                image: req.body.image
            })
            await obj.save()
            response.log("Badge added successfully")
            return response.responseHandlerWithMessage(res, 200, "Badge added successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=====================================Store list for statistics============================//

    storeListForStatistics: async (req, res) => {

        try {
            response.log("Request for get store list is==============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let brandData = await Brand.find({ _id: req.body.brandId }).select('businessName _id address')
            let result = await Brand.find({ brandId: req.body.brandId, userType: 'Store', deleteStatus: false }).select('businessName _id address')
            let newData = brandData.concat(result)
            response.log("Store List Found", newData)
            return response.responseHandlerWithData(res, 200, "Store List Found", newData);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=====================================Get marketing data==================================//

    getMarketingDataForStatistics: async (req, res) => {

        try {
            response.log("Request for get marketing data is==========>", req.body);
            let storeIdArray = []
            let restaurantList = req.body.restaurantIdData
            for (let i = 0; i < restaurantList.length; i++) {
                storeIdArray.push(ObjectId(restaurantList[i]._id))
            }
            let marketQuery = { _id: { $in: storeIdArray } }
            let checkMarketData = await Brand.findOne(marketQuery)
            if (checkMarketData) {
                let totalRating = checkMarketData.totalRating
                let avgRating = checkMarketData.avgRating
                let newFollowers = 0
                let savedCo2 = 0
                let notifications = 0
                let firstTimeCustomers = 0
                let rescuedFood = 0
                newFollowers = await Favorite.findOne({ brandId: { $in: storeIdArray } }).count()
                notifications = await Notification.find({ brandId: { $in: storeIdArray } }).count()
                firstTimeCustomers = await Newusers.findOne({ storeId: { $in: storeIdArray } }).count()
                let saveCo2 = await Order.aggregate([
                    {
                        $match: { storeId: { $in: storeIdArray } }
                    },
                    {
                        "$group": {
                            _id: "$storeId",
                            rescusedFood: { "$sum": "$rescusedFood" }
                        }
                    }
                ])
                if (saveCo2.length > 0) {
                    savedCo2 = saveCo2[0].rescusedFood
                }
                let rescuseFood = await Order.aggregate([
                    {
                        $match: { storeId: { $in: storeIdArray }, status: 'Delivered' }
                    },
                    {
                        "$group": {
                            _id: "$storeId",
                            rescueFood: { "$sum": "$rescusedFood" }
                        }
                    }
                ])
                if (rescuseFood.length > 0) {
                    rescuedFood = rescuseFood[0].rescueFood
                }
                let obj = {
                    totalRating: totalRating,
                    avgRating: Number(avgRating).toFixed(1),
                    newFollowers: newFollowers,
                    savedCo2: Number(savedCo2).toFixed(2),
                    notifications: notifications,
                    firstTimeCustomers: firstTimeCustomers,
                    rescuedFood: Number(rescuedFood).toFixed(2)
                }

                response.log("Market data found", obj)
                return response.responseHandlerWithData(res, 200, "Market data found", obj);
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //====================================Sale list for statistics=============================//

    saleListForStatistics: async (req, res) => {

        try {
            response.log("Request for get sale is===========>", req.body);
            let storeIdArray = []
            let restaurantList = req.body.restaurantIdData
            for (let i = 0; i < restaurantList.length; i++) {
                storeIdArray.push(ObjectId(restaurantList[i]._id))
            }
            let checkQuery = { storeId: { $in: storeIdArray }, status: 'Delivered' }
            let itemQuery = { brandId: { $in: storeIdArray } }
            let soldQuery = { brandId: { $in: storeIdArray } }
            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                startTodayDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                checkQuery.createdAt = { $gte: startTodayDate, $lte: todayDate }
                itemQuery.startDate = { $lte: todayDate }
                itemQuery.endDate = { $gte: startTodayDate }
                soldQuery.createdAt = { $gte: startTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                weekDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                checkQuery.createdAt = { $gte: weekDate, $lte: todayDate }
                soldQuery.createdAt = { $gte: weekDate, $lte: todayDate }
                itemQuery.startDate = { $lte: todayDate }
                itemQuery.endDate = { $gte: weekDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                monthDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                checkQuery.createdAt = { $gte: monthDate, $lte: todayDate }
                soldQuery.createdAt = { $gte: monthDate, $lte: todayDate }
                itemQuery.startDate = { $lte: todayDate }
                itemQuery.endDate = { $gte: monthDate }
            }
            if (req.body.fromDate && req.body.toDate) {
                let monthDate = new Date(req.body.fromDate)
                monthDate.setHours(00, 00, 00, 000);
                let todayDate = new Date(req.body.toDate)
                todayDate.setHours(23, 59, 59, 999);
                checkQuery.createdAt = { $gte: monthDate, $lte: todayDate }
                soldQuery.createdAt = { $gte: monthDate, $lte: todayDate }
                itemQuery.startDate = { $lte: todayDate }
                itemQuery.endDate = { $gte: monthDate }
            }
            let revenue = await Order.aggregate([
                {
                    $match: checkQuery
                },
                {
                    "$group": {
                        _id: "$storeId",
                        total: { "$sum": "$storeProceeds" }
                    }
                }
            ])
            let totalRevenue = 0
            if (revenue.length > 0) {
                totalRevenue = revenue[0].total
            }
            let itemSold = await Productearning.find(soldQuery).count()
            let itemAdded = await Sellingmodel.find(itemQuery).count()
            let totalItems = await Order.find(checkQuery).count()
            let obj = {
                totalRevenue: Number(totalRevenue).toFixed(1),
                soldItems: itemSold,
                itemAdded: itemAdded,
                totalItems: totalItems
            }
            response.log("Sales list found successfully", obj);
            return response.responseHandlerWithData(res, 200, "Sales list found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=====================================Revenue data=======================================//

    revenueData: async (req, res) => {

        try {
            response.log("Request for get revenue is===========>", req.body);
            let ids = []
            let myIds = req.body.selectedItems
            for (let i = 0; i < myIds.length; i++) {
                ids.push(ObjectId(myIds[i]._id))
            }
            let dateList = []
            let queryCheck = { status: 'Delivered' }
            let getDaysBetweenDates = function (startDate, endDate) {
                let now = startDate.clone(), dates = [];
                while (now.isSameOrBefore(endDate)) {
                    dates.push(now.format('YYYY-MM-DD'));
                    now.add(1, 'days');
                }
                return dates;
            };
            if (req.body.timeframe == "Today") {
                let todayDateNow = new Date(moment().format())
                todayDateNow.setHours(00, 00, 00, 000);
                let convertedWeekDate = moment().format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedWeekDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: todayDateNow, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                weekDate.setHours(00, 00, 00, 000);
                let convertedWeekDate = moment().startOf('isoWeek').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedWeekDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                monthDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                let convertedMonthDate = moment().startOf('month').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedMonthDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Year") {
                let yearDate = new Date(moment().startOf('year').format())
                yearDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                let convertedYearDate = moment().startOf('year').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedYearDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                queryCheck.createdAt = { $gte: yearDate, $lte: todayDate }
            }
            if (req.body.fromDate && req.body.toDate) {
                let yearDate = new Date(moment(req.body.fromDate).format())
                yearDate.setHours(00, 00, 00, 000);
                let todayDate = new Date(req.body.toDate)
                todayDate.setHours(23, 59, 59, 999);
                let convertedYearDate = moment(req.body.fromDate).format("YYYY-MM-DD")
                let convertedTodayDate = moment(req.body.toDate).format('YYYY-MM-DD')
                let startDate = moment(convertedYearDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                queryCheck.createdAt = { $gte: yearDate, $lte: todayDate }
            }
            let actualGraphData = []
            for (let i = 0; i < dateList.length; i++) {
                let orderList = await Order.aggregate([
                    {
                        $match: {
                            pickupDate: dateList[i],
                            status: 'Delivered',
                            storeId: { $in: ids }

                        }
                    },
                    {
                        $group:
                        {
                            _id: "$pickupDate",
                            sumTotal: { "$sum": "$storeProceeds" }
                        }
                    }
                ])
                if (orderList.length > 0) {
                    let obj = {
                        date: new Date(dateList[i]),
                        value: Number(orderList[0].sumTotal).toFixed(1)
                    }
                    actualGraphData.push(obj)
                }
                if (orderList.length == 0) {
                    let obj = {
                        date: new Date(dateList[i]),
                        value: 0
                    }
                    actualGraphData.push(obj)
                }
            }
            let totalRevenue = await Order.aggregate([
                {
                    $match: {
                        status: 'Delivered',
                        storeId: { $in: ids }
                    }
                },
                {
                    $group:
                    {
                        _id: "$deliveryDate",
                        sumTotal: { "$sum": "$storeProceeds" },
                    }
                }
            ])
            let revenue = 0
            if (totalRevenue.length > 0) {
                revenue = Number(totalRevenue[0].sumTotal).toFixed(1)
            }
            let obj = {
                orderList: actualGraphData,
                totalRevenue: Number(revenue).toFixed(2)
            }
            response.log("Order list found successfully", obj);
            return response.responseHandlerWithData(res, 200, "Order list found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //======================================Followers data====================================//

    followersData: async (req, res) => {

        try {
            response.log("Request for get followers data is===========>", req.body);
            let ids = []
            let myIds = req.body.selectedItems
            for (let i = 0; i < myIds.length; i++) {
                ids.push(ObjectId(myIds[i]._id))
            }
            let dateList = []
            let queryCheck = { brandId: { $in: ids } }
            let getDaysBetweenDates = function (startDate, endDate) {
                let now = startDate.clone(), dates = [];
                while (now.isSameOrBefore(endDate)) {
                    dates.push(now.format('YYYY-MM-DD'));
                    now.add(1, 'days');
                }
                return dates;
            };
            if (req.body.timeframe == "Today") {
                let todayDateNow = new Date(moment().format())
                todayDateNow.setHours(00, 00, 00, 000);
                let convertedWeekDate = moment().format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedWeekDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: todayDateNow, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                weekDate.setHours(00, 00, 00, 000);
                let convertedWeekDate = moment().startOf('isoWeek').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedWeekDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                monthDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                let convertedMonthDate = moment().startOf('month').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedMonthDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Year") {
                let yearDate = new Date(moment().startOf('year').format())
                yearDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                let convertedYearDate = moment().startOf('year').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedYearDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                queryCheck.createdAt = { $gte: yearDate, $lte: todayDate }
            }
            if (req.body.fromDate && req.body.toDate) {
                let yearDate = new Date(moment(req.body.fromDate).format())
                yearDate.setHours(00, 00, 00, 000);
                let todayDate = new Date(req.body.toDate)
                todayDate.setHours(23, 59, 59, 999);
                let convertedYearDate = moment(req.body.fromDate).format("YYYY-MM-DD")
                let convertedTodayDate = moment(req.body.toDate).format('YYYY-MM-DD')
                let startDate = moment(convertedYearDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                queryCheck.createdAt = { $gte: yearDate, $lte: todayDate }
            }
            let actualGraphData = []
            let firstTimeCustomers = await Favorite.find(queryCheck).count()
            for (let i = 0; i < dateList.length; i++) {
                queryCheck.date = dateList[i]
                let usersList = await Favorite.find(queryCheck)
                let obj = {
                    date: new Date(dateList[i]),
                    value: usersList.length
                }
                actualGraphData.push(obj)
            }
            let obj = {
                userList: actualGraphData,
                firstTimeCustomers: firstTimeCustomers
            }
            response.log("Order list found successfully", obj);
            return response.responseHandlerWithData(res, 200, "Order list found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //====================================Sale date==========================================//

    itemSalesData: async (req, res) => {

        try {
            response.log("Request for get items sales is===========>", req.body);
            let ids = []
            let myIds = req.body.selectedItems
            for (let i = 0; i < myIds.length; i++) {
                ids.push(ObjectId(myIds[i]._id))
            }
            let queryCheck = { brandId: { $in: ids } }
            let stDate
            let enDate
            if (req.body.timeframe == "Today") {
                let todayDateNow = new Date(moment().format())
                todayDateNow.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                stDate = todayDateNow
                enDate = todayDate
                queryCheck.startDate = { $lte: todayDate }
                queryCheck.endDate = { $gte: todayDateNow }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                weekDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                stDate = weekDate
                enDate = todayDate
                queryCheck.startDate = { $lte: todayDate }
                queryCheck.endDate = { $gte: weekDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                monthDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                stDate = monthDate
                enDate = todayDate
                queryCheck.startDate = { $lte: todayDate }
                queryCheck.endDate = { $gte: monthDate }
            }
            if (req.body.timeframe == "Year") {
                let yearDate = new Date(moment().startOf('year').format())
                yearDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                stDate = yearDate
                enDate = todayDate
                queryCheck.startDate = { $lte: todayDate }
                queryCheck.endDate = { $gte: yearDate }
            }
            if (req.body.fromDate && req.body.toDate) {
                let yearDate = new Date(moment(req.body.fromDate).format())
                yearDate.setHours(00, 00, 00, 000);
                let todayDate = new Date(req.body.toDate)
                todayDate.setHours(23, 59, 59, 999);
                stDate = yearDate
                enDate = todayDate
                queryCheck.startDate = { $lte: todayDate }
                queryCheck.endDate = { $gte: yearDate }
            }
            let finalSellingData = []
            let sellingProducts = await Sellingmodel.find(queryCheck)
            for (let i = 0; i < sellingProducts.length; i++) {
                let storeData = await Brand.findOne({ _id: sellingProducts[i].brandId }).select('commission fixCommissionPer businessName')
                let productData = await Product.findOne({ _id: sellingProducts[i].productId }).select('foodName sellingStatus')
                if (productData.sellingStatus == true) {
                    let commissionPer = storeData.commission
                    let totalEarning = await Productearning.aggregate([
                        {
                            $match: {
                                productId: ObjectId(sellingProducts[i].productId),
                                brandId: ObjectId(sellingProducts[i].brandId),
                            }
                        },
                        {
                            "$group": {
                                _id: "$brandId",
                                amountSum: { "$sum": "$amount" },
                                quantitySum: { "$avg": "$quantity" }
                            }
                        }
                    ])

                    if (totalEarning.length > 0) {
                        let amountWithQuantity = totalEarning[0].amountSum * totalEarning[0].quantitySum
                        let newTax = 5 / 100
                        let newCommissionPer = commissionPer / 100
                        let calculateTax = totalEarning[0].amountSum * totalEarning[0].quantitySum * Number(newTax)
                        let productAmountWithTax = totalEarning[0].amountSum * totalEarning[0].quantitySum + calculateTax
                        let normalPrice = totalEarning[0].amountSum * totalEarning[0].quantitySum * newCommissionPer
                        let normalPriceWithGst = normalPrice * 0.18
                        let amountWithGST = normalPrice + normalPriceWithGst
                        let updatedAmount = productAmountWithTax - amountWithGST
                        let soldQuantity = Number(totalEarning[0].quantitySum) * 100
                        let percentage = Number(soldQuantity / Number(sellingProducts[i].quantity)).toFixed(2)
                        let itemAdded = Number(sellingProducts[i].quantity) * Number(sellingProducts[i].amount)
                        let obj = {
                            storeName: storeData.businessName,
                            itemName: productData.foodName,
                            quantity: sellingProducts[i].quantity,
                            itemAdded: itemAdded,
                            soldItems: amountWithQuantity,
                            revenue: Number(updatedAmount).toFixed(2),
                            percentage: percentage
                        }
                        finalSellingData.push(obj)
                    }
                }
            }
            response.log("Sale list found successfully", finalSellingData);
            return response.responseHandlerWithData(res, 200, "Sale list found successfully", finalSellingData);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //====================================Per store data=====================================//

    perStoreData: async (req, res) => {

        try {
            response.log("Request for get per store is===========>", req.body);
            let ids = []
            let myIds = req.body.selectedItems
            for (let i = 0; i < myIds.length; i++) {
                ids.push(ObjectId(myIds[i]._id))
            }
            let queryCheck = { _id: { $in: ids } }
            let stDate
            let enDate
            if (req.body.timeframe == "Today") {
                let todayDateNow = new Date(moment().format())
                todayDateNow.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                stDate = todayDateNow
                enDate = todayDate
                queryCheck.startDate = { $lte: todayDate }
                queryCheck.endDate = { $gte: todayDateNow }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                weekDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                stDate = weekDate
                enDate = todayDate
                queryCheck.startDate = { $lte: todayDate }
                queryCheck.endDate = { $gte: weekDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                monthDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                stDate = monthDate
                enDate = todayDate
                queryCheck.startDate = { $lte: todayDate }
                queryCheck.endDate = { $gte: monthDate }
            }
            if (req.body.timeframe == "Year") {
                let yearDate = new Date(moment().startOf('year').format())
                yearDate.setHours(00, 00, 00, 000);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                stDate = yearDate
                enDate = todayDate
                queryCheck.startDate = { $lte: todayDate }
                queryCheck.endDate = { $gte: yearDate }
            }
            if (req.body.fromDate && req.body.toDate) {
                let yearDate = new Date(moment(req.body.fromDate).format())
                yearDate.setHours(00, 00, 00, 000);
                let todayDate = new Date(req.body.toDate)
                todayDate.setHours(23, 59, 59, 999);
                stDate = yearDate
                enDate = todayDate
                queryCheck.startDate = { $lte: todayDate }
                queryCheck.endDate = { $gte: yearDate }
            }
            let newDate = new Date()
            newDate.setDate(newDate.getDate() + 1);
            let storeData = await Brand.aggregate([
                {
                    $match: { _id: { $in: ids } }
                },
                {
                    $lookup: {
                        from: "sellingitemsses",
                        let: {
                            brandId: "$_id"
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $lte: ["$startDate", enDate] },
                                        { $gte: ["$endDate", stDate] }
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "products",
                                let: {
                                    productId: "$productId"
                                },
                                pipeline: [{
                                    $match: {
                                        $expr:
                                        {
                                            $and: [
                                                { $eq: ["$_id", "$$productId"] }
                                            ]
                                        }
                                    }
                                }],
                                as: "productData"
                            }
                        },
                        {
                            $unwind: {
                                path: "$productData",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $match: {
                                "productData.sellingStatus": true
                            }
                        },
                        {
                            $group:
                            {
                                _id: "$brandId",
                                totalQuantity: { "$sum": "$quantity" },
                                totalAmount: { $sum: { $multiply: ["$amount", "$quantity"] } },
                            }
                        }],
                        as: "sellingData"
                    }
                },
                {
                    $unwind: {
                        path: "$sellingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "productearnings",
                        let: {
                            brandId: "$_id"
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $lte: ["$createdAt", enDate] },
                                        { $gte: ["$createdAt", stDate] }
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "products",
                                let: {
                                    productId: "$productId"
                                },
                                pipeline: [{
                                    $match: {
                                        $expr:
                                        {
                                            $and: [
                                                { $eq: ["$_id", "$$productId"] }
                                            ]
                                        }
                                    }
                                }],
                                as: "productData"
                            }
                        },
                        {
                            $unwind: {
                                path: "$productData",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $match: {
                                "productData.sellingStatus": true
                            }
                        },
                        {

                            $project: {
                                newSumData: { $multiply: ["$amount", "$quantity"] },
                                quantity: 1,
                                amount: 1,
                                status: 1
                            }
                        },
                        {
                            $group:
                            {
                                _id: "$brandId",
                                soldAmount: { "$sum": "$newSumData" },
                                quantitySum: { "$sum": "$quantity" },
                                status: { $first: "$status" }
                            }
                        }
                        ],
                        as: "soldData"
                    }
                },
                {
                    $unwind: {
                        path: "$soldData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "soldData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "productorders",
                        let: {
                            storeId: "$_id", status: 'Delivered'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$storeId", "$$storeId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$createdAt", enDate] },
                                        { $gte: ["$createdAt", stDate] }
                                    ]
                                }
                            }
                        },
                        {
                            $group:
                            {
                                _id: "$storeId",
                                revenueSum: { "$sum": "$storeProceeds" },
                            }
                        },
                        ],
                        as: "revenueData"
                    }
                },
                {
                    $unwind: {
                        path: "$revenueData",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        from: "sellingitemsses",
                        let: {
                            brandId: "$_id"
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $lte: ["$startDate", enDate] },
                                        { $gte: ["$endDate", stDate] }
                                    ]
                                }
                            }
                        },
                        {
                            $project:
                            {
                                _id: 1,
                                myDate: new Date(),
                                startDate: 1
                            }
                        },
                        {
                            $project:
                            {
                                _id: 1,
                                myDate: new Date(),
                                startDate: 1,
                                dayssince: {
                                    $trunc: {
                                        $divide: [{ $subtract: [newDate, '$startDate'] }, 1000 * 60 * 60 * 24]
                                    }
                                },
                            }
                        },

                        ],
                        as: "newDateData"
                    }
                },
                {
                    $lookup: {
                        from: "productearnings",
                        let: {
                            brandId: "$_id"
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $lte: ["$createdAt", enDate] },
                                        { $gte: ["$createdAt", stDate] }
                                    ]
                                }
                            }
                        },
                        {
                            $group:
                            {
                                _id: "$userId",
                                count: { $sum: 1 }
                            }
                        }
                        ],
                        as: "usersData"
                    }
                },
                {
                    $lookup: {
                        from: "sellingitemsses",
                        let: {
                            brandId: "$_id"
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $lte: ["$startDate", enDate] },
                                        { $gte: ["$endDate", stDate] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                endDate: 1,
                                startDate: 1
                            }
                        }
                        ],
                        as: "datesData"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        businessName: 1,
                        sellingData: 1,
                        newDateData: 1,
                        soldData: 1,
                        revenueData: 1,
                        usersData: 1,
                        datesData: 1,
                        totalUsers: { $size: "$usersData" },
                        saleDays: { $max: "$newDateData.dayssince" },
                        multiplyData: { $multiply: ["$soldData.quantitySum", 100] },

                    }
                },
                {
                    $project: {
                        _id: 1,
                        businessName: 1,
                        sellingData: 1,
                        newDateData: 1,
                        soldData: 1,
                        multiplyData: 1,
                        revenueData: 1,
                        usersData: 1,
                        totalUsers: 1,
                        datesData: 1,
                        saleDays: 1,
                        percen: { $divide: ["$multiplyData", "$sellingData.totalQuantity"] },

                    }
                },
                {
                    $project: {
                        _id: 1,
                        businessName: 1,
                        sellingData: 1,
                        newDateData: 1,
                        soldData: 1,
                        multiplyData: 1,
                        percen: 1,
                        revenueData: 1,
                        usersData: 1,
                        totalUsers: 1,
                        datesData: 1,
                        saleDays: 1,
                        percentage: { $trunc: ["$percen", 1] }

                    }
                }
            ])
            response.log("Sasdadasdasdasdasda", storeData);
            return response.responseHandlerWithData(res, 200, "Sale list found successfully", storeData);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===================================Sold out=============================================//

    soldOut: async (req, res) => {

        try {
            response.log("Request for sold out is==============>", req.body);
            req.checkBody('productId', 'Something went wrong').notEmpty();
            req.checkBody('outOfStock', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkProduct = await Product.findOne({ _id: req.body.productId })
            if (!checkProduct) {
                response.log("Invalid product Id")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let obj = {
                outOfStock: req.body.outOfStock
            }
            await Product.findByIdAndUpdate({ _id: req.body.productId }, { $set: obj }, { new: true })
            response.log("Status updated successfully")
            return response.responseHandlerWithMessage(res, 200, `Status updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================Add choice category==================================//

    addChoiceCategory: async (req, res) => {

        try {
            response.log("Request for add choice category is===============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('categoryName', 'Something went wrong').notEmpty();
            req.checkBody('min', 'Something went wrong').notEmpty();
            req.checkBody('max', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let choiceData = req.body.choice
            let choiceObj = new Choicecategory({
                brandId: req.body.brandId,
                categoryName: req.body.categoryName,
                min: req.body.min,
                max: req.body.max,
                status: req.body.status,
                choice: choiceData
            })
            await choiceObj.save()
            response.log("Choice added successfully")
            return response.responseHandlerWithMessage(res, 200, "Choice added successfully");

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================Update choice category===============================//

    updateChoiceCategory: async (req, res) => {

        try {
            response.log("Request for update choice category is===============>", req.body);
            req.checkBody('choiceId', 'Something went wrong').notEmpty();
            req.checkBody('categoryName', 'Something went wrong').notEmpty();
            req.checkBody('min', 'Something went wrong').notEmpty();
            req.checkBody('max', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let choice = req.body.choice
            let choiceObj = {
                categoryName: req.body.categoryName,
                min: req.body.min,
                max: req.body.max,
                status: req.body.status,
                choice: choice
            }
            await Choicecategory.findByIdAndUpdate({ _id: req.body.choiceId }, { $set: choiceObj }, { new: true })
            response.log("Choice updated successfully")
            return response.responseHandlerWithMessage(res, 200, "Choice updated successfully");

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================Delete choice========================================//

    deleteChoiceCategory: async (req, res) => {

        try {
            response.log("Request for delete choice category is==========>", req.body);
            req.checkBody('choiceId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkItem = await Choicecategory.findByIdAndUpdate({ "_id": req.body.choiceId })
            if (!checkItem) {
                response.log("Invalid choice Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Choice deleted successfully", checkItem);
            return response.responseHandlerWithMessage(res, 200, "Choice deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===================================Update choice category==============================//

    updateChoiceCategoryStatus: async (req, res) => {

        try {
            response.log("Request for delete choice category is==========>", req.body);
            req.checkBody('choiceId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkItem = await Choicecategory.findByIdAndUpdate({ "_id": req.body.choiceId }, { $set: { status: req.body.status } })
            if (!checkItem) {
                response.log("Invalid choice Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Choice status updated successfully", checkItem);
            return response.responseHandlerWithMessage(res, 200, "Choice status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================Get choice category=================================//

    getChoiceCategory: async (req, res) => {

        try {
            response.log("Request for get menu category is==============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let categoryList = await Choicecategory.find({ brandId: req.body.brandId }).sort({ createdAt: -1 })
            response.log("Category list found successfully", categoryList);
            return response.responseHandlerWithData(res, 200, "Category list found successfully", categoryList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================Product choice====================================//

    getChoiceCategoryProduct: async (req, res) => {

        try {
            response.log("Request for get menu category is==============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let categoryList = await Choicecategory.find({ brandId: req.body.brandId, status: 'Active' }).sort({ createdAt: -1 })
            response.log("Category list found successfully", categoryList);
            return response.responseHandlerWithData(res, 200, "Category list found successfully", categoryList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=====================================Get choice detail================================//

    getChoiceDetail: async (req, res) => {

        try {
            response.log("Request for get choice detail is==========>", req.body);
            req.checkBody('choiceId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkChoice = await Choicecategory.findOne({ "_id": req.body.choiceId })
            if (!checkChoice) {
                response.log("Invalid choice Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Details found successfully", checkChoice);
            return response.responseHandlerWithData(res, 200, "Details found successfully", checkChoice);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===================================Get product choice================================//

    getProductChoiceCategory: async (req, res) => {

        try {
            response.log("Request for get product choice is==============>", req.body);
            req.checkBody('productId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let categoryList = await Productchoice.find({ productId: req.body.productId }).populate('choiceId')
            response.log("Category list found successfully", categoryList);
            return response.responseHandlerWithData(res, 200, "Category list found successfully", categoryList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=====================================Upload Images===================================//

    uploadImages: async (req, res) => {

        try {
            response.log("Request for update image is=============>", req.files)

            let imagesData = []
            let images = req.files.images
            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    let imageUrl = await Fileupload.upload(images[i], "user/");
                    imagesData.push(imageUrl)
                }
            }
            response.log("Image uploaded successfully", imagesData)
            return response.responseHandlerWithData(res, 200, `Image uploaded successfully`, imagesData);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    //====================================Delete product==================================//

    deleteProduct: async (req, res) => {

        try {
            response.log("Request for delete item is==========>", req.body);
            req.checkBody('itemId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = { deleteStatus: true }
            let checkItem = await Product.findByIdAndUpdate({ "_id": req.body.itemId }, { $set: obj }, { new: true })
            if (!checkItem) {
                response.log("Invalid item Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let deleteItem = await Cart.findOneAndUpdate({ "productData.productId": req.body.itemId }, { $pull: { productData: { productId: req.body.itemId } } }, { safe: true, new: true })
            if (deleteItem) {
                if (deleteItem.productData.length == 0) {
                    await Cart.findByIdAndRemove({ _id: deleteItem._id })
                }
            }
            response.log("Item deleted successfully", checkItem);
            return response.responseHandlerWithMessage(res, 200, "Item deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

}


//===================Brand store off==================//

async function brandStoreOff() {

    try {
        let day = moment().format('dddd');
        response.log("Cron start for close Day is=======>", day)
        let timeByDay = await Openinghours.find({ day: day, runningStatus: true, status: 'Active' })
        if (timeByDay.length == 0) {
            response.log("No data found")
        }
        if (timeByDay.length > 0) {
            for (let i = 0; i < timeByDay.length; i++) {
                let date = new Date()
                let todayDate = momentZone.tz(timeByDay[i].timezone).format('YYYY-MM-DD');
                let closeTime = momentZone.tz(`${todayDate} ${timeByDay[i].closeTime}`, timeByDay[i].timezone).format('x')
                let currentTime = momentZone.tz(date, timeByDay[i].timezone).format('x')
                if (currentTime > closeTime) {
                    if (timeByDay[i].storeId) {
                        let checkStore = await Store.findOne({ _id: timeByDay[i].storeId })
                        if (checkStore) {
                            if (checkStore.openStatus == 'Open') {
                                let obj = {
                                    openStatus: 'Close'
                                }
                                await Store.findByIdAndUpdate({ _id: timeByDay[i].storeId }, { $set: obj }, { new: true })
                                let newObj = {
                                    runningStatus: false
                                }
                                await Openinghours.findByIdAndUpdate({ _id: timeByDay[i]._id }, { $set: newObj }, { new: true })
                                response.log("Store status updated")
                            }
                            else {
                                response.log("Store is closed")
                            }
                        }
                        else {
                            response.log("Store not found")
                        }
                    }
                    if (timeByDay[i].brandId) {
                        let checkBrand = await Brand.findOne({ _id: timeByDay[i].brandId })
                        if (checkBrand) {
                            if (checkBrand.openStatus == 'Open') {
                                let obj = {
                                    openStatus: 'Close'
                                }
                                await Brand.findByIdAndUpdate({ _id: timeByDay[i].brandId }, { $set: obj }, { new: true })
                                let newObj = {
                                    runningStatus: false
                                }
                                await Openinghours.findByIdAndUpdate({ _id: timeByDay[i]._id }, { $set: newObj }, { new: true })
                                response.log("Brand status updated")
                            }
                            else {
                                response.log("Brand is closed")
                            }
                        }
                        else {
                            response.log("Brand not found")
                        }
                    }
                }
                else {
                    response.log("Time is not set")
                }
            }
        }
    } catch (error) {
        response.log("Error is==========>", error);

    }
}

//==================Brand store open=================//

async function brandStoreOpen() {

    try {
        let day = moment().format('dddd');
        response.log("Close start for open Day is=======>", day)
        let timeByDay = await Openinghours.find({ day: day, runningStatus: false, status: 'Active' })
        if (timeByDay.length == 0) {
            response.log("No data found")
        }
        if (timeByDay.length > 0) {
            for (let i = 0; i < timeByDay.length; i++) {
                let date = new Date()
                let todayDate = momentZone.tz(timeByDay[i].timezone).format('YYYY-MM-DD');
                let closeTime = momentZone.tz(`${todayDate} ${timeByDay[i].closeTime}`, timeByDay[i].timezone).format('x')
                let currentTime = momentZone.tz(date, timeByDay[i].timezone).format('x')
                if (currentTime > closeTime) {
                    if (timeByDay[i].storeId) {
                        let checkStore = await Store.findOne({ _id: timeByDay[i].storeId })
                        if (checkStore) {
                            if (checkStore.openStatus == 'Close') {
                                let obj = {
                                    openStatus: 'Open'
                                }
                                await Store.findByIdAndUpdate({ _id: timeByDay[i].storeId }, { $set: obj }, { new: true })
                                let newObj = {
                                    runningStatus: true
                                }
                                await Openinghours.findByIdAndUpdate({ _id: timeByDay[i]._id }, { $set: newObj }, { new: true })
                                response.log("Store status updated")
                            }
                            else {
                                response.log("Store is closed")
                            }
                        }
                        else {
                            response.log("Store not found")
                        }
                    }
                    if (timeByDay[i].brandId) {
                        let checkBrand = await Brand.findOne({ _id: timeByDay[i].brandId })
                        if (checkBrand) {
                            if (checkBrand.openStatus == 'Close') {
                                let obj = {
                                    openStatus: 'Open'
                                }
                                await Brand.findByIdAndUpdate({ _id: timeByDay[i].brandId }, { $set: obj }, { new: true })
                                let newObj = {
                                    runningStatus: true
                                }
                                await Openinghours.findByIdAndUpdate({ _id: timeByDay[i]._id }, { $set: newObj }, { new: true })
                                response.log("Brand status updated")
                            }
                            else {
                                response.log("Brand is closed")
                            }
                        }
                        else {
                            response.log("Brand not found")
                        }
                    }
                }
                else {
                    response.log("Time is not set")
                }
            }
        }
    } catch (error) {
        response.log("Error is==========>", error);

    }
}

//===================Holiday close===================//

async function holidayClose() {

    try {

        let startDate = new Date()
        response.log("Holiday cron here is=======>", startDate)
        let checkHoliday = await Holiday({ status: 'Active', runningStatus: true, convertedStartDate: { $lte: startDate, convertedEndDate: { $gte: startDate } } })
        if (checkHoliday.length == 0) {
            response.log("No data found")
        }
        if (checkHoliday.length > 0) {
            for (let i = 0; i < checkHoliday.length; i++) {
                let date = new Date()
                let closeTime = momentZone.tz(`${checkHoliday[i].convertedStartDate}`, timeByDay[i].timezone).format('x')
                let currentTime = momentZone.tz(date, timeByDay[i].timezone).format('x')
                if (currentTime > closeTime) {
                    if (checkHoliday[i].storeId) {
                        let checkStore = await Store.findOne({ _id: timeByDay[i].storeId })
                        if (checkStore) {
                            if (checkStore.openStatus == 'Open') {
                                let obj = {
                                    openStatus: 'Close'
                                }
                                await Store.findByIdAndUpdate({ _id: timeByDay[i].storeId }, { $set: obj }, { new: true })
                                let newObj = {
                                    runningStatus: false
                                }
                                await Openinghours.findByIdAndUpdate({ _id: timeByDay[i]._id }, { $set: newObj }, { new: true })
                                response.log("Store status updated")
                            }
                            else {
                                response.log("Store is closed")
                            }
                        }
                        else {
                            response.log("Store not found")
                        }
                    }
                    if (timeByDay[i].brandId) {
                        let checkBrand = await Brand.findOne({ _id: timeByDay[i].brandId })
                        if (checkBrand) {
                            if (checkBrand.openStatus == 'Open') {
                                let obj = {
                                    openStatus: 'Close'
                                }
                                await Brand.findByIdAndUpdate({ _id: timeByDay[i].brandId }, { $set: obj }, { new: true })
                                let newObj = {
                                    runningStatus: true
                                }
                                await Openinghours.findByIdAndUpdate({ _id: timeByDay[i]._id }, { $set: newObj }, { new: true })
                                response.log("Brand status updated")
                            }
                            else {
                                response.log("Brand is closed")
                            }
                        }
                        else {
                            response.log("Brand not found")
                        }
                    }
                }
                else {
                    response.log("Time is not set")
                }
            }
        }
    } catch (error) {
        response.log("Error is==========>", error);

    }
}

//===================Holiday open====================//

async function holidayOpen() {

    try {

        let startDate = new Date()
        response.log("Holiday cron here is=======>", startDate)
        let checkHoliday = await Holiday({ status: 'Active', runningStatus: true, convertedStartDate: { $lte: startDate, convertedEndDate: { $gte: startDate } } })
        if (checkHoliday.length == 0) {
            response.log("No data found")
        }
        if (checkHoliday.length > 0) {
            for (let i = 0; i < checkHoliday.length; i++) {
                let date = new Date()
                let closeTime = momentZone.tz(`${checkHoliday[i].convertedEndDate}`, timeByDay[i].timezone).format('x')
                let currentTime = momentZone.tz(date, timeByDay[i].timezone).format('x')
                if (currentTime > closeTime) {
                    if (checkHoliday[i].storeId) {
                        let checkStore = await Store.findOne({ _id: timeByDay[i].storeId })
                        if (checkStore) {
                            if (checkStore.openStatus == 'Close') {
                                let obj = {
                                    openStatus: 'Open'
                                }
                                await Store.findByIdAndUpdate({ _id: timeByDay[i].storeId }, { $set: obj }, { new: true })
                                let newObj = {
                                    runningStatus: true
                                }
                                await Openinghours.findByIdAndUpdate({ _id: timeByDay[i]._id }, { $set: newObj }, { new: true })
                                response.log("Store status updated")
                            }
                            else {
                                response.log("Store is closed")
                            }
                        }
                        else {
                            response.log("Store not found")
                        }
                    }
                    if (timeByDay[i].brandId) {
                        let checkBrand = await Brand.findOne({ _id: timeByDay[i].brandId })
                        if (checkBrand) {
                            if (checkBrand.openStatus == 'Close') {
                                let obj = {
                                    openStatus: 'Open'
                                }
                                await Brand.findByIdAndUpdate({ _id: timeByDay[i].brandId }, { $set: obj }, { new: true })
                                let newObj = {
                                    runningStatus: false
                                }
                                await Openinghours.findByIdAndUpdate({ _id: timeByDay[i]._id }, { $set: newObj }, { new: true })
                                response.log("Brand status updated")
                            }
                            else {
                                response.log("Brand is closed")
                            }
                        }
                        else {
                            response.log("Brand not found")
                        }
                    }
                }
                else {
                    response.log("Time is not set")
                }
            }
        }
    } catch (error) {
        response.log("Error is==========>", error);

    }
}

//=====================Product delete================//

async function productDelete() {

    try {
        response.log("Cron start for product delete is")
        let checkProducts = await Product.find({ sellingStatus: true, deleteStatus: false })
        if (checkProducts.length == 0) {
            response.log("No data found")
        }
        if (checkProducts.length > 0) {
            for (let i = 0; i < checkProducts.length; i++) {
                let date = new Date()
                let closeTime = momentZone.tz(`${checkProducts[i].expiryDate} ${checkProducts[i].expiryTime}`, `Asia/Kolkata`).format('x')
                let convertedDate = new Date(`${checkProducts[i].expiryDate} ${checkProducts[i].expiryTime}`)
                let closeDate = momentZone.tz(convertedDate, `Asia/Kolkata`).format()
                response.log("Close time is========>", closeTime)
                response.log("Close date is========>", closeDate)
                let currentTime = momentZone.tz(date, `Asia/Kolkata`).format('x')
                let currentDate = momentZone.tz(date, `Asia/Kolkata`).format()
                response.log("Today date is========>", date)
                response.log("current time is========>", currentDate)
                if (closeTime < currentTime) {
                    let obj = {
                        sellingStatus: false,
                        pauseStatus: false,
                        leftQuantity: 0,
                        leftQuantity: 0,
                        addedQuantity: 0,
                        pickupLaterAllowance: false,
                        discountPer: 0,
                        discountAmount: 0,
                        offeredPrice: 0
                    }
                    await Product.findByIdAndUpdate({ _id: checkProducts[i]._id }, { $set: obj }, { new: true })
                    let deleteItem = await Cart.findOneAndUpdate({ "productData.productId": checkProducts[i]._id }, { $pull: { productData: { productId: checkProducts[i]._id } } }, { safe: true, new: true })
                    if (deleteItem) {
                        if (deleteItem.productData.length == 0) {
                            await Cart.findByIdAndRemove({ _id: deleteItem._id })
                        }
                    }
                }
                else {
                    response.log("Time is not set")
                }
            }
        }
    } catch (error) {
        response.log("Error is==========>", error);

    }
}

//======================No show order================//

async function noShowOrder() {

    try {
        response.log("Cron start for order checking is")
        let checkOrers = await Order.find({ status: 'Order Ready for pickup' })
        if (checkOrers.length == 0) {
            response.log("No data found")
        }
        if (checkOrers.length > 0) {
            for (let i = 0; i < checkOrers.length; i++) {
                let date = new Date()
                let pickupTime = momentZone.tz(`${checkOrers[i].convertedPickupDate}`, `Asia/Kolkata`).format('x')
                let newPickupTime = pickupTime + 43200000
                let currentTime = momentZone.tz(date, `Asia/Kolkata`).format('x')
                if (newPickupTime < currentTime) {
                    let obj = {
                        status: 'No Show'
                    }
                    await Order.findByIdAndUpdate({ _id: checkOrers[i]._id }, { $set: obj }, { new: true })
                }
                else {
                    response.log("Time is not set")
                }
            }
        }
    } catch (error) {
        response.log("Error is==========>", error);

    }
}

//======================Check order date============//

async function checkOrderEveryDay() {

    try {
        response.log("Cron start for order checking is")
        let d = new Date()
        d.setDate(d.getDate() - 3);
        d.setHours(00, 00, 00, 000);
        let nowTime = new Date()
        let userList = await User.aggregate([
            {
                $match: {
                    status: 'Active',
                    createdAt: { $gte: d },
                    createdAt: { $lte: nowTime }
                }
            },

            {
                $lookup: {
                    from: "productorders",
                    let: {
                        userId: "$_id"
                    },
                    pipeline: [{
                        $match: {
                            $expr:
                            {
                                $and: [
                                    { $eq: ["$userId", "$$userId"] }
                                ]
                            }
                        }
                    }],
                    as: "orderData"
                }
            },
            {
                "$project": {
                    _id: 1,
                    deviceType: 1,
                    deviceToken: 1,
                    name: 1,
                    latitude: 1,
                    longitude: 1,
                    "orderSize": { $size: "$orderData" }
                }
            },
            {
                $match: {
                    orderSize: 0
                }
            }
        ])
        for (let i = 0; i < userList.length; i++) {
            let notiTitle = `${userList[i].name}! You missed some crazy offers`
            let notiMessage = `Many restaurants are giving 90% off on items. Tap to order.`
            let notiType = `visitApp`
            let newId = userList[i]._id
            Sendnotification.sendNotificationForAndroid(userList[i].deviceToken, notiTitle, notiMessage, notiType, newId, userList[i].deviceType, (error10, result10) => {
                response.log("Notification Sent");
            })
        }
    } catch (error) {
        response.log("Error is==========>", error);

    }
}

