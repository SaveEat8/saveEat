const User = require('../models/userModel.js');
const Brand = require('../models/brandModel.js');
const Store = require('../models/storeModel.js');
const Support = require('../models/supportModel.js');
const Openinghours = require('../models/openingHoursModel.js');
const Notification = require('../models/notificationModel.js');
const Product = require('../models/productModel.js');
const Cuisine = require('../models/cuisineModel.js');
const Menu = require('../models/menuModel.js');
const Promocode = require('../models/promoCodeModel.js');
const Itemcategory = require('../models/itemCategoryModel.js');
const Fileupload = require('../utils/fileUpload.js');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const moment = require('moment')
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
const Dietary = require('../models/dietaryNeedsModel.js');
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
const geodist = require('geodist');
const Favorite = require('../models/favouriteModel.js');



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
            let checkEmail = await Brand.findOne({ email: (req.body.email).toLowerCase(), userType: 'Store' })
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
            let checkMobile = await Brand.findOne({ mobileNumber: req.body.mobileNumber, userType: 'Store' })
            if (checkMobile) {
                response.log("Mobile number is already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number is already exist");
            }
            let otp = 123456
            let checkOtp = await Otp.findOne({ mobileNumber: req.body.mobileNumber })
            response.log("Otp is=========>", otp)
            if (checkOtp) {
                await Otp.findByIdAndRemove({ _id: checkOtp._id })
            }
            let otpObj = new Otp({
                mobileNumber: req.body.mobileNumber,
                otp: otp
            })
            let otpData = otpObj.save()
            response.log(`Otp has been sent to your mobile ${req.body.mobileNumber} successfully.`, otpData);
            response.responseHandlerWithMessage(res, 200, `Otp has been sent to your mobile ${req.body.mobileNumber} successfully.`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Store logout==========================================//

    storeLogout: async (req, res) => {

        try {
            let checkStore = await Brand.findOne({ "_id": req.body.storeId })
            if (!checkStore) {
                response.log("Invalid store Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let result = await Brand.findByIdAndUpdate({ "_id": req.body.storeId }, { $set: { jwtToken: "", deviceToken: '' } }, { new: true })
            response.log("Logout successfully", result)
            return response.responseHandlerWithMessage(res, 200, "Logout successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Store login for panel==================================//

    storeLoginForPanel: async (req, res) => {

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
            let checkUser = await Brand.findOne({ email: (req.body.email).toLowerCase(), userType: 'Store-Admin' })
              console.log("checkUser===>",checkUser)
            if (!checkUser) {
                response.log("Invalid credentials1");
                return response.responseHandlerWithMessage(res, 401, "Invalid credentials");
            }

            // if (checkUser.adminVerificationStatus == 'Pending') {
            //     response.log("You have blocked by administrator")
            //     return response.responseHandlerWithMessage(res, 423, "Your account verification status is pending. Please wait for admin approval.");
            // }

            if (checkUser.status == 'Inactive') {
                console.log("262============>")
                response.log("Your account has been blocked")
                return response.responseHandlerWithMessage(res, 423, "Your account has been blocked");
            }

            if (checkUser.adminVerificationStatus == 'Disapprove') {
                response.log("You have blocked by administrator")
                return response.responseHandlerWithMessage(res, 423, "Your account has been disapprove by admin. Please conatct with admin for furture process.");
            }

            if (checkUser.deleteStatus == true) {
                response.log("You have blocked by administrator")
                return response.responseHandlerWithMessage(res, 423, "You have terminated your account. Are you sure you want to re-open your existing account?");
            }


            let checkUser2 = await Brand.findOne({ _id: ObjectId(checkUser.brandId), userType: 'Store' })

            if(checkUser2){
                if(checkUser2.status == 'Inactive'){
                    console.log("282====================>")
                    response.log("Your account has been blocked")
                    return response.responseHandlerWithMessage(res, 423, "Your account has been blocked");
                }


                let checkUser3 = await Brand.findOne({ id: checkUser2._id, userType: 'Brand' })
                console.log("checkUser3===>",checkUser3)
                if(checkUser3){
                    if(checkUser2.status == 'Inactive'){
                        console("292====================>")
                        response.log("Your account has been blocked")
                        return response.responseHandlerWithMessage(res, 423, "Your account has been blocked");
                    }
                }
            }

            if(!checkUser2){
                let checkUser3 = await Brand.findOne({ id: checkUser._id, userType: 'Brand' })
                console.log("checkUser3===>",checkUser3)
                if(checkUser3){
                    if(checkUser.status == 'Inactive'){
                        console.log("306====================>")
                        response.log("Your account has been blocked")
                        return response.responseHandlerWithMessage(res, 423, "Your account has been blocked");
                    }
                }
            }







            

            // if(checkUser.userType == 'Store-Admin'){
            //     let checkUser1 = await Brand.findOne({ email: (req.body.email).toLowerCase(), userType: 'Store' })
            //     if(!checkUser1){
            //         response.log("Invalid credentials1");
            //         return response.responseHandlerWithMessage(res, 401, "Invalid credentials");
            //     }

            //     if (checkUser1.status == 'Inactive') {
            //         response.log("Your account has been blocked")
            //         return response.responseHandlerWithMessage(res, 423, "Your account has been blocked");
            //     }            
            // }

            var passVerify = await bcrypt.compareSync(req.body.password, checkUser.password);
            if (!passVerify) {
                console.log("password======>")
                response.log("Invalid credentials2");
                return response.responseHandlerWithMessage(res, 401, "Invalid credentials");
            }
            let checkStore = await Brand.findOne({ _id: checkUser.brandId, userType: 'Store' })
            let jwtToken = jwt.sign({ "_id": checkUser._id }, `sUpER@SecReT`);
            let result2 = await Brand.findByIdAndUpdate({ "_id": checkUser._id }, { $set: { "jwtToken": jwtToken, deviceToken: req.body.deviceToken, deviceType: 'Panel' } }, { new: true, lean: true }).populate({ path: 'brandId', select: 'businessName logo followers' })
            if (result2.userType == "Store-Admin") {
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

    //===============================================Store detail==========================================//

    getStoreDetails: async (req, res) => {

        try {
            response.log("Request for get store detail is==============>", req.body);
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkUser = await Brand.findOne({ "_id": req.body.storeId }).lean()
            if (!checkUser) {
                response.log("Invalid store Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let followersCount = await Favorite.find({ brandId: req.body.storeId }).count()
            checkUser.followersCount = followersCount
            let storeData = await Brand.findOne({ _id: checkUser.brandId })
            let roleData = await Role.findOne({ _id: storeData.roleId }).select('modules accessibility roleTitle')
            checkUser.roleData = roleData
            checkUser.storeData = storeData
            response.log("Details found successfully", checkUser);
            delete (checkUser.password)
            return response.responseHandlerWithData(res, 200, "Details found successfully", checkUser);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },


    getStoreAdmin: async (req, res) => {

        try {
            response.log("Request for get store detail is==============>", req.body);
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkUser = await Brand.findOne({ "_id": req.body.storeId }).lean()
            if (!checkUser) {
                response.log("Invalid store Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let storeData = await Brand.findOne({ _id: checkUser.brandId }).lean()
            let followersCount = await Favorite.find({ brandId: checkUser.brandId }).count()
            storeData.followersCount = followersCount
            let roleData = await Role.findOne({ _id: checkUser.roleId }).select('modules accessibility roleTitle')
            checkUser.roleData = roleData
            checkUser.storeData = storeData
            response.log("Details found successfully", checkUser);
            delete (checkUser.password)
            return response.responseHandlerWithData(res, 200, "Details found successfully", checkUser);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Store notification settings=============================//

    updateStoreNotificationStatus: async (req, res) => {

        try {
            response.log("Request for update notification setting is============>", req.body);
            req.checkBody('notificationStatus', 'Something went wrong').notEmpty();
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                notificationStatus: req.body.notificationStatus
            }
            let checkStore = await Brand.findOne({ _id: req.body.storeId })
            if (!checkStore) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            if (checkStore.adminVerificationStatus == "Pending") {
                response.log("You can not update status utill admin approve your account.");
                return response.responseHandlerWithMessage(res, 501, "You can not update status until admin approve your account.");
            }
            let result = await Brand.findByIdAndUpdate({ "_id": req.body.storeId }, { $set: obj }, { new: true })
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

    updateStoreAccountStatus: async (req, res) => {

        try {
            response.log("Request for update status setting is============>", req.body);
            req.checkBody('status', 'Something went wrong').notEmpty();
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                status: req.body.status
            }
            let result = await Brand.findByIdAndUpdate({ "_id": req.body.storeId }, { $set: obj }, { new: true })
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

    //===========================================Update store language====================================//

    updateStoreLanguage: async (req, res) => {

        try {
            response.log("Request for language notification setting is============>", req.body);
            req.checkBody('language', 'Something went wrong').notEmpty();
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                language: req.body.language
            }
            let result = await Brand.findByIdAndUpdate({ "_id": req.body.storeId }, { $set: obj }, { new: true })
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

    //=================================================Update store========================================//

    updateStoreDetails: async (req, res) => {

        try {
            response.log("Request for update brand is=============>", req.body)
            req.checkBody('originalName', 'Something went wrong').notEmpty();
            req.checkBody('originalEmail', 'Something went wrong').notEmpty();
            req.checkBody('originalMobileNumber', 'Something went wrong').notEmpty();
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            let checkStore = await Brand.findOne({ _id: req.body.storeId })
            if (!checkStore) {
                response.log("Something went wrong")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let checkEmail = await Brand.findOne({ originalEmail: (req.body.originalEmail).toLowerCase(), userType: 'Store', _id: { $ne: req.body.storeId } })
            if (checkEmail) {
                response.log("Email is already exist");
                return response.responseHandlerWithMessage(res, 409, "Email is already exist");
            }

            let checkMobile = await Brand.findOne({ originalMobileNumber: req.body.originalMobileNumber, userType: 'Store', _id: { $ne: req.body.storeId } })
            if (checkMobile) {
                response.log("Mobile number already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number already exist");
            }
            let obj = {
                originalEmail: (req.body.originalEmail).toLowerCase(),
                originalName: req.body.originalName,
                originalMobileNumber: req.body.originalMobileNumber
            }
            let updateData = await Brand.findByIdAndUpdate({ _id: req.body.storeId }, { $set: obj }, { new: true, lean: true })
            response.log("Profile updated successfully", updateData)
            return response.responseHandlerWithMessage(res, 200, `Profile updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Update Store profile==================================//

    updateStoreProfile: async (req, res) => {

        try {
            response.log("Request for update brand profile is=============>", req.body)
            req.checkBody('businessName', 'Something went wrong').notEmpty();
            req.checkBody('businessType', 'Something went wrong').notEmpty();
            req.checkBody('gstinNumber', 'Something went wrong').notEmpty();
            req.checkBody('fssaiNumber', 'Something went wrong').notEmpty();
            req.checkBody('mobileNumber', 'Something went wrong').notEmpty();
            req.checkBody('foodType', 'Something went wrong').notEmpty();
            req.checkBody('storeId', 'Something went wrong').notEmpty();
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
            let checkEmail = await Brand.findOne({ email: (req.body.email).toLowerCase(), userType: 'Store', _id: { $ne: req.body.storeId } })
            if (checkEmail) {
                response.log("Email is already exist");
                return response.responseHandlerWithMessage(res, 409, "Email is already exist");
            }
            let checkMobile = await Brand.findOne({ mobileNumber: req.body.mobileNumber, userType: 'Store', _id: { $ne: req.body.storeId } })
            if (checkMobile) {
                response.log("Mobile number already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number already exist");
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
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                address: req.body.address,
                location: { "type": "Point", "coordinates": [Number(req.body.longitude), Number(req.body.latitude)] }
            }
            let updateData = await Brand.findByIdAndUpdate({ _id: req.body.storeId }, { $set: brandObj }, { new: true })
            response.log("Profile updated successfully", updateData)
            return response.responseHandlerWithMessage(res, 200, `Profile updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Store logo image======================================//

    updateStoreLogoImage: async (req, res) => {

        try {
            response.log("Request for update image is=============>", req.body)
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
                if (req.body.logo) {
                    logo = await Fileupload.uploadBase(req.body.logo, "user/");
                    console.log("image", logo)
                }
            }

            let image = checkStore.image
            if (req.body.type == "Image") {
                if (req.body.image) {
                    image = await Fileupload.uploadBase(req.body.image, "user/");
                    console.log("image", image)
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

    //==============================================Item list for sell fixed==========================//

    itemListForSellFixedStore: async (req, res) => {

        try {
            response.log("Request for get ietm list is==============>", req.body);
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkStore = await Brand.findOne({ _id: req.body.storeId })
            if (!checkStore) {
                response.log("Invalid store Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let checkMenu = await Menu.findOne({ brandId: req.body.storeId, status: 'Active', deleteStatus: false })
            if (!checkMenu) {
                response.log("Invalid menu Id");
                return response.responseHandlerWithMessage(res, 501, "Menu is not available");
            }
            let result = await Product.find({ menuId: checkMenu._id, deleteStatus: false, sellingStatus: false })
            response.log("Item List Found", result)
            return response.responseHandlerWithData(res, 200, "Item List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Hours for store====================================//

    hoursByDayStore: async (req, res) => {

        try {
            response.log("Request for get hours list is==============>", req.body);
            req.checkBody('day', 'Something went wrong').notEmpty();
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let result = await Openinghours.findOne({ brandId: req.body.storeId, day: req.body.day })
            response.log("Hours List Found", result)
            return response.responseHandlerWithData(res, 200, "Hours List Found", result);

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Selling item list==================================//

    itemListForSellStore: async (req, res) => {

        try {
            response.log("Request for get ietm list is==============>", req.body);
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkStore = await Brand.findOne({ _id: req.body.storeId })
            if (!checkStore) {
                response.log("Invalid store Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let checkMenu = await Menu.findOne({ brandId: req.body.storeId, status: 'Active', deleteStatus: false })
            if (!checkMenu) {
                response.log("Invalid menu Id");
                return response.responseHandlerWithMessage(res, 501, "Menu is not available");
            }
            let result = await Product.find({ menuId: checkMenu._id, deleteStatus: false, sellingStatus: true })
            response.log("Item List Found", result)
            return response.responseHandlerWithData(res, 200, "Item List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Store forgot password==============================//

    checkEmailForForgotStore: async (req, res) => {

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
            let checkEmail = await Brand.findOne({ email: req.body.email, userType: 'Store-Admin' })
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
            SendMail.sendForgotOtp((req.body.email).toLowerCase(), subject, otp, sms, (error10, result10) => {
                response.log("Email sent")
            })
        } catch (error) {
            response.log("Error is============>", error)
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Brand reset password================================//

    storeResetPassword: async (req, res) => {

        try {
            req.checkBody('password', 'Something went wrong.').notEmpty();
            req.checkBody('storeId', 'Something went wrong.').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkStore = await Brand.findOne({ _id: req.body.storeId })
            if (!checkStore) {
                response.log("Invalid Token")
                return response.responseHandlerWithMessage(res, 500, 'Invalid Token');
            }
            req.body.password = bcrypt.hashSync(req.body.password, 10)
            let result = await Brand.findByIdAndUpdate({ _id: req.body.storeId }, { $set: { password: req.body.password } }, { new: true })
            response.log("Password reset successfully", result)
            return response.responseHandlerWithMessage(res, 200, 'Password reset successfully');
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Change password======================================//

    storeChangePassword: async (req, res) => {

        try {
            req.checkBody('oldPassword', 'Something went wrong').notEmpty();
            req.checkBody('newPassword', 'Something went wrong').notEmpty();
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkStore = await Brand.findOne({ _id: req.body.storeId })
            if (!checkStore) {
                response.log("Something went wrong")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let passVerify = await bcrypt.compareSync(req.body.oldPassword, checkStore.password);
            response.log("Password verification status is===========>", passVerify);
            if (!passVerify) {
                response.log("Old password is not correct");
                return response.responseHandlerWithMessage(res, 400, "Old password is incorrect.");
            }
            req.body.newPassword = bcrypt.hashSync(req.body.newPassword, salt);
            let userData = await Brand.findByIdAndUpdate({ _id: req.body.storeId }, { $set: { "password": req.body.newPassword } }, { new: true })
            response.log("Password changed successfully", userData);
            return response.responseHandlerWithMessage(res, 200, "Password has been changed successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }

    },

    //===============================================Upload excel by store=================================//

    uploadExcelByStore: async (req, res) => {

        try {
            response.log("Request for import data is============>", req.body)
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkStore = await Brand.findOne({ "_id": req.body.storeId })
            if (!checkStore) {
                response.log("Invalid store Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let rows = await xlsxFile(req.files.file.path)
            response.log("Rows here=======>", rows)
            for (let i = 1; i < rows.length; i++) {
                let menuObj = new Menu({
                    menuName: rows[i][0],
                    storeId: req.body.storeId,
                    status: 'Inactive'
                })
                await menuObj.save()
            }
            return response.responseHandlerWithMessage(res, 200, "Data imported successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },



}




