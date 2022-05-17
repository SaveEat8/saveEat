const User = require('../models/userModel.js');
const Notification = require('../models/notificationModel.js');
const Product = require('../models/productModel.js');
const Cart = require('../models/cartModel.js');
const Favorite = require('../models/favouriteModel.js');
const Fileupload = require('../utils/fileUpload.js');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const moment = require('moment')
const momentZone = require('moment-timezone');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const response = require("../utils/httpResponseMessage");
const SendMail = require('../utils/sendMail.js');
const Sendnotification = require('../utils/notification.js');
const Menu = require('../models/menuModel.js');
const Order = require('../models/productOrderModel.js');
const CREDIT_USED = require('../models/userCreditUsed.js');
const Admin = require('../models/adminModel.js');
const geodist = require('geodist');
const Openinghours = require('../models/openingHoursModel.js');
const Rating = require('../models/storeRatingModel.js');
const Brand = require('../models/brandModel.js');
const Holiday = require('../models/holidayModel.js');
const QRCode = require("qrcode");
const { createCanvas, loadImage } = require("canvas");
const Cuisine = require('../models/cuisineModel.js');
const convertTime = require('convert-time');
const Badgeearning = require('../models/badgeEarningModel.js');
const Badge = require('../models/badgeModel.js');
const Productearning = require('../models/productEarningModel.js');
const Rescuefood = require('../models/rescuedFoodModel.js');
const Mainorder = require('../models/mainOrderModel.js');
const Itemcategory = require('../models/itemCategoryModel.js');
const Recentsearch = require('../models/recentSearchModel.js');
const Choicecategory = require('../models/choiceCategoryModel.js');
const Productchoice = require('../models/productChoiceModel.js');
const Cuisinecategory = require('../models/cuisineCategoryModel.js');
const Creditmodel = require('../models/creditModel.js');
const Claimcoupon = require('../models/claimCouponModel.js');
const Star = require('../models/starModel.js');
const Reward = require('../models/rewardModel.js');
const authKey = '368530A5a091JQRL6167bdd1P1'
const request = require('request');
const ZOHO = require('../models/zohoModel.js')
const date = require('date-and-time');


module.exports = {


    //==============================================Check mobile and email================================//

    checkUserMobileAndEmail: async (req, res) => {

        try {
            response.log("Request for check mobile and email is============>", req.body);
            let checkEmail = await User.findOne({ email: (req.body.email).toLowerCase() })
            if (checkEmail) {
                response.log("Email Id already exist");
                return response.responseHandlerWithMessage(res, 409, "Email Id already exist");
            }
            let checkMobile = await User.findOne({ mobileNumber: req.body.mobileNumber })
            if (checkMobile) {
                response.log("Mobile number already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number already exist");
            }
            response.log(`Available`);
            return response.responseHandlerWithMessage(res, 200, `Available`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Check user mobile=====================================//

    checkUserMobile: async (req, res) => {

        try {
            response.log("Request for check mobile is============>", req.body);
            let checkMobile = await User.findOne({ mobileNumber: req.body.mobileNumber })
            if (checkMobile) {
                response.log("Mobile number already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number already exist");
            }
            response.log("Available");
            return response.responseHandlerWithMessage(res, 200, `Available`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Check email=============================================//

    checkEmailForUser: async (req, res) => {

        try {
            response.log("Request for check email is============>", req.body);
            let checkEmail = await User.findOne({ email: (req.body.email).toLowerCase() })
            if (checkEmail) {
                response.log("Email already exist");
                return response.responseHandlerWithMessage(res, 409, "Email already exist");
            }
            let otp = Math.floor(100000 + Math.random() * 900000)
            response.log("Otp is=========>", otp)

            response.log(`Otp has been sent to your email ${(req.body.email).toLowerCase()} successfully.`, otp);
            response.responseHandlerWithData(res, 200, `Otp has been sent to your email ${(req.body.email).toLowerCase()} successfully.`, otp);
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

    //===========================================User Signup===============================================//

    userSignup: async (req, res) => {

        try {
            response.log("Request for user signup is=============>", req.body)
            req.checkBody('password', 'Something went wrong').notEmpty();
            req.checkBody('name', 'Something went wrong').notEmpty();
            req.checkBody('email', 'Something went wrong').notEmpty();
            req.checkBody('countryCode', 'Something went wrong').notEmpty();
            req.checkBody('mobileNumber', 'Something went wrong').notEmpty();
            req.checkBody('address', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkEmail = await User.findOne({ email: (req.body.email).toLowerCase() })
            if (checkEmail) {
                response.log("Email Id already exist");
                return response.responseHandlerWithMessage(res, 409, "Email Id already exist");
            }
            let checkMobile = await User.findOne({ mobileNumber: req.body.mobileNumber })
            if (checkMobile) {
                response.log("Mobile number already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number already exist");
            }
            let checkAdmin = await Admin.findOne({ userType: 'Admin' })
            let userNumber = `CU${checkAdmin.userNumber}`
            let newNumber = Number(checkAdmin.userNumber) + 1
            req.body.password = await bcrypt.hashSync(req.body.password, salt);
            let signupObj = new User({
                email: (req.body.email).toLowerCase(),
                countryCode: req.body.countryCode,
                mobileNumber: req.body.mobileNumber,
                userNumber: userNumber,
                address: req.body.address,
                name: req.body.name,
                password: req.body.password,
                latitude: Number(req.body.latitude),
                longitude: Number(req.body.longitude),
                deviceType: req.body.deviceType,
                deviceToken: req.body.deviceToken,
                distance: req.body.distance,
                location: { "type": "Point", "coordinates": [Number(req.body.longitude), Number(req.body.latitude)] }
            })
            let signupData = await signupObj.save()
            let jwtToken = jwt.sign({ "_id": signupData._id }, `sUpER@SecReT`);
            let updateToken = await User.findByIdAndUpdate({ _id: signupData._id }, { $set: { jwtToken: jwtToken } }, { new: true, lean: true })
            delete (updateToken.password);
            response.log("You have successfully signed up", updateToken)
            notiTitle = `${req.body.name}! You are welcome.`
            notiMessage = `Hi! Thanks for signing up. You are welcome.`
            notiType = 'welcome'
            newId = signupData._id
            response.log("You have successfully signed up", updateToken)
            response.responseHandlerWithData(res, 200, `You have successfully signed up`, updateToken);
            await Admin.findByIdAndUpdate({ _id: checkAdmin._id }, { $set: { userNumber: newNumber } }, { new: true })

            //zoho
            response.log('===========================================ZOHO Works================================================');
            let dataString = {
                "data": [
                    {
                        "Customer_ID": userNumber,
                        "Customer_Location": req.body.address,
                        "Customer_Mobile": req.body.mobileNumber,
                        "Name": req.body.name,
                        "Customer_Since": date.format(signupData.createdAt, "YYYY-MM-DD"),
                        "Email": req.body.email,
                        "Reward_Star_Status": 0,
                        "Unused_Credits": 0
                    }
                ]
            }
            let result = await ZOHO.findOne()
            var headers = {
                'Authorization': `Zoho-oauthtoken ${result.access_token}`
            };
            var options = {
                url: `https://www.zohoapis.in/crm/v2/Customers`,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dataString)
            };

            request(options,async  function (error, res1, body) {
                if (!error) {
                    // let data = JSON.stringify(data)
                    var obj = JSON.parse(body)
                    let data = {...obj};
                    response.log('===========================================Saved================================================>',data.data[0].details.id);
                    await User.findByIdAndUpdate({ _id: signupData._id }, { $set: { zohoId: data.data[0].details.id} }, { new: true })
                }else{
                    response.log('===========================================Not Saved================================================',error);
                }
            });

            Sendnotification.sendNotificationForAndroid(signupData.deviceToken, notiTitle, notiMessage, notiType, newId, signupData.deviceType, (error10, result10) => {
                response.log("Notification Sent");
            })
            return
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    //===========================================User Login================================================//

    userLogin: async (req, res) => {

        try {
            response.log("Request for user signin is=============>", req.body);
            req.checkBody('password', 'Something went wrong').notEmpty();
            req.checkBody('mobileNumber', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkUser = await User.findOne({ mobileNumber: req.body.mobileNumber })
            if (!checkUser) {
                response.log("Invalid credentials1");
                return response.responseHandlerWithMessage(res, 401, "Invalid credentials");
            }
            if (checkUser.status == 'Inactive') {
                response.log("You have blocked by administrator")
                return response.responseHandlerWithMessage(res, 423, "Your account have been disabled by administrator due to any suspicious activity");
            }
            if (checkUser.deleteStatus == true) {
                response.log("You have blocked by administrator")
                return response.responseHandlerWithMessage(res, 423, "You have terminated your account. Are you sure you want to re-open your existing account?");
            }
            var passVerify = await bcrypt.compareSync(req.body.password, checkUser.password);
            if (!passVerify) {
                response.log("Invalid credentials2");
                return response.responseHandlerWithMessage(res, 401, "Invalid credentials");
            }
            let jwtToken = jwt.sign({ "_id": checkUser._id }, `sUpER@SecReT`);
            let result2 = await User.findByIdAndUpdate({ "_id": checkUser._id }, { $set: { "jwtToken": jwtToken, deviceToken: req.body.deviceToken, deviceType: req.body.deviceType } }, { new: true, lean: true })
            response.log("You have successfully logged in.", result2)
            delete (result2.password)
            return response.responseHandlerWithData(res, 200, "You have successfully logged in", result2);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Get Notification List======================================//

    getNotificationList: async (req, res) => {

        try {
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let result = await Notification.find({ notiTo: req.user._id, }).sort({ createdAt: -1 }).limit(30)
            response.log("Notification list found successfully", result);
            response.responseHandlerWithData(res, 200, "Notification List Found Successfully", result);
            let searchQuery = { $and: [{ notiTo: req.user._id }, { isSeen: false }] }
            await Notification.updateMany(searchQuery, { $set: { isSeen: true } })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Forgot Passsword===================================//

    forgotPassword: async (req, res) => {

        try {
            response.log("Request for forgot password is==============>", req.body)
            req.checkBody('password', 'Something went wrong').notEmpty();
            req.checkBody('userId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkUser = await User.findOne({ _id: req.body.userId })
            if (!checkUser) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            else if (checkUser.status == 'Inactive') {
                response.log("You have blocked by administrator")
                return response.responseHandlerWithMessage(res, 423, "Your account have been disabled by administrator due to any suspicious activity");
            }
            req.body.password = await bcrypt.hashSync(req.body.password, salt);
            await User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { password: req.body.password } }, { new: true })
            response.log("Password reset successfully")
            return response.responseHandlerWithMessage(res, 200, "Password reset successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Check mobile for forgot=================================//

    checkMobilForForgotPassword: async (req, res) => {

        try {
            response.log("Request for forgot password is==========>", req.body);
            req.checkBody('mobileNumber', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkMobileNumber = await User.findOne({ mobileNumber: req.body.mobileNumber })
            if (checkMobileNumber) {
                let obj = {
                    userId: checkMobileNumber._id
                }
                response.log("Otp send on your mobile")
                return response.responseHandlerWithData(res, 200, `Account found successfully`, obj);
            }
            if (!checkMobileNumber) {
                response.log("Mobile number is not registerd")
                return response.responseHandlerWithMessage(res, 409, "This mobile number is not registered with our system. Please try signup.");
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================================Get User Details===================================//

    getUserDetails: async (req, res) => {

        try {
            let checkUser = await User.findOne({ "_id": req.user._id }).lean().select('walletAmount email mobileNumber')
            if (!checkUser) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("User Details found successfully", checkUser);
            delete (checkUser.password)
            return response.responseHandlerWithData(res, 200, "User Details found successfully", checkUser);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================User Logout======================================//

    userLogout: async (req, res) => {

        try {
            let checkUser = await User.findOne({ "_id": req.user._id })
            if (!checkUser) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let result = await User.findByIdAndUpdate({ "_id": req.user._id }, { $set: { jwtToken: "", deviceType: '', deviceToken: '' } }, { new: true })
            response.log("Logout successfully", result)
            return response.responseHandlerWithMessage(res, 200, "Logout successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================================Notification Count==============================//

    getNotificationCount: async (req, res) => {

        try {
            let query = { $and: [{ notiTo: req.user._id }, { isSeen: false }] }
            let result = await Notification.find(query).count()
            response.log("Notification count is==========>", result)
            return response.responseHandlerWithData(res, 200, "Notification Count Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================User Update Details==============================//

    userUpdateDetails: async (req, res) => {

        try {

            response.log("Request for update profile pic is===========>", req.body)
            req.checkBody('name', 'Something went wrong').notEmpty();
            req.checkBody('email', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let profilePic = req.user.profilePic
            if (req.body.profilePic) {
                profilePic = req.body.profilePic
            }
            let checkEmail = await User.findOne({ email: (req.body.email).toLowerCase(), _id: { $ne: req.user._id } })
            if (checkEmail) {
                response.log("Email Id already exist");
                return response.responseHandlerWithMessage(res, 409, "Email Id already exist");
            }
            let obj = {
                name: req.body.name,
                email: req.body.email,
                profilePic: profilePic
            }
            let result = await User.findByIdAndUpdate({ _id: req.user._id }, { $set: obj }, { new: true, lean: true })
            delete (result.password);
            response.log("Profile has been updated successfully", result);
            return response.responseHandlerWithData(res, 200, "Profile has been updated successfully", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================================Change password================================//

    changePassword: async (req, res) => {

        try {
            req.checkBody('oldPassword', 'Something went wrong').notEmpty();
            req.checkBody('newPassword', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            response.log("Bcrypt Password is=======>", req.user.password)
            let passVerify = await bcrypt.compareSync(req.body.oldPassword, req.user.password);
            response.log("Password verification status is===========>", passVerify);
            if (!passVerify) {
                response.log("Old password is not correct");
                return response.responseHandlerWithMessage(res, 400, "Old password is incorrect.");
            }
            req.body.newPassword = bcrypt.hashSync(req.body.newPassword, salt);
            let userData = await User.findByIdAndUpdate({ _id: req.user._id }, { $set: { "password": req.body.newPassword } }, { new: true })
            response.log("Password changed successfully", userData);
            return response.responseHandlerWithMessage(res, 200, "Password has been changed successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }

    },

    //==============================================Change mobile number===============================//

    changeMobileNumber: async (req, res) => {

        try {
            response.log("Request for change mobile number is===========>", req.body);
            req.checkBody('mobileNumber', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkMobile = await User.findOne({ mobileNumber: req.body.mobileNumber })
            if (checkMobile) {
                response.log("Mobile number already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number already exist");
            }
            let result = await User.findByIdAndUpdate({ "_id": req.user._id }, { $set: { mobileNumber: req.body.mobileNumber } }, { new: true })
            response.log("Mobile number updated successfully", result);
            return response.responseHandlerWithMessage(res, 200, "Mobile number updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Change email=====================================//

    changeEmail: async (req, res) => {

        try {
            response.log("Request for change email is===========>", req.body);
            req.checkBody('email', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkEmail = await User.findOne({ email: (req.body.email).toLowerCase() })
            if (checkEmail) {
                response.log("Email Id already exist");
                return response.responseHandlerWithMessage(res, 409, "Email Id already exist");
            }
            let result = await User.findByIdAndUpdate({ "_id": req.user._id }, { $set: { email: req.body.email } }, { new: true })
            response.log("Email updated successfully", result);
            return response.responseHandlerWithMessage(res, 200, "Email updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Notification settings============================//

    notificationSetting: async (req, res) => {

        try {
            response.log("Request for update notification setting is============>", req.body);
            req.checkBody('notificationStatus', 'Something went wrong').notEmpty();
            let obj = {
                notificationStatus: req.body.notificationStatus
            }
            let result = await User.findByIdAndUpdate({ "_id": req.user._id }, { $set: obj }, { new: true })
            response.log("Notification settings updated successfully", result);
            return response.responseHandlerWithMessage(res, 200, "Notification settings updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Delete notification==============================//

    deleteNotification: async (req, res) => {

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

    clearNotification: async (req, res) => {

        try {
            response.log("Request for clear notification is=============>", req.body);
            await Notification.deleteMany({ notiTo: req.user._id })
            response.log("Notification deleted successfully")
            return response.responseHandlerWithMessage(res, 200, `Notification(s) deleted successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Add address===================================//

    updateAddress: async (req, res) => {

        try {
            response.log("Request for add address is=============>", req.body);
            req.checkBody('address', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                latitude: Number(req.body.latitude),
                longitude: Number(req.body.longitude),
                distance: Number(req.body.distance),
                address: req.body.address,
                location: { "type": "Point", "coordinates": [Number(req.body.longitude), Number(req.body.latitude)] }
            }
            await User.findByIdAndUpdate({ _id: req.user._id }, { $set: obj }, { new: true })
            response.log("Address updated successfully")
            return response.responseHandlerWithMessage(res, 200, `Address updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Add to cart====================================//

    addToCart: async (req, res) => {

        try {
            response.log("Request for add to cart is=============>", req.body);
            req.checkBody('productId', 'Something went wrong').notEmpty();
            req.checkBody('restroId', 'Something went wrong').notEmpty();
            req.checkBody('quantity', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkRestroActaul = await Cart.findOne({ restroId: req.body.restroId, userId: req.user._id })
            if (checkRestroActaul) {
                let checkCartCount = await Cart.find({ userId: req.user._id }).count()
                let checkProduct = await Product.findOne({ _id: req.body.productId })
                if (!checkProduct) {
                    response.log("Something went wrong")
                    return response.responseHandlerWithMessage(res, 503, "Something went wrong");
                }
                if (checkCartCount <= 3) {
                    let checkRestro = await Cart.findOne({ restroId: req.body.restroId, userId: req.user._id })
                    if (checkRestro) {
                        let productData = {
                            productId: req.body.productId,
                            choice: req.body.choice,
                            quantity: Number(req.body.quantity),
                            type: req.body.type
                        }
                        let cartData = await Cart.findOneAndUpdate({ _id: checkRestro._id }, { $push: { productData: productData } }, { new: true })
                        response.log("Item added to cart successfully", cartData)
                        return res.send({ "status": 200, "message": "Item added to cart successfully", cartData: cartData })
                    }
                    if (!checkRestro) {
                        let productData = [{
                            productId: req.body.productId,
                            choice: req.body.choice,
                            quantity: Number(req.body.quantity),
                            type: req.body.type
                        }]
                        let cartObj = new Cart({
                            restroId: req.body.restroId,
                            userId: req.user._id,
                            productData: productData
                        })
                        let cartData = await cartObj.save()
                        response.log("Item added to cart successfully", cartData)
                        return res.send({ "status": 200, "message": "Item added to cart successfully", cartData: cartData })
                    }
                }
            }
            if (!checkRestroActaul) {
                let checkCartCount = await Cart.find({ userId: req.user._id }).count()
                if (checkCartCount == 3) {
                    response.log("Sorry! Can not add this item to your cart because you can order at max 3 restaurant same time")
                    return response.responseHandlerWithMessage(res, 503, "Sorry! Can not add this item to your cart because you can order at max 3 restaurant same time");
                }
                let checkProduct = await Product.findOne({ _id: req.body.productId })
                if (!checkProduct) {
                    response.log("Something went wrong")
                    return response.responseHandlerWithMessage(res, 503, "Something went wrong");
                }
                if (checkCartCount < 3) {
                    let checkRestro = await Cart.findOne({ restroId: req.body.restroId, userId: req.user._id })
                    if (checkRestro) {
                        let productData = {
                            productId: req.body.productId,
                            choice: req.body.choice,
                            quantity: Number(req.body.quantity),
                            type: req.body.type
                        }
                        let cartData = await Cart.findOneAndUpdate({ _id: checkRestro._id }, { $push: { productData: productData } }, { new: true })
                        response.log("Item added to cart successfully", cartData)
                        return res.send({ "status": 200, "message": "Item added to cart successfully", cartData: cartData })
                    }
                    if (!checkRestro) {
                        let productData = [{
                            productId: req.body.productId,
                            choice: req.body.choice,
                            quantity: Number(req.body.quantity),
                            type: req.body.type
                        }]
                        let cartObj = new Cart({
                            restroId: req.body.restroId,
                            userId: req.user._id,
                            productData: productData
                        })
                        let cartData = await cartObj.save()
                        response.log("Item added to cart successfully", cartData)
                        return res.send({ "status": 200, "message": "Item added to cart successfully", cartData: cartData })
                    }
                }
            }

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Clear cart======================================//

    clearCart: async (req, res) => {

        try {
            response.log("Request for clear cart is============>", req.body);
            let cartClear = await Cart.deleteMany({ userId: req.user._id })
            response.log("Item removed successfully", cartClear);
            return response.responseHandlerWithMessage(res, 200, `Item removed successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================delete restro from cart==========================//

    deleteRestroFromCart: async (req, res) => {

        try {
            response.log("Request for delete rsetro from cart is========>", req.body);
            req.checkBody('cartId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let deleteCart = await Cart.findByIdAndRemove({ "_id": req.body.cartId })
            if (!deleteCart) {
                response.log("Invalid cart Id");
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            response.log("Record deleted successfully");
            return res.send({ "status": 200, "message": "Record deleted successfully" })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Delete item from cart===========================//

    deleteItemFromCart: async (req, res) => {

        try {
            response.log("Request for delete item from cart is============>", req.body);
            req.checkBody('cartId', 'Something went wrong').notEmpty();
            req.checkBody('itemId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let deleteItem = await Cart.findOneAndUpdate({ "_id": req.body.cartId, "productData.productId": req.body.itemId }, { $pull: { productData: { productId: req.body.itemId } } }, { safe: true, new: true })
            if (!deleteItem) {
                response.log("Invalid cart Id");
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            if (deleteItem.productData.length == 0) {
                await Cart.findByIdAndRemove({ _id: req.body.cartId })
            }
            response.log("Item deleted successfully");
            return res.send({ "status": 200, "message": "Item deleted successfully" })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Update cart======================================//

    updateCart: async (req, res) => {

        try {
            response.log("Request for update cart is===========>", req.body);
            req.checkBody('cartId', 'Something went wrong').notEmpty();
            req.checkBody('itemId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            if (Number(req.body.quantity) == 0) {
                let deleteItem = await Cart.findOneAndUpdate({ "_id": req.body.cartId, "productData.productId": req.body.itemId }, { $pull: { productData: { productId: req.body.itemId } } }, { safe: true, new: true })
                if (!deleteItem) {
                    response.log("Invalid cart Id");
                    return response.responseHandlerWithMessage(res, 503, "Something went wrong");
                }
                if (deleteItem.productData == 0) {
                    await Cart.findByIdAndRemove({ _id: req.body.cartId })
                }
                response.log("Cart updated successfully", deleteItem);
                return res.send({ "status": 200, "message": "Item removed from cart successfully" })
            }
            let cartUpdate = await Cart.update({ "_id": req.body.cartId, "productData.productId": req.body.itemId }, { $set: { "productData.$.quantity": req.body.quantity, "productData.$.choice": req.body.choice, "productData.$.requirement": req.body.requirement } }, { new: true })
            if (!cartUpdate) {
                response.log("Invalid cart Id");
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            response.log("Cart updated successfully", cartUpdate);
            return res.send({ "status": 200, "message": "Cart updated successfully" })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=====================================Get cart count===========================================//

    getCartCount: async (req, res) => {

        try {
            response.log("Request for get cart count is=========>", req.body);
            let checkCount = await Cart.find({ userId: req.user._id })
            let updatedCount=0
            for(let i=0;i<checkCount.length;i++){
                let newProdData=checkCount[i].productData
                let newCount = _.sumBy(newProdData, 'quantity')
                updatedCount=updatedCount+newCount
            }            
            response.log("Cart count found successfully", updatedCount);
            response.responseHandlerWithData(res, 200, "Cart count found successfully", updatedCount);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Get item detail=======================================//

    getItemDetail: async (req, res) => {

        try {
            response.log("Request for get item detail is=========>", req.body);
            req.checkBody('itemId', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (!req.body.userId == "") {
                userId = req.body.userId
            }
            let checkItem = await Product.findOne({ "_id": req.body.itemId }).lean()
            if (!checkItem) {
                response.log("Invalid restaurant Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let extra = await Product.find({ "refProductId.productId": req.body.itemId }).select('foodName description foodQuantity price foodType subCategory cuisine foodImage safetyBadge')
            let checkCartData = await Cart.findOne({ "productData.productId": req.body.itemId, userId: userId })
            checkItem.cartData = checkCartData
            checkItem.extra = extra
            let choiceData = await Productchoice.aggregate([
                {
                    $match: {
                        productId: ObjectId(req.body.itemId)
                    }
                },
                {
                    $lookup:
                    {
                        from: "choicecategorys",
                        localField: "choiceId",
                        foreignField: "_id",
                        as: "choiceNewData"
                    }
                },
                {
                    $unwind: {
                        path: "$choiceNewData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "choiceNewData.status": 'Active'
                    }
                }
            ])
            checkItem.choiceData = choiceData
            let checkMenu = await Menu.findOne({ _id: checkItem.menuId, status: 'Active' })
            if (!checkMenu) {
                response.log("Invalid menu Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let isFav = false
            let checkFav = await Favorite.findOne({ brandId: checkMenu.brandId, userId: userId })
            if (checkFav) {
                isFav = true
            }
            checkItem.isFav = isFav
            let checkBrand = await Brand.findOne({ _id: checkMenu.brandId }).select('image logo businessName latitude longitude address avgRating').lean()
            if (checkBrand) {
                let distance = await geodist({ lon: parseFloat(checkBrand.longitude), lat: parseFloat(checkBrand.latitude) }, { lon: parseFloat(req.body.longitude), lat: parseFloat(req.body.latitude) }, { exact: true, unit: 'meters' })
                let day = moment().format('dddd');
                let checkToday = await Openinghours.findOne({ day: day, brandId: checkMenu.brandId, status: 'Active' }).select('saleWindowOpen saleWindowClose pickupWindowOpen pickupWindowClose day').lean()
                checkItem.restroData = checkBrand
                checkItem.distance = distance
                checkBrand.storeStatus = true
                if (checkToday) {
                    checkToday.pickupOpenTime = convertTime(checkToday.pickupWindowOpen, 'hh:mm A')
                    checkToday.pickupCloseTime = convertTime(checkToday.pickupWindowClose, 'hh:mm A')
                    checkItem.todayData = checkToday
                }
                if (!checkToday) {
                    response.log("Restaurant is not accepting order now.");
                    return response.responseHandlerWithMessage(res, 501, "Restaurant is not accepting order now.");
                }
                let startDate = new Date()
                let checkHoliday = await Holiday.findOne({ status: 'Inactive', brandId: checkMenu.brandId, convertedStartDate: { $lte: startDate }, convertedEndDate: { $gte: startDate } })
                if (checkHoliday) {
                    response.log("Restaurant is not available");
                    return response.responseHandlerWithMessage(res, 501, "Restaurant is not available due to holiday!");
                }
            }
            response.log("Item Details found successfully", checkItem);
            return response.responseHandlerWithData(res, 200, "Item Details found successfully", checkItem);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Get restro detail=====================================//

    getRestroDetail: async (req, res) => {

        try {
            response.log("Request for get restro detail is=========>", req.body);
            req.checkBody('restroId', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (!req.body.userId == "") {
                userId = req.body.userId
            }
            let checkBrand = await Brand.findOne({ _id: req.body.restroId }).select('image logo businessName latitude longitude address safetyBadge avgRating').lean()
            if (!checkBrand) {
                response.log("Invalid restro Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            if (checkBrand) {
                let isFav = false
                let checkFav = await Favorite.findOne({ brandId: req.body.restroId, userId: userId })
                if (checkFav) {
                    isFav = true
                }
                checkBrand.isFav = isFav
                let checkMenu = await Menu.findOne({ brandId: req.body.restroId, status: 'Active' })
                if (!checkMenu) {
                    response.log("Restaurant is not available");
                    return response.responseHandlerWithMessage(res, 501, "Restaurant is not available");
                }
                checkBrand.menuData = checkMenu._id
                let distance = await geodist({ lon: parseFloat(checkBrand.longitude), lat: parseFloat(checkBrand.latitude) }, { lon: parseFloat(req.body.longitude), lat: parseFloat(req.body.latitude) }, { exact: true, unit: 'meters' })
                let day = moment().format('dddd');
                let checkToday = await Openinghours.findOne({ day: day, brandId: req.body.restroId, status: 'Active' }).select('saleWindowOpen saleWindowClose pickupWindowOpen pickupWindowClose day').lean()
                checkBrand.distance = distance
                if (checkToday) {
                    checkToday.pickupOpenTime = convertTime(checkToday.pickupWindowOpen, 'hh:mm A')
                    checkToday.pickupCloseTime = convertTime(checkToday.pickupWindowClose, 'hh:mm A')
                    checkBrand.todayData = checkToday
                }
                if (!checkToday) {
                    response.log("Restaurant is not available");
                    return response.responseHandlerWithMessage(res, 501, "Restaurant is not available");
                }
                let startDate = new Date()
                let checkHoliday = await Holiday.findOne({ status: 'Inactive', brandId: req.body.restroId, convertedStartDate: { $lte: startDate }, convertedEndDate: { $gte: startDate } })
                if (checkHoliday) {
                    response.log("Restaurant is not available");
                    return response.responseHandlerWithMessage(res, 501, "Restaurant is not available");
                }
            }
            response.log("Details found successfully", checkBrand);
            return response.responseHandlerWithData(res, 200, "Details found successfully", checkBrand);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Get menu list======================================//

    getMenuList: async (req, res) => {

        try {
            response.log("Request for get menu list is==============>", req.body);
            req.checkBody('menuId', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (!req.body.userId == "") {
                userId = req.body.userId
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
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            let checkMenu = await Menu.findOne({ _id: req.body.menuId })
            if (!checkMenu) {
                response.log("Invalid menu Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let restroObj = {}
            let isFav = false
            let checkFav = await Favorite.findOne({ brandId: checkMenu.brandId, userId: userId })
            if (checkFav) {
                isFav = true
            }
            let checkBrand = await Brand.findOne({ _id: checkMenu.brandId }).select('image logo businessName latitude longitude address foodType mobileNumber webiteLink avgRating safetyBadge').lean()
            if (checkBrand) {
                let distance = await geodist({ lon: parseFloat(checkBrand.longitude), lat: parseFloat(checkBrand.latitude) }, { lon: parseFloat(req.body.longitude), lat: parseFloat(req.body.latitude) }, { exact: true, unit: 'meters' })
                let day = moment().format('dddd');
                let checkToday = await Openinghours.findOne({ day: day, brandId: checkMenu.brandId, status: 'Active' }).lean()
                if (checkToday) {
                    checkToday.pickupOpenTime = convertTime(checkToday.pickupWindowOpen, 'hh:mm A')
                    checkToday.pickupCloseTime = convertTime(checkToday.pickupWindowClose, 'hh:mm A')
                    checkBrand.storeStatus = true
                    restroObj = {
                        restroData: checkBrand,
                        todayData: checkToday,
                        distance: distance,
                        isFav: isFav
                    }
                }
                if (!checkToday) {
                    response.log("Restaurant is not available");
                    return response.responseHandlerWithMessage(res, 501, "Restaurant is not available");
                }
                if (!checkToday) {
                    let startDate = new Date()
                    let checkHoliday = await Holiday({ status: 'Active', brandId: checkMenu.brandId, convertedStartDate: { $lte: startDate, convertedEndDate: { $gte: startDate } } })
                    if (checkHoliday) {
                        response.log("Restaurant is not available");
                        return response.responseHandlerWithMessage(res, 501, "Restaurant is not available");
                    }
                    if (!checkHoliday) {
                        restroObj = {
                            restroData: checkBrand,
                            todayData: {},
                            distance: distance,
                            isFav: isFav
                        }
                    }
                }
            }
            let itemsCount = await Brand.aggregate([
                {
                    $match: {
                        _id: ObjectId(checkMenu.brandId)
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: ObjectId(req.body.menuId), sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $gte: ["$convertedExpiryDate", nowTime] },
                                        { $gt: ["$leftQuantity", 0] },
                                    ]
                                }
                            }
                        },
                        {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        },
                        {
                            "$group": {
                                _id: "$menuId",
                                letfProductAllSum: { "$sum": "$leftQuantity" },
                            }
                        }],
                        as: "maxLeft"
                    }
                },
                {
                    $unwind: {
                        path: "$maxLeft",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        "leftData": "$maxLeft.letfProductAllSum",
                    }
                },
            ])
            let checkStatus = false
            let newLeftCount = 0
            if (itemsCount.length > 0) {
                if (itemsCount[0].leftData) {
                    newLeftCount = itemsCount[0].leftData
                }
                else {
                    newLeftCount = 0
                }

            }
            if (newLeftCount == 0) {
                checkStatus = true
            }
            let cuisineList = []
            let cuisines = await Itemcategory.find({ status: 'Active', brandId: checkMenu.brandId }).sort({ createdAt: -1 }).select('name')
            if (cuisines.length == 0) {
                response.log("Menu list found successfully", []);
                return response.responseHandlerWithData(res, 200, "Menu list found successfully", []);
            }
            for (let j = 0; j < cuisines.length; j++) {
                let checkCuisineQuery = {
                    $and: [
                        {
                            $or: [
                                { "sellingStatus": true },
                                { "sellingStatus": false }
                            ]
                        },
                        {
                            menuCategoryId: cuisines[j]._id
                        },
                        {
                            menuId: req.body.menuId
                        },
                        {
                            pauseStatus: false
                        }
                    ]
                }
                let checkCount = await Product.find(checkCuisineQuery).count()
                if (checkCount > 0) {
                    cuisineList.push(cuisines[j])
                }
            }
            let itemData = []
            if (cuisineList.length > 0) {
                for (let i = 0; i < cuisineList.length; i++) {
                    let itemList = await Product.aggregate([
                        {
                            $match: {
                                menuCategoryId: cuisineList[i]._id,
                                menuId: ObjectId(req.body.menuId),
                                deleteStatus: false,
                                sellingStatus: true,
                                pauseStatus: false,
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        },
                        {
                            "$project": {
                                "adminVerifyStatus": 1,
                                "status": 1,
                                "deleteStatus": 1,
                                "sellingStatus": 1,
                                "isChoiceStatus": 1,
                                "changeRequest": 1,
                                "changeRequestApporve": 1,
                                "changeRequestMsg": 1,
                                "totalOrder": 1,
                                "avgRating": 1,
                                "totalRating": 1,
                                "ratingByUsers": 1,
                                "quantitySell": 1,
                                "leftQuantity": 1,
                                "addedQuantity": 1,
                                "pickupLaterAllowance": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "subCategory": 1,
                                "cuisine": 1,
                                "foodImage": 1,
                                "changeRequestId": 1,
                                "category": 1,
                                "createdAt": 1,
                                "updatedAt": 1,
                                "convertedExpiryDate": 1,
                                "convertedPickupDate": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "expiryDate": 1,
                                "expiryTime": 1,
                                "pickupDate": 1,
                                "pickupTime": 1,
                                "pauseStatus": 1
                            }
                        },
                        {
                            $sort: { leftQuantity: 1 }
                        }
                    ])
                    let fullPriceItems = await Product.aggregate([
                        {
                            $match: {
                                menuCategoryId: cuisineList[i]._id,
                                menuId: ObjectId(req.body.menuId),
                                deleteStatus: false,
                                sellingStatus: false
                            }
                        },
                        {
                            "$project": {
                                "adminVerifyStatus": 1,
                                "status": 1,
                                "deleteStatus": 1,
                                "sellingStatus": 1,
                                "isChoiceStatus": 1,
                                "changeRequest": 1,
                                "changeRequestApporve": 1,
                                "changeRequestMsg": 1,
                                "totalOrder": 1,
                                "avgRating": 1,
                                "totalRating": 1,
                                "ratingByUsers": 1,
                                "quantitySell": 1,
                                "leftQuantity": 1,
                                "addedQuantity": 1,
                                "pickupLaterAllowance": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "subCategory": 1,
                                "cuisine": 1,
                                "foodImage": 1,
                                "changeRequestId": 1,
                                "category": 1,
                                "createdAt": 1,
                                "updatedAt": 1,
                                "convertedExpiryDate": 1,
                                "convertedPickupDate": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "expiryDate": 1,
                                "expiryTime": 1,
                                "pickupDate": 1,
                                "pickupTime": 1,
                                "pauseStatus": 1,
                                "outOfStock": 1
                            }
                        },
                        {
                            $sort: { createdAt: -1 }
                        }
                    ])
                    let newDataFull = fullPriceItems
                    if (checkStatus == true) {
                        newDataFull = []
                    }
                    let obj = {
                        itemList: itemList,
                        cuisineName: cuisineList[i].name,
                        cuisineId: cuisineList[i]._id,
                        fullPriceItems: newDataFull
                    }
                    itemData.push(obj)
                }
            }
            let itemListAll = await Product.aggregate([
                {
                    $match: {
                        menuId: ObjectId(req.body.menuId),
                        deleteStatus: false,
                        sellingStatus: true,
                        pauseStatus: false,
                        foodTypeArray: { $in: foodTypeArray }
                    }
                },
                {
                    "$project": {
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "offeredPrice": 1
                    }
                },
                {
                    $sort: { leftQuantity: -1 }
                }
            ])
            let fullPriceItemsList = await Product.aggregate([
                {
                    $match: {
                        menuId: ObjectId(req.body.menuId),
                        deleteStatus: false,
                        sellingStatus: false,
                        pauseStatus: false,
                        foodTypeArray: { $in: foodTypeArray }
                    }
                },
                {
                    "$project": {
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "offeredPrice": 1,
                        "outOfStock": 1
                    }
                },
                {
                    $sort: { createdAt: -1 }
                }
            ])
            let newDataFullAll = fullPriceItemsList
            if (checkStatus == true) {
                newDataFullAll = []
            }
            let myData = {
                cuisineList: cuisineList,
                itemData: itemData,
                restroObj: restroObj,
                itemListAll: itemListAll,
                fullPriceItemsList: newDataFullAll
            }
            response.log("Menu list found successfully", myData);
            return response.responseHandlerWithData(res, 200, "Menu list found successfully", myData);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Add to favorite===================================//

    addToFavourite: async (req, res) => {

        try {
            response.log("Request for add to favourite is============>", req.body);
            req.checkBody('storeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Brand.findOne({ _id: req.body.storeId })
            if (!checkBrand) {
                response.log("Something went wrong")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let checkFav = await Favorite.findOne({ brandId: req.body.storeId, userId: req.user._id })
            if (!checkFav) {
                let date = moment().format('YYYY-MM-DD')
                let favouireObj = new Favorite({
                    brandId: req.body.storeId,
                    userId: req.user._id,
                    date: date
                })
                await favouireObj.save()
                response.log("Added to favourite successfully");
                return response.responseHandlerWithMessage(res, 200, `Added to favourite successfully`);
            }
            if (checkFav) {
                await Favorite.findByIdAndRemove({ _id: checkFav._id })
                response.log("Remove from favourite successfully");
                return response.responseHandlerWithMessage(res, 200, `Remove from favourite successfully`);
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Cart item=========================================//

    getCartItem: async (req, res) => {

        try {
            response.log("Request for get cart item is===========>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            currentTime = currentTime.replace(/:/g, '');
            let cartList = await Cart.aggregate([
                {
                    $match: { userId: ObjectId(req.user._id) }
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "restroId",
                        foreignField: "_id",
                        as: "restroData"
                    }
                },
                {
                    $unwind: {
                        path: "$restroData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$restroData._id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$restroData._id"
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] }
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1


                            }
                        }],
                        as: "timeData"
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "restroId": 1,
                        "userId": 1,
                        "productData": 1,
                        "restroData.image": 1,
                        "restroData.logo": 1,
                        "restroData.latitude": 1,
                        "restroData.longitude": 1,
                        "restroData.webiteLink": 1,
                        "restroData.userType": 1,
                        "restroData.businessName": 1,
                        "restroData.mobileNumber": 1,
                        "createdAt": 1,
                        "openingData": 1,
                        "timeData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "restroId": 1,
                        "userId": 1,
                        "productData": 1,
                        "restroData.image": 1,
                        "restroData.logo": 1,
                        "restroData.latitude": 1,
                        "restroData.longitude": 1,
                        "restroData.webiteLink": 1,
                        "restroData.userType": 1,
                        "restroData.businessName": 1,
                        "restroData.mobileNumber": 1,
                        "createdAt": 1,
                        "openingData": 1,
                        "timeData": 1,
                        "saleOpenSt": 1,
                        "saleOpenCt": 1,
                        "saleCloseSt": 1,
                        "saleCloseCt": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "restroId": 1,
                        "userId": 1,
                        "productData": 1,
                        "restroData.image": 1,
                        "restroData.logo": 1,
                        "restroData.latitude": 1,
                        "restroData.longitude": 1,
                        "restroData.webiteLink": 1,
                        "restroData.userType": 1,
                        "restroData.businessName": 1,
                        "restroData.mobileNumber": 1,
                        "createdAt": 1,
                        "openingData": 1,
                        "timeData": 1,
                        "saleOpenSt": 1,
                        "saleOpenCt": 1,
                        "saleCloseSt": 1,
                        "saleCloseCt": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }

                    }
                },
                { "$sort": { createdAt: -1 } }
            ])
            for (let i = 0; i < cartList.length; i++) {
                let productData = cartList[i].productData
                for (let j = 0; j < productData.length; j++) {
                    let checkPro = await Product.findOne({ _id: productData[j].productId })
                    productData[j].productDetail = checkPro
                }
            }
            let taxCommission = await Admin.findOne({ status: 'Active' }).select('fee tax')
            let data = {
                cartData: cartList,
                taxCommission: taxCommission
            }
            response.log("Cart list found successfully", data);
            return response.responseHandlerWithData(res, 200, "Cart list found successfully", data);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Get All restaurant=================================//

    restaurantList: async (req, res) => {

        try {
            response.log("Request for get all restaurant is=============>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            req.checkBody('foodType', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (req.body.userId) {
                userId = req.body.userId
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
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
            let query = {
                $and: [
                    {
                        $or: [
                            { "userType": "Brand" },
                            { "userType": "Store" }
                        ]
                    },
                    {
                        status: 'Active'
                    },
                    {
                        foodTypeArray: { $in: foodTypeArray }
                    },
                    {
                        hiddenStatus: false
                    }
                ]
            }
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }
            let restroList = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs",
                    },

                },
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "menuData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "openingData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", Number(nowTime)] },
                                        { $gte: ["$convertedEndDate", Number(nowTime)] }
                                    ],
                                },
                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$gt:0}
                            }
                        }],
                        as: "productData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "subCategory": 1,
                                "cuisine": 1,
                                "offeredPrice": 1,
                                "foodTypeArray": 1
                            }
                        },
                        {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$gt:0}
                            }
                        },
                        {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $gt: ["$leftQuantity", 0] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        }],
                        as: "leftProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $gt: ["$leftQuantity", 0] },
                                    ]
                                }
                            }
                        },
                        {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                
                            }
                        },
                        {
                            "$group": {
                                _id: "$menuId",
                                letfProductAllSum: { "$sum": "$leftQuantity" },
                            }
                        }],
                        as: "maxLeft"
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "userType": 1,
                        "address": 1,
                        "foodType": 1,
                        "foodTypeArray": 1,
                        "safetyBadge": 1,
                        "itemSize": { $size: "$productData" },
                        "leftData": { $size: "$leftProductData" },
                        "realProductData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                { "$sort": { itemSize: -1 } },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        productSize: { $gt: 0 }
                    }
                }
            ])
            response.log("Restaurant list found successfully", restroList);
            return response.responseHandlerWithData(res, 200, "Restaurant list found successfully", restroList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //============================================== Get all Restaurent without sale ==================//

    restaurantListSaleOff: async (req, res) => {

        try {
            response.log("Request for get all restaurant is=============>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            req.checkBody('foodType', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (req.body.userId) {
                userId = req.body.userId
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
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
            let query = {
                $and: [
                    {
                        $or: [
                            { "userType": "Brand" },
                            { "userType": "Store" }
                        ]
                    },
                    {
                        status: 'Active'
                    },
                    {
                        foodTypeArray: { $in: foodTypeArray }
                    },
                    {
                        hiddenStatus: false
                    }
                ]
            }
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }
            let restroList = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs",
                    },

                },
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "menuData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "openingData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", Number(nowTime)] },
                                        { $gte: ["$convertedEndDate", Number(nowTime)] }
                                    ],
                                },
                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },

        // ===============================================================================//

        {
            $lookup: {
                from: "sellingitemsses",
                let: {
                    brandId: "$_id", userId: ObjectId(userId)
                },
                pipeline: [{
                    $match: {
                        $expr:
                        {
                            $and: [
                                { $eq: ["$brandId", "$$brandId"] },                            ],

                        },

                    }

                },
                {
                    '$sort': {  'createdAt': -1 }
                }, { $limit: 1 }],
                as: "sellData"
            }
        },
        {
            $unwind: {
                path: "$sellData",
                preserveNullAndEmptyArrays: true
            }
        },

        //=================================================================================//
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: false, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$gt:0}
                            }
                        }],
                        as: "productData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: false, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "sellData":1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "subCategory": 1,
                                "cuisine": 1,
                                "offeredPrice": 1,
                                "foodTypeArray": 1
                            }
                        },
                        {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$gt:0}
                            }
                        },
                        {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: false, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $gt: ["$leftQuantity", 0] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        }],
                        as: "leftProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: false, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $gt: ["$leftQuantity", 0] },
                                    ]
                                }
                            }
                        },
                        {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                
                            }
                        },
                        {
                            "$group": {
                                _id: "$menuId",
                                letfProductAllSum: { "$sum": "$leftQuantity" },
                            }
                        }],
                        as: "maxLeft"
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "sellData":1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "userType": 1,
                        "address": 1,
                        "foodType": 1,
                        "foodTypeArray": 1,
                        "safetyBadge": 1,
                        "itemSize": { $size: "$productData" },
                        "leftData": { $size: "$leftProductData" },
                        "realProductData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "sellData":1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "sellData":1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                { "$sort": { itemSize: -1 } },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        // "realProductData.sellingStatus":false,
                        // "realProductData.pauseStatus":false
                        // productSize: { $gt: 0 }
                    }
                }
            ])

            console.log("restroList===>", restroList)
            for(let i = 0; i < restroList.length; i++){

                

                let offerTime = restroList[i].sellData.updatedAt

                let convertedTime = (moment(offerTime).add(5, 'hours').add(30, 'minutes'))

                let fromNow = moment(convertedTime).fromNow()

                let checkTodaYTime = restroList[i].sellData.updatedAt.getHours()

                restroList[i].sellData.fromNow = fromNow


                if (checkTodaYTime < 12) {
                    restroList[i].sellData.OrderTimeSet = "In Morning"
                  } else if (checkTodaYTime < 16) {
                    restroList[i].sellData.OrderTimeSet = "In Afternoon"
                  }
                  else if (checkTodaYTime < 18) {
                    restroList[i].sellData.OrderTimeSet = "In evening"
                  } else {
                    restroList[i].sellData.OrderTimeSet = "In Night"
                  }



            }

            response.log("Restaurant list found successfully", restroList);
            return response.responseHandlerWithData(res, 200, "Restaurant list found successfully", restroList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Get favorite restaurant============================//

    getFavoriteRestaurants: async (req, res) => {

        try {
            response.log("Request for get fav restaurant is=============>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            currentTime = currentTime.replace(/:/g, '');
            let distance = 100000
            let favList = await Favorite.aggregate([
                {
                    $match: {
                        userId: ObjectId(req.user._id)
                    }
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$brandId", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "brands",
                        let: {
                            "brandId": "$brandId", status: 'Active'
                        },
                        pipeline: [
                            {
                                $geoNear: {
                                    near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                                    key: "location",
                                    spherical: true,
                                    maxDistance: distance,
                                    distanceField: "dist.calculated",
                                    includeLocs: "locs",
                                },

                            },
                            {
                                $match: {
                                    $expr:
                                    {
                                        $and: [
                                            { $eq: ["$_id", "$$brandId"] },
                                            { $eq: ["$status", "$$status"] },
                                        ],

                                    },

                                }
                            },
                            {
                                $project: {
                                    "dist.calculated": 1,
                                    "_id": 1,
                                    "businessName": 1,
                                    "logo": 1,
                                    "image": 1,
                                    "avgRating": 1,
                                    "safetyBadge": 1,
                                    "status": 1
                                },
                            },
                            {
                                $limit: 1
                            }
                        ],
                        as: "restroData"
                    }
                },
                {
                    $unwind: {
                        path: "$restroData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "restroData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$brandId", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] }
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "offeredPrice": 1
                            }
                        },
                        {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $gt: ["$leftQuantity", 0] }
                                    ]
                                }
                            }
                        }],
                        as: "leftProductData"
                    }
                },
                {
                    "$project": {
                        "brandId": 1,
                        "realProductData": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "createdAt": 1,
                        "leftData": { $size: "$leftProductData" },
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    "$project": {
                        "brandId": 1,
                        "realProductData": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "createdAt": 1,
                        "leftData": 1,
                        "saleOpenSt": 1,
                        "saleOpenCt": 1,
                        "saleCloseSt": 1,
                        "saleCloseCt": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    "$project": {
                        "brandId": 1,
                        "realProductData": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "createdAt": 1,
                        "leftData": 1,
                        "saleOpenSt": 1,
                        "saleOpenCt": 1,
                        "saleCloseSt": 1,
                        "saleCloseCt": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                {
                    $sort: { "createdAt": - 1 }
                }
            ])
            response.log("Restaurant list found successfully", favList);
            return response.responseHandlerWithData(res, 200, "Restaurant list found successfully", favList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================New restro list=== old api===============================//

    newRestaurantList: async (req, res) => {

        try {
            response.log("Request for get all restaurant is=============>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (!req.body.userId == "") {
                userId = req.body.userId
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
            let query = {
                $and: [
                    { "userType": "Brand" },
                    {
                        status: 'Active'
                    },
                    {
                        foodTypeArray: { $in: foodTypeArray }
                    },
                    {
                        hiddenStatus: false
                    }
                ]
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }
            let restroList = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs",
                    },

                },
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "menuData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "openingData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$gt:0}
                            }
                        }],
                        as: "productData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "foodTypeArray": 1,
                                "subCategory": 1,
                                "cuisine": 1,
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$gt:0}
                            }
                        }, {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $gt: ["$leftQuantity", 0] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        }],
                        as: "leftProductData"
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "userType": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "safetyBadge": 1,
                        "itemSize": { $size: "$productData" },
                        "leftData": { $size: "$leftProductData" },
                        "realProductData": 1,
                        "openingData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "userType": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "itemSize": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                { $sort: { itemSize: -1 } },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        productSize: { $gt: 0 }
                    }
                },
                {
                    $limit: 10
                }
            ])
            response.log("Restaurant list found successfully", restroList);
            return response.responseHandlerWithData(res, 200, "Restaurant list found successfully", restroList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================new restro list============================================//

    newRestaurantListssssssss: async (req, res) => {

        try {
            response.log("Request for get all restaurant is=============>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (!req.body.userId == "") {
                userId = req.body.userId
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
            let query = {
                $and: [
                    { "userType": "Brand" },
                    {
                        status: 'Active'
                    },
                    {
                        foodTypeArray: { $in: foodTypeArray }
                    },
                    {
                        hiddenStatus: false
                    }
                ]
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }
            let restroList = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs",
                    },

                },
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "menuData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "openingData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", 
                            // sellingStatus: true, 
                            pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        // { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$gt:0}
                            }
                        }],
                        as: "productData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id",
                            //  sellingStatus: true, 
                             pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        // { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "foodTypeArray": 1,
                                "subCategory": 1,
                                "cuisine": 1,
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$gt:0}
                            }
                        }, {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", 
                            // sellingStatus: true,
                             pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        // { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $gt: ["$leftQuantity", 0] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        }],
                        as: "leftProductData"
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "userType": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "safetyBadge": 1,
                        "itemSize": { $size: "$productData" },
                        "leftData": { $size: "$leftProductData" },
                        "realProductData": 1,
                        "openingData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "userType": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "itemSize": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                { $sort: { itemSize: -1 } },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        // productSize: { $gt: 0 }
                    }
                },
                {
                    $limit: 10
                }
            ])
            response.log("Restaurant list found successfully", restroList);
            return response.responseHandlerWithData(res, 200, "Restaurant list found successfully", restroList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //============================================Popular restro====================================//

    popularRestaurantList: async (req, res) => {

        try {
            response.log("Request for get all restaurant is=============>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            req.checkBody('limit', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (req.body.userId) {
                userId = req.body.userId
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
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
            let query = {
                $and: [
                    {
                        $or: [
                            { "userType": "Brand" },
                            { "userType": "Store" }
                        ]
                    },
                    {
                        status: 'Active'
                    },
                    {
                        foodTypeArray: { $in: foodTypeArray }
                    },
                    {
                        hiddenStatus: false
                    }
                ]
            }
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }
            let restroList = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs",
                    },

                },
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "menuData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] }
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$gt:0}
                            }
                        }],
                        as: "productData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $gt: ["$leftQuantity", 0] }
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        }],
                        as: "leftProductData"
                    }
                },
                {
                    $lookup: {
                        from: "productorders",
                        let: {
                            restroId: "$_id", status: 'Delivered'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$restroId", "$$restroId"] },
                                        { $eq: ["$status", "$$status"] }
                                    ]
                                }
                            }
                        }],
                        as: "orderData"
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "openingData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] }
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "offeredPrice": 1,
                                "foodTypeArray": 1,
                                "subCategory": 1,
                                "cuisine": 1,
                            }
                        },
                        {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$gt:0}
                            }
                        },
                        {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "userType": 1,
                        "foodType": 1,
                        "safetyBadge": 1,
                        "itemSize": { $size: "$productData" },
                        "orderSize": { $size: "$orderData" },
                        "leftData": { $size: "$leftProductData" },
                        "realProductData": 1,
                        "foodTypeArray": 1,
                        "openingData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                { "$sort": { orderSize: -1 } },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "userType": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "realProductData": 1,
                        "foodTypeArray": 1,
                        "itemSize": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "openingData": 1,
                        "holidayData": 1,
                        "leftData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        productSize: { $gt: 0 }
                    }
                },
                {
                    $limit: Number(req.body.limit)
                }
            ])
            response.log("Restaurant list found successfully", restroList);
            return response.responseHandlerWithData(res, 200, "Restaurant list found successfully", restroList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================More save product================================//

    moreSaveProductList: async (req, res) => {

        try {
            response.log("Request for get product list is==============>", req.body);
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
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
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }
            let itemListAll = await Product.aggregate([
                {
                    $match: {
                        deleteStatus: false,
                        sellingStatus: true,
                        pauseStatus: false,
                        foodTypeArray: { $in: foodTypeArray },
                    }
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            menuId: "$menuId", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$_id", "$$menuId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "menuData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "brands",
                        let: {
                            "brandId": "$menuData.brandId", status: 'Active', hiddenStatus: false
                        },
                        pipeline: [
                            {
                                $geoNear: {
                                    near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                                    key: "location",
                                    spherical: true,
                                    maxDistance: distance,
                                    distanceField: "dist.calculated",
                                    includeLocs: "locs",
                                },

                            },
                            {
                                $match: {
                                    $expr:
                                    {
                                        $and: [
                                            { $eq: ["$_id", "$$brandId"] },
                                            { $eq: ["$status", "$$status"] },
                                            { $eq: ["$hiddenStatus", "$$hiddenStatus"] },
                                        ],

                                    },

                                }
                            },
                            {
                                $project: {
                                    "dist.calculated": 1,
                                    _id: 1,
                                    "businessName": 1,
                                    "userType": 1,
                                    "logo": 1,
                                    "addresss": 1,
                                    "latitude": 1,
                                    "longitude": 1,
                                    "foodType": 1,
                                    "image": 1,
                                    "avgRating": 1,
                                    "status": 1
                                },
                            },
                            {
                                $limit: 1
                            }
                        ],
                        as: "restroData"
                    }
                },
                {
                    $unwind: {
                        path: "$restroData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "restroData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$restroData._id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "openingData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$restroData._id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,      
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        // "offeredPrice": 1,
                        "offeredPrice": { $round: [ "$offeredPrice", 1 ] },
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $sort: { "restroData.dist": 1 }
                },
                {
                    $sort: { "convertedExpiryDate": 1 }
                },
                {
                    $project: {
                        _id: 1,
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $match: {
                        saleWindowOpen: { $lte: Number(currentTime) },
                        saleWindowClose: { $gte: Number(currentTime) },
                        "holidayData.status": { $ne: 'Inactive' }
                    }
                },
                {
                    $limit: 10
                },
            ])

            // let updateUserStatus = await Product.updateMany({ menuId: ObjectId("61adac55b846c60cb016d978") }, { $set: { "foodTypeArray": ["Veg"] } }, { new: true })


            let finalData = _.filter(itemListAll, ({ leftQuantity }) => leftQuantity > 0)
            response.log("Product list found successfully", finalData);
            return response.responseHandlerWithData(res, 200, "Product list found successfully", finalData);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Order rating======================================//

    ratingByUser: async (req, res) => {

        try {
            response.log("Request for rating by user is=======>", req.body);
            req.checkBody('orderId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkOrder = await Order.findOne({ "_id": req.body.orderId })
            if (!checkOrder) {
                response.log("Invalid order Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let checkRating = await Rating.findOne({ userId: req.user._id, orderId: req.body.orderId })
            if (checkRating) {
                response.log("You have given already a rating to this order");
                return response.responseHandlerWithMessage(res, 501, "You have given already a rating to this order.");
            }
            let ratingObj = new Rating({
                userId: req.user._id,
                brandId: checkOrder.storeId,
                rating: Number(req.body.rating),
                review: req.body.review,
                orderId: req.body.orderId
            })
            await ratingObj.save()
            let totalRating = await Rating.aggregate([
                {
                    $match: {
                        brandId: ObjectId(checkOrder.storeId)
                    }
                },
                {
                    "$group": {
                        _id: "$brandId",
                        documentSum: { "$sum": "$rating" },
                        documentAvg: { "$avg": "$rating" }
                    }
                }
            ])
            let countRating = await Rating.find({ brandId: ObjectId(checkOrder.storeId) }).count()
            response.log("Rating is=========>", totalRating);
            await Brand.findByIdAndUpdate({ _id: checkOrder.storeId }, { $set: { totalRating: totalRating[0].documentSum, avgRating: (totalRating[0].documentAvg).toFixed(2), ratingByUsers: countRating } }, { new: true })
            response.log("Thanks for rating");
            return response.responseHandlerWithData(res, 200, "Thanks for rating");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Order detail=========================================//

    getOrderDetail: async (req, res) => {

        try {
            response.log("Request for get order detail is=========>", req.body);
            req.checkBody('orderId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkOrder = await Order.findOne({ "_id": req.body.orderId, userId: req.user._id }).lean()
            if (!checkOrder) {
                response.log("Invalid order Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let ratingData = {}
            let ratingObj = await Rating.findOne({ orderId: req.body.orderId, userid: req.user._id })
            if (ratingObj) {
                ratingData = ratingObj
            }
            checkOrder.ratingData = ratingData
            let checkBrand = await Brand.findOne({ _id: checkOrder.storeId }).select({ password: 0 }).lean()
            checkOrder.restroData = checkBrand
            response.log("Order Details found successfully", checkOrder);
            return response.responseHandlerWithData(res, 200, "Order Details found successfully", checkOrder);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //======================================Get order list=======================================//

    getOrderList: async (req, res) => {

        try {
            response.log("Request for get oder item is===========>", req.body);
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let orderQuery = {
                userId: req.user._id
            }
            if (req.body.orderType == "Running") {
                orderQuery = {
                    $and: [
                        {
                            $or: [
                                { "status": "Pending" },
                                { "status": "Accepted" },
                                { "status": "Order Ready for pickup" }
                            ]
                        },
                        {
                            userId: ObjectId(req.user._id)
                        }
                    ]
                }
            }
            if (req.body.orderType == "Delivered") {
                orderQuery = {
                    $and: [
                        {
                            $or: [
                                { "status": "Delivered" },
                                { "status": "Cancelled" },
                                { "status": "Rejected" }
                            ]
                        },
                        {
                            userId: ObjectId(req.user._id)
                        }
                    ]
                }
            }
            let orderList = await Order.aggregate([
                {
                    $match: orderQuery
                },
                {
                    $lookup: {
                        from: "brands",
                        let: {
                            "brandId": "$storeId"
                        },
                        pipeline: [
                            {
                                $geoNear: {
                                    near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                                    key: "location",
                                    spherical: true,
                                    maxDistance: 99999999999999,
                                    distanceField: "dist.calculated",
                                    includeLocs: "locs",
                                },

                            },
                            {
                                $match: {
                                    $expr:
                                    {
                                        $and: [
                                            { $eq: ["$_id", "$$brandId"] }
                                        ]
                                    },

                                }
                            },
                            {
                                $project: {
                                    "dist.calculated": 1,
                                    "_id": 1,
                                    "businessName": 1,
                                    "logo": 1,
                                    "image": 1,
                                    "mobileNumber": 1,
                                    "address": 1,
                                    "latitude": 1,
                                    "longitude": 1,
                                    "avgRating": 1
                                },

                            },
                            {
                                $limit: 1
                            },
                        ],
                        as: "restroData"
                    }
                },
                {
                    $unwind: {
                        path: "$restroData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "storeratings",
                        let: {
                            orderId: "$_id", userId: ObjectId(req.user._id)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$orderId", "$$orderId"] },
                                        { $eq: ["$userId", "$$userId"] }
                                    ]
                                }
                            }
                        }, { $limit: 1 }],
                        as: "ratingData"
                    }
                },
                {
                    $unwind: {
                        path: "$ratingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        status: 1,
                        ratingData: 1,
                        storeId: 1,
                        userId: 1,
                        orderData: 1,
                        orderNumber: 1,
                        subTotal: 1,
                        total: 1,
                        tax: 1,
                        address: 1,
                        latitude: 1,
                        longitude: 1,
                        landmark: 1,
                        pickupDate: 1,
                        pickupTime: 1,
                        saveAmount: 1,
                        convertedPickupDate: 1,
                        orderAcceptedTime: 1,
                        orderDeliveredTime: 1,
                        createdAt: 1,
                        qrCode: 1,
                        orderDate: 1,
                        restroData: 1,
                        pin: 1,
                        orderCancelledTime: 1,
                        saveEatFees: 1,
                        taxes: 1
                    }
                },
                { "$sort": { createdAt: -1 } }
            ])
            response.log("Order list found successfully", orderList);
            return response.responseHandlerWithData(res, 200, "Order list found successfully", orderList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=====================================Cancel order by user=================================//

    orderCancelByUser: async (req, res) => {

        try {
            response.log("Request for update order status is============>", req.body);
            req.checkBody('orderId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkOrder = await Order.findOne({ "_id": req.body.orderId, userId: req.user._id })
            if (!checkOrder) {
                response.log("Invalid order Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            if (checkOrder.status == "Cancelled") {
                response.log("Order is already cancelled");
                return response.responseHandlerWithMessage(res, 501, "Order is already cancelled");
            }
            if (checkOrder.status == "Delivered") {
                response.log("Order is already delivered");
                return response.responseHandlerWithMessage(res, 501, "Order is already delivered");
            }
            let date = new Date()
            let closeTime = momentZone.tz(`${checkOrder.createdAt}`, `Asia/Kolkata`).format('x')
            let currentTime = momentZone.tz(date, `Asia/Kolkata`).format('x')
            let obj = {
                status: 'Cancelled',
                orderCancelledTime: new Date()
            }
            await Order.findByIdAndUpdate({ _id: req.body.orderId }, { $set: obj }, { new: true })
            response.log("Status updated successfully");
            let newData = JSON.stringify(checkOrder.orderData)
            let orderData = JSON.parse(newData)
            for (let i = 0; i < orderData.length; i++) {
                if (orderData[i].productData.sellingStatus == true) {
                    let checkProduct = await Product.findOne({ _id: orderData[i].productId })
                    let leftQuantity = Number(checkProduct.leftQuantity) + Number(orderData[i].quantity)
                    await Product.findByIdAndUpdate({ _id: orderData[i].productId }, { $set: { leftQuantity: leftQuantity } }, { new: true })
                }
            }
            return response.responseHandlerWithMessage(res, 200, "Order cancelled successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=====================================Order place============================================//

    orderItems: async (req, res) => {

        try {
            response.log("Request for purchase item is===========>", req.body);
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkAdmin = await Admin.findOne({ "userType": "Admin" })
            if (!checkAdmin) {
                response.log("Sorry! Resraurant is not accepting order now.");
                return response.responseHandlerWithMessage(res, 501, "Sorry! Resraurant is not accepting order now.");
            }
            let checkProduct
            let myData
            let currentOrderNumber = (checkAdmin.orderNumber) + 1
            let orderNumber = `OD${currentOrderNumber}`
            let orderIds = []
            let amountWithGST
            let cartData = req.body.cartData
            if (cartData.length == 0) {
                response.log("Add items to place order");
                return response.responseHandlerWithMessage(res, 501, "Add items to place order");
            }
            let newDeductedCredits = 0
            if (req.body.isUseCredit == true || req.body.isUseCredit == "true") {
                newDeductedCredits = Number(req.body.creditUsed) / cartData.length
            }
            let quantityProducts = []
            for (let i = 0; i < cartData.length; i++) {
                let orderData = []
                let commissionPer = 25
                let fixCommissionPer = 15
                let fixedTax = checkAdmin.tax
                let checkRestro = await Brand.findOne({ _id: cartData[i].restroId })
                if (checkRestro) {
                    let checkCartData = await Cart.findOne({ restroId: cartData[i].restroId, _id: cartData[i].cartId })
                    if (!checkCartData) {
                        response.log("Sorry! Resraurant is not accepting order now.");
                        return response.responseHandlerWithMessage(res, 501, "Sorry! Resraurant is not accepting order now.");
                    }
                    if (checkRestro.commission) {
                        commissionPer = checkRestro.commission
                        fixCommissionPer = checkRestro.fixCommissionPer
                    }

                    let checkCartProductData = checkCartData.productData
                    let kgRescued = 0
                    let choiceAmount = 0
                    let storeProceeds = 0
                    let totalCommissionAmount = 0
                    for (let j = 0; j < checkCartProductData.length; j++) {
                        checkProduct = await Product.findOne({ _id: checkCartProductData[j].productId }).select('menuId menuCategoryName foodName description foodQuantity price foodType subCategory cuisine discountAmount discountPer expiryDate expiryTime offeredPrice convertedExpiryDate convertedPickupDate pickupDate pickupTime leftQuantity foodImage taxable sellingStatus')
                        let myChoice = checkCartProductData[j].choice
                        let newChoice = []
                        if (myChoice.length > 0) {
                            for (let k = 0; k < myChoice.length; k++) {

                                let newTax = fixedTax / 100
                                let newCommissionPer = fixCommissionPer / 100
                                let calculateTax = Number(myChoice[k].price) * Number(newTax)
                                let productAmountWithTax = Number(myChoice[k].price) + calculateTax
                                let normalPrice = Number(myChoice[k].price) * newCommissionPer
                                let normalPriceWithGst = normalPrice * 0.18
                                let amountWithGST = normalPrice + normalPriceWithGst
                                let updatedAmount = productAmountWithTax - amountWithGST
                                totalCommissionAmount = totalCommissionAmount + amountWithGST
                                let brandAmount = updatedAmount
                                storeProceeds = storeProceeds + updatedAmount

                                let newChoiceObj = {
                                    name: myChoice[k].name,
                                    price: myChoice[k].price,
                                    quantity: 1,
                                    fixCommissionAmount: amountWithGST,
                                    fixBrandAmount: brandAmount
                                }
                                choiceAmount = choiceAmount + Number(myChoice[k].price)
                                newChoice.push(newChoiceObj)
                            }
                        }
                        if (checkProduct.sellingStatus == true) {

                            let newTax = fixedTax / 100
                            let newCommissionPer = commissionPer / 100
                            let calculateTax = Number(checkProduct.offeredPrice) * Number(checkCartProductData[j].quantity) * Number(newTax)
                            let productAmountWithTax = Number(checkProduct.offeredPrice) * Number(checkCartProductData[j].quantity) + calculateTax
                            let normalPrice = Number(checkProduct.offeredPrice) * Number(checkCartProductData[j].quantity) * newCommissionPer
                            let normalPriceWithGst = normalPrice * 0.18
                            amountWithGST = normalPrice + normalPriceWithGst
                            let updatedAmount = productAmountWithTax - amountWithGST
                            totalCommissionAmount = totalCommissionAmount + amountWithGST
                            let brandAmount = updatedAmount
                            storeProceeds = storeProceeds + updatedAmount

                            let obj = {
                                productId: checkCartProductData[j].productId,
                                mainChoice: newChoice,
                                commissonAmount: amountWithGST,
                                brandAmount: brandAmount,
                                productData: checkProduct,
                                requirement: checkCartProductData[j].requirement,
                                extra: checkCartProductData[j].choice,
                                quantity: checkCartProductData[j].quantity,
                                productAmount: Number(checkProduct.offeredPrice) * Number(checkCartProductData[j].quantity),
                                productDiscountAmount: Number(checkProduct.discountAmount) * Number(checkCartProductData[j].quantity),
                                actualproductAmount: Number(checkProduct.price) * Number(checkCartProductData[j].quantity),
                                productAmountWithChoice: Number(checkProduct.offeredPrice) * Number(checkCartProductData[j].quantity) + Number(choiceAmount),
                                price: cartData[i].price,
                                actualAmount: cartData[i].actualAmount,
                                discountAmount: cartData[i].discountAmount,
                                choiceAmount: Number(choiceAmount),
                                tax: Number(cartData[i].tax),
                                amountWithQuantuty: (Number(cartData[i].price) * Number(checkCartProductData[j].quantity)) + Number(choiceAmount),
                                withTax: (Number(cartData[i].price) * Number(checkCartProductData[j].quantity)) + Number(choiceAmount) + Number(cartData[i].tax)
                            }
                            orderData.push(obj)
                            kgRescued = kgRescued + Number(checkProduct.foodQuantity) * Number(checkCartProductData[j].quantity) * 0.001
                            let prodQtyObj = {
                                id: checkCartProductData[j].productId,
                                quantity: checkCartProductData[j].quantity
                            }
                            quantityProducts.push(prodQtyObj)
                        }
                        if (checkProduct.sellingStatus == false) {

                            let newTax = fixedTax / 100
                            let newCommissionPer = fixCommissionPer / 100
                            let calculateTax = Number(checkProduct.price) * Number(checkCartProductData[j].quantity) * Number(newTax)
                            let productAmountWithTax = Number(checkProduct.price) * Number(checkCartProductData[j].quantity) + calculateTax
                            let normalPrice = Number(checkProduct.price) * Number(checkCartProductData[j].quantity) * newCommissionPer
                            let normalPriceWithGst = normalPrice * 0.18
                            amountWithGST = normalPrice + normalPriceWithGst
                            let updatedAmount = productAmountWithTax - amountWithGST
                            totalCommissionAmount = totalCommissionAmount + amountWithGST
                            let brandAmount = updatedAmount
                            storeProceeds = storeProceeds + updatedAmount

                            let obj = {
                                productId: checkCartProductData[j].productId,
                                mainChoice: newChoice,
                                commissonAmount: amountWithGST,
                                brandAmount: brandAmount,
                                productData: checkProduct,
                                requirement: checkCartProductData[j].requirement,
                                extra: [],
                                quantity: checkCartProductData[j].quantity,
                                productAmount: Number(checkProduct.price) * Number(checkCartProductData[j].quantity),
                                productDiscountAmount: 0,
                                actualproductAmount: Number(checkProduct.price) * Number(checkCartProductData[j].quantity),
                                productAmountWithChoice: Number(checkProduct.price) * Number(checkCartProductData[j].quantity),
                                price: cartData[i].price,
                                actualAmount: cartData[i].actualAmount,
                                discountAmount: cartData[i].discountAmount,
                                choiceAmount: Number(choiceAmount),
                                tax: Number(cartData[i].tax),
                                amountWithQuantuty: (Number(cartData[i].price) * Number(checkCartProductData[j].quantity)) + Number(choiceAmount),
                                withTax: (Number(cartData[i].price) * Number(checkCartProductData[j].quantity)) + Number(choiceAmount) + Number(cartData[i].tax)
                            }
                            orderData.push(obj)

                        }
                        newChoice = []

                    }
                    let convertedPickupDate = moment(`${cartData[i].pickupDate} ${cartData[i].pickupTime}`)
                    let actualOrderDate = moment().format("YYYY-MM-DD")
                    let today = new Date(convertedPickupDate);
                    let month = today.getUTCMonth() + 1;
                    let day = today.getUTCDate();
                    let year = today.getUTCFullYear();
                    let qrCode = ''
                    let pin = (Math.floor(100000 + Math.random() * 900000)).toString()
                    qrCode = await create(
                        pin,
                        "https://res.cloudinary.com/a2karya80559188/image/upload/v1631265150/icon_1024_fu1dmk.png",
                        150,
                        60
                    );

                    let showStoreAmount = Number(Number(cartData[i].subTotal) + Number(cartData[i].taxes)).toFixed(1)
                    let actualQr = await Fileupload.uploadBase(qrCode, "user/");
                    let orderObj = {
                        storeId: cartData[i].restroId,
                        userId: req.user._id,
                        orderNumber: orderNumber,
                        subTotal: Number(cartData[i].subTotal).toFixed(2),
                        total: Number(cartData[i].total).toFixed(0),
                        tax: Number(cartData[i].tax).toFixed(2),
                        address: cartData[i].address,
                        latitude: cartData[i].latitude,
                        longitude: cartData[i].longitude,
                        pickupDate: cartData[i].pickupDate,
                        pickupTime: cartData[i].pickupTime,
                        saveAmount: cartData[i].saveAmount,
                        taxes: cartData[i].taxes,
                        saveEatFees: Number(cartData[i].saveEatFees).toFixed(2),
                        orderData: orderData,
                        commissionPer: commissionPer,
                        convertedPickupDate: convertedPickupDate,
                        day: day,
                        month: month,
                        year: year,
                        timezone: cartData[i].timezone,
                        orderType: cartData[i].orderType,
                        qrCode: actualQr,
                        pin: pin,
                        actualOrderDate: actualOrderDate,
                        rescusedFood: kgRescued,
                        orderFullSubTotal: req.body.subTotal,
                        orderFullTotal: req.body.total,
                        orderFullTax: req.body.tax,
                        paymentMode: req.body.paymentMode,
                        paymentId: req.body.paymentId,
                        paymentMode: req.body.paymentMode,
                        paymentStatus: req.body.paymentStatus,
                        orderFullSaveAmount: req.body.saveAmount,
                        fixCommissionPer: fixCommissionPer,
                        storeProceeds: Number(storeProceeds).toFixed(2),
                        totalCommissionAmount: (totalCommissionAmount).toFixed(2),
                        showStoreAmount: Number(showStoreAmount).toFixed(2),
                        deductedPoints: newDeductedCredits
                    }
                    myData = await new Order(orderObj).save()
                    kgRescued = 0
                    // storeProceeds = 0
                    totalCommissionAmount = 0
                    orderData = []
                    let idObj = {
                        storeId: myData._id
                    }
                    orderIds.push(idObj)
                    await Cart.findByIdAndRemove({ _id: cartData[i].cartId })
                    await Admin.findByIdAndUpdate({ _id: checkAdmin._id }, { $set: { orderNumber: currentOrderNumber } }, { new: true })
                    let notiTitle = `New order available!`
                    let notiMessage = `Hi! New order is available at date ${cartData[i].pickupDate} & time ${cartData[i].pickupTime}.`
                    let notiType = `newOrder`
                    let newOrderData = await Order.aggregate([
                        {
                            $match: {
                                _id: ObjectId(myData._id)
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
                                "taxes": 1
                            }
                        }
                    ])
                    var io = require('socket.io-client');
                    var socket = io.connect('https://saveeat.in:3035', { reconnect: true });
                    socket.on('connection', (socket) => {
                        console.log('Connected!');
                    });
                    if (checkRestro.userType == "Store") {
                        let checkBrandSub = await Brand.find({ brandId: checkRestro._id, "userType": "Store-Admin" })
                        let msgData = {
                            // roomId: ccheckRestro._id,
                            roomId: checkRestro._id,
                            data: newOrderData
                        }
                        socket.emit('sendOrder', msgData);
                        for (let s = 0; s < checkBrandSub.length; s++) {
                            Sendnotification.sendNotificationForWeb(checkBrandSub[s].deviceToken, notiTitle, notiMessage, notiType, 'Brand', myData._id, newOrderData, (error10, result10) => {
                                response.log("Notification Sent");
                            })
                        }
                    }
                    if (checkRestro.userType == "Brand") {
                        Sendnotification.sendNotificationForWeb(checkRestro.deviceToken, notiTitle, notiMessage, notiType, 'Brand', myData._id, newOrderData, (error10, result10) => {
                            response.log("Notification Sent");
                        })
                        let msgData = {
                            roomId: cartData[i].restroId,
                            data: newOrderData
                        }
                        socket.emit('sendOrder', msgData);
                    }
                     //zoho
                     let Subform_1 = []
                     let Commission_Details = []
                     const now = new Date();
                     now.setHours(now.getHours() + 5);
                     now.setMinutes(now.getMinutes() + 30);
                     let orderDataFinal = orderObj.orderData
                     for (let q = 0; q < orderDataFinal.length; q++) {
                        let obj1 = {
                            "Commission_Percent": commissionPer,
                            "Commission_Amount": amountWithGST.toFixed(2),
                            "Commission_Tax": Number(cartData[i].tax).toFixed(2) * orderDataFinal[q].quantity,
                            "Food_Tax": orderDataFinal[q].tax.toFixed(2),
                            "SaveEat_Fee_Tax": req.body.taxes,
                            "SaveEat_Fees":Number(cartData[i].saveEatFees).toFixed(2),
                            "Store_Proceeds": Number(storeProceeds.toFixed(2) - orderDataFinal[q].tax.toFixed(2))
                        }
                        Commission_Details.push(obj1)
                            let obj2 = {
                                "Eatery_Total": orderDataFinal[q].productData.price,
                                "Full_Price": orderDataFinal[q].productData.price,
                                "Item_name": orderDataFinal[q].productData.foodName,
                                "Quantity": orderDataFinal[q].quantity,
                                "Discount_Percent": 0,
                                "Discount_Amount": 0.00
                            }
                            Subform_1.push(obj2)
                     response.log('===========================================dataString================================================',obj1);

                    }
                     response.log('===========================================ZOHO Works================================================');
                    let dataString = {
                        "data": [{
                            "Customer_ID": req.user.userNumber,
                            "Name": orderNumber,
                            "Customer_Location": req.user.address,
                            "Customer_Name": req.user.name,
                            "Eatery_ID": checkRestro.empNumber,
                            "Eatery_Name": checkRestro.businessName,
                            "Online_Paid_Amount": Number(cartData[i].total).toFixed(0) -  Number(req.body.creditUsed) ,
                            "Order_Placed_Date_Time": date.format(now, "MMM DD, YYYY hh:mm A"),
                            "Order_Status": "Pending",
                            "Credit_Used_Amount": req.body.isUseCredit == true || "true" ? Number(req.body.creditUsed) : 0,
                            "Total_Order_Amount": Number(cartData[i].total).toFixed(0),
                            "Commission_Details": Commission_Details,
                            "Subform_1":Subform_1
                        }]
                    }
                    response.log('===========================================dataString================================================',dataString);

                    let result = await ZOHO.findOne()
                    var headers = {
                        'Authorization': `Zoho-oauthtoken ${result.access_token}`
                    };
                    var options = {
                        url: `https://www.zohoapis.in/crm/v2/Customer_Orders`,
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(dataString)
                    };
                    request(options,async  function (error, res1, body) {
                        if (!error) {
                            // let data = JSON.stringify(data)
                            var obj = JSON.parse(body)
                            let data = {...obj};
                            // response.log('===========================================Saved================================================>',data.data[0].details.id);
                            response.log('===========================================Saved================================================>',body);
                            await Order.findByIdAndUpdate({ _id: signupData._id }, { $set: { zohoId: data.data[0].details.id} }, { new: true })
                        }else{
                            response.log('===========================================Not Saved================================================',error);
                        }
                    });

                    storeProceeds = 0
                }
            }
            for (let m = 0; m < quantityProducts.length; m++) {
                let checkProQty = await Product.findOne({ _id: quantityProducts[m].id })
                let qtyLeft = Number(checkProQty.leftQuantity) - Number(quantityProducts[m].quantity)
                if (qtyLeft < 0) {
                    qtyLeft = 0
                }
                await Product.findByIdAndUpdate({ _id: quantityProducts[m].id }, { $set: { leftQuantity: qtyLeft } }, { new: true })
            }
            let today = new Date();
            let month = today.getUTCMonth() + 1;
            let day = today.getUTCDate();
            let year = today.getUTCFullYear();
            let newMainOrder = new Mainorder({
                userId: req.user._id,
                storeData: orderIds,
                subTotal: req.body.subTotal,
                total: req.body.total,
                tax: req.body.tax,
                day: day,
                month: month,
                year: year,
                paymentId: req.body.paymentId,
                paymentMode: req.body.paymentMode,
                paymentStatus: req.body.paymentStatus,
                saveAmount: req.body.saveAmount,
                saveEatFees: req.body.saveEatFees,
                taxes: req.body.taxes
            })
            await newMainOrder.save()
            if (req.body.isUseCredit == true || req.body.isUseCredit == "true") {
                if(req.body.creditUsed > 0){
                    let saveCreditHistory = new CREDIT_USED({
                        userId: req.user._id,
                        orderId: myData._id,
                        debitTitle: 'Order Placed',
                        debitAmount: req.body.creditUsed
                    })
                    await saveCreditHistory.save()
                }
                let walletAmount = Number(req.user.walletAmount) - Number(req.body.creditUsed)
                await User.findByIdAndUpdate({ _id: req.user._id }, { $set: { walletAmount: walletAmount } }, { new: true })
                //zoho
                response.log('===========================================ZOHO Works================================================');
                let dataString = {
                    "data": [
                        {
                            "Unused_Credits": walletAmount
                        }
                    ]
                }
                let result = await ZOHO.findOne()
                var headers = {
                    'Authorization': `Zoho-oauthtoken ${result.access_token}`
                };
                var options = {
                    url: `https://www.zohoapis.in/crm/v2/Customers/${req.user.zohoId}`,
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(dataString)
                };
                request(options,async  function (error, res1, body) {
                    if (!error) {
                        // let data = JSON.stringify(data)
                        var obj = JSON.parse(body)
                        let data = {...obj};
                        response.log('===========================================SavedW================================================>',body);
                    }else{
                        response.log('===========================================Not Saved================================================',body);
                    }
                });
            }
            response.log("Order placed successfully");
            response.responseHandlerWithMessage(res, 200, "Order placed successfully");

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==============================================Get All restaurant=================================//

    nearByRestaurantDetail: async (req, res) => {

        try {
            response.log("Request for get all restaurant is=============>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (!req.body.userId == "") {
                userId = req.body.userId
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
            let query = {
                $and: [
                    {
                        "userType": "Store"
                    },
                    {
                        status: 'Active'
                    },
                    {
                        brandId: ObjectId(req.body.brandId)
                    }
                ]
            }
            let restroList = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: 99999999999999,
                        distanceField: "dist.calculated",
                        includeLocs: "locs",
                    },

                },
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "openingData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $match: { itemSize: { $gt: 0 } }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' }
                    }
                },
                { "$sort": { dist: 1 } },
                {
                    $limit: 1
                }
            ])
            if (restroList.length > 0) {
                let checkBrand = await Brand.findOne({ _id: restroList[0].brandId }).select('image logo businessName latitude longitude address').lean()
                if (!checkBrand) {
                    response.log("Invalid restro Id");
                    return response.responseHandlerWithMessage(res, 501, "Invalid Token");
                }
                if (checkBrand) {
                    let isFav = false
                    let checkFav = await Favorite.findOne({ brandId: restroList[0].brandId, userId: userId })
                    if (checkFav) {
                        isFav = true
                    }
                    checkBrand.isFav = isFav
                    let checkMenu = await Menu.findOne({ brandId: restroList[0].brandId, status: 'Active' })
                    if (!checkMenu) {
                        response.log("Restaurant is not available");
                        return response.responseHandlerWithMessage(res, 501, "Restaurant is not available");
                    }
                    checkBrand.menuData = checkMenu._id
                    let distance = await geodist({ lon: parseFloat(checkBrand.longitude), lat: parseFloat(checkBrand.latitude) }, { lon: parseFloat(req.body.longitude), lat: parseFloat(req.body.latitude) }, { exact: true, unit: 'meters' })
                    let day = moment().format('dddd');
                    let checkToday = await Openinghours.findOne({ day: day, brandId: restroList[0].brandId, status: 'Active' }).select('saleWindowOpen saleWindowClose pickupWindowOpen pickupWindowClose day')
                    checkBrand.distance = distance
                    if (checkToday) {
                        checkBrand.todayData = checkToday
                        checkBrand.storeStatus = true
                    }
                    if (!checkToday) {
                        response.log("Restaurant is not available");
                        return response.responseHandlerWithMessage(res, 501, "Restaurant is not available");
                    }
                    let startDate = new Date()
                    let checkHoliday = await Holiday.findOne({ status: 'Inactive', brandId: restroList[0].brandId, convertedStartDate: { $lte: startDate }, convertedEndDate: { $gte: startDate } })
                    if (checkHoliday) {
                        response.log("Restaurant is not available");
                        return response.responseHandlerWithMessage(res, 501, "Restaurant is not available");
                    }
                    response.log("Restaurant detail found successfully", checkBrand);
                    return response.responseHandlerWithData(res, 200, "Restaurant detail found successfully", checkBrand);
                }
            }
            if (restroList.length == 0) {
                let checkBrand = await Brand.findOne({ _id: req.body.brandId }).select('image logo businessName latitude longitude address').lean()
                if (!checkBrand) {
                    response.log("Invalid restro Id");
                    return response.responseHandlerWithMessage(res, 501, "Invalid Token");
                }
                if (checkBrand) {
                    let isFav = false
                    let checkFav = await Favorite.findOne({ brandId: req.body.brandId, userId: userId })
                    if (checkFav) {
                        isFav = true
                    }
                    checkBrand.isFav = isFav
                    let checkMenu = await Menu.findOne({ brandId: req.body.brandId, status: 'Active' })
                    if (!checkMenu) {
                        response.log("Restaurant is not available");
                        return response.responseHandlerWithMessage(res, 501, "Restaurant is not available");
                    }
                    checkBrand.menuData = checkMenu._id
                    let distance = await geodist({ lon: parseFloat(checkBrand.longitude), lat: parseFloat(checkBrand.latitude) }, { lon: parseFloat(req.body.longitude), lat: parseFloat(req.body.latitude) }, { exact: true, unit: 'meters' })
                    let day = moment().format('dddd');
                    let checkToday = await Openinghours.findOne({ day: day, brandId: req.body.brandId, status: 'Active' }).select('saleWindowOpen saleWindowClose pickupWindowOpen pickupWindowClose day')
                    checkBrand.distance = distance
                    if (checkToday) {
                        checkBrand.todayData = checkToday
                        checkBrand.storeStatus = true
                    }
                    if (!checkToday) {
                        response.log("Restaurant is not available1");
                        return response.responseHandlerWithMessage(res, 501, "Restaurant is not accepting order");
                    }
                    let startDate = new Date()
                    let checkHoliday = await Holiday.findOne({ status: 'Inactive', brandId: req.body.brandId, convertedStartDate: { $lte: startDate }, convertedEndDate: { $gte: startDate } })
                    if (checkHoliday) {
                        response.log("Restaurant is not available");
                        return response.responseHandlerWithMessage(res, 501, "Restaurant is off due to holiday");
                    }
                    response.log("Restaurant detail found successfully", checkBrand);
                    return response.responseHandlerWithData(res, 200, "Restaurant detail found successfully", checkBrand);
                }
            }

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Restuarnt list for home==============================//

    restaurantForHomeList: async (req, res) => {

        try {
            response.log("Request for get home restaurant is=============>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            req.checkBody('foodType', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (!req.body.userId == "") {
                userId = req.body.userId
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
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
            let query = {
                $and: [
                    {
                        $or: [
                            { "userType": "Brand" },
                            { "userType": "Store" }
                        ]
                    },
                    {
                        status: 'Active'
                    },
                    {
                        foodTypeArray: { $in: foodTypeArray }
                    },
                    {
                        hiddenStatus: false
                    }
                ]
            }
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }
            let restroList = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs",
                    },

                },
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "menuData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "openingData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$ne:0}
                            }
                        }],
                        as: "productData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "cuisine": 1,
                                "offeredPrice": 1,
                                "foodTypeArray": 1
                            }
                        },
                        {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$ne:0}
                            }
                        },
                        {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $gt: ["$leftQuantity", 0] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        }],
                        as: "leftProductData"
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "createdAt": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "userType": 1,
                        "address": 1,
                        "foodType": 1,
                        "foodTypeArray": 1,
                        "safetyBadge": 1,
                        "itemSize": { $size: "$productData" },
                        "leftData": { $size: "$leftProductData" },
                        "realProductData": 1,
                        "openingData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "createdAt": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "safetyBadge": 1,
                        "realProductData": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "createdAt": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                {
                    "$sort": { createdAt: -1 }
                },
                { "$sort": { itemSize: -1 } },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        productSize: { $gt: 0 }
                    }
                },
                {
                    $limit: 5
                }
            ])
            response.log("Restaurant list found successfully", restroList);
            return response.responseHandlerWithData(res, 200, "Restaurant list found successfully", restroList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Restaurant list by brand=============================//

    restaurantListByBrand: async (req, res) => {

        try {
            response.log("Request for get all restaurant is=============>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (!req.body.userId == "") {
                userId = req.body.userId
            }
            let foodTypeArray = ['Veg']
            let checkBrandDetail = await Brand.findOne({ _id: req.body.brandId })
            if (checkBrandDetail) {
                foodTypeArray = checkBrandDetail.foodTypeArray
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
            let query = {
                $and: [
                    {
                        status: 'Active'
                    },
                    { "userType": "Store" },
                    {
                        brandId: ObjectId(req.body.brandId)
                    },
                    {
                        foodTypeArray: { $in: foodTypeArray }
                    }
                ]
            }
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }
            let restroList = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs",
                    },

                },
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        }],
                        as: "productData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "cuisine": 1,
                                "offeredPrice": 1,
                                "foodTypeArray": 1
                            }
                        },
                        {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        },
                        {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $gt: ["$leftQuantity", 0] },
                                    ]
                                }
                            }
                        },
                        {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        }],
                        as: "leftProductData"
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "userType": 1,
                        "address": 1,
                        "foodType": 1,
                        "safetyBadge": 1,
                        "itemSize": { $size: "$productData" },
                        "leftData": { $size: "$leftProductData" },
                        "realProductData": 1,
                        "openingData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "safetyBadge": 1,
                        "realProductData": 1,
                        "distance": 1,
                        "productSize": 1,
                        "leftData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "safetyBadge": 1,
                        "realProductData": 1,
                        "distance": 1,
                        "productSize": 1,
                        "leftData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                { "$sort": { itemSize: -1 } },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        productSize: { $gt: 0 }
                    }
                }
            ])
            response.log("Restaurant list found successfully", restroList);
            return response.responseHandlerWithData(res, 200, "Restaurant list found successfully", restroList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================User badge earning==================================//

    userBadgesEarning: async (req, res) => {

        try {
            response.log("Request for get badge earning is=============>", req.body);
            let earningData = await Badge.aggregate([
                {
                    $lookup: {
                        from: "badgeearnings",
                        let: {
                            badgeId: "$_id", userId: ObjectId(req.user._id)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$badgeId", "$$badgeId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }],
                        as: "currentData"
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        "name": 1,
                        "message": 1,
                        "image": 1,
                        "greyContent": 1,
                        "fullColorContent": 1,
                        "emojiGrey": 1,
                        "emojiColor": 1,
                        "badgeCount": { $size: "$currentData" }
                    }
                }
            ])
            let checkQuery = { userId: ObjectId(req.user._id), status: 'Delivered' }
            let savedAmount = await Order.aggregate([
                {
                    $match: checkQuery
                },
                {
                    "$group": {
                        _id: "$userId",
                        saveAmount: { "$sum": "$saveAmount" }
                    }
                }
            ])
            let saveAmountFinal = 0
            if (savedAmount.length > 0) {
                saveAmountFinal = savedAmount[0].saveAmount
            }
            let totalRescuedItems = 0
            let itemsRes = await Productearning.aggregate([
                {
                    $match: {
                        userId: ObjectId(req.user._id)
                    }
                },
                {
                    "$group": {
                        _id: "$userId",
                        totalQuantity: { "$sum": "$quantity" }
                    }
                }
            ])
            if (itemsRes.length > 0) {
                totalRescuedItems = itemsRes[0].totalQuantity
            }
            let rescuseFood = await Order.aggregate([
                {
                    $match: {
                        userId: ObjectId(req.user._id),
                        status: 'Delivered'
                    }
                },
                {
                    "$group": {
                        _id: "$userId",
                        foodSum: { "$sum": "$rescusedFood" }
                    }
                }
            ])
            let rescuseFoodFinal = 0
            if (rescuseFood.length > 0) {
                rescuseFoodFinal = rescuseFood[0].foodSum
            }
            let rewardCount = 0
            let totalStar = 0
            let rewardData = {}
            let checkReward = await Reward.findOne({ userId: req.user._id, claimedStatus: 'Unclaimed' })
            if (!checkReward) {
                let starList = await Star.aggregate([
                    {
                        $match: {
                            userId: ObjectId(req.user._id)
                        }
                    },
                    {
                        "$group": {
                            _id: "$userId",
                            starSum: { "$sum": "$star" }
                        }
                    }
                ])
                if (starList.length > 0) {
                    totalStar = starList[0].starSum
                }
            }
            if (checkReward) {
                rewardCount = 1
                totalStar = 5
                rewardData = checkReward
            }

            let obj = {
                badgeData: earningData,
                savedAmount: Number((saveAmountFinal).toFixed(0)),
                totalRescuedItems: totalRescuedItems,
                rescuseFoodFinal: Number((rescuseFoodFinal).toFixed(2)),
                rewardCount: rewardCount,
                totalStar: totalStar,
                checkReward: checkReward
            }
            response.log("Badge list found successfully", obj);
            return response.responseHandlerWithData(res, 200, "Badge list found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Cart count particular restro==========================//

    cartCountParticularRestro: async (req, res) => {

        try {
            response.log("Request for get cart count is=========>", req.body);
            let checkCount = await Cart.findOne({ restroId: req.body.restaurantId, userId: req.user._id })
            if (checkCount) {
                let newCount = _.sumBy(checkCount.productData, 'quantity')
                response.log("Cart count found successfully", newCount);
                return response.responseHandlerWithData(res, 200, "Cart count found successfully", newCount);
            }
            if (!checkCount) {
                response.log("Cart count found successfully", 0);
                return response.responseHandlerWithData(res, 200, "Cart count found successfully", 0);
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Login by otp==========================================//

    loginByOtp: async (req, res) => {

        try {
            response.log("Request for login by otp is=============>", req.body);
            req.checkBody('mobileNumber', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkUser = await User.findOne({ mobileNumber: req.body.mobileNumber })
            if (!checkUser) {
                response.log("Invalid credentials1");
                return response.responseHandlerWithMessage(res, 401, "Invalid credentials");
            }
            if (checkUser.status == 'Inactive') {
                response.log("You have blocked by administrator")
                return response.responseHandlerWithMessage(res, 423, "Your account have been disabled by administrator due to any suspicious activity");
            }
            let jwtToken = jwt.sign({ "_id": checkUser._id }, `sUpER@SecReT`);
            let result2 = await User.findByIdAndUpdate({ "_id": checkUser._id }, { $set: { "jwtToken": jwtToken, deviceToken: req.body.deviceToken, deviceType: req.body.deviceType } }, { new: true, lean: true })
            response.log("You have successfully logged in.", result2)
            delete (result2.password)
            return response.responseHandlerWithData(res, 200, "You have successfully logged in", result2);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Restaurant filter=====================================//

    restaurantFilter: async (req, res) => {

        try {
            response.log("Request for get all restaurant is=============>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            req.checkBody('pickupLaterAllowance', 'Something went wrong').notEmpty();
            req.checkBody('minPrice', 'Something went wrong').notEmpty();
            req.checkBody('maxPrice', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (req.body.userId) {
                userId = req.body.userId
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
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
            let query = {
                $and: [
                    {
                        $or: [
                            { "userType": "Brand" },
                            { "userType": "Store" }
                        ]
                    },
                    {
                        status: 'Active'
                    },
                    {
                        avgRating: { $gte: Number(req.body.rating), $lte: 5 }
                    },
                    {
                        hiddenStatus: false
                    }
                ]
            }
            let cuisineFilter = {
                status: 'Active'
            }
            if (req.body.cuisines.length > 0) {
                cuisineFilter = {
                    realProductData: {
                        $elemMatch: { cuisineArray: { $in: req.body.cuisines } }
                    }
                }
            }
            let categoryFilter = {
                status: 'Active'
            }
            if (req.body.subCategory.length > 0) {
                categoryFilter = {
                    realProductData: {
                        $elemMatch: { subCategoryArray: { $in: req.body.subCategory } }
                    }
                }
            }
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }
            let restroList = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs",
                    },

                },
                {
                    $match: query
                },

                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    $match: {
                        "menuData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    $match: {
                        "openingData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gt: ["$leftQuantity", 0] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] }
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        }],
                        as: "productData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] },
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "subCategory": 1,
                                "pickupLaterAllowance": 1,
                                "cuisine": 1,
                                "offeredPrice": 1,
                                "cuisineArray": { $split: ["$cuisine", ", "] },
                                "subCategoryArray": { $split: ["$subCategory", ", "] },
                                "foodTypeArray": 1
                            }
                        },
                        {
                            $match: { leftQuantity: { $gt: 0 }, foodTypeArray: { $in: foodTypeArray } }
                        },
                        {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $gt: ["$leftQuantity", 0] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        }],
                        as: "leftProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] },
                                        { $gt: ["$leftQuantity", 0] },
                                    ]
                                }
                            }
                        },
                        {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        },
                        {
                            "$group": {
                                _id: "$menuId",
                                letfProductAllSum: { "$sum": "$leftQuantity" },
                            }
                        }],
                        as: "maxLeft"
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "userType": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "status": 1,
                        "safetyBadge": 1,
                        "itemSize": { $size: "$productData" },
                        "realProductData": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "leftData": { $size: "$leftProductData" },
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $match: cuisineFilter
                },
                {
                    $match: categoryFilter
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "userType": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "status": 1,
                        "maxLeft": 1,
                        "foodType": 1,
                        "safetyBadge": 1,
                        "realProductData": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "maxLeft": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                {
                    $sort: { itemSize: -1 }
                },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        productSize: { $gt: 0 }
                    }
                }
            ])
            response.log("Restaurant list found successfully", restroList);
            return response.responseHandlerWithData(res, 200, "Restaurant list found successfully", restroList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //============================================Global search=====================================//

    globalSearch: async (req, res) => {

        try {
            response.log("Request for get all restaurant is=============>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (req.body.userId) {
                userId = req.body.userId
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
            let query = {
                $and: [
                    {
                        $or: [
                            { "userType": "Brand" },
                            { "userType": "Store" }
                        ]
                    },
                    {
                        status: 'Active'
                    },
                    {
                        hiddenStatus: false
                    }
                ]
            }
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }
            let restaurantSearch = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs"
                    },

                },
                {
                    $match: query
                },

                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },

                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    $match: {
                        "menuData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    $match: {
                        "openingData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id"
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id"
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $gt: ["$leftQuantity", 0] }
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "subCategory": 1,
                                "pickupLaterAllowance": 1,
                                "cuisine": 1,
                                "offeredPrice": 1,
                                "cuisineArray": { $split: ["$cuisine", ", "] },
                                "subCategoryArray": { $split: ["$subCategory", ", "] },
                                "foodTypeArray": 1
                            }
                        },
                        {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id"
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $gt: ["$leftQuantity", 0] },
                                    ]
                                }
                            }
                        },
                        {
                            "$group": {
                                _id: "$menuId",
                                letfProductAllSum: { "$sum": "$leftQuantity" },
                            }
                        }],
                        as: "maxLeft"
                    }
                },
                {
                    $match: {
                        deleteStatus: false,
                        $or: [
                            // { "businessName": { $regex: "^" + req.body.search, $options: 'i' } },
                            // { "realProductData.foodName": { $regex: "^" + req.body.search, $options: 'i' } },
                            // { "realProductData.cuisine": { $regex: "^" + req.body.search, $options: 'i' } }
                            { "businessName": { $regex:  req.body.search, $options: 'i' } },
                            { "realProductData.foodName": { $regex:  req.body.search, $options: 'i' } },
                            { "realProductData.cuisine": { $regex:  req.body.search, $options: 'i' } }
                        ]
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "userType": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "status": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "openingData": 1,
                        "realProductData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "userType": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "realProductData": 1,
                        "productSize": 1,
                        "address": 1,
                        "status": 1,
                        "foodType": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "openingData": 1,
                        "holidayData": 1,
                        "maxLeft": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "realProductData": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "productSize": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "leftData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "maxLeft": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } },
                        "name": "$businessName"
                    }
                },
                {
                    $sort: { dist: 1 }
                },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        productSize: { $gt: 0 }
                    }
                }
            ])
            let prouctNameSearch = await Product.aggregate([
                {
                    $match: {
                        deleteStatus: false,
                        pauseStatus: false,
                        $or: [

                            // { "foodName": { $regex: "^" + req.body.search, $options: 'i' } },
                            // { "cuisine": { $regex: "^" + req.body.search, $options: 'i' } },
                            // { "subCategory": { $regex: "^" + req.body.search, $options: 'i' } },
                            { "foodName": { $regex:  req.body.search, $options: 'i' } },
                            { "cuisine": { $regex:  req.body.search, $options: 'i' } },
                            { "subCategory": { $regex:  req.body.search, $options: 'i' } },
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            menuId: "$menuId", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$_id", "$$menuId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "menuData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "brands",
                        let: {
                            "brandId": "$menuData.brandId", status: 'Active', hiddenStatus: false
                        },
                        pipeline: [
                            {
                                $geoNear: {
                                    near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                                    key: "location",
                                    spherical: true,
                                    maxDistance: distance,
                                    distanceField: "dist.calculated",
                                    includeLocs: "locs",
                                },

                            },
                            {
                                $match: {
                                    $expr:
                                    {
                                        $and: [
                                            { $eq: ["$_id", "$$brandId"] },
                                            { $eq: ["$status", "$$status"] },
                                            { $eq: ["$hiddenStatus", "$$hiddenStatus"] },
                                        ],

                                    },

                                }
                            },
                            {
                                $project: {
                                    "dist.calculated": 1,
                                    _id: 1,
                                    "businessName": 1,
                                    "userType": 1,
                                    "logo": 1,
                                    "addresss": 1,
                                    "latitude": 1,
                                    "longitude": 1,
                                    "foodType": 1,
                                    "image": 1,
                                    "avgRating": 1,
                                    "status": 1
                                },
                            },
                            {
                                $limit: 1
                            }
                        ],
                        as: "restroData"
                    }
                },
                {
                    $unwind: {
                        path: "$restroData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "restroData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$restroData._id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "openingData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$restroData._id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "offeredPrice": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } },
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } },
                        "actualType": 'Product',
                        "name": "$foodName"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                {
                    $sort: { leftQuantity: -1 }
                },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' }
                    }
                }
            ])
            let mergeData = [...restaurantSearch, ...prouctNameSearch];
            let random = _.shuffle(mergeData);
            let obj = {
                restaurantSearch: restaurantSearch,
                prouctNameSearch: prouctNameSearch,
                mergeData: random
            }
            response.log("Data found successfully", obj);
            return response.responseHandlerWithData(res, 200, "Data found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Save recent search=================================//

    saveRecentSearch: async (req, res) => {

        try {
            response.log("Request for add to recent search is============>", req.body);
            req.checkBody('userId', 'Something went wrong').notEmpty();
            req.checkBody('search', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkSearch = await Recentsearch.findOne({ userId: req.body.userId, search: req.body.search })
            if (!checkSearch) {
                let saveObj = new Recentsearch({
                    userId: req.body.userId,
                    search: req.body.search
                })
                await saveObj.save()
            }
            response.log("Saved");
            return response.responseHandlerWithMessage(res, 200, `Saved`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Recent search list===================================//

    getRecentSearch: async (req, res) => {

        try {
            response.log("Request for add to recent search is============>", req.body);
            req.checkBody('userId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let limit = Number(req.body.limit)
            let searchResult = await Recentsearch.find({ userId: req.body.userId }).sort({ createdAt: -1 }).limit(limit)
            response.log("Data found successfully", searchResult);
            return response.responseHandlerWithData(res, 200, `Data found successfully`, searchResult);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //============================================Delete search====================================//

    deleteRecentSearch: async (req, res) => {

        try {
            response.log("Request for delete recent search is============>", req.body);
            req.checkBody('searchId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let deleteSearch = await Recentsearch.findByIdAndRemove({ "_id": req.body.searchId })
            if (!deleteSearch) {
                response.log("Invalid user Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Record deleted successfully", deleteSearch);
            return response.responseHandlerWithMessage(res, 200, "Record deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Popular cuisine product=============================//

    popularCuisineProducts: async (req, res) => {

        try {
            response.log("Request for get product list is==============>", req.body);
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }
            let cuisineData = await Productearning.aggregate([
                {
                    $group:
                    {
                        _id: "$productId",
                        count: { $sum: 1 },
                        productId: { $first: "$productId" },
                        brandId: { $first: "$productId" }
                    }
                },
                {
                    $sort: {
                        count: -1
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
                        }, {
                            $project: {
                                foodImage: 1,
                                foodName: 1,
                                cuisine: 1,
                                deleteStatus: 1,
                                menuId: 1
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
                    $lookup: {
                        from: "menus",
                        let: {
                            menuId: "$productData.menuId"
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$_id", "$$menuId"] }
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "menuData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "brands",
                        let: {
                            "brandId": "$menuData.brandId", status: 'Active'
                        },
                        pipeline: [
                            {
                                $geoNear: {
                                    near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                                    key: "location",
                                    spherical: true,
                                    maxDistance: distance,
                                    distanceField: "dist.calculated",
                                    includeLocs: "locs",
                                },

                            },
                            {
                                $match: {
                                    $expr:
                                    {
                                        $and: [
                                            { $eq: ["$_id", "$$brandId"] },
                                            { $eq: ["$status", "$$status"] },
                                        ],

                                    },

                                }
                            },
                            {
                                $project: {
                                    "dist.calculated": 1,
                                    _id: 1,
                                    "businessName": 1,
                                    "userType": 1,
                                    "logo": 1,
                                    "addresss": 1,
                                    "latitude": 1,
                                    "longitude": 1,
                                    "foodType": 1,
                                    "image": 1,
                                    "avgRating": 1,
                                    "status": 1,
                                    "deleteStatus": 1
                                },
                            },
                            {
                                $limit: 1
                            }
                        ],
                        as: "restroData"
                    }
                },
                {
                    $unwind: {
                        path: "$restroData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "productData.deleteStatus": false,
                        "restroData.deleteStatus": false
                    }
                }
            ])
            var uniq = _.uniqBy(cuisineData, function (o) {
                return o.productData.cuisine;
            });
            response.log("Data found successfully", uniq);
            return response.responseHandlerWithData(res, 200, "Data found successfully", uniq);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Search suggestions=================================//

    searchSuggestions: async (req, res) => {

        try {
            response.log("Request for get search suggestion is=============>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (req.body.userId) {
                userId = req.body.userId
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
            let query = {
                $and: [
                    {
                        $or: [
                            { "userType": "Brand" },
                            { "userType": "Store" }
                        ]
                    },
                    {
                        // "businessName": { $regex: "^" + req.body.search, $options: 'i' }
                        "businessName": { $regex:  req.body.search, $options: 'i' }

                    },
                    {
                        status: 'Active'
                    },
                    {
                        hiddenStatus: false
                    }
                ]
            }
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }
            let restaurantSearch = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs"
                    },

                },
                {
                    $match: query
                },

                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] }
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    $match: {
                        "menuData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    $match: {
                        "openingData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id"
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "userType": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "status": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "openingData": 1,
                        "holidayData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "userType": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "status": 1,
                        "foodType": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "leftData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } },
                        "actualType": "Restaurant"
                    }
                },
                {
                    $sort: { dist: 1 }
                },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                    }
                }
            ])
            let prouctNameSearch = await Product.aggregate([
                {
                    $match: {
                        deleteStatus: false,
                        sellingStatus:true, // ====> mychanges
                        pauseStatus: false,
                        // "foodName": { $regex: "^" + req.body.search, $options: 'i' }
                        "foodName": { $regex: req.body.search, $options: 'i' }

                    }
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            menuId: "$menuId", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$_id", "$$menuId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "menuData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "brands",
                        let: {
                            "brandId": "$menuData.brandId", status: 'Active', hiddenStatus: false
                        },
                        pipeline: [
                            {
                                $geoNear: {
                                    near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                                    key: "location",
                                    spherical: true,
                                    maxDistance: distance,
                                    distanceField: "dist.calculated",
                                    includeLocs: "locs",
                                },

                            },
                            {
                                $match: {
                                    $expr:
                                    {
                                        $and: [
                                            { $eq: ["$_id", "$$brandId"] },
                                            { $eq: ["$status", "$$status"] },
                                            { $eq: ["$hiddenStatus", "$$hiddenStatus"] }
                                        ],

                                    },

                                }
                            },
                            {
                                $project: {
                                    "dist.calculated": 1,
                                    _id: 1,
                                    "businessName": 1,
                                    "userType": 1,
                                    "logo": 1,
                                    "addresss": 1,
                                    "latitude": 1,
                                    "longitude": 1,
                                    "foodType": 1,
                                    "image": 1,
                                    "avgRating": 1,
                                    "status": 1
                                },
                            },
                            {
                                $limit: 1
                            }
                        ],
                        as: "restroData"
                    }
                },
                {
                    $unwind: {
                        path: "$restroData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "restroData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$restroData._id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "openingData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$restroData._id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "offeredPrice": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } },
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } },
                    }
                },
                {
                    $project: {
                        _id: 1,
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } },
                        "actualType": 'Dish'
                    }
                },
                {
                    $sort: { leftQuantity: -1 }
                },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' }
                    }
                }
            ])
            let cuisineSearch = await Product.aggregate([
                {
                    $match: {
                        deleteStatus: false,
                        sellingStatus: true,  // ======> my changes
                        pauseStatus: false,
                        // "cuisine": { $regex: "^" + req.body.search, $options: 'i' }
                        "cuisine": { $regex: req.body.search, $options: 'i' }

                    }
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            menuId: "$menuId", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$_id", "$$menuId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "menuData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "brands",
                        let: {
                            "brandId": "$menuData.brandId", status: 'Active', hiddenStatus: false
                        },
                        pipeline: [
                            {
                                $geoNear: {
                                    near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                                    key: "location",
                                    spherical: true,
                                    maxDistance: distance,
                                    distanceField: "dist.calculated",
                                    includeLocs: "locs",
                                },

                            },
                            {
                                $match: {
                                    $expr:
                                    {
                                        $and: [
                                            { $eq: ["$_id", "$$brandId"] },
                                            { $eq: ["$status", "$$status"] },
                                            { $eq: ["$hiddenStatus", "$$hiddenStatus"] }
                                        ],

                                    },

                                }
                            },
                            {
                                $project: {
                                    "dist.calculated": 1,
                                    _id: 1,
                                    "businessName": 1,
                                    "userType": 1,
                                    "logo": 1,
                                    "addresss": 1,
                                    "latitude": 1,
                                    "longitude": 1,
                                    "foodType": 1,
                                    "image": 1,
                                    "avgRating": 1,
                                    "status": 1
                                },
                            },
                            {
                                $limit: 1
                            }
                        ],
                        as: "restroData"
                    }
                },
                {
                    $unwind: {
                        path: "$restroData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "restroData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$restroData._id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "openingData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$restroData._id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "offeredPrice": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } },
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } },
                    }
                },
                {
                    $project: {
                        _id: 1,
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } },
                        "actualType": 'Cuisine'
                    }
                },
                {
                    $sort: { leftQuantity: -1 }
                },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' }
                    }
                }
            ])
            let productCuisine = [...prouctNameSearch, ...cuisineSearch]
            let uniqueData = _.uniqBy(productCuisine, '_id');
            let mergeData = [...restaurantSearch, ...uniqueData];
            let random = _.shuffle(mergeData);
            let obj = {
                mergeData: random
            }
            response.log("Data found successfully", obj);
            return response.responseHandlerWithData(res, 200, "Data found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Cuisine sub category===============================//

    cusineSubCategory: async (req, res) => {

        try {
            response.log("Request for get cuisine sub category is============", req.body);
            let subCategory = await Cuisinecategory.find({ "cuisineId": { $in: req.body.cuisineData }, status: 'Active' })
            response.log("Data found successfully", subCategory);
            return response.responseHandlerWithData(res, 200, "Data found successfully", subCategory);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Cuisine list=========================================//

    cuisineList: async (req, res) => {

        try {
            response.log("Request for get cuisine is============", req.body);
            let subCategory = await Cuisine.find({ status: 'Active' }).sort({ createdAt: -1 })
            response.log("Data found successfully", subCategory);
            return response.responseHandlerWithData(res, 200, "Data found successfully", subCategory);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Home filter=========================================//

    homeFilter: async (req, res) => {

        try {
            response.log("Request for get home filter data is===========>", req.body);
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('distance', 'Something went wrong').notEmpty();
            req.checkBody('pickupLaterAllowance', 'Something went wrong').notEmpty();
            req.checkBody('minPrice', 'Something went wrong').notEmpty();
            req.checkBody('maxPrice', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (req.body.userId) {
                userId = req.body.userId
            }
            let day = moment().format('dddd');
            let currentTime = (moment().add(5, 'hours').add(30, 'minutes').format('HH:mm')).toString()
            let nowTime = new Date(moment().add(5, 'hours').add(30, 'minutes'))
            currentTime = currentTime.replace(/:/g, '');
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
            let query = {
                $and: [
                    {
                        $or: [
                            { "userType": "Brand" },
                            { "userType": "Store" }
                        ]
                    },
                    {
                        status: 'Active'
                    },
                    {
                        avgRating: { $gte: Number(req.body.rating), $lte: 5 }
                    },
                    {
                        hiddenStatus: false
                    }
                ]
            }
            let cuisineFilter = {
                status: 'Active'
            }
            let cuisineFilterProduct = {
                status: 'Active'
            }
            if (req.body.cuisines.length > 0) {
                cuisineFilter = {
                    realProductData: {
                        $elemMatch: { cuisineArray: { $in: req.body.cuisines } }
                    }
                }
            }
            if (req.body.cuisines.length > 0) {
                cuisineFilterProduct = {
                    cuisineArray: {
                        $in: req.body.cuisines
                    }
                }
            }
            let categoryFilter = {
                status: 'Active'
            }
            let categoryFilterProduct = {
                status: 'Active'
            }
            if (req.body.subCategory.length > 0) {
                categoryFilter = {
                    realProductData: {
                        $elemMatch: { subCategoryArray: { $in: req.body.subCategory } }
                    }
                }
            }
            if (req.body.subCategory.length > 0) {
                categoryFilterProduct = {
                    subCategoryArray: {
                        $in: req.body.subCategory
                    }
                }
            }
            let distance = 10000
            if (req.body.distance) {
                distance = Number(req.body.distance) * 1000
            }

            response.log("pickupLaterAllowance", Boolean(req.body.pickupLaterAllowance))

            let newRestaurantHome = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs",
                    },

                },
                {
                    $match: query
                },

                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    $match: {
                        "menuData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    $match: {
                        "openingData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false, pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] }
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$ne:0}
                            }
                        }],
                        as: "productData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false, pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] },
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "subCategory": 1,
                                "pickupLaterAllowance": 1,
                                "cuisine": 1,
                                "offeredPrice": 1,
                                "cuisineArray": { $split: ["$cuisine", ", "] },
                                "subCategoryArray": { $split: ["$subCategory", ", "] },
                                "foodTypeArray": 1
                            }
                        },
                        {
                            $match: { foodTypeArray: { $in: foodTypeArray }, leftQuantity:{$ne:0} }
                        },
                        {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false, pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$ne:0}
                            }
                        }],
                        as: "leftProductData"
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "userType": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "createdAt": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "status": 1,
                        "safetyBadge": 1,
                        "itemSize": { $size: "$productData" },
                        "realProductData": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "leftData": { $size: "$leftProductData" },
                        "openingData": 1,
                        "holidayData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $match: cuisineFilter
                },
                {
                    $match: categoryFilter
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "userType": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "createdAt": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "status": 1,
                        "foodType": 1,
                        "safetyBadge": 1,
                        "realProductData": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "openingData": 1,
                        "leftData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "createdAt": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                {
                    $sort: { createdAt: -1, itemSize: -1 }
                },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        productSize: { $gt: 0 }
                    }
                }
            ])


            let brandQuery = {
                $and: [
                    {
                        userType: "Brand"
                    },
                    {
                        status: 'Active'
                    },
                    {
                        avgRating: { $gte: Number(req.body.rating), $lte: 5 }
                    },
                    {
                        hiddenStatus: false
                    }
                ]
            }
            let brandListHome = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs",
                    },

                },
                {
                    $match: brandQuery
                },

                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    $match: {
                        "menuData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    $match: {
                        "openingData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false, pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gt: ["$leftQuantity", 0] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] }
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        }],
                        as: "productData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false, pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] },
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "subCategory": 1,
                                "pickupLaterAllowance": 1,
                                "cuisine": 1,
                                "offeredPrice": 1,
                                "cuisineArray": { $split: ["$cuisine", ", "] },
                                "subCategoryArray": { $split: ["$subCategory", ", "] },
                                "foodTypeArray": 1
                            }
                        },
                        {
                            $match: { leftQuantity: { $gt: 0 }, foodTypeArray: { $in: foodTypeArray } }
                        },
                        {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false, pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gte: ["$minPrice", "$$minPrice"] },
                                        { $lte: ["$maxPrice", "$$maxPrice"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $gt: ["$leftQuantity", 0] }
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        }],
                        as: "leftProductData"
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "userType": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "createdAt": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "status": 1,
                        "safetyBadge": 1,
                        "itemSize": { $size: "$productData" },
                        "realProductData": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "leftData": { $size: "$leftProductData" },
                        "openingData": 1,
                        "holidayData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $match: cuisineFilter
                },
                {
                    $match: categoryFilter
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "userType": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "createdAt": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "status": 1,
                        "foodType": 1,
                        "safetyBadge": 1,
                        "realProductData": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "createdAt": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "foodTypeArray": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                {
                    $sort: { createdAt: -1, itemSize: -1 }
                },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        productSize: { $gt: 0 }
                    }
                }
            ])

            let popularRestaurantHome = await Brand.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                        key: "location",
                        spherical: true,
                        maxDistance: distance,
                        distanceField: "dist.calculated",
                        includeLocs: "locs",
                    },

                },
                {
                    $match: query
                },

                {
                    $lookup: {
                        from: "menus",
                        let: {
                            brandId: "$_id", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    $match: {
                        "menuData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "productorders",
                        let: {
                            restroId: "$_id", status: 'Delivered'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$restroId", "$$restroId"] },
                                        { $eq: ["$status", "$$status"] }
                                    ]
                                }
                            }
                        }],
                        as: "orderData"
                    }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$_id", day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    $match: {
                        "openingData.status": 'Active'
                    }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$_id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "favourites",
                        let: {
                            brandId: "$_id", userId: ObjectId(userId)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$userId", "$$userId"] },
                                    ],

                                },

                            }

                        }, { $limit: 1 }],
                        as: "favData"
                    }
                },
                {
                    $unwind: {
                        path: "$favData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false, pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] }
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$ne:0}
                            }
                        }],
                        as: "productData"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false, pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] },
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                "_id": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "foodImage": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "leftQuantity": 1,
                                "quantitySell": 1,
                                "subCategory": 1,
                                "pickupLaterAllowance": 1,
                                "cuisine": 1,
                                "offeredPrice": 1,
                                "cuisineArray": { $split: ["$cuisine", ", "] },
                                "subCategoryArray": { $split: ["$subCategory", ", "] },
                                "foodTypeArray": 1
                            }
                        },
                        {
                            $match: { foodTypeArray: { $in: foodTypeArray }, leftQuantity:{$ne:0} }
                        },
                        {
                            "$sort": { leftQuantity: -1 }
                        }],
                        as: "realProductData"
                    }
                },


                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: "$menuData._id", sellingStatus: true, pauseStatus: false, pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance), minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                    ]
                                }
                            }
                        }, {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray },
                                leftQuantity:{$ne:0}
                            }
                        }],
                        as: "leftProductData"
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        favData: 1,
                        "isFav": {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$favData.userId', ObjectId(userId)]
                                        }
                                    ]
                                },
                                then: true,
                                else: false,
                            }
                        },
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "userType": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "createdAt": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "status": 1,
                        "safetyBadge": 1,
                        "itemSize": { $size: "$productData" },
                        "realProductData": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "leftData": { $size: "$leftProductData" },
                        "orderSize": { $size: "$orderData" },
                        "openingData": 1,
                        "holidayData": 1,
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $match: cuisineFilter
                },
                {
                    $match: categoryFilter
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "userType": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "createdAt": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "orderSize": 1,
                        "status": 1,
                        "foodType": 1,
                        "safetyBadge": 1,
                        "leftData": 1,
                        "realProductData": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        favData: 1,
                        "isFav": 1,
                        "menuData._id": 1,
                        "dist.calculated": 1,
                        "image": 1,
                        "logo": 1,
                        "totalRating": 1,
                        "avgRating": 1,
                        "ratingByUsers": 1,
                        "businessName": 1,
                        "createdAt": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "address": 1,
                        "foodType": 1,
                        "itemSize": 1,
                        "userType": 1,
                        "orderSize": 1,
                        "foodTypeArray": 1,
                        "realProductData": 1,
                        "safetyBadge": 1,
                        "distance": { $trunc: ["$dist.calculated", 2] },
                        "productSize": { $size: "$realProductData" },
                        "leftData": 1,
                        "openingData": 1,
                        "maxLeft": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                {
                    $sort: { orderSize: -1, itemSize: -1 }
                },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        productSize: { $gt: 0 }
                    }
                }
            ])


            let saveMoreProductHome = await Product.aggregate([
                {
                    $match: {
                        deleteStatus: false,
                        sellingStatus: true,
                        pauseStatus: false,
                        pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance),
                        foodTypeArray: { $in: foodTypeArray },
                        leftQuantity:{$ne:0}
                    }
                },
                {
                    $lookup: {
                        from: "menus",
                        let: {
                            menuId: "$menuId", status: 'Active'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$_id", "$$menuId"] },
                                        { $eq: ["$status", "$$status"] },
                                    ],

                                },
                            }

                        }, { $limit: 1 }],
                        as: "menuData"
                    }
                },
                {
                    $unwind: {
                        path: "$menuData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "menuData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "brands",
                        let: {
                            "brandId": "$menuData.brandId", status: 'Active', hiddenStatus: false, avgRating: Number(req.body.rating)
                        },
                        pipeline: [
                            {
                                $geoNear: {
                                    near: { type: "Point", coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] },
                                    key: "location",
                                    spherical: true,
                                    maxDistance: distance,
                                    distanceField: "dist.calculated",
                                    includeLocs: "locs",
                                },

                            },
                            {
                                $match: {
                                    $expr:
                                    {
                                        $and: [
                                            { $eq: ["$_id", "$$brandId"] },
                                            { $eq: ["$status", "$$status"] },
                                            { $gte: ["$avgRating", "$$avgRating"] },
                                            { $lte: ["$avgRating", 5] },
                                            { $eq: ["$hiddenStatus", "$$hiddenStatus"] },
                                        ],

                                    },

                                }
                            },
                            {
                                $project: {
                                    "dist.calculated": 1,
                                    _id: 1,
                                    "businessName": 1,
                                    "userType": 1,
                                    "logo": 1,
                                    "addresss": 1,
                                    "latitude": 1,
                                    "longitude": 1,
                                    "foodType": 1,
                                    "image": 1,
                                    "avgRating": 1,
                                    "status": 1,
                                    "foodTypeArray": 1
                                },
                            }
                        ],
                        as: "restroData"
                    }
                },
                {
                    $unwind: {
                        path: "$restroData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "restroData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "deliveryslots",
                        let: {
                            brandId: "$restroData._id", status: 'Active', day: day
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $eq: ["$day", "$$day"] },
                                    ],

                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "day": 1,
                                "status": 1
                            }
                        }, { $limit: 1 }],
                        as: "openingData"
                    }
                },
                {
                    $unwind: {
                        path: "$openingData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "openingData.status": 'Active' }
                },
                {
                    $lookup: {
                        from: "holidays",
                        let: {
                            brandId: "$restroData._id", status: 'Inactive'
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$brandId", "$$brandId"] },
                                        { $eq: ["$status", "$$status"] },
                                        { $lte: ["$convertedStartDate", nowTime] },
                                        { $gte: ["$convertedEndDate", nowTime] }
                                    ],
                                },

                            }

                        }, {
                            $project: {
                                "_id": 1,
                                "saleWindowOpen": 1,
                                "saleWindowClose": 1,
                                "pickupWindowOpen": 1,
                                "pickupWindowClose": 1,
                                "convertedStartDate": 1,
                                "convertedEndDate": 1,
                                "status": 1

                            }
                        }, { $limit: 1 }],
                        as: "holidayData"
                    }
                },
                {
                    $unwind: {
                        path: "$holidayData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "offeredPrice": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "cuisineArray": { $split: ["$cuisine", ", "] },
                        "subCategoryArray": { $split: ["$subCategory", ", "] },
                        "saleOpenSt": { $substr: ["$openingData.saleWindowOpen", 0, 2] },
                        "saleOpenCt": { $substr: ["$openingData.saleWindowOpen", 3, 6] },
                        "saleCloseSt": { $substr: ["$openingData.saleWindowClose", 0, 2] },
                        "saleCloseCt": { $substr: ["$openingData.saleWindowClose", 3, 6] }
                    }
                },
                {
                    $sort: { "convertedExpiryDate": 1 }
                },
                {
                    $match: cuisineFilterProduct
                },
                {
                    $match: categoryFilterProduct
                },
                {
                    $project: {
                        _id: 1,
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "offeredPrice": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": { $toDouble: { $concat: ["$saleOpenSt", "$saleOpenCt"] } },
                        "saleWindowClose": { $toDouble: { $concat: ["$saleCloseSt", "$saleCloseCt"] } },
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } },
                    }
                },
                {
                    $project: {
                        _id: 1,
                        "_id": 1,
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "offeredPrice": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "restroData": 1,
                        "menuData": 1,
                        "openingData": 1,
                        "holidayData": 1,
                        "saleWindowOpen": 1,
                        "saleWindowClose": 1,
                        "storeStatusOne": { $cond: { if: { $lte: ["$saleWindowOpen", Number(currentTime)] }, then: true, else: false } },
                        "storeStatusTwo": { $cond: { if: { $gte: ["$saleWindowClose", Number(currentTime)] }, then: true, else: false } }
                    }
                },
                {
                    $match: {
                        "holidayData.status": { $ne: 'Inactive' },
                        offeredPrice: { $gte: Number(req.body.minPrice) }
                    }
                },
                {
                    $match: {
                        offeredPrice: { $lte: Number(req.body.maxPrice) }
                    }
                },
                {
                    $limit: 10
                },
            ])
            let obj = {
                newRestaurantHome: newRestaurantHome,
                brandListHome: brandListHome,
                popularRestaurantHome: popularRestaurantHome,
                finalProductData: saveMoreProductHome
            }
            response.log("Restaurant list found successfully", obj);
            return response.responseHandlerWithData(res, 200, "Restaurant list found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Get menu by filter==================================//

    getMenuListByFilter: async (req, res) => {

        try {
            response.log("Request for get menu list is==============>", req.body);
            req.checkBody('menuId', 'Something went wrong').notEmpty();
            req.checkBody('latitude', 'Something went wrong').notEmpty();
            req.checkBody('longitude', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let userId = "606e8dd28248100f410d6766"
            if (!req.body.userId == "") {
                userId = req.body.userId
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
            let cuisineFilterProduct = {
                status: 'Active'
            }
            if (req.body.cuisines.length > 0) {
                cuisineFilterProduct = {
                    cuisineArray: {
                        $in: req.body.cuisines
                    }
                }
            }
            let categoryFilterProduct = {
                status: 'Active'
            }
            if (req.body.subCategory.length > 0) {
                categoryFilterProduct = {
                    subCategoryArray: {
                        $in: req.body.subCategory
                    }
                }
            }
            let checkMenu = await Menu.findOne({ _id: req.body.menuId })
            if (!checkMenu) {
                response.log("Invalid menu Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let restroObj = {}
            let isFav = false
            let checkFav = await Favorite.findOne({ brandId: checkMenu.brandId, userId: userId })
            if (checkFav) {
                isFav = true
            }
            let checkBrand = await Brand.findOne({ _id: checkMenu.brandId }).select('image logo businessName latitude longitude address foodType mobileNumber webiteLink avgRating safetyBadge').lean()
            if (checkBrand) {
                let distance = await geodist({ lon: parseFloat(checkBrand.longitude), lat: parseFloat(checkBrand.latitude) }, { lon: parseFloat(req.body.longitude), lat: parseFloat(req.body.latitude) }, { exact: true, unit: 'meters' })
                let day = moment().format('dddd');
                let checkToday = await Openinghours.findOne({ day: day, brandId: checkMenu.brandId, status: 'Active' }).lean()
                if (checkToday) {
                    checkToday.pickupOpenTime = convertTime(checkToday.pickupWindowOpen, 'hh:mm A')
                    checkToday.pickupCloseTime = convertTime(checkToday.pickupWindowClose, 'hh:mm A')
                    checkBrand.storeStatus = true
                    restroObj = {
                        restroData: checkBrand,
                        todayData: checkToday,
                        distance: distance,
                        isFav: isFav
                    }
                }
                if (!checkToday) {
                    response.log("Restaurant is not available");
                    return response.responseHandlerWithMessage(res, 501, "Restaurant is not available");
                }
                if (!checkToday) {
                    let startDate = new Date()
                    let checkHoliday = await Holiday({ status: 'Active', brandId: checkMenu.brandId, convertedStartDate: { $lte: startDate, convertedEndDate: { $gte: startDate } } })
                    if (checkHoliday) {
                        response.log("Restaurant is not available");
                        return response.responseHandlerWithMessage(res, 501, "Restaurant is not available");
                    }
                    if (!checkHoliday) {
                        restroObj = {
                            restroData: checkBrand,
                            todayData: {},
                            distance: distance,
                            isFav: isFav
                        }
                    }
                }
            }
            let itemsCount = await Brand.aggregate([
                {
                    $match: {
                        _id: ObjectId(checkMenu.brandId)
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            menuId: ObjectId(req.body.menuId), sellingStatus: true, pauseStatus: false, minPrice: Number(req.body.minPrice), maxPrice: Number(req.body.maxPrice), pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance)
                        },
                        pipeline: [{
                            $match: {
                                $expr:
                                {
                                    $and: [
                                        { $eq: ["$menuId", "$$menuId"] },
                                        { $eq: ["$sellingStatus", "$$sellingStatus"] },
                                        { $eq: ["$pauseStatus", "$$pauseStatus"] },
                                        { $eq: ["$pickupLaterAllowance", "$$pickupLaterAllowance"] },
                                        { $gte: ["$offeredPrice", "$$minPrice"] },
                                        { $lte: ["$offeredPrice", "$$maxPrice"] },
                                        { $gt: ["$leftQuantity", 0] },
                                    ]
                                }
                            }
                        },
                        {
                            $match: {
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        },
                        {
                            "$group": {
                                _id: "$menuId",
                                letfProductAllSum: { "$sum": "$leftQuantity" },
                            }
                        }],
                        as: "maxLeft"
                    }
                },
                {
                    $unwind: {
                        path: "$maxLeft",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        "leftData": "$maxLeft.letfProductAllSum",
                    }
                },
            ])
            let checkStatus = false
            let newLeftCount = 0
            if (itemsCount.length > 0) {
                if (itemsCount[0].leftData > 0) {
                    newLeftCount = itemsCount[0].leftData
                }
                else {
                    newLeftCount = 0
                }

            }
            if (newLeftCount == 0) {
                checkStatus = true
            }
            let cuisineList = []
            let cuisines = await Itemcategory.find({ status: 'Active', brandId: checkMenu.brandId }).sort({ createdAt: -1 }).select('name')
            if (cuisines.length == 0) {
                response.log("Menu list found successfully", []);
                return response.responseHandlerWithData(res, 200, "Menu list found successfully", []);
            }
            for (let j = 0; j < cuisines.length; j++) {
                let checkCuisineQuery = {
                    $and: [
                        {
                            $or: [
                                { "sellingStatus": true },
                                { "sellingStatus": false }
                            ]
                        },
                        {
                            menuCategoryId: cuisines[j]._id
                        },
                        {
                            menuId: req.body.menuId
                        },
                        {
                            pauseStatus: false
                        }
                    ]
                }
                let checkCount = await Product.find(checkCuisineQuery).count()
                if (checkCount > 0) {
                    cuisineList.push(cuisines[j])
                }
            }
            let itemData = []
            if (cuisineList.length > 0) {
                for (let i = 0; i < cuisineList.length; i++) {
                    let itemList = await Product.aggregate([
                        {
                            $match: {
                                menuCategoryId: cuisineList[i]._id,
                                menuId: ObjectId(req.body.menuId),
                                deleteStatus: false,
                                sellingStatus: true,
                                pauseStatus: false,
                                foodTypeArray: { $in: foodTypeArray }
                            }
                        },
                        {
                            "$project": {
                                "adminVerifyStatus": 1,
                                "status": 1,
                                "deleteStatus": 1,
                                "sellingStatus": 1,
                                "isChoiceStatus": 1,
                                "changeRequest": 1,
                                "changeRequestApporve": 1,
                                "changeRequestMsg": 1,
                                "totalOrder": 1,
                                "avgRating": 1,
                                "totalRating": 1,
                                "ratingByUsers": 1,
                                "quantitySell": 1,
                                "leftQuantity": 1,
                                "addedQuantity": 1,
                                "pickupLaterAllowance": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "subCategory": 1,
                                "cuisine": 1,
                                "foodImage": 1,
                                "changeRequestId": 1,
                                "category": 1,
                                "createdAt": 1,
                                "updatedAt": 1,
                                "convertedExpiryDate": 1,
                                "convertedPickupDate": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "expiryDate": 1,
                                "expiryTime": 1,
                                "pickupDate": 1,
                                "pickupTime": 1,
                                "pauseStatus": 1
                            }
                        },
                        {
                            $sort: { leftQuantity: 1 }
                        }
                    ])
                    let fullPriceItems = await Product.aggregate([
                        {
                            $match: {
                                menuCategoryId: cuisineList[i]._id,
                                menuId: ObjectId(req.body.menuId),
                                deleteStatus: false,
                                sellingStatus: false
                            }
                        },
                        {
                            "$project": {
                                "adminVerifyStatus": 1,
                                "status": 1,
                                "deleteStatus": 1,
                                "sellingStatus": 1,
                                "isChoiceStatus": 1,
                                "changeRequest": 1,
                                "changeRequestApporve": 1,
                                "changeRequestMsg": 1,
                                "totalOrder": 1,
                                "avgRating": 1,
                                "totalRating": 1,
                                "ratingByUsers": 1,
                                "quantitySell": 1,
                                "leftQuantity": 1,
                                "addedQuantity": 1,
                                "pickupLaterAllowance": 1,
                                "menuId": 1,
                                "menuCategoryName": 1,
                                "foodName": 1,
                                "description": 1,
                                "foodQuantity": 1,
                                "price": 1,
                                "foodType": 1,
                                "subCategory": 1,
                                "cuisine": 1,
                                "foodImage": 1,
                                "changeRequestId": 1,
                                "category": 1,
                                "createdAt": 1,
                                "updatedAt": 1,
                                "convertedExpiryDate": 1,
                                "convertedPickupDate": 1,
                                "discountAmount": 1,
                                "discountPer": 1,
                                "expiryDate": 1,
                                "expiryTime": 1,
                                "pickupDate": 1,
                                "pickupTime": 1,
                                "pauseStatus": 1,
                                "outOfStock": 1
                            }
                        },
                        {
                            $sort: { createdAt: -1 }
                        }
                    ])
                    let newDataFull = fullPriceItems
                    if (checkStatus == true) {
                        newDataFull = []
                    }
                    let obj = {
                        itemList: itemList,
                        cuisineName: cuisineList[i].name,
                        cuisineId: cuisineList[i]._id,
                        fullPriceItems: newDataFull
                    }
                    itemData.push(obj)
                }
            }
            let itemListAll = await Product.aggregate([
                {
                    $match: {
                        menuId: ObjectId(req.body.menuId),
                        deleteStatus: false,
                        sellingStatus: true,
                        pauseStatus: false,
                        pickupLaterAllowance: Boolean(req.body.pickupLaterAllowance),
                        offeredPrice: { $gte: Number(req.body.minPrice) },
                        offeredPrice: { $lte: Number(req.body.maxPrice) },
                        foodTypeArray: { $in: foodTypeArray }
                    }
                },
                {
                    "$project": {
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "sellingStatus": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "offeredPrice": 1,
                        "cuisineArray": { $split: ["$cuisine", ", "] },
                        "subCategoryArray": { $split: ["$subCategory", ", "] },
                    }
                },
                {
                    $match: cuisineFilterProduct
                },
                {
                    $match: categoryFilterProduct
                },
                {
                    $sort: { leftQuantity: -1 }
                }
            ])
            let fullPriceItemsList = await Product.aggregate([
                {
                    $match: {
                        menuId: ObjectId(req.body.menuId),
                        deleteStatus: false,
                        sellingStatus: false,
                        pauseStatus: false,
                        price: { $gte: Number(req.body.minPrice) },
                        price: { $lte: Number(req.body.maxPrice) },
                        foodTypeArray: { $in: foodTypeArray }
                    }
                },
                {
                    "$project": {
                        "adminVerifyStatus": 1,
                        "status": 1,
                        "deleteStatus": 1,
                        "Status": 1,
                        "isChoiceStatus": 1,
                        "changeRequest": 1,
                        "changeRequestApporve": 1,
                        "changeRequestMsg": 1,
                        "totalOrder": 1,
                        "avgRating": 1,
                        "totalRating": 1,
                        "ratingByUsers": 1,
                        "quantitySell": 1,
                        "leftQuantity": 1,
                        "addedQuantity": 1,
                        "pickupLaterAllowance": 1,
                        "menuId": 1,
                        "menuCategoryName": 1,
                        "foodName": 1,
                        "description": 1,
                        "foodQuantity": 1,
                        "price": 1,
                        "foodType": 1,
                        "subCategory": 1,
                        "cuisine": 1,
                        "foodImage": 1,
                        "changeRequestId": 1,
                        "category": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "convertedExpiryDate": 1,
                        "convertedPickupDate": 1,
                        "discountAmount": 1,
                        "discountPer": 1,
                        "expiryDate": 1,
                        "expiryTime": 1,
                        "pickupDate": 1,
                        "pickupTime": 1,
                        "pauseStatus": 1,
                        "offeredPrice": 1,
                        "outOfStock": 1,
                        "cuisineArray": { $split: ["$cuisine", ", "] },
                        "subCategoryArray": { $split: ["$subCategory", ", "] },
                    }
                },
                {
                    $match: cuisineFilterProduct
                },
                {
                    $match: categoryFilterProduct
                },
                {
                    $sort: { price: 1 }
                }
            ])
            let newDataFullAll = fullPriceItemsList
            if (checkStatus == true) {
                newDataFullAll = []
            }
            let myData = {
                cuisineList: cuisineList,
                itemData: itemData,
                restroObj: restroObj,
                itemListAll: itemListAll,
                fullPriceItemsList: newDataFullAll
            }
            response.log("Menu list found successfully", myData);
            return response.responseHandlerWithData(res, 200, "Menu list found successfully", myData);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Claim coupon code====================================//

    claimCouponCode: async (req, res) => {

        try {
            response.log("Request for claim code is==========>", req.body);
            req.checkBody('code', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let claimData = await Claimcoupon.findOne({ code: req.body.code, userId: req.user._id })
            if (claimData) {
                response.log("You have already claimed this coupon.");
                return response.responseHandlerWithMessage(res, 501, "You have already claimed this coupon.");
            }
            let code = await Creditmodel.findOne({ status: 'Active', creditCode: req.body.code })
            if (!code) {
                response.log("Invalid Coupon");
                return response.responseHandlerWithMessage(res, 501, "Invalid Coupon");
            }
            if (code.remaningFrequency == 0) {
                response.log("Coupon code has been expired");
                return response.responseHandlerWithMessage(res, 501, "Coupon code has been expired");
            }
            let todate = new Date(code.toDate).getTime()
            let todaydate = new Date().getTime()
            if (todate < todaydate) {
                response.log("Coupon code has been expired");
                return response.responseHandlerWithMessage(res, 501, "Coupon code has been expired");
            }
            let obj = new Claimcoupon({
                userId: req.user._id,
                code: req.body.code,
                couponId: code._id
            })
            let date = moment().format('LL');
            let claimDataSave = await obj.save()
            let remaningFrequency = code.remaningFrequency - 1
            await Creditmodel.findByIdAndUpdate({ _id: code._id }, { $set: { remaningFrequency: remaningFrequency } }, { new: true })
            let walletAmount = Number(req.user.walletAmount) + Number(code.creditAmount)
            await User.findByIdAndUpdate({ _id: req.user._id }, { $set: { walletAmount: walletAmount } }, { new: true })
            let notiTitle = `Congratulation! You have received ${code.creditAmount} saveEat credits`
            let notiMessage = `Congratulation! You have received ${code.creditAmount} saveEat credits`
            let notiType = `creditByCoupon`
            let newId = claimDataSave._id
            response.log(`Congratulation! You have received ${code.creditAmount} saveEat credits.`, claimDataSave);
            response.responseHandlerWithMessage(res, 200, `Congratulation! You have received ${code.creditAmount} saveEat credits.`);
            let templateId = '1307163465637691289'
            let msg = `You've got cash! Use Rs.${code.creditAmount} worth of credits through your SaveEat app. by entering the following code  ${req.body.code} to enjoy your favourite foods by ${date}. -All you need to save the planet: Eat!!`
            request(`https://api.msg91.com/api/sendhttp.php?mobiles=${req.user.mobileNumber}&sender=Sender&message=${msg}&authkey=${authKey}&route=4&country=91&DLT_TE_ID=${templateId}`, async (error, resp, body) => {
                response.log('body:', body);
            });
            Sendnotification.sendNotificationForAndroid(req.user.deviceToken, notiTitle, notiMessage, notiType, newId, req.user.deviceType, (error10, result10) => {
                response.log("Notification Sent");
            })
            return
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Claimed reward=======================================//

    claimReward: async (req, res) => {

        try {
            response.log("Request for claim reward is==========>", req.body);
            req.checkBody('rewardId', 'Something went wrong').notEmpty();
            req.checkBody('rewardType', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkReward = await Reward.findOne({ _id: req.body.rewardId, claimedStatus: 'Unclaimed' })
            if (!checkReward) {
                response.log("Reward has been expired");
                return response.responseHandlerWithMessage(res, 501, "Reward has been expired");
            }
            if (req.body.rewardType == "Credit") {
                let walletAmount = Number(req.user.walletAmount) + 25
                await User.findByIdAndUpdate({ _id: req.user._id }, { $set: { walletAmount: walletAmount } }, { new: true })
                let rewardObj = {
                    claimedStatus: 'Claimed',
                    rewardType: 'Credit',
                    claimedDate: new Date()
                }
                await Reward.findByIdAndUpdate({ _id: req.body.rewardId }, { $set: rewardObj }, { new: true })
                let notiTitle = `Congratulation! You have received ${25} saveEat credits`
                let notiMessage = `Congratulation! You have received ${25} saveEat credits`
                let notiType = `creditReward`
                let newId = req.body.rewardId
                await Star.deleteMany({ userId: req.user._id })
                response.log(`Reward has been claimed successfully`);
                response.responseHandlerWithMessage(res, 200, `Reward has been claimed successfully`);
                Sendnotification.sendNotificationForAndroid(req.user.deviceToken, notiTitle, notiMessage, notiType, newId, req.user.deviceType, (error10, result10) => {
                    response.log("Notification Sent");
                })
                return
            }
            if (req.body.rewardType == "Plant") {
                let rewardObj = {
                    claimedStatus: 'Claimed',
                    rewardType: 'Plant',
                    claimedDate: new Date()
                }
                await Reward.findByIdAndUpdate({ _id: req.body.rewardId }, { $set: rewardObj }, { new: true })
                await Star.deleteMany({ userId: req.user._id })
                response.log(`Reward has been claimed successfully`);
                return response.responseHandlerWithMessage(res, 200, `Reward has been claimed successfully`);
            }

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //======================================Unlock hidden restaurant==============================//

    unlockHiddenRestaurant: async (req, res) => {

        try {

            response.log("Request for unlock hidden restaurant is===========>", req.body);
            req.checkBody('hiddenCode', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkHiddenCode = await Brand.findOne({ hiddenCode: req.body.hiddenCode })
            if (!checkHiddenCode) {
                response.log("Invalid Code");
                return response.responseHandlerWithMessage(res, 501, "Invalid Code");
            }
            let checkMenu = await Menu.findOne({ brandId: checkHiddenCode._id, status: 'Active' })
            if (!checkMenu) {
                response.log("This restaurant is not accepting order");
                return response.responseHandlerWithMessage(res, 501, "This restaurant is not accepting order");
            }
            let checkFav = await Favorite.findOne({ brandId: checkMenu.brandId, userId: req.user._id })
            if (!checkFav) {
                let date = moment().format('YYYY-MM-DD')
                let favouireObj = new Favorite({
                    brandId: checkMenu.brandId,
                    userId: req.user._id,
                    date: date
                })
                await favouireObj.save()
            }
            let obj = {
                restaurantId: checkHiddenCode._id,
                menuId: checkMenu._id
            }
            response.log(`Restaurant unlocked successfully`, obj);
            return response.responseHandlerWithData(res, 200, `Restaurant unlocked successfully`, obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //======================================Payment not complete=================================//

    paymentNotComplete: async (req, res) => {

        try {
            response.log("Request for payment not complete is===========>", req.body);
            let checkOrder = await Order.findOne({ _id: req.body.orderId })
            if (!checkOrder) {
                response.log("Invalid Token");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let templateId = '1307163465627349338'
            let msg = `Your payment for SaveEat order #${checkOrder.orderNumber} was not completed. Any amount if debited from your card will get refunded within 4-7 days.`
            request(`https://api.msg91.com/api/sendhttp.php?mobiles=${req.user.mobileNumber}&sender=Sender&message=${msg}&authkey=${authKey}&route=4&country=91&DLT_TE_ID=${templateId}`, async (error, resp, body) => {
                response.log('body:', body);
            });
            response.log(`Message sent successfully`);
            return response.responseHandlerWithMessage(res, 200, `Message sent successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Cancel by out of stock==============================//

    cancelByOutOfStock: async (req, res) => {

        try {
            response.log("Request for ot of stock is===========>", req.body);
            let checkOrder = await Order.findOne({ _id: req.body.orderId })
            if (!checkOrder) {
                response.log("Invalid Token");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            let templateId = '1307163465599138110'
            let msg = `Your SaveEat order #${checkOrder.orderNumber} has been canceled because the item(s) ordered are not in stock anymore. We apologise for the inconvenience and request you to re-order basis current availability.`
            request(`https://api.msg91.com/api/sendhttp.php?mobiles=${req.user.mobileNumber}&sender=Sender&message=${msg}&authkey=${authKey}&route=4&country=91&DLT_TE_ID=${templateId}`, async (error, resp, body) => {
                response.log('body:', body);
            });
            response.log(`Message sent successfully`);
            return response.responseHandlerWithMessage(res, 200, `Message sent successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },



}

//=========================Qr Code Generator=========================//

async function create(dataForQRcode, center_image, width, cwidth) {
    const canvas = createCanvas(width, width);
    QRCode.toCanvas(
        canvas,
        dataForQRcode,
        {
            errorCorrectionLevel: "M",
            margin: 1,
            width: 400,
            height: 400,
            color: "#166a83"
        }
    );
    const ctx = canvas.getContext("2d");
    const img = await loadImage(center_image);
    const center = (width - cwidth) / 2;
    ctx.drawImage(img, 174, 174, cwidth, cwidth);
    return canvas.toDataURL("image/png");
}









