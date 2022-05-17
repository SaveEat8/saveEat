const User = require('../models/userModel.js');
const StaticContent = require('../models/staticModel.js');
const Order = require('../models/productOrderModel.js');
const Notification = require('../models/notificationModel.js');
const { ObjectId } = require('mongodb');
const func = require('../utils/commonFun.js');
const SendMail = require('../utils/sendMail.js');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const config = require("../config/config");
const Admin = require('../models/adminModel.js')
const adminRole = require('../models/adminRoleModel.js')
const ZOHO = require('../models/zohoModel.js')
const CT_CREDITS = require('../models/cleverTapCreditsModel.js')
const Coins = require('../models/creditModel.js');
const DUNZO = require('../models/dunzoTokenModel.js')
const DELIVERY_FEE = require('../models/deliveryFee.js')



const _ = require('lodash');
const response = require("../utils/httpResponseMessage");
const Fileupload = require('../utils/fileUpload.js');
const fs = require('fs')
const fileSystem = require('file-system');
const path = require('path');
const moment = require('moment')
var request = require('request');
const notificationFunction = require('../utils/notification.js');

module.exports = {

    //========================================Admin Login=================================================//

    adminLogin: async (req, res) => {

        try {
            response.log("Request for admin login is===========>", req.body);
            req.checkBody('email', 'Your email address is invalid. Please enter a valid address.').isEmail().notEmpty();
            req.checkBody('password', 'Password must be of minimum 6 characters length').notEmpty().isLength({ min: 6 });
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            req.body.email = req.body.email.toLowerCase();
            let checkAdmin = await Admin.findOne({ email: req.body.email })
            if (!checkAdmin) {
                response.log("Invalid Credentials")
                return response.responseHandlerWithMessage(res, 500, "Invalid Credentails");
            }
            response.log("Bcrypt Password is=======>", checkAdmin.password)
            let passVerify = await bcrypt.compareSync(req.body.password, checkAdmin.password);
            if (!passVerify) {
                response.log("Invalid Credentails")
                return response.responseHandlerWithMessage(res, 500, "Invalid Credentails");
            }
            req.body.password = checkAdmin.password
            let query = { $and: [{ _id: checkAdmin._id }, { password: req.body.password }] }
            let checkPassword = await Admin.findOne(query)
            if (!checkPassword) {
                response.log("Invalid Credentails")
                return response.responseHandlerWithMessage(res, 500, "Invalid Credentails");
            }
            var jwtToken = jwt.sign({ "_id": checkPassword._id }, `sUpER@SecReT`);
            response.log("Jwt Token is=========>", jwtToken)
            let result = await Admin.findByIdAndUpdate({ _id: checkAdmin._id }, { $set: { jwtToken: jwtToken,fcmToken:req.body.token } }, { new: true }).select('name _id profilePic userType')

            if(checkAdmin.userType == "SubAdmin"){

                if(checkAdmin.status == "Inactive"){
                    return response.responseHandlerWithMessage(res, 500, "Due to some suspicious activity your account has been disabled by admin.");
                }


                let checkAdminRole = await adminRole.findOne({ _id: ObjectId(checkAdmin.roleId) })

                if(checkAdminRole.status == "Inactive"){
                    return response.responseHandlerWithMessage(res, 500, "Your Role has been disabled by admin please contact admin.");
                }


                return res.send({status:200,message:"You have successfully logged in ",data:result,Role:checkAdminRole})

            }
            

            response.log("Admin have successfully logged in", result)
            return response.responseHandlerWithData(res, 200, "You have successfully logged in ", result);
        } catch (error) {
            response.log("Error is============>", error)
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Admin Forgot password=======================================//

    adminForgotPassword: async (req, res) => {

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
            let checkEmail = await Admin.findOne({ email: req.body.email })
            if (!checkEmail) {
                response.log("Invalid Credentials")
                return response.responseHandlerWithMessage(res, 500, "Don't have any account with this email");
            }
            let obj={
                _id:checkEmail._id
            }
            let otp = Math.floor(100000 + Math.random() * 900000)
            let sms = `Please do not share with anyone.`
            let subject = `Save Eat`
            await Admin.findByIdAndUpdate({ _id: checkEmail._id }, { $set: { emailOtp: otp } }, { new: true })
            response.log("Otp send on your email", obj)
            response.responseHandlerWithData(res, 200, `Otp has been sent to your email ${(req.body.email).toLowerCase()} successfully.`, obj);
            SendMail.sendForgotOtp((req.body.email).toLowerCase(), subject, otp, sms, (error10, result10) => {
                response.log("Email sent")
            })
        } catch (error) {
            response.log("Error is============>", error)
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Admin Logout==========================================//

    adminLogout: async (req, res) => {

        try {
            let checkAdmin = await Admin.findByIdAndUpdate({ _id: req.body.adminId }, { $set: { jwtToken: '' } }, { new: true })
            if (!checkAdmin) {
                response.log("Admin Id is incorrect");
                return response.responseHandlerWithMessage(res, 500, 'Something went wrong');
            }
            response.log(`You've been logged out successfully`, checkAdmin);
            return response.responseHandlerWithMessage(res, 200, `You've been logged out successfully`);
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    verifyOtp: async (req, res) => {

        try {
            let verifyOtp = await Admin.findOne({ email: req.body.email,emailOtp:req.body.otp })
            if (!verifyOtp) {
                response.log("Invalid OTP");
                return response.responseHandlerWithMessage(res, 500, 'Invalid OTP');
            }
            let otp = Math.floor(100000 + Math.random() * 900000)
            let checkAdmin = await Admin.findByIdAndUpdate({ _id: verifyOtp._id }, { $set: { emailOtp: otp } }, { new: true })
            if (!checkAdmin) {
                response.log("Admin Id is incorrect");
                return response.responseHandlerWithMessage(res, 500, 'Something went wrong');
            }
            response.log(`Otp verified successfully`, checkAdmin);
            return response.responseHandlerWithData(res, 200, `Otp verified successfully`,checkAdmin._id);
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================================Work(Get static content)=========================//

    staticContentGet: async (req, res) => {

        try {
            console.log("Request is==========>", req.body);
            if (!req.body.type) {
                console.log("All fields are required")
                return res.send({ response_code: 401, response_message: "Something went wrong" })
            }
            let result = await StaticContent.findOne({ type: req.body.type })
            if (!result) {
                console.log("Type is not correct");
                return res.send({ response_code: 500, response_message: "Invalid Token" })
            }
            console.log("Result is=========>", result);
            return res.send({ response_code: 200, response_message: "Data found successfully", Data: result })
        } catch (error) {
            console.log("Error is=========>", error);
            return res.send({ response_code: 500, response_message: "Internal server error" })
        }
    },

    //================================================Work(Update static content)========================//

    StaticContentUpdate: async (req, res) => {

        try {
            if (req.body.type == 'TermCondition') {
                var obj = { $set: { "description": req.body.description } }
            }
            if (req.body.type == 'PrivacyPolicy') {
                var obj = { $set: { "description": req.body.description } }
            }
            let result = await StaticContent.findOneAndUpdate({ Type: req.body.type }, obj, { new: true })
            if (!result) {
                return res.send({ response_code: 500, response_message: "Invalid Token" })
            }
            console.log("Result is=======>", result)
            return res.send({ responseCode: 200, responseMessage: "Updated Successfully.", Data: result })
        } catch (error) {
            return res.send({ responseCode: 500, responseMessage: "Internal server error." })
        }
    },

    //============================================Get Admin Details=====================================//

    getAdminDetail: async (req, res) => {

        try {

            let checkAdmin = await Admin.findOne({ _id: req.user._id })
            if (!checkAdmin) {
                response.log("Admin Id is not correct")
                return response.responseHandlerWithMessage(res, 500, 'Something went wrong');
            }
            response.log("Admin data found successfully", checkAdmin)
            return response.responseHandlerWithData(res, 200, 'Detail Found Successfully', checkAdmin);
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Password change==========================================//

    passwordChange: async (req, res) => {

        try {
            req.checkBody('newPassword', 'Something went wrong.').notEmpty();
            req.checkBody('adminId', 'Something went wrong.').notEmpty();
            req.checkBody('oldPassword', 'Password must be of minimum 6 characters length').notEmpty().isLength({ min: 6 });
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkAdmin=await Admin.findOne({_id:req.body.adminId})
            if(!checkAdmin){
                response.log("Admin id is incorrect")
                return response.responseHandlerWithMessage(res, 500, 'Admin id is incorrect');
            }
            if (!(bcrypt.compareSync(req.body.oldPassword, checkAdmin.password))) {
                response.log("Old password is incorrect")
                return response.responseHandlerWithMessage(res, 500, 'Old password is incorrect');
            }
            req.body.newPassword = bcrypt.hashSync(req.body.newPassword, 10)
            let result = await Admin.findByIdAndUpdate({ _id: req.body.adminId }, { $set: { password: req.body.newPassword } }, { new: true })
            response.log("Password reset successfully", result)
            return response.responseHandlerWithMessage(res, 200, 'Password reset successfully');
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Update admin detail======================================//

    updateAdminDetail: async (req, res) => {
        try {
            response.log("Rerquest for update admin detail is==========>", req.files)
            // req.checkBody('name', 'Something went wrong.').notEmpty();
            req.checkBody('adminId', 'Something went wrong.').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateDetail = await Admin.findByIdAndUpdate({ _id: req.body.adminId }, { $set: { name: req.body.name } }, { new: true })
            response.log("Profile updated successfully", updateDetail)

            if (req.files.profilePic) {
                console.log("req.files.profilePic=====>",req.files.profilePic)
                let imageUrl = await Fileupload.upload(req.files.profilePic, "admin/");
                console.log("imageUrl====>",imageUrl)
                await Admin.findByIdAndUpdate({ _id: req.body.adminId }, { $set: { profilePic: imageUrl } }, { new: true, lean: true })
                response.responseHandlerWithData(res, 200, 'Profile updated successfully', imageUrl);

            }

            
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Dashboard count=====================================//

    dashboardCount: async (req, res) => {

        try {
            let totalUser = await User.find({}).count()
            let activeUser = await User.find({ status: 'Active' }).count()
            let notification = await Notification.find({}).count()
            let obj = {
                totalUser: totalUser,
                activeUser: activeUser,
                notification: notification,
            }
            response.log("Dashboard count found successfully", obj)
            response.responseHandlerWithData(res, 200, 'Dashboard count found successfully', obj);
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Reset password======================================//
    resetPassword: async (req, res) => {

        try {
            req.checkBody('password', 'Something went wrong.').notEmpty();
            req.checkBody('adminId', 'Something went wrong.').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkAdmin = await Admin.findOne({ _id: req.body.adminId })
            if (!checkAdmin) {
                response.log("Session has been expired")
                return response.responseHandlerWithMessage(res, 500, 'Session has been expired');
            }
            req.body.password = bcrypt.hashSync(req.body.password, 10)
            let otp = Math.floor(10000000 + Math.random() * 90000000)
            let result = await Admin.findByIdAndUpdate({ _id: req.body.adminId }, { $set: { password: req.body.password, emailOtp: otp } }, { new: true })
            response.log("Password reset successfully", result)
            return response.responseHandlerWithMessage(res, 200, 'Password reset successfully');
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Get excel=======================================//
    getExcel: (req, res) => {

        var filePath = path.join(__dirname, '../excel/' + req.params.fileName);
        console.log("File path is===========>", filePath);
        res.writeHead(200, {
            'Content-Type': 'application/vnd.ms-excel',
        });
        var readStream = fileSystem.createReadStream(filePath);
        readStream.pipe(res);
    },

    // =========================================== create Sub-admin============================= //
    createSubAdmin:async (req, res) => {

        try {
            response.log("Request for user signup is=============>", req.body)
            req.checkBody('password', 'Something went wrong').notEmpty();
            req.checkBody('name', 'Something went wrong').notEmpty();
            req.checkBody('email', 'Something went wrong').notEmpty();
            // req.checkBody('countryCode', 'Something went wrong').notEmpty();
            req.checkBody('mobileNumber', 'Something went wrong').notEmpty();

            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkEmail = await Admin.findOne({ email: (req.body.email).toLowerCase() })
            if (checkEmail) {
                response.log("Email Id already exist");
                return response.responseHandlerWithMessage(res, 409, "Email Id already exist");
            }
            let checkMobile = await Admin.findOne({ mobileNumber: req.body.mobileNumber })
            if (checkMobile) {
                response.log("Mobile number already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number already exist");
            }

            let mainAdmin = await Admin.findOne({userType:"Admin"})

            let subAdminId = (mainAdmin.subAdminNumber)

            let result = await adminRole.findOne({_id:ObjectId(req.body.role)})
            if(!result){
                return response.responseHandlerWithMessage(res, 409, "No role dound");
            }

            req.body.password = await bcrypt.hashSync(req.body.password, salt);
            let signupObj = new Admin({
                email: (req.body.email).toLowerCase(),
                countryCode: req.body.countryCode,
                mobileNumber: req.body.mobileNumber,
                userType:"SubAdmin",
                adminNumber: `SUA${subAdminId}`,
                name: req.body.name,
                password: req.body.password,
                role:result.title,
                roleId:ObjectId(result._id)
            })
            let signupData = await signupObj.save()
            let jwtToken = jwt.sign({ "_id": signupData._id }, `sUpER@SecReT`);
            let updateToken = await Admin.findByIdAndUpdate({ _id: signupData._id }, { $set: { jwtToken: jwtToken } }, { new: true, lean: true })
            delete (updateToken.password);
            response.log("Account created successfully.", updateToken)

            let subAdminIds = (mainAdmin.subAdminNumber)+1


            let updateSubAdminCount = await Admin.findByIdAndUpdate({ _id: mainAdmin._id },  { $set: { "subAdminNumber": subAdminIds } }, { new: true, lean: true })


            let result12 = await adminRole.findOne({_id:ObjectId(req.body.role)})

            
            let updateToken1 = await adminRole.findByIdAndUpdate({ _id: result._id },  { $push: { "users": ObjectId(signupData._id) } }, { new: true, lean: true })


            response.responseHandlerWithData(res, 200, `Account created successfully.`, updateToken);

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },
    
    // =========================================== sub-admin update============================//
    subAdminUpdate: async (req, res) => {

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
            
            let checkAdmin = await Admin.findOne({ _id: req.body.adminId })
            if (!checkAdmin) {
                response.log("Session has been expired")
                return response.responseHandlerWithMessage(res, 500, 'Session has been expired');
            }

            let roleId 
            let role


            let password = checkAdmin.password
            if (req.body.password) {
                req.body.password = bcrypt.hashSync(req.body.password, 10)
                password = req.body.password
            }

             role = checkAdmin.role
             roleId = ObjectId(checkAdmin.roleId)
            if (req.body.role) {
                let result = await adminRole.findOne({_id:ObjectId(req.body.role)})
                if(!result){
                    return response.responseHandlerWithMessage(res, 409, "No role dound");
                }
                // role = req.body.role
                role =result.title,
                roleId =ObjectId(result._id)
            }

            let checkEmail = await Admin.findOne({ email: (req.body.email).toLowerCase(), _id: { $ne: checkAdmin._id } })
            if (checkEmail) {
                response.log("Email Id already exist");
                return response.responseHandlerWithMessage(res, 409, "Email Id already exist");
            }

            let checkMobile = await Admin.findOne({ mobileNumber: (req.body.mobileNumber).toLowerCase(), _id: { $ne: checkAdmin._id } })
            if (checkMobile) {
                response.log("Mobile number already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number already exist");
            }



            let obj = {
                name: req.body.name,
                email: req.body.email,
                password:password,
                role:role,
                roleId:roleId,
                mobileNumber: req.body.mobileNumber
            }
            let result = await Admin.findByIdAndUpdate({ _id: checkAdmin._id }, { $set: obj }, { new: true, lean: true })
            delete (result.password);
            response.log("Profile has been updated successfully", result);
            return response.responseHandlerWithData(res, 200, "Profile has been updated successfully", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //  ========================================= sub-admin update status ========================//
    subAdminStatus:async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('adminId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Admin.findByIdAndUpdate({ _id: req.body.adminId }, { $set: { status: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid adminId");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }

            response.log("Status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // ========================================== delete sub-admin =================================//
    deleteSubAdmin:async (req, res) => {

        try {
            response.log("Request for cuisine delete is============>", req.body);
            req.checkBody('adminId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            // let adminData = await Admin.findByIdAndUpdate({ _id: req.body.adminId }, { $set: { deleteStatus: true } }, { new: true })

            let adminData = await Admin.findByIdAndRemove({ _id: req.body.adminId })
            if (!adminData) {
                response.log("Invalid admin Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Admin deleted successfully", adminData)
            return response.responseHandlerWithMessage(res, 200, "Sub-Admin deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // ============================================= sub-admin list ===================================//
    subAdminList:async (req, res) => {

        try {
            response.log("Request for get user list is==============>", req.body);
            req.checkBody('pageNumber', 'Something went wrong').notEmpty();
            req.checkBody('limit', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10,
                sort: { createdAt: -1 },
                select: { password: 0 },
                lean: true
            }
            let queryCheck = { userType: 'SubAdmin' }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())

                // let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);

                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }

            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
            }

            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
            }

            if (req.body.timeframe == "All") {
               
            }

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "firstName": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "lastName": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "email": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "status": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "gender": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "nationality": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }
            let result = await Admin.paginate(queryCheck, options)
            // for (let i = 0; i < result.docs.length; i++) {
            //     let totalOrders = await Order.find({ userId: result.docs[i]._id }).count()
            //     result.docs[i].totalOrderss = totalOrders
            // }
            response.log("Sub-Admin List Found", result)
            return response.responseHandlerWithData(res, 200, "Sub-Admin List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // =============================================subAdmin-Detail ====================================// 
    particularSubAdmin:async (req, res) => {

        try {
            response.log("Request for user signup is=============>", req.body)
            req.checkBody('adminId', 'Something went wrong').notEmpty();

            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            let checkEmail = await Admin.findOne({ _id: ObjectId(req.body.adminId)})
            if (!checkEmail) {
                response.log("Adminalready exist");
                return response.responseHandlerWithMessage(res, 409, "Admin not exist");
            }
           
            response.log("Admin detail successfully.", checkEmail)
            response.responseHandlerWithData(res, 200, `Account Detail found successfully.`, checkEmail);

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    // ==================================== Role- Management ====================================//

    createAdminRole:async (req, res) => {

        try {
            response.log("Request for user signup is=============>", req.body)
            // req.checkBody('password', 'Something went wrong').notEmpty();
            // req.checkBody('name', 'Something went wrong').notEmpty();
            // req.checkBody('email', 'Something went wrong').notEmpty();
            // // req.checkBody('countryCode', 'Something went wrong').notEmpty();
            // req.checkBody('mobileNumber', 'Something went wrong').notEmpty();

            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            let signupObj = new adminRole({
                accessNumber: `ACESS${new Date().getTime()}`,
                title: req.body.title,
                description: req.body.description,
                roleNumber: `${new Date().getTime()}`,
                actions: req.body.actions,
                module: req.body.module,

            })
            let signupData = await signupObj.save()

            response.log("Role created successfully.", signupData)
            response.responseHandlerWithData(res, 200, `Account created successfully.`, signupData);

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    //======================================Role  List ===========================================// 

    adminRoleList:async (req, res) => {

        try {
            response.log("Request for get user list is==============>", req.body);
            req.checkBody('pageNumber', 'Something went wrong').notEmpty();
            req.checkBody('limit', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10,
                sort: { createdAt: -1 },
                select: { password: 0 },
                lean: true
            }
            let queryCheck = {  }

            queryCheck.deleteStatus = false

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())

                // let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 00, 000);

                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }

            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
            }

            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
            }

            if (req.body.timeframe == "All") {
                
            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "title": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "lastName": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "email": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "status": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "gender": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "nationality": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }
            let result = await adminRole.paginate(queryCheck, options)
            // for (let i = 0; i < result.docs.length; i++) {
            //     let totalOrders = await Order.find({ userId: result.docs[i]._id }).count()
            //     result.docs[i].totalOrderss = totalOrders
            // }
            response.log("Sub-Admin List Found", result)
            return response.responseHandlerWithData(res, 200, "Admin Role List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //======================================Update Status ============================================//

    updateRoleStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('roleId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await adminRole.findByIdAndUpdate({ _id: req.body.roleId }, { $set: { status: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }

            response.log("Status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // ===================================== Delete Role ================================================//

    deleteRole: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('roleId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await adminRole.findByIdAndUpdate({ _id: req.body.roleId }, { $set: { deleteStatus: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }

            response.log("Status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Role Deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // =====================================   tax and fees  ==============================================//

    updateAdminTaxAndSaveitfee: async (req, res) => {
        try {
            response.log("Rerquest for update admin detail is==========>", req.files)
            // req.checkBody('name', 'Something went wrong.').notEmpty();
            req.checkBody('adminId', 'Something went wrong.').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            let updateDetail = await Admin.findOneAndUpdate({ "userType" : "Admin" }, { $set: { tax: req.body.tax, fee:req.body.fee } }, { new: true })
            response.log("Profile updated successfully", updateDetail)

            return response.responseHandlerWithData(res, 200, "tax and fee updated ", updateDetail);

            
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // =====================================  admin details post =========================================//

    getAdminDetailss: async (req, res) => {

        try {

            let checkAdmin = await Admin.findOne({ _id: req.body.adminId })
            if (!checkAdmin) {
                response.log("Admin Id is not correct")
                return response.responseHandlerWithMessage(res, 500, 'Something went wrong');
            }
            response.log("Admin data found successfully", checkAdmin)
            return response.responseHandlerWithData(res, 200, 'Detail Found Successfully', checkAdmin);
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================== admin all role list =====================================//

    adminAllRoleList:async (req, res) => {

        try {
            response.log("Request for get user list is==============>", req.body);
            // req.checkBody('pageNumber', 'Something went wrong').notEmpty();
            // req.checkBody('limit', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            let queryCheck = {  }

            queryCheck.deleteStatus = false

            let result = await adminRole.find({deleteStatus: false})

            // let result = await adminRole.paginate(queryCheck, options)
            // for (let i = 0; i < result.docs.length; i++) {
            //     let totalOrders = await Order.find({ userId: result.docs[i]._id }).count()
            //     result.docs[i].totalOrderss = totalOrders
            // }
            response.log("Sub-Admin List Found", result)
            return response.responseHandlerWithData(res, 200, "Admin Role List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================== zoho token =====================================//
    //*/50 * * * * wget -O - -q -t 1 http://13.234.94.41:3032/api/v1/admin/refreshAcessToken

    refreshAcessToken: async (req, res) => {
        try {
            response.log('<-------------------------ZOHO TOKEN UPDATED-------------------------->');

            let result = await ZOHO.findOne()

            // var headers = {
            //     'Authorization': ''
            // };
            let refresh_token = '1000.64a5c94a8900227cc31244fc4a5ad85f.f65fc5e8eab6ec48e84024d8e122f210'
            var dataString = '{}';
            var options = {
                url: `https://accounts.zoho.in/oauth/v2/token?refresh_token=${refresh_token}&client_id=1000.3XI1BV05KX45P2BKO505S02QEFJ59R&client_secret=90b43b9795efbb70e6848fb62584fc3ee446c0a1d6&grant_type=refresh_token`,
                method: 'POST',
                // headers: headers,
                body: dataString
            };
            request(options, async function (error, res1, body) {
                if (!error && res1.statusCode == 200) {
                    // response.log('body.access_token------========>',body);
                    let data = JSON.parse(body)
                    let updateZohoToken = await ZOHO.findOneAndUpdate({ _id: result._id }, {access_token : data.access_token })
                    response.responseHandlerWithData(res, 200, `Data saved`, data);
                }else{
                    response.log(error);
                }
            });

            // let dataString = {
            //     "data": [
            //         {
            //             "Customer_ID": 'CU1867',
            //             "Customer_Location": 'Noida',
            //             "Customer_Mobile": '8923385447',
            //             "Name": 'Mobuuser test',
            //             "Customer_Since": '2022-01-24T05:11:49.355+00:00',
            //             "Email": 'mobu123@gmail.com',
            //             "Reward_Star_Status": 1,
            //             "Unused_Credits": 0
            //         }
            //     ]
            // }
            // let result = await ZOHO.findOne()
            // response.log('===========================================================================================>',dataString);

            // var headers = {
            //     'Authorization': `Zoho-oauthtoken ${result.access_token}`
            // };
            // var options = {
            //     url: `https://www.zohoapis.in/crm/v2/Customers`,
            //     method: 'POST',
            //     headers: headers,
            //     body: JSON.stringify(dataString)
            // };

            // request(options, function (error, res1, body) {
            //     if (!error ) {
            //         // let data = JSON.parse(body)
            //         response.log('===========================================================================================>',res1);
            //     }else{
            //         response.log('error===========================================================================================>',error);
            //     }
            // });
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    //*/50 * * * * wget -O - -q -t 1 http://13.234.94.41:3032/api/v1/admin/refreshDunzoAcessToken
    refreshDunzoAcessToken: async (req, res) => {
        try {
            response.log('<-------------------------DUNZO TOKEN UPDATED-------------------------->');

            let result = await DUNZO.findOne()

            // var headers = {
            //     'client-id': '660b9b8d-5c91-49f9-80a7-b632e98cde1f',
            //     'client-secret': '8450dd15-3c2f-4723-981e-6841dd1b181b',
            //     "Content-Type": "application/json"
            // };
            var headers = {
                'client-id': '515a5dd7-7f13-4efa-b840-b568deec494d',
                'client-secret': 'c78969e7-e38d-474b-928b-cd6c68b8d402',
                "Content-Type": "application/json"
            };
            // var dataString = '{}';
            var options = {
                url: `https://api.dunzo.in/api/v1/token`,
                method: 'GET',
                headers: headers,
                // body: dataString
            };
            request(options, async function (error, res1, body) {
                if (!error && res1) {
                    let data = JSON.parse(body)
                    let updateToken = await DUNZO.findOneAndUpdate({ _id: result._id }, {access_token : data.token })
                    response.responseHandlerWithData(res, 200, `Data saved`);
                }else{
                    response.log('====================>',error);
                }
            });
            
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    // ======================================== website ============================//
    latestOrderForWebsite: async (req, res) => {

        try {
            let htmlData
            let arrData
            let dataArray = []
            let getData = await Order.aggregate([
                {
                    $sort: {
                        createdAt: -1
                      }
                },
                {
                    $lookup:
                    {
                        from: 'products',
                        localField: 'orderData.productId',
                        foreignField: '_id',
                        as: 'productData'
                    }
                },
                {
                    $unwind: {
                        path: "$productData",
                        // preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        'name':'$productData.foodName',
                        'foodImage':'$productData.foodImage',
                        'price':'$productData.price',
                        'offeredPrice':'$productData.offeredPrice'
                    }
                },
                {
                    $match:{
                        price : {
                            $gte : 50
                        },
                        offeredPrice : {
                            $gt : 0
                          }
                    }
                },
                {
                   $limit:10
                }
            ])
            if (getData) {
                getData = getData.map(d => {
                    return{
                        name : d.name,
                        foodImage : d.foodImage,
                        price : d.price.toFixed(0),
                        // offeredPrice : d.offeredPrice > 0 ? d.offeredPrice.toFixed(0) : d.price.toFixed(0)
                        offeredPrice : d.offeredPrice 
                    }
                })
                // if (getData[0].offeredPrice > 0) {
                //     htmlData = `<strike>₹ ${getData[0].price}</strike>
                //     <strong>₹ ${getData[0].offeredPrice}</strong>`
                // } else {
                //     htmlData = `<strong>₹ ${getData[0].price}</strong>`
                // }
                for (let i = 0; i < getData.length; i++) {
                    if(getData[i].offeredPrice > 0){
                        htmlData = `<strike>₹ ${getData[i].price}</strike>
                    <strong>₹ ${getData[i].offeredPrice}</strong>`
                    }else{
                        htmlData = `<strong>₹ ${getData[i].price}</strong>`
                    }
                    arrData = `<div class="item">
                    <div class="ProductBox">
                        <figure><img src=${getData[i].foodImage} /></figure>
                        <figcaption>
                        ${htmlData}
                        </figcaption>
                    </div>
                    </div>`
                    dataArray.push(arrData)
                }
                let finalData = [
                    `<div class="item">
                    <div class="ProductBox">
                        <figure><img src=${getData[0].foodImage} /></figure>
                        <figcaption>
                        <strike>₹ ${getData[0].price}</strike>
                        <strong>₹ ${getData[0].offeredPrice}</strong>
                        </figcaption>
                    </div>
                    </div>`,
                    `<div class="item">
                    <div class="ProductBox">
                        <figure><img src=${getData[1].foodImage} /></figure>
                        <figcaption>
                            <strike>₹ ${getData[1].price}</strike>
                            <strong>₹ ${getData[1].offeredPrice}</strong>
                        </figcaption>
                    </div>
                    </div>`,
                    `<div class="item">
                    <div class="ProductBox">
                        <figure><img src=${getData[2].foodImage} /></figure>
                        <figcaption>
                            <strike>₹ ${getData[2].price}</strike>
                            <strong>₹ ${getData[2].offeredPrice}</strong>
                        </figcaption>
                    </div>
                    </div>`,
                    `<div class="item">
                    <div class="ProductBox">

                        <figure><img src=${getData[3].foodImage} /></figure>
                        <figcaption>
                            <strike>₹ ${getData[3].price}</strike>
                            <strong>₹ ${getData[3].offeredPrice}</strong>
                        </figcaption>
                    </div>
                    </div>`,
                    `<div class="item">
                    <div class="ProductBox">

                        <figure><img src=${getData[4].foodImage} /></figure>
                        <figcaption>
                            <strike>₹ ${getData[4].price}</strike>
                            <strong>₹ ${getData[4].offeredPrice}</strong>
                        </figcaption>
                    </div>
                    </div>`,
                    `<div class="item">
                    <div class="ProductBox">

                        <figure><img src=${getData[5].foodImage} /></figure>
                        <figcaption>
                            <strike>₹ ${getData[5].price}</strike>
                            <strong>₹ ${getData[5].offeredPrice}</strong>
                        </figcaption>
                    </div>
                    </div>`,
                    `<div class="item">
                    <div class="ProductBox">

                        <figure><img src=${getData[6].foodImage} /></figure>
                        <figcaption>
                            <strike>₹ ${getData[6].price}</strike>
                            <strong>₹ ${getData[6].offeredPrice}</strong>
                        </figcaption>
                    </div>
                    </div>`,
                    `<div class="item">
                    <div class="ProductBox">
                        <figure><img src=${getData[7].foodImage} /></figure>
                        <figcaption>
                            <strike>₹ ${getData[7].price}</strike>
                            <strong>₹ ${getData[7].offeredPrice}</strong>
                        </figcaption>
                    </div>
                    </div>`,
                    `<div class="item">
                    <div class="ProductBox">

                        <figure><img src=${getData[8].foodImage} /></figure>
                        <figcaption>
                            <strike>₹ ${getData[8].price}</strike>
                            <strong>₹ ${getData[8].offeredPrice}</strong>
                        </figcaption>
                    </div>
                    </div>`,
                    `<div class="item">
                    <div class="ProductBox">

                        <figure><img src=${getData[9].foodImage} /></figure>
                        <figcaption>
                            <strike>₹ ${getData[9].price}</strike>
                            <strong>₹ ${getData[9].offeredPrice}</strong>
                        </figcaption>
                    </div>
                    </div>`
                ]
                return response.responseHandlerWithData(res, 200, "List found successfully", dataArray);   
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================CT=====================================//
    getCtCreditsDetails: async (req, res) => {

        try {
            let checkAdmin = await Admin.findOne({ _id: req.body.adminId })
            if (!checkAdmin) {
                response.log("Admin Id is not correct")
                return response.responseHandlerWithMessage(res, 500, 'Something went wrong');
            }
            response.log("Admin data found successfully", checkAdmin)
            let data = {
                credits : checkAdmin.ctCredits,
                expiryDate : checkAdmin.ctCreditsExpiryDays
            }
            return response.responseHandlerWithData(res, 200, 'Detail Found Successfully', data);
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // =====================================   CT details update   ==============================================//

    ctDetailsUpdate: async (req, res) => {
        try {
            response.log("Rerquest for update admin detail is==========>", req.files)
            req.checkBody('credits', 'Something went wrong.').notEmpty();
            req.checkBody('expiryDate', 'Something went wrong.').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            let updateDetail = await Admin.findOneAndUpdate({
                "userType": "Admin"
            }, {
                $set: {
                    ctCredits: req.body.credits,
                    ctCreditsExpiryDays: req.body.expiryDate
                }
            }, {
                new: true
            })
            response.log("Data updated successfully", updateDetail)

            return response.responseHandlerWithData(res, 200, "Settings updated successfully.", updateDetail);

            
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //0 7 * * * wget -O - -q -t 1 http://13.234.94.41:3032/api/v1/admin/ctCreditsGiven
    //0 11 * * * wget -O - -q -t 1 http://13.234.94.41:3032/api/v1/admin/ctCreditsGiven
    //0 15 * * * wget -O - -q -t 1 http://13.234.94.41:3032/api/v1/admin/ctCreditsGiven
    //0 19 * * * wget -O - -q -t 1 http://13.234.94.41:3032/api/v1/admin/ctCreditsGiven
    //0 23 * * * wget -O - -q -t 1 http://13.234.94.41:3032/api/v1/admin/ctCreditsGiven
    //0 3 * * * wget -O - -q -t 1 http://13.234.94.41:3032/api/v1/admin/ctCreditsGiven

    ctCreditsGiven: async (req, res) => {
        try {
            let findCredits = await CT_CREDITS.aggregate([{
                $match: {
                    isCreditSend : false
                }
            }])
            if(findCredits && findCredits.length > 0){
                response.log("CT credits============================>",findCredits.length)
                for (x of findCredits) {

                    let mainAdmin = await Admin.findOne({ userType: "Admin" })
                    let subAdminId = (mainAdmin.creditNumber)

                    let user = await User.findOne({ "_id": x.user })
                    if(user){
                        let obj = new Coins({
                            userId: ObjectId(user._id),
                            creditNumber: "CR" + subAdminId,
                            creditTitle: 'Award Credits',
                            creditType: 'Direct',
                            remaningFrequency: x.credits,
                            // totalFrequency: req.body.totalFrequency,
                            creditAmount: x.credits,
                            description: 'Award Credits',
                            expiryDate: x.expiryDate
                        })
                        await obj.save()    
                        
                        let subAdminIds = (mainAdmin.creditNumber) + 1
                        await Admin.findByIdAndUpdate({ _id: mainAdmin._id }, { $set: { "creditNumber": subAdminIds } }, { new: true, lean: true })

                        let totalCreaditedAmount = Number(user.walletAmount) + Number(x.credits)
                        await User.findOneAndUpdate({ _id: ObjectId(user._id) }, { $set: { "walletAmount": totalCreaditedAmount } }, { new: true, lean: true })

                        await CT_CREDITS.findOneAndUpdate({ _id: x._id }, { $set: { isCreditSend : true } }, { new: true, lean: true })

                        let notiTitle = `${user.name}! You received ${x.credits} amount in your wallet.`
                        let notiMessage = `${user.name}! You received ${x.credits} amount in your wallet and it would be expired ${x.expiryDate}`
                        let notiType = 'credit'
                        let newId = user._id
                        let deviceToken = user.deviceToken
                        let deviceType = user.deviceType
                          
                        notificationFunction.sendNotificationForAndroid(deviceToken,notiTitle, notiMessage, notiType, newId, deviceType, (error10, result10) => {
                              response.log("Notification Sent");
                        })

                          
                        //zoho
                        let userUpdated = await User.findOne({ "_id": x.user })
                        response.log('===========================================ZOHO Works================================================');
                        let dataString = {
                            "data": [
                                {
                                    "Unused_Credits": userUpdated.walletAmount
                                }
                            ]
                        }
                        let result = await ZOHO.findOne()
                        var headers = {
                            'Authorization': `Zoho-oauthtoken ${result.access_token}`
                        };
                        var options = {
                            url: `https://www.zohoapis.in/crm/v2/Customers/${user.zohoId}`,
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
                    }
                }
                return response.responseHandlerWithData(res, 200, `Data found successfully`);
            }else{
                return response.responseHandlerWithData(res, 200, `Data not found.`);
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //Delivery Fee

    getDeliveryDetails: async (req, res) => {

        try {
            let getDetail = await DELIVERY_FEE.findOne({ type: 'saveEat_delivery_fees' })
            if (getDetail) {
                return response.responseHandlerWithData(res, 200, 'Data Found', getDetail);
            }
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    updateDeliveryFee: async (req, res) => {
        try {
            let new_values = JSON.parse(JSON.stringify({
                zero_one: req.body.zero_one || undefined,
                one_two: req.body.one_two || undefined,
                two_three: req.body.two_three || undefined,
                three_four: req.body.three_four || undefined,
                four_five: req.body.four_five || undefined,
                five_six: req.body.five_six || undefined,
                six_seven: req.body.six_seven || undefined,
                seven_eight: req.body.seven_eight || undefined,
                eight_nine: req.body.eight_nine || undefined,
                nine_ten: req.body.nine_ten || undefined
            }))     

            let updateDetail = await DELIVERY_FEE.findOneAndUpdate({
                type: 'saveEat_delivery_fees'
            }, new_values)
            response.log("Data updated successfully", updateDetail)

            return response.responseHandlerWithData(res, 200, "Delivery fees updated successfully.", updateDetail);
            
        } catch (error) {
            response.log("Error  is============>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    
}






