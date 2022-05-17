const User = require('../models/userModel.js');
// const Driver = require('../models/driverModel.js');
const Restaurant = require('../models/brandModel.js');
const Brand = require('../models/brandModel.js');
const StaticContent = require('../models/staticModel.js');
const Notification = require('../models/notificationModel.js');
const Cuisine = require('../models/cuisineModel.js');
const Cuisinecategory = require('../models/cuisineCategoryModel.js');
const Products = require('../models/productModel.js');

const Holiday = require('../models/holidayModel.js');
const DeliverySlots = require('../models/openingHoursModel.js');
const Banner = require('../models/bannerModel.js');
const { ObjectId } = require('mongodb');
const func = require('../utils/commonFun.js');
const SendMail = require('../utils/sendMail.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../config/config");
const moment = require('moment')
const Admin = require('../models/adminModel.js')
const _ = require('lodash');
const response = require("../utils/httpResponseMessage");
const Fileupload = require('../utils/fileUpload.js');
const notificationFunction = require('../utils/notification.js');
const salt = bcrypt.genSaltSync(10);
const fs = require('fs');
const fileSystem = require('file-system');
const path = require('path');
const Product = require('../models/productModel.js');
const Menu = require('../models/menuModel.js');
const Promocode = require('../models/promoCodeModel.js');
var ISODate = require("isodate");

// const Branch = require('../models/branchModel.js');
var QRCode = require('qrcode');

const date = require('date-and-time');
const excel = require('exceljs');

// const Area = require('../models/areaModel.js');
const Dietary = require('../models/dietaryNeedsModel.js');
const Sendnotification = require('../utils/notification.js');
const Order = require('../models/productOrderModel.js');

const sellItems = require('../models/sellingModel.js');

const badgesEarn = require('../models/badgeEarningModel.js');

const badges = require('../models/badgeModel.js');



const Coins = require('../models/creditModel.js');
const Refund = require('../models/refundModel.js');

const Rewards = require('../models/rewardModel.js')

const Stars = require('../models/starModel.js')


const CouponUsed = require('../models/claimCouponModel.js')

const Favorites = require('../models/favouriteModel.js')

const Productearning = require('../models/productEarningModel.js')

// const Sendnotification = require('../utils/notification.js');

const ZOHO = require('../models/zohoModel.js')



var request = require('request');


module.exports = {

    //=======================================User List=============================//

    getUserList: async (req, res) => {
        try {
        
            let result = await User.find({mobileNumber:{$nin:['8447813728','7011394069','9990643663','9412861870','9756460420','8077796487','9819634294']}}).skip(1000).limit(500);
            result = result.map(
                d => {
                  return {
                    "objectId": d._id,
                    "identity": d.userNumber,
                    "type": "profile",
                    "profileData": {
                        "Customer Name": d.name,
                        "email": d.email,
                        "countycode": d.countryCode,
                        "mobilenumber": d.mobileNumber,
                        "devicetype": d.deviceType,
                        "devicetoken": d.deviceToken,
                        "address": d.address,
                        "latitude": d.latitude,
                        "longitude": d.longitude,
                        "distance": d.distance,
                        "Gender": d.gender 
                    }
                  }
                }          
              ) 
            return response.responseHandlerWithData(res, 200, "User List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    userList: async (req, res) => {
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
            let queryCheck = { userType: 'User' }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())

                // let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);

                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lt: endDates }
            }

            if(req.body.timeframe == "All"){

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

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "firstName": { $regex:req.body.search, $options: 'i' } },
                        { "userNumber": { $regex:req.body.search, $options: 'i' } },
                        { "name": { $regex: req.body.search, $options: 'i' } },
                        { "lastName": { $regex:req.body.search, $options: 'i' } },
                        { "email": { $regex: req.body.search, $options: 'i' } },
                        { "mobileNumber": { $regex: req.body.search, $options: 'i' } },
                        { "status": { $regex: req.body.search, $options: 'i' } },
                        { "address": { $regex: req.body.search, $options: 'i' } },
                        { "gender": { $regex: req.body.search, $options: 'i' } },
                        { "nationality": { $regex: req.body.search, $options: 'i' } },
                    ]
                }]
            }
            let result = await User.paginate(queryCheck, options)
            for (let i = 0; i < result.docs.length; i++) {
                let totalOrders = await Order.find({ userId: result.docs[i]._id, status: "Delivered" }).count()
                result.docs[i].totalOrderss = totalOrders

                let cancledOrders = await Order.find({ userId: result.docs[i]._id, status: "Cancelled" }).count()
                result.docs[i].cancledOrderss = cancledOrders
            }
            response.log("User List Found", result)
            return response.responseHandlerWithData(res, 200, "User List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    userDownloadList: async (req, res) => {
        try {
            response.log("Request for get user list is==============>", req.body);
            // req.checkBody('pageNumber', 'Something went wrong').notEmpty();
            // req.checkBody('limit', 'Something went wrong').notEmpty();
            // const errors = req.validationErrors();
            // if (errors) {
            //     let error = errors[0].msg;
            //     response.log("Field is missing")
            //     return response.responseHandlerWithMessage(res, 503, error);
            // }
            let options = {
                // page: Number(req.body.pageNumber) || 1,
                limit: 1000000,
                sort: { createdAt: -1 },
                // select: { password: 0 },
                lean: true
            }
            let queryCheck = { userType: 'User' }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())

                // let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);

                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }
            
            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lt: endDates }
            }

            if(req.body.timeframe == "All"){

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

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "firstName": { $regex:req.body.search, $options: 'i' } },
                        { "name": { $regex: req.body.search, $options: 'i' } },
                        { "lastName": { $regex:req.body.search, $options: 'i' } },
                        { "email": { $regex: req.body.search, $options: 'i' } },
                        { "mobileNumber": { $regex: req.body.search, $options: 'i' } },
                        { "status": { $regex: req.body.search, $options: 'i' } },
                        { "address": { $regex: req.body.search, $options: 'i' } },
                        { "gender": { $regex: req.body.search, $options: 'i' } },
                        { "nationality": { $regex: req.body.search, $options: 'i' } },
                    ]
                }]
            }
            let result = await User.paginate(queryCheck, options)
            for (let i = 0; i < result.docs.length; i++) {
                let totalOrders = await Order.find({ userId: result.docs[i]._id, status: "Delivered" }).count()
                result.docs[i].totalOrderss = totalOrders

                let cancledOrders = await Order.find({ userId: result.docs[i]._id, status: "Cancelled" }).count()
                result.docs[i].cancledOrderss = cancledOrders
            }
            result = result.docs.map(
                d => {
                  return {
                    userNumber : d.userNumber,
                    name : d.name,
                    email : d.email,
                    mobileNumber : d.mobileNumber,
                    totalOrderss : d.totalOrderss,
                    cancledOrderss : d.cancledOrderss,
                    status :d.status,
                    walletAmount : d.walletAmount,
                    createdAt: date.format(d.createdAt, "DD/MM/YYYY HH:mm")
                  }
                }          
              )  
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Sheet1'); //creating worksheet
            //  WorkSheet Header
            worksheet.columns = [
            {
                header: 'Customer ID',
                key: 'userNumber',
                width: 20
            },
            {
                header: 'Name',
                key: 'name',
                width: 20
            },
            {
                header: 'Contact Email',
                key: 'email',
                width: 20
            },
            {
                header: 'Contact Number',
                key: 'mobileNumber',
                width: 20
            },
            {
                header: 'Customer Since',
                key: 'createdAt',
                width: 20
            },
            {
                header: 'Completed Orders',
                key: 'totalOrderss',
                width: 20
            },
            {
                header: 'Cancelled Orders',
                key: 'cancledOrderss',
                width: 20
            },
            {
                header: 'Order Status',
                key: 'status',
                width: 20
            },
            {
                header: 'Credits',
                key: 'walletAmount',
                width: 20
            }    
            ];
            //Add Array Rows
            worksheet.addRows(result);    
            //create file
            let file = await workbook.xlsx.writeFile(`userList.xlsx`)
            let link = `https://saveeat.in:3035/api/v1/adminUser/getUserListFile/userList.xlsx`
            setTimeout(() => {
                return response.responseHandlerWithData(res, 200, "Link", link);
            }, 2000);
            // return response.responseHandlerWithData(res, 200, "Link", link);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    getUserListFile: async (req, res) => {
        try {
          var filePath = path.join(__dirname, '../' + req.params.fileName);
          console.log("File path is===========>", filePath);
          res.writeHead(200, {
              'Content-Type': 'application/vnd.ms-excel',
          });
          var readStream = fs.createReadStream(filePath);
          readStream.pipe(res);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //====================================== Customer Details======================//
    customersDetail: async (req, res) => {
        try {
            response.log("Request for get user list is==============>", req.body);


            let userDetails = await User.aggregate([
                {
                    $match: {
                        _id: ObjectId(req.body.userId)
                    }
                },
                {
                    $lookup:
                    {
                        from: "productorders",
                        localField: "_id",
                        foreignField: "userId",
                        as: "orderDetail"
                    }
                },

                {
                    $project: {
                        '_id': 1,
                        'businessName': 1,
                        'adminVerificationStatus': 1,
                        'mobileNumber': 1,
                        'name': 1,
                        'status': 1,
                        'email': 1,
                        'empNumber': 1,
                        'address': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'userNumber': 1,
                        'countryCode': 1,
                        'totalOrders': 1,
                        'totalCancelledOrders': 1,
                        'foodRescure': 1,
                        'savedMoney': 1,
                        'walletAmount': 1,
                        'profilePic': 1,
                        'orderDetail':1,
                    }
                },

            ])

            var savedAmount = 0
            var totalAmountUsed = 0
            var totalSavedFood = 0
            var avreageStar = 0
            var allSavedFood  = 0
            var userStar = 0
            for(let i = 0; i < userDetails.length; i++){

                let totalRescuedItems = 0
                let itemsRes = await Productearning.aggregate([
                    {
                        $match: {
                            userId: ObjectId(req.body.userId)
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

                for (let j = 0 ; j < userDetails[i].orderDetail.length; j++){
                    if(userDetails[i].orderDetail[j].status== 'Delivered' ){
                        savedAmount += userDetails[i].orderDetail[j].saveAmount
                    }
                    // console.log("userDetails[i].orderDetail[j].savedAmount==>",userDetails[i].orderDetail[j])
                    totalAmountUsed += userDetails[i].orderDetail[j].total

                    totalSavedFood += userDetails[i].orderDetail[j].rescusedFood

                    for(let m = 0; m < userDetails[i].orderDetail[j].orderData.length; m++ ){
                        // allSavedFood += userDetails[i].orderDetail[j].orderData[m].productData.
                    }
                    
                }
                

                let userBadges = await badgesEarn.aggregate([
                    {
                        $match: {
                            userId: ObjectId(req.body.userId)
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "badges",
                            localField: "badgeId",
                            foreignField: "_id",
                            as: "badgeDetail"
                        }
                    },
    
                    {
                        $project: {
                            '_id': 1,
                            'badgeDetail': 1,
                            'day':1,
                            'month':1,
                            'year':1,
                            'createdAt':1,
                        }
                    },
    
                ])

                let rescuseFood = await Order.aggregate([
                    {
                        $match: {
                            userId:  ObjectId(req.body.userId),
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




                let userTotalOrder = await Order.find({"userId":ObjectId(req.body.userId)}).count()
                let completedUserOrder = await Order.find({"userId":ObjectId(req.body.userId),"status" : "Delivered"}).count()
                let canclledUserOrder = await Order.find({"userId":ObjectId(req.body.userId),"status" : "Cancelled"}).count()
                let userlatDateOrder = await Order.find({"userId":ObjectId(req.body.userId)}).sort( { "createdAt": -1 } ).limit(1)
                let userTotalStarGiven = await Stars.find({"userId":ObjectId(req.body.userId)})

                

                let userRaiting = await Stars.findOne({"userId":ObjectId(req.body.userId)})

                let userRewardGiven = await Rewards.find({"userId":ObjectId(req.body.userId)})

                
                if(userRaiting){
                    userStar =  userRaiting.star
                }
                

                if(userTotalStarGiven.length >0){
                    for (let k = 0; k< userTotalStarGiven.length; k++ ){

                        let totalDoc = userTotalStarGiven.length
                        console.log("totalDoc===>",totalDoc)
                        let totalStars = 0
                        totalStars += Number(userTotalStarGiven[k].star)
                        avreageStar = (totalStars) / totalDoc
                        
                    }
                }else{
                    avreageStar = 0
                }




                

                userDetails[i].userRewardGiven = userRewardGiven
                userDetails[i].userBadges = userBadges
                userDetails[i].userlatDateOrder = userlatDateOrder
                userDetails[i].userTotalOrder = userTotalOrder
                userDetails[i].completedUserOrder = completedUserOrder
                userDetails[i].canclledUserOrder = canclledUserOrder
                userDetails[i].savedAmount = savedAmount
                userDetails[i].totalAmountUsed = totalAmountUsed
                userDetails[i].totalSavedFood = totalSavedFood
                userDetails[i].noSavedFood = totalSavedFood
                userDetails[i].avreageStar = avreageStar
                userDetails[i].userRaiting = userStar

                userDetails[i].totalRescuedItems = totalRescuedItems

                userDetails[i].rescuseFoodFinal = rescuseFoodFinal


                


                

                

            }


            return response.responseHandlerWithData(res, 200, "User Details Found", userDetails);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },



    //========================================= Restaurnt List======================//

    restaurantsList: async (req, res) => {
        try {

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = { "userType": "Brand" }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
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

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [

                        { "businessName": { $regex:  req.body.search, $options: 'i' } },
                        { "empNumber": { $regex:  req.body.search, $options: 'i' } },
                        { "mobileNumber": { $regex:  req.body.search, $options: 'i' } },
                        { "address": { $regex:  req.body.search, $options: 'i' } },
                    ]
                }]
            }

            console.log("queryCheck==>", queryCheck)

            if (req.body.fullPrice == "fullPrice") {

                let totalRestaurant = await Restaurant.find({ "userType": "Brand" }).count()

                let restaurantList = await Restaurant.aggregate([
                    {
                        $match: queryCheck
                    },
                    {
                        $lookup: {
                            from: "menus",
                            let: { brandId: '$_id' },
                            pipeline: [
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $and:
                                                [
                                                    { $eq: ["$brandId", "$$brandId"] },

                                                ]
                                        }

                                    }


                                },
                                { $match: { "status": "Active" } },
                            ],

                            as: "menuDetails"
                        }
                    },
                    {
                        $lookup: {
                            from: "menus",
                            let: { brandId: '$_id' },
                            pipeline: [
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $and:
                                                [
                                                    { $eq: ["$brandId", "$$brandId"] },

                                                ]
                                        }

                                    }


                                },
                                // { $match: { "status": "Active" } },
                            ],

                            as: "menuDetailsCount"
                        }
                    },
                    {
                        $project: {
                            '_id': 1,
                            'businessName': 1,
                            'adminVerificationStatus': 1,
                            'mobileNumber': 1,
                            'name': 1,
                            'status': 1,
                            'hiddenCode':1,
                        'wallet':1,
                            'hiddenStatus':1,
                            'empNumber': 1,
                            'address': 1,
                            'updatedAt': 1,
                            'createdAt': 1,
                            'menuDetails.menuName': 1,
                            'menuDetails.status': 1,
                        }
                    },
                    // {
                    //     $match: {
                    //         "menuDetails.status":"Active"
                    //     }
                    // },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },

                ])

                for (let i = 0; i < restaurantList.length; i++) {
                    let menuIdArr = []


                    let totalmenus = await Menu.find({ "brandId": ObjectId(restaurantList[i]._id) })

                    console.log("totalmenus==>", totalmenus)

                    for (let l = 0; l < totalmenus.length; l++) {
                        menuIdArr.push(ObjectId(totalmenus[l]._id))
                    }
                    
                    let favorites = await Favorites.find({ "brandId": ObjectId(restaurantList[i]._id) }).count()
                    restaurantList[i].favorites = favorites

                    let totalOrder = await Order.find({ "storeId": ObjectId(restaurantList[i]._id) }).count()
                    restaurantList[i].totalOrder = totalOrder

                    let totalOrder1 = await Order.find({ "storeId": ObjectId(restaurantList[i]._id), status: "Delivered" }).count()
                    restaurantList[i].orderDone = totalOrder1

                    console.log("menuIdArr==>", menuIdArr)

                    let totalRestaurant = await Products.find({ "sellingStatus": true, "menuId": { "$in": menuIdArr } }).count()

                    restaurantList[i].SellCount = totalRestaurant

                    let totalrevenue = 0

                    let revenueCheck = await Order.find({ "storeId": ObjectId(restaurantList[i]._id) })
                    for(let j = 0 ; j< revenueCheck.length;j++){
                        totalrevenue += revenueCheck[j].orderFullTotal
                    }

                    restaurantList[i].totalrevenue = totalrevenue


                }

                return res.send({ response_code: 200, message: "Restaurant List", Data: restaurantList, TotalCount: totalRestaurant })

            }

            let totalRestaurant = await Restaurant.find(queryCheck).count()


            let restaurantList = await Restaurant.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup: {
                        from: "menus",
                        let: { brandId: '$_id' },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$brandId", "$$brandId"] },

                                            ]
                                    }

                                }


                            },
                            { $match: { "status": "Active" } },
                        ],

                        as: "menuDetails"
                    }
                },
                {
                    $lookup: {
                        from: "menus",
                        let: { brandId: '$_id' },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$brandId", "$$brandId"] },

                                            ]
                                    }

                                }


                            },
                            // { $match: { "status": "Active" } },
                        ],

                        as: "menuDetailsCount"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'businessName': 1,
                        'adminVerificationStatus': 1,
                        'mobileNumber': 1,
                        'name': 1,
                        'status': 1,
                        'empNumber': 1,
                        'hiddenCode':1,
                        'hiddenStatus':1,
                        'wallet':1,
                        'address': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'menuDetails.menuName': 1,
                        'menuDetails.status': 1,
                    }
                },
                // {
                //     $match: {
                //         "menuDetails.status":"Active"
                //     }
                // },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])

            for (let i = 0; i < restaurantList.length; i++) {
                let menuIdArr = []


                let totalmenus = await Menu.find({ "brandId": ObjectId(restaurantList[i]._id) })

                console.log("totalmenus==>", totalmenus)

                for (let l = 0; l < totalmenus.length; l++) {
                    menuIdArr.push(ObjectId(totalmenus[l]._id))
                }

                console.log("menuIdArr==>", menuIdArr)


                let totalOrder = await Order.find({ "storeId": ObjectId(restaurantList[i]._id) }).count()
                restaurantList[i].totalOrder = totalOrder

                let totalOrder1 = await Order.find({ "storeId": ObjectId(restaurantList[i]._id), status: "Delivered" }).count()
                restaurantList[i].orderDone = totalOrder1

                 let favoritess = await Favorites.find({ "brandId": ObjectId(restaurantList[i]._id) }).count()
                 restaurantList[i].favorites = favoritess




                let totalRestaurant = await Products.find({ "sellingStatus": true, "menuId": { "$in": menuIdArr } }).count()

                restaurantList[i].SellCount = totalRestaurant

                let totalrevenue = 0

                let revenueCheck = await Order.find({ "storeId": ObjectId(restaurantList[i]._id) })
                for(let j = 0 ; j< revenueCheck.length;j++){
                    totalrevenue += revenueCheck[j].orderFullTotal
                }

                restaurantList[i].totalrevenue = totalrevenue

            }

            return res.send({ response_code: 200, message: "Restaurant List", Data: restaurantList, TotalCount: totalRestaurant })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    restaurantsDownloadList: async (req, res) => {
        try {

            // var skip = 0
            // var limit = 10
            // if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
            //     skip = (Number(req.body.pageNumber) - 1) * 10
            // }
            // if (req.body.limit && Number(req.body.limit) != 0) {
            //     limit = Number(req.body.limit)
            // }


            // let options = {
            //     page: Number(req.body.pageNumber) || 1,
            //     limit: Number(req.body.limit) || 50,
            //     sort: { createdAt: -1 },
            // }
            let queryCheck = { "userType": "Brand" }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
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

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [

                        { "businessName": { $regex:  req.body.search, $options: 'i' } },
                        { "mobileNumber": { $regex:  req.body.search, $options: 'i' } },
                        { "address": { $regex:  req.body.search, $options: 'i' } },
                    ]
                }]
            }

            console.log("queryCheck==>", queryCheck)

            if (req.body.fullPrice == "fullPrice") {

                let totalRestaurant = await Restaurant.find({ "userType": "Brand" }).count()

                let restaurantList = await Restaurant.aggregate([
                    {
                        $match: queryCheck
                    },
                    {
                        $lookup: {
                            from: "menus",
                            let: { brandId: '$_id' },
                            pipeline: [
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $and:
                                                [
                                                    { $eq: ["$brandId", "$$brandId"] },

                                                ]
                                        }

                                    }


                                },
                                { $match: { "status": "Active" } },
                            ],

                            as: "menuDetails"
                        }
                    },
                    {
                        $lookup: {
                            from: "menus",
                            let: { brandId: '$_id' },
                            pipeline: [
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $and:
                                                [
                                                    { $eq: ["$brandId", "$$brandId"] },

                                                ]
                                        }

                                    }


                                },
                                // { $match: { "status": "Active" } },
                            ],

                            as: "menuDetailsCount"
                        }
                    },
                    {
                        $project: {
                            '_id': 1,
                            'businessName': 1,
                            'adminVerificationStatus': 1,
                            'mobileNumber': 1,
                            'name': 1,
                            'status': 1,
                            'hiddenCode':1,
                            'hiddenStatus':1,
                            'empNumber': 1,
                            'address': 1,
                            'updatedAt': 1,
                            'createdAt': 1,
                            'menuDetails.menuName': 1,
                            'menuDetails.status': 1,
                        }
                    },
                    // {
                    //     $match: {
                    //         "menuDetails.status":"Active"
                    //     }
                    // },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },

                ])

                for (let i = 0; i < restaurantList.length; i++) {
                    let menuIdArr = []


                    let totalmenus = await Menu.find({ "brandId": ObjectId(restaurantList[i]._id) })

                    console.log("totalmenus==>", totalmenus)

                    for (let l = 0; l < totalmenus.length; l++) {
                        menuIdArr.push(ObjectId(totalmenus[l]._id))
                    }
                    
                    let favorites = await Favorites.find({ "brandId": ObjectId(restaurantList[i]._id) }).count()
                    restaurantList[i].favorites = favorites

                    let totalOrder = await Order.find({ "storeId": ObjectId(restaurantList[i]._id) }).count()
                    restaurantList[i].totalOrder = totalOrder

                    let totalOrder1 = await Order.find({ "storeId": ObjectId(restaurantList[i]._id), status: "Delivered" }).count()
                    restaurantList[i].orderDone = totalOrder1

                    console.log("menuIdArr==>", menuIdArr)

                    let totalRestaurant = await Products.find({ "sellingStatus": true, "menuId": { "$in": menuIdArr } }).count()

                    restaurantList[i].SellCount = totalRestaurant

                    let totalrevenue = 0

                    let revenueCheck = await Order.find({ "storeId": ObjectId(restaurantList[i]._id) })
                    for(let j = 0 ; j< revenueCheck.length;j++){
                        totalrevenue += revenueCheck[j].orderFullTotal
                    }

                    restaurantList[i].totalrevenue = totalrevenue


                }

                return res.send({ response_code: 200, message: "Restaurant List", Data: restaurantList, TotalCount: totalRestaurant })

            }

            let totalRestaurant = await Restaurant.find(queryCheck).count()


            let restaurantList = await Restaurant.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup: {
                        from: "menus",
                        let: { brandId: '$_id' },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$brandId", "$$brandId"] },

                                            ]
                                    }

                                }


                            },
                            { $match: { "status": "Active" } },
                        ],

                        as: "menuDetails"
                    }
                },
                {
                    $lookup: {
                        from: "menus",
                        let: { brandId: '$_id' },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$brandId", "$$brandId"] },

                                            ]
                                    }

                                }


                            },
                            // { $match: { "status": "Active" } },
                        ],

                        as: "menuDetailsCount"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'businessName': 1,
                        'adminVerificationStatus': 1,
                        'mobileNumber': 1,
                        'name': 1,
                        'status': 1,
                        'empNumber': 1,
                        'hiddenCode':1,
                        'hiddenStatus':1,
                        'address': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'menuDetails.menuName': 1,
                        'menuDetails.status': 1,
                    }
                },
                // {
                //     $match: {
                //         "menuDetails.status":"Active"
                //     }
                // },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                // { $skip: skip },
                // { $limit: limit },
            ])

            for (let i = 0; i < restaurantList.length; i++) {
                let menuIdArr = []


                let totalmenus = await Menu.find({ "brandId": ObjectId(restaurantList[i]._id) })

                console.log("totalmenus==>", totalmenus)

                for (let l = 0; l < totalmenus.length; l++) {
                    menuIdArr.push(ObjectId(totalmenus[l]._id))
                }

                console.log("menuIdArr==>", menuIdArr)


                let totalOrder = await Order.find({ "storeId": ObjectId(restaurantList[i]._id) }).count()
                restaurantList[i].totalOrder = totalOrder

                let totalOrder1 = await Order.find({ "storeId": ObjectId(restaurantList[i]._id), status: "Delivered" }).count()
                restaurantList[i].orderDone = totalOrder1

                 let favoritess = await Favorites.find({ "brandId": ObjectId(restaurantList[i]._id) }).count()
                 restaurantList[i].favorites = favoritess




                let totalRestaurant = await Products.find({ "sellingStatus": true, "menuId": { "$in": menuIdArr } }).count()

                restaurantList[i].SellCount = totalRestaurant

                let totalrevenue = 0

                let revenueCheck = await Order.find({ "storeId": ObjectId(restaurantList[i]._id) })
                for(let j = 0 ; j< revenueCheck.length;j++){
                    totalrevenue += revenueCheck[j].orderFullTotal
                }

                restaurantList[i].totalrevenue = totalrevenue

            }
            restaurantList = restaurantList.map(
                d => {
                  return {
                    empNumber : d.empNumber,
                    businessName : d.businessName,
                    mobileNumber : d.mobileNumber,
                    address : d.address,
                    menuDetails : d.menuDetails.length>0 ? d.menuDetails[0].menuName : '',
                    SellCount : d.SellCount,
                    orderDone :d.orderDone,
                    favorites : d.favorites,
                    totalrevenue : d.totalrevenue,
                    itemsSold : 0
                    // createdAt: date.format(d.createdAt, "DD/MM/YYYY HH:mm")
                  }
                }          
            )
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Sheet1'); //creating worksheet
            //  WorkSheet Header
            worksheet.columns = [
            {
                header: 'Brand ID',
                key: 'empNumber',
                width: 20
            },
            {
                header: 'Brand Name',
                key: 'businessName',
                width: 20
            },
            {
                header: 'Contact Number',
                key: 'mobileNumber',
                width: 20
            },
            {
                header: 'Location',
                key: 'address',
                width: 20
            },
            {
                header: 'Menu Added',
                key: 'menuDetails',
                width: 20
            },
            {
                header: 'Items for Sale',
                key: 'SellCount',
                width: 20
            },
            {
                header: 'Items Sold',
                key: 'itemsSold',
                width: 20
            },
            {
                header: 'Total Orders',
                key: 'orderDone',
                width: 20
            },
            {
                header: 'Restaurant Followers',
                key: 'favorites',
                width: 20
            },
            {
                header: 'Revenue',
                key: 'totalrevenue',
                width: 20
            }    
            ];
            //Add Array Rows
            worksheet.addRows(restaurantList);
    
            //create file
            let file = await workbook.xlsx.writeFile(`restaurantList.xlsx`)
            let link = `https://saveeat.in:3035/api/v1/adminUser/getRestaurantsListFile/restaurantList.xlsx`

            return response.responseHandlerWithData(res, 200, "Link", link);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    getRestaurantsListFile: async (req, res) => {
        try {
          var filePath = path.join(__dirname, '../' + req.params.fileName);
          console.log("File path is===========>", filePath);
          res.writeHead(200, {
              'Content-Type': 'application/vnd.ms-excel',
          });
          var readStream = fs.createReadStream(filePath);
          readStream.pipe(res);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================= Particular Restaurnt Details ===============//

    particularRestaurnt: async (req, res) => {

        try {
            response.log("Request for cuisine is============>", req.body);
            req.checkBody('restaurntId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let restaurantData = await Restaurant.findOne({ _id: req.body.restaurntId })
            if (!restaurantData) {
                response.log("Invalid restaurnt Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }

            response.log("Cuisine data", restaurantData)

            let favorites = await Favorites.find({ "brandId": ObjectId(req.body.restaurntId) }).count()

            let holidayTime = await Holiday.find({ brandId: req.body.restaurntId })

            let openingTiming = await DeliverySlots.find({ brandId: req.body.restaurntId })


            return res.send({ status: 200, message: "Cuisine Data", Data: restaurantData, Holidays: holidayTime, Openings: openingTiming,FavCount: favorites})
            // return response.responseHandlerWithMessage(res, 200, "Cuisine Data",cuisineData);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //======================================== Brand List==========================//

    restrauntBrandList: async (req, res) => {
        try {

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }

            let totalBrands = await Restaurant.find({ "userType": "Store", "brandId": ObjectId(req.body.brandId) }).count()


            let brandList = await Restaurant.aggregate([
                {
                    $match: {
                        "userType": "Store",
                        "brandId": ObjectId(req.body.brandId)
                    }
                },
                {
                    $lookup: {
                        from: "menus",
                        let: { brandId: '$_id' },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$brandId", "$$brandId"] },

                                            ]
                                    }

                                }


                            },
                            { $match: { "status": "Active" } },
                        ],

                        as: "menuDetails"
                    }
                },
                {
                    $lookup: {
                        from: "menus",
                        let: { brandId: '$_id' },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$brandId", "$$brandId"] },

                                            ]
                                    }

                                }


                            },
                            // { $match: { "status": "Active" } },
                        ],

                        as: "menuDetailsCount"
                    }
                },
                {
                    $project: {
                        'businessName': 1,
                        'adminVerificationStatus': 1,
                        'mobileNumber': 1,
                        'name': 1,
                        'brandId': 1,
                        'status': 1,
                        'empNumber': 1,
                        'address': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'menuDetails.menuName': 1,
                        'menuDetails.status': 1,

                    }
                },
                // {
                //     $match: {
                //         "menuDetails.status":"Active"
                //     }
                // },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])
            for (let i = 0; i < brandList.length; i++) {
                let menuIdArr = []


                let totalmenus = await Menu.find({ "brandId": ObjectId(brandList[i]._id) })

                console.log("totalmenus==>", totalmenus)

                for (let l = 0; l < totalmenus.length; l++) {
                    menuIdArr.push(ObjectId(totalmenus[l]._id))
                }

                let favorites = await Favorites.find({ "brandId": ObjectId(brandList[i]._id) }).count()
                brandList[i].favorites = favorites

                console.log("menuIdArr==>", menuIdArr)

                let totalRestaurant = await Products.find({ "sellingStatus": true, "menuId": { "$in": menuIdArr } }).count()

                brandList[i].SellCount = totalRestaurant

                // ===================================================//


                let totalOrder = await Order.find({ "storeId":ObjectId(brandList[i]._id) }).count()
                brandList[i].totalOrder = totalOrder

                

                let totalOrder1 = await Order.find({ "storeId":ObjectId(brandList[i]._id), status: "Delivered" }).count()
                brandList[i].orderDone = totalOrder1


                let totalRestaurants = await Products.find({ "sellingStatus": true, "menuId": { "$in": menuIdArr } }).count()

                brandList[i].SellCount = totalRestaurants

                let totalrevenue = 0

                let revenueCheck = await Order.find({ "storeId":ObjectId(brandList[i]._id) })
                for(let j = 0 ; j< revenueCheck.length;j++){
                    totalrevenue += revenueCheck[j].orderFullTotal
                }

                brandList[i].totalrevenue = totalrevenue

            }

            return res.send({ response_code: 200, message: "Brand List", Data: brandList, TotalCount: totalBrands })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===================================== Update Restaurnt Status ===============//

    updateRestaurntStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { status: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            await Restaurant.updateMany({ brandId: req.body.brandId }, { $set: { status: req.body.status } }, { new: true })

            response.log("Status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===================================== Update Restaurnt wallet ===============//

    updateRestaurntWallet: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('amount', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { wallet: req.body.amount } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            // await Restaurant.updateMany({ brandId: req.body.brandId }, { $set: { status: req.body.status } }, { new: true })

            response.log("Status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Wallet updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===================================== Update Brand Status ====================//

    updateBrandsStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { status: req.body.status } }, { new: true })
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

    //===================================== Approve Restaurnt ======================//

    approveRestaurnt: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { adminVerificationStatus: req.body.status } }, { new: true })
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
    //=======================================Driver list============================//

    driverList: async (req, res) => {

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
                select: { password: 0 }
            }
            var queryCheck = { userType: 'Driver', "adminVerificationStatus": "Approve" }
            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "firstName": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "lastName": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "email": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "drivingLicence": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "nationalIdentity": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "vehicleType": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "vehicleBrand": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "vehicleModel": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "vehicleNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "vehicleLicence": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }
            let result = await Driver.paginate(queryCheck, options)
            response.log("User List Found", result)
            return response.responseHandlerWithData(res, 200, "User List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //======================================Pending brand list======================//

    pendingBrandList: async (req, res) => {

        try {
            response.log("Request for get brand list is==============>", req.body);
            req.checkBody('pageNumber', 'Something went wrong').notEmpty();
            req.checkBody('limit', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let options = {
                page: Number(req.query.pageNumber) || 1,
                limit: Number(req.query.limit) || 10,
                sort: { createdAt: -1 },
                select: { password: 0 }
            }
            var queryCheck = { userType: 'Brand', adminVerificationStatus: 'Pending' }
            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "firstName": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "lastName": { $regex: "^" + req.body.search, $options: 'i' } }
                    ]
                }]
            }
            let result = await Restaurant.paginate(queryCheck, options)
            response.log("Restaurant List Found", result)
            return response.responseHandlerWithData(res, 200, "Restaurant List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //======================================Pending driver list=====================//

    pedningDriverList: async (req, res) => {

        try {
            response.log("Request for get brand list is==============>", req.body);
            req.checkBody('pageNumber', 'Something went wrong').notEmpty();
            req.checkBody('limit', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let options = {
                page: Number(req.query.pageNumber) || 1,
                limit: Number(req.query.limit) || 10,
                sort: { createdAt: -1 },
                select: { password: 0 }
            }
            var queryCheck = { userType: 'Driver', adminVerificationStatus: 'Pending' }
            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "firstName": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "lastName": { $regex: "^" + req.body.search, $options: 'i' } }
                    ]
                }]
            }
            let result = await Driver.paginate(queryCheck, options)
            response.log("Driver List Found", result)
            return response.responseHandlerWithData(res, 200, "Driver List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Update user status=====================//

    updateUserStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('userId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { status: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("User status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "User status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Update driver status===================//

    updateDriverStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('driverId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Driver.findByIdAndUpdate({ _id: req.body.driverId }, { $set: { status: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("User status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "User status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Get User Detail==========================//

    getUserDetail: async (req, res) => {

        try {
            req.checkBody('userId', 'Something went wrong').notEmpty().isLength({ min: 24 });
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkUser = await User.findOne({ _id: req.body.userId }).select({ 'password': 0 })
            if (!checkUser) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("User Detail Found", checkUser)
            return response.responseHandlerWithData(res, 200, "User Detail Found", checkUser);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Get driver detail=======================//

    getDriverDetail: async (req, res) => {

        try {
            req.checkBody('driverId', 'Something went wrong').notEmpty().isLength({ min: 24 });
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkUser = await Driver.findOne({ _id: req.body.driverId }).select({ 'password': 0 })
            if (!checkUser) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("User Detail Found", checkUser)
            return response.responseHandlerWithData(res, 200, "User Detail Found", checkUser);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Send Notification==========================//

    sendNotification: async (req, res) => {

        try {
            response.log("Request for send notification is===========>", req.body);
            req.checkBody('title', 'Something went wrong').notEmpty();
            req.checkBody('message', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let title = "Alert"
            if (req.body.predefineType == "No") {
                title = req.body.title
            }
            if (req.body.userType == "Users") {
                let checKusers = await User.find({ status: 'Active' })
                for (let i = 0; i < checKusers.length; i++) {
                    let notiObj = new Notification({
                        notiTo: checKusers[i]._id,
                        notiTitle: title,
                        notiMessage: req.body.message,
                        type: 'User',
                        notiType: 'adminAlert'
                    })
                    await notiObj.save()
                    Sendnotification.sendNotificationForAndroid(checKusers[i].deviceToken, notiObj.notiTitle, notiObj.notiMessage, notiObj.notiType, "", checKusers[i].deviceType, (error10, result10) => {
                        response.log("Notification Sent");
                    })
                }
            }
            else if (req.body.userType == "Drivers") {

                let checKDrivers = await Driver.find({ status: 'Active', adminVerificationStatus: 'Approve' })
                for (let i = 0; i < checKDrivers.length; i++) {
                    let notiObj = new Notification({
                        driverId: checKDrivers[i]._id,
                        notiTitle: title,
                        notiMessage: req.body.message,
                        type: 'Driver',
                        notiType: 'adminAlert'
                    })
                    await notiObj.save()
                    Sendnotification.sendNotificationForAndroid(checKDrivers[i].deviceToken, notiObj.notiTitle, notiObj.notiMessage, notiObj.notiType, "", checKDrivers[i].deviceType, (error10, result10) => {
                        response.log("Notification Sent");
                    })
                }

            }
            else if (req.body.userType == "Restaurants") {
                let checKRestaurant = await Restaurant.find({ status: 'Active', adminVerificationStatus: 'Approve' })
                for (let i = 0; i < checKRestaurant.length; i++) {
                    let checkSubAdmin = await Restaurant.find({ adminVerificationStatus: "Approve", userType: 'Sub-Admin', "status": "Active", branchId: checKRestaurant[i]._id })
                    for (let j = 0; j < checkSubAdmin.length; j++) {
                        let notiRestroObj = new Notification({
                            restaurantId: checKRestaurant[i]._id,
                            notiTitle: title,
                            notiMessage: req.body.message,
                            type: 'Restaurant',
                            notiType: 'adminAlert',
                            data: checKRestaurant[i]._id,
                        })
                        await notiRestroObj.save()
                        if (checkSubAdmin[i].deviceType == "Panel") {
                            Sendnotification.sendNotificationForWeb(checkSubAdmin[i].fcmToken, notiRestroObj.notiTitle, notiRestroObj.notiMessage, notiRestroObj.notiType, "", "", "", (error10, result10) => {
                                response.log("Notification Sent");
                            })

                        }
                        if (checkSubAdmin[i].deviceType == "Android") {
                            Sendnotification.sendNotificationForAndroid(checkSubAdmin[i].deviceToken, notiRestroObj.notiTitle, notiRestroObj.notiMessage, notiRestroObj.notiType, notiRestroObj.data, checkSubAdmin[i].deviceType, (error10, result10) => {
                                response.log("Notification Sent");
                            })
                        }

                    }
                }
            }
            response.log("Notification send successfully")
            return response.responseHandlerWithMessage(res, 200, "Notification send successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //======================================Notification to user========================//

    sendNotificationToUser: async (req, res) => {

        try {
            response.log("Request for send notification is===========>", req.body);
            req.checkBody('title', 'Something went wrong').notEmpty();
            req.checkBody('message', 'Something went wrong').notEmpty();
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
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let notiObj = new Notification({
                notiTo: req.body.userId,
                notiTitle: req.body.title,
                notiMessage: req.body.message,
                type: 'User',
                data: req.body.userId,
                notiType: 'adminAlert'
            })
            await notiObj.save()
            response.log("Notification send successfully")
            response.responseHandlerWithMessage(res, 200, "Notification send successfully");
            Sendnotification.sendNotificationForAndroid(checkUser.deviceToken, notiObj.notiTitle, notiObj.notiMessage, notiObj.notiType, notiObj.data, (error10, result10) => {
                response.log("Notification Sent");
            })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=====================================Notification to restro======================//

    sendNotificationToRestro: async (req, res) => {

        try {
            response.log("Request for send notification is===========>", req.body);
            req.checkBody('title', 'Something went wrong').notEmpty();
            req.checkBody('message', 'Something went wrong').notEmpty();
            req.checkBody('restaurantId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkRestro = await Branch.findOne({ _id: req.body.restaurantId })
            if (!checkRestro) {
                response.log("Invalid restaurant Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let checkSubAdmin = await Restaurant.find({ adminVerificationStatus: "Approve", userType: 'Sub-Admin', "status": "Active", branchId: req.body.restaurantId })
            for (let i = 0; i < checkSubAdmin.length; i++) {
                let notiRestroObj = new Notification({
                    restaurantId: checkSubAdmin[i]._id,
                    notiTitle: req.body.title,
                    notiMessage: req.body.message,
                    notiType: `adminAlert`,
                    data: checkSubAdmin[i]._id,
                    type: 'Restaurant'
                })
                await notiRestroObj.save()
                Sendnotification.sendNotificationForAndroid(checkSubAdmin[i].deviceToken, notiRestroObj.notiTitle, notiRestroObj.notiMessage, notiRestroObj.notiType, notiRestroObj.data, (error10, result10) => {
                    response.log("Notification Sent");
                })
            }
            response.log("Notification send successfully")
            response.responseHandlerWithMessage(res, 200, "Notification send successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=====================================Notification List=============================//

    notificationList: async (req, res) => {

        try {
            response.log("Request for get notification list is==============>", req.body);
            req.checkBody('pageNumber', 'Something went wrong').notEmpty();
            req.checkBody('limit', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let options = {}
            let queryCheck = {}
            if (req.body.type == "User") {
                queryCheck = { type: 'User' }
                options = {
                    page: Number(req.body.pageNumber) || 1,
                    limit: Number(req.body.limit) || 10,
                    sort: { createdAt: -1 },
                    populate: { path: 'notiTo', select: 'firstName' }
                }
            }
            if (req.body.type == "Restaurant") {
                queryCheck = { type: 'Restaurant' }
                options = {
                    page: Number(req.body.pageNumber) || 1,
                    limit: Number(req.body.limit) || 10,
                    sort: { createdAt: -1 },
                    populate: { path: 'restaurantId', select: 'name' }
                }
            }
            let result = await Notification.paginate(queryCheck, options)
            response.log("Notification List Found", result)
            return response.responseHandlerWithData(res, 200, "Notification List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //====================================delete notification=============================//

    deleteNotification: async (req, res) => {

        try {
            response.log("Request for notification user is============>", req.body);
            req.checkBody('notificationId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let notificationDelete = await Notification.findByIdAndRemove({ _id: req.body.notificationId })
            if (!notificationDelete) {
                response.log("Invalid notification Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Notification deleted successfully", notificationDelete)
            return response.responseHandlerWithMessage(res, 200, "Notification deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Delete driver================================//

    deleteDriver: async (req, res) => {

        try {
            response.log("Request for driver delete is============>", req.body);
            req.checkBody('driverId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let driverData = await Driver.findByIdAndRemove({ _id: req.body.driverId })
            if (!driverData) {
                response.log("Invalid driver Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Driver deleted successfully", driverData)
            return response.responseHandlerWithMessage(res, 200, "Driver deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Add cuisine==================================//

    addCuisine: async (req, res) => {

        try {
            response.log("Request for add cuisine is============>", req.body);
            req.checkBody('name', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkCuisine = await Cuisine.findOne({ name: req.body.name })
            if (checkCuisine) {
                response.log("Cuisine already exist");
                return response.responseHandlerWithMessage(res, 501, "Cuisine already exist");
            }
            let obj = new Cuisine({
                name: req.body.name
            })
            let data = await obj.save()
            response.log("Cuisine added successfully")
            return response.responseHandlerWithData(res, 200, "Cuisine added successfully", data);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //======================================= particular cuisine ==========================//

    particularCuisine: async (req, res) => {

        try {
            response.log("Request for cuisine is============>", req.body);
            req.checkBody('cuisineId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let cuisineData = await Cuisine.findOne({ _id: req.body.cuisineId })
            if (!cuisineData) {
                response.log("Invalid cuisine Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Cuisine data", cuisineData)
            return res.send({ status: 200, message: "Cuisine Data", Data: cuisineData })
            // return response.responseHandlerWithMessage(res, 200, "Cuisine Data",cuisineData);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Update cuisine===============================//

    updateCuisine: async (req, res) => {

        try {
            response.log("Request for update cuisine is============>", req.body);
            req.checkBody('name', 'Something went wrong').notEmpty();
            req.checkBody('cuisineId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkCuisine = await Cuisine.findOne({ _id: req.body.cuisineId })
            if (!checkCuisine) {
                response.log("Invalid cuisine Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let checkCuisineName = await Cuisine.findOne({ name: req.body.name, _id: { $ne: req.body.cuisineId } })
            if (checkCuisineName) {
                response.log("Cuisine already exist");
                return response.responseHandlerWithMessage(res, 501, "Cuisine already exist");
            }
            let obj = {
                name: req.body.name
            }
            let data = await Cuisine.findByIdAndUpdate({ _id: req.body.cuisineId }, { $set: obj }, { new: true })
            response.log("Cuisine updated successfully")
            return response.responseHandlerWithData(res, 200, "Cuisine updated successfully", data);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Delete cuisine==============================//

    deleteCuisine: async (req, res) => {

        try {
            response.log("Request for cuisine delete is============>", req.body);
            req.checkBody('cuisineId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let cuisineData = await Cuisine.findByIdAndUpdate({ _id: req.body.cuisineId }, { $set: { deleteStatus: true } }, { new: true })

            // let cuisineData = await Cuisine.findByIdAndRemove({ _id: req.body.cuisineId })
            if (!cuisineData) {
                response.log("Invalid cuisine Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Cuisine deleted successfully", cuisineData)
            return response.responseHandlerWithMessage(res, 200, "Cuisine deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Cuisine list================================//

    cuisineList: async (req, res) => {

        try {
            response.log("Request for get notification list is==============>", req.body);
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
            }
            let queryCheck = { deleteStatus: false }
            if (!req.body.startDate == '' && !req.body.endDate == "") {
                queryCheck.createdAt = { $gte: req.body.startDate, $lte: req.body.endDate }
            }
            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "name": { $regex: "^" + req.body.search, $options: 'i' } }
                    ]
                }]
            }
            let result = await Cuisine.paginate(queryCheck, options)
            response.log("Cuisine List Found", result)
            return response.responseHandlerWithData(res, 200, "Cuisine List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },
    //=========================================== cuisineList aggergation ==================//

    cuisineListAggergation: async (req, res) => {

        try {
            response.log("Request for get notification list is==============>", req.body);
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
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = { deleteStatus: false }
            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "name": { $regex: "^" + req.body.search, $options: 'i' } }
                    ]
                }]
            }
            // let result = await Cuisine.paginate(queryCheck, options)
            // response.log("Cuisine List Found", result)

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 50
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }

            let result = await Cuisine.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $project: {
                        '_id': 1,
                        'status': 1,
                        'deleteStatus': 1,
                        'name': 1,
                        'updatedAt': 1,
                        'createdAt': 1,

                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])

            for (let i = 0; i < result.length; i++) {
                let subCuisines = await Cuisinecategory.find({ "cuisineId": result[i]._id }).count()

                result[i].subCuisineCount = subCuisines

            }

            let totalCount = await Cuisine.find(queryCheck).count()

            return res.send({ status: 200, message: "Cuisine List Found", data: result, total: totalCount })
            return response.responseHandlerWithData(res, 200, "Cuisine List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },


    //===========================================Add banner=================================//

    addBanner: async (req, res) => {

        try {
            response.log("Request for add banner is============>", req.body);
            req.checkBody('enTitle', 'Something went wrong').notEmpty();
            req.checkBody('enDescription', 'Something went wrong').notEmpty();
            req.checkBody('fromDate', 'Something went wrong').notEmpty();
            req.checkBody('fromTime', 'Something went wrong').notEmpty();
            req.checkBody('toDate', 'Something went wrong').notEmpty();
            req.checkBody('toTime', 'Something went wrong').notEmpty();
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let restaurantData = []
            let data = JSON.parse(req.body.restaurant)
            for (let i = 0; i < data.length; i++) {
                let obj = {
                    restaurantId: ObjectId(data[i].item_id)
                }
                restaurantData.push(obj)
            }
            let fromTimeAndDate = moment(`${req.body.fromDate} ${req.body.fromTime}`)
            let toActualTimeAndDate = moment(`${req.body.toDate} ${req.body.toTime}`)
            let enImage = ""
            if (req.body.image) {
                enImage = await Fileupload.uploadBase(req.body.image, "user/");
            }
            let obj = new Banner({
                enTitle: req.body.enTitle,
                arTitle: req.body.arTitle,
                enDescription: req.body.enDescription,
                arDescription: req.body.arDescription,
                enOfferCode: req.body.enOfferCode,
                arOfferCode: req.body.arOfferCode,
                fromDate: req.body.fromDate,
                fromTime: req.body.fromTime,
                toDate: req.body.toDate,
                toTime: req.body.toTime,
                enImage: enImage,
                fromTimeAndDate: fromTimeAndDate,
                toActualTimeAndDate: toActualTimeAndDate,
                brandId: req.body.brandId,
                restroData: data,
                restaurantData: restaurantData
            })
            await obj.save()
            response.log("Banner added successfully")
            return response.responseHandlerWithMessage(res, 200, `Banner added successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Update banner==============================//

    updateBanner: async (req, res) => {

        try {
            response.log("Request for update banner is============>", req.body);
            req.checkBody('enTitle', 'Something went wrong').notEmpty();
            req.checkBody('enDescription', 'Something went wrong').notEmpty();
            req.checkBody('fromDate', 'Something went wrong').notEmpty();
            req.checkBody('fromTime', 'Something went wrong').notEmpty();
            req.checkBody('toDate', 'Something went wrong').notEmpty();
            req.checkBody('toTime', 'Something went wrong').notEmpty();
            req.checkBody('bannerId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let restaurantData = []
            let data = JSON.parse(req.body.restaurant)
            for (let i = 0; i < data.length; i++) {
                let obj = {
                    restaurantId: ObjectId(data[i].item_id)
                }
                restaurantData.push(obj)
            }
            let checkBanner = await Banner.findOne({ _id: req.body.bannerId })
            if (!checkBanner) {
                response.log("Invalid banner Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let fromTimeAndDate = moment(`${req.body.fromDate} ${req.body.fromTime}`)
            let toActualTimeAndDate = moment(`${req.body.toDate} ${req.body.toTime}`)
            let enImage = checkBanner.enImage
            if (req.body.image) {
                enImage = await Fileupload.upload(req.body.image, "user/");
            }
            let obj = {
                enTitle: req.body.enTitle,
                arTitle: req.body.arTitle,
                enDescription: req.body.enDescription,
                arDescription: req.body.arDescription,
                enOfferCode: req.body.enOfferCode,
                arOfferCode: req.body.arOfferCode,
                fromDate: req.body.fromDate,
                fromTime: req.body.fromTime,
                toDate: req.body.toDate,
                toTime: req.body.toTime,
                enImage: enImage,
                fromTimeAndDate: fromTimeAndDate,
                toActualTimeAndDate: toActualTimeAndDate,
                brandId: req.body.brandId,
                restroData: data,
                restaurantData: restaurantData
            }
            await Banner.findByIdAndUpdate({ _id: req.body.bannerId }, { $set: obj }, { new: true })
            response.log("Banner updated successfully")
            return response.responseHandlerWithMessage(res, 200, `Banner updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Delete banner================================//

    deleteBanner: async (req, res) => {

        try {
            response.log("Request for banner delete is============>", req.body);
            req.checkBody('bannerId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let bannerData = await Banner.findByIdAndRemove({ _id: req.body.bannerId })
            if (!bannerData) {
                response.log("Invalid banner Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Banner deleted successfully", bannerData)
            return response.responseHandlerWithMessage(res, 200, "Banner deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //============================================Banner list=================================//

    bannerList: async (req, res) => {

        try {
            response.log("Request for get banner list is==============>", req.body);
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
            }
            let queryCheck = { deleteStatus: false }
            if (!req.body.startDate == '' && !req.body.endDate == "") {
                queryCheck.createdAt = { $gte: req.body.startDate, $lte: req.body.endDate }
            }
            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "enTitle": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "arTitle": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "enDescription": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "erDescription": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "enOfferCode": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "arOfferCode": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }
            let result = await Banner.paginate(queryCheck, options)
            response.log("Banner List Found", result)
            return response.responseHandlerWithData(res, 200, "Banner List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Banner detail================================//

    getBannerDetail: async (req, res) => {

        try {
            req.checkBody('bannerId', 'Something went wrong').notEmpty().isLength({ min: 24 });
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBanner = await Banner.findOne({ _id: req.body.bannerId }).populate({ "path": 'brandId', select: 'storeName' })
            if (!checkBanner) {
                response.log("Invalid banner Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Banner Detail Found", checkBanner)
            return response.responseHandlerWithData(res, 200, "Banner Detail Found", checkBanner);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Verify driver=================================//

    verifyDriverStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('driverId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Driver.findByIdAndUpdate({ _id: req.body.driverId }, { $set: { adminVerificationStatus: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Status updated successfully", updateUserStatus)
            response.responseHandlerWithMessage(res, 200, "Status updated successfully");
            let notiTitle = "Request Approved!"
            let newMes = "Welcome to Bite.me App"
            let message = `Hi ${updateUserStatus.firstName}! your request for become a driver has been approved by admin now.`
            if (req.body.status == "Disapprove") {
                notiTitle = "Request Disapproved!"
                message = `Hi ${updateUserStatus.firstName}! your request for become a driver has been rejected by admin now.`
            }
            SendMail.sendAccountVerificationStatus(updateUserStatus.email, notiTitle, message, newMes, (error10, result10) => {
                if (error10) {
                    console.log("Error 10 is=========>", error10);
                }
                else {
                    console.log("mail send is==========>", result10);
                }
            })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Verify restaurant=============================//

    verifyRestaurantStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { adminVerificationStatus: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Status updated successfully", updateUserStatus)
            response.responseHandlerWithMessage(res, 200, "Status updated successfully");
            let notiTitle = "Request Approved!"
            let newMes = "Welcome to Bite.me App"
            let message = `Hi ${updateUserStatus.firstName}! your request for become a brand has been approved by admin now.`
            if (req.body.status == "Disapprove") {
                notiTitle = "Request Disapproved!"
                message = `Hi ${updateUserStatus.firstName}! your request for become a brand has been rejected by admin now.`
            }
            SendMail.sendAccountVerificationStatus(updateUserStatus.email, notiTitle, message, newMes, (error10, result10) => {
                if (error10) {
                    console.log("Error 10 is=========>", error10);
                }
                else {
                    console.log("mail send is==========>", result10);
                }
            })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Add driver===================================//

    addDriver: async (req, res) => {

        try {
            response.log("Request for driver signup is=============>", req.body)
            req.checkBody('password', 'Something went wrong').notEmpty();
            req.checkBody('firstName', 'Something went wrong').notEmpty();
            req.checkBody('email', 'Something went wrong').notEmpty();
            req.checkBody('countryCode', 'Something went wrong').notEmpty();
            req.checkBody('mobileNumber', 'Something went wrong').notEmpty();
            req.checkBody('dutyStartTime', 'Something went wrong').notEmpty();
            req.checkBody('dutyEndTime', 'Something went wrong').notEmpty();
            req.checkBody('emirateNumber', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkEmail = await Driver.findOne({ email: (req.body.email).toLowerCase() })
            if (checkEmail) {
                response.log("Email number already exist");
                return response.responseHandlerWithMessage(res, 409, "Email already exist");
            }
            let checkMobile = await Driver.findOne({ mobileNumber: req.body.mobileNumber })
            if (checkMobile) {
                response.log("Mobile number already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number already exist");
            }
            let profilePic = ""
            if (req.files.profilePic) {
                profilePic = await Fileupload.upload(req.files.profilePic, "user/");
            }
            let vehicleDocument = ""
            if (req.files.vehicleDocument) {
                vehicleDocument = await Fileupload.upload(req.files.vehicleDocument, "user/");
            }
            req.body.password = await bcrypt.hashSync(req.body.password, salt);
            let obj = new Driver({
                email: (req.body.email).toLowerCase(),
                countryCode: req.body.countryCode,
                mobileNumber: req.body.mobileNumber,
                firstName: req.body.firstName,
                password: req.body.password,
                latitude: Number(28.99999),
                longitude: Number(78.9999),
                drivingLicence: req.body.drivingLicence,
                policeVerification: req.body.policeVerification,
                documents: req.body.documents,
                vehicleType: req.body.vehicleType,
                vehicleBrand: req.body.vehicleBrand,
                vehicleModel: req.body.vehicleModel,
                vehicleNumber: req.body.vehicleNumber,
                manufacturingDate: req.body.manufacturingDate,
                vehicleLicence: req.body.vehicleLicence,
                emirateNumber: req.body.emirateNumber,
                profilePic: profilePic,
                vehicleDocument: vehicleDocument,
                dutyStartTime: req.body.dutyStartTime,
                dutyEndTime: req.body.dutyEndTime,
                passportNumber: req.body.passportNumber,
                dob: req.body.dob,
                adminVerificationStatus: 'Approve',
                location: { "type": "Point", "coordinates": [Number(78.9999), Number(28.99999)] }
            })
            await obj.save()
            response.log("Driver added successfully")
            return response.responseHandlerWithData(res, 200, `Driver added successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    //============================================Update driver===============================//

    updateDriver: async (req, res) => {

        try {
            response.log("Request for driver signup is=============>", req.body)
            req.checkBody('firstName', 'Something went wrong').notEmpty();
            req.checkBody('email', 'Something went wrong').notEmpty();
            req.checkBody('countryCode', 'Something went wrong').notEmpty();
            req.checkBody('mobileNumber', 'Something went wrong').notEmpty();
            req.checkBody('dutyStartTime', 'Something went wrong').notEmpty();
            req.checkBody('dutyEndTime', 'Something went wrong').notEmpty();
            req.checkBody('emirateNumber', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkDriver = await Driver.findOne({ _id: req.body.driverId })
            if (!checkDriver) {
                response.log("Something went wrong");
                return response.responseHandlerWithMessage(res, 409, "Something went wrong");
            }
            let checkEmail = await Driver.findOne({ email: (req.body.email).toLowerCase(), _id: { $ne: req.body.driverId } })
            if (checkEmail) {
                response.log("Email number already exist");
                return response.responseHandlerWithMessage(res, 409, "Email already exist");
            }
            let checkMobile = await Driver.findOne({ mobileNumber: req.body.mobileNumber, _id: { $ne: req.body.driverId } })
            if (checkMobile) {
                response.log("Mobile number already exist");
                return response.responseHandlerWithMessage(res, 409, "Mobile number already exist");
            }
            let profilePic = checkDriver.profilePic
            if (req.files.profilePic) {
                profilePic = await Fileupload.upload(req.files.profilePic, "user/");
            }
            let vehicleDocument = checkDriver.vehicleDocument
            if (req.files.vehicleDocument) {
                vehicleDocument = await Fileupload.upload(req.files.vehicleDocument, "user/");
            }
            let obj = {
                email: (req.body.email).toLowerCase(),
                countryCode: req.body.countryCode,
                mobileNumber: req.body.mobileNumber,
                firstName: req.body.firstName,
                drivingLicence: req.body.drivingLicence,
                vehicleType: req.body.vehicleType,
                vehicleBrand: req.body.vehicleBrand,
                vehicleModel: req.body.vehicleModel,
                vehicleNumber: req.body.vehicleNumber,
                manufacturingDate: req.body.manufacturingDate,
                vehicleDocument: req.body.vehicleDocument,
                profilePic: profilePic,
                dutyStartTime: req.body.dutyStartTime,
                emirateNumber: req.body.emirateNumber,
                dutyEndTime: req.body.dutyEndTime,
                passportNumber: req.body.passportNumber,
                dob: req.body.dob,
                vehicleDocument: vehicleDocument
            }
            await Driver.findByIdAndUpdate({ _id: req.body.driverId }, { $set: obj }, { new: true })
            response.log("Driver updated successfully")
            return response.responseHandlerWithData(res, 200, `Driver updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    //===========================================Brand list===================================//

    brandList: async (req, res) => {

        try {
            response.log("Request for get banner list is==============>", req.body);
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
                limit: 1000,
                sort: { createdAt: -1 },
                select: { password: 0 },
                lean: true
            }
            let queryCheck = { deleteStatus: false, userType: 'Brand', adminVerificationStatus: 'Approve' }
            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "firstName": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "lastName": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "storeName": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "email": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "status": { $regex: "^" + req.body.search, $options: 'i' } }
                    ]
                }]
            }
            let result = await Restaurant.paginate(queryCheck, options)
            response.log("Brand List Found", result)
            return response.responseHandlerWithData(res, 200, "Brand List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Update brand status==========================//

    updateBrandStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let result = await Branch.find({ brandId: req.body.brandId, status: 'Inactive' })
            let updateUserStatus = await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { status: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            await Branch.updateMany({ brandId: req.body.brandId }, { $set: { status: req.body.status } }, { new: true })
            if (req.body.status == "Inactive") {
                if (result.length > 0) {
                    let data = '';
                    data = data + "Name" + '\t' + "Email" + '\t' + "Country Code" + '\t' + "Mobile Number" + '\t' + "Status" + '\t' + "Service" + '\t' + "Location" + '\n';
                    for (let i = 0; i < result.length; i++) {
                        data = data + result[i].branchNameEn + '\t' + result[i].email + '\t' + result[i].countryCode + '\t' + result[i].mobileNumber + '\t' + result[i].status + '\t' + result[i].serviceType + '\t' + result[i].address + '\n';
                    }
                    let fileName = Date.now() + '.xls';
                    response.log("File name is===========>", fileName);
                    fs.appendFile("./excel/" + fileName, data, (err) => {
                        if (err) {
                            response.log("Error is=========>", err)
                        }
                        else {
                            response.log("Excel created==========>", `http://3.140.159.167:3032/api/v1/admin/getExcel/${fileName}`)
                        }
                    })
                    let link = `http://3.140.159.167:3032/api/v1/admin/getExcel/${fileName}`
                    let obj = {
                        excel: link,
                        filename: fileName,
                        excelAvailable: true
                    }
                    await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: obj }, { new: true })
                }
                else {
                    let obj = {
                        excelAvailable: false
                    }
                    await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: obj }, { new: true })
                }

            }
            response.log("Status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Brand login====================================//

    brandLogin: async (req, res) => {

        try {
            response.log("Request for user signin is=============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkUser = await Restaurant.findOne({ _id: req.body.brandId })
            if (!checkUser) {
                response.log("Invalid credentials1");
                return response.responseHandlerWithMessage(res, 401, "Invalid credentials");
            }
            if (checkUser.status == 'Inactive') {
                response.log("You have blocked by administrator")
                return response.responseHandlerWithMessage(res, 423, "Your account have been disabled by administrator due to any suspicious activity");
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
            let jwtToken = jwt.sign({ "_id": checkUser._id }, `sUpER@SecReT`);
            let result2 = await Restaurant.findByIdAndUpdate({ "_id": checkUser._id }, { $set: { "jwtToken": jwtToken, deviceToken: req.body.deviceToken, deviceType: req.body.deviceType } }, { new: true, lean: true })
            response.log("You have successfully logged in.", result2)
            delete (result2.password)
            return response.responseHandlerWithData(res, 200, "You have successfully logged in", result2);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Create user excel================================//

    createUserExcel: async (req, res) => {

        try {
            response.log("Request for create dmc is=========>", req.body)


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 1000,
                sort: { createdAt: -1 },
            }
            let queryCheck = { userType: 'User' }
            let result = await User.paginate(queryCheck, options)
            response.log("User List Found", result)
            if (result.docs.length == 0) {
                return response.responseHandlerWithData(res, 400, "Excel can not be create. Beacause record found.", result);

            }
            var data = '';
            data = data + "First Name" + '\t' + "Last Name" + '\t' + "Email" + '\t' + "Country Code" + '\t' + "Mobile Number" + '\t' + "Status" + '\t' + "Total Orders" + '\n';
            for (var i = 0; i < result.docs.length; i++) {
                data = data + result.docs[i].firstName + '\t' + result.docs[i].lastName + '\t' + result.docs[i].email + '\t' + result.docs[i].countryCode + '\t' + result.docs[i].mobileNumber + '\t' + result.docs[i].status + '\t' + result.docs[i].totalOrders + '\n';
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
            let link = `http://3.140.159.167:3032/api/v1/admin/getExcel/${fileName}`
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

    //=========================================Promocode list===================================//

    promocodeList: async (req, res) => {

        try {
            response.log("Request for get promocide list is==============>", req.body);
            req.checkBody('pageNumber', 'Something went wrong').notEmpty();
            req.checkBody('limit', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let options = {
                page: Number(req.query.pageNumber) || 1,
                limit: Number(req.query.limit) || 10000,
                sort: { createdAt: -1 },
            }
            var queryCheck = { adminVerificationStatus: 'Pending' }
            let result = await Promocode.paginate(queryCheck, options)
            response.log("Promocode List Found", result)
            return response.responseHandlerWithData(res, 200, "Promocode List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Update promocode status===========================//

    updatePromocodeStatus: async (req, res) => {

        try {
            response.log("Request for update promocode status is============>", req.body);
            req.checkBody('promocodeId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                adminVerificationStatus: req.body.status
            }
            let updatePromoStatus = await Promocode.findByIdAndUpdate({ _id: req.body.promocodeId }, { $set: obj }, { new: true })
            if (!updatePromoStatus) {
                response.log("Invalid code Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Status updated successfully", updatePromoStatus)
            return response.responseHandlerWithMessage(res, 200, "Status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Update promocode==================================//

    updatePromocode: async (req, res) => {

        try {
            response.log("Request for add menu is==============>", req.body);
            req.checkBody('fromDate', 'Something went wrong').notEmpty();
            req.checkBody('todate', 'Something went wrong').notEmpty();
            req.checkBody('discountType', 'Something went wrong').notEmpty();
            req.checkBody('discount', 'Something went wrong').notEmpty();
            req.checkBody('promocodeId', 'Something went wrong').notEmpty();
            req.checkBody('code', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let codeObj = {
                fromDate: req.body.fromDate,
                todate: req.body.todate,
                discountType: req.body.discountType,
                discount: req.body.discount,
                code: req.body.code
            }
            let updatePromo = await Promocode.findByIdAndUpdate({ _id: req.body.promocodeId }, { $set: codeObj }, { new: true })
            if (!updatePromo) {
                response.log("Invalid code Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Promocode updated successfully")
            return response.responseHandlerWithMessage(res, 200, `Promocode updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=============================================Promocode data==================================//

    promocodeData: async (req, res) => {

        try {
            response.log("Request for get promocide data is==============>", req.body);
            req.checkBody('pageNumber', 'Something went wrong').notEmpty();
            req.checkBody('limit', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let options = {
                page: Number(req.query.pageNumber) || 1,
                limit: Number(req.query.limit) || 10000,
                sort: { createdAt: -1 },
                populate: [{ path: 'branchId', select: 'branchNameEn' }, { path: 'itemId', select: 'productName productImage cuisine' }]
            }
            var queryCheck = { adminVerificationStatus: 'Pending' }
            let result = await Promocode.paginate(queryCheck, options)
            response.log("Promocode List Found", result)
            return response.responseHandlerWithData(res, 200, "Promocode List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Get promocode detail=============================//

    getPromocodeDetail: async (req, res) => {

        try {
            response.log("Request for get promocode detail is============>", req.body);
            req.checkBody('promocodeId', 'Something went wrong').notEmpty().isLength({ min: 24 });
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkPromo = await Promocode.findOne({ _id: req.body.promocodeId })
            if (!checkPromo) {
                response.log("Invalid code Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Promocode Detail Found", checkPromo)
            return response.responseHandlerWithData(res, 200, "Promocode Detail Found", checkPromo);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Delete promocode================================//

    deletePromocode: async (req, res) => {

        try {
            response.log("Request for promocode delete is============>", req.body);
            req.checkBody('promocodeId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let promoData = await Promocode.findByIdAndRemove({ _id: req.body.promocodeId })
            if (!promoData) {
                response.log("Invalid code Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Promocode deleted successfully", promoData)
            return response.responseHandlerWithMessage(res, 200, "Promocode deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Update brand logo image=========================//

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
            let checkBrand = await Restaurant.findOne({ _id: req.body.brandId })
            if (!checkBrand) {
                response.log("Something went wrong");
                return response.responseHandlerWithMessage(res, 409, "Something went wrong");
            }
            let logo = checkBrand.logo
            if (req.body.type == "Logo") {
                if (req.body.image) {
                    logo = await Fileupload.uploadBase(req.body.image, "user/");
                }
            }

            let image = checkBrand.image
            if (req.body.type == "Image") {
                if (req.body.image) {
                    image = await Fileupload.uploadBase(req.body.image, "user/");
                }
            }
            let obj = {
                image: image,
                logo: logo,
            }
            await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: obj }, { new: true })
            response.log("Image updated successfully")
            return response.responseHandlerWithData(res, 200, `Image updated successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    //===========================================Get brand detail===============================//

    getBrandDetail: async (req, res) => {

        try {
            response.log("Request for get brand detail is============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty().isLength({ min: 24 });
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Restaurant.findOne({ _id: req.body.brandId }).select({ password: 0 })
            if (!checkBrand) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Brand Detail Found", checkBrand)
            return response.responseHandlerWithData(res, 200, "Brand Detail Found", checkBrand);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Get branch detail===============================//

    getBranchDetail: async (req, res) => {

        try {
            response.log("Request for get brand detail is============>", req.body);
            req.checkBody('branchId', 'Something went wrong').notEmpty().isLength({ min: 24 });
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBranch = await Branch.findOne({ _id: req.body.branchId }).populate({ path: 'brandId', select: 'address storeName country image logo' }).select({ password: 0 })
            if (!checkBranch) {
                response.log("Invalid branch Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Branch Detail Found", checkBranch)
            return response.responseHandlerWithData(res, 200, "Branch Detail Found", checkBranch);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Verify brnach===================================//

    verifyBranchStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('branchId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Branch.findByIdAndUpdate({ _id: req.body.branchId }, { $set: { adminVerificationStatus: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Status updated successfully", updateUserStatus)
            response.responseHandlerWithMessage(res, 200, "Status updated successfully");
            let notiTitle = "Request Approved!"
            let newMes = "Welcome to Bite.me App"
            let message = `Hi ${updateUserStatus.branchNameEn}! your request for become a branch has been approved by admin now.`
            if (req.body.status == "Disapprove") {
                notiTitle = "Request Disapproved!"
                message = `Hi ${updateUserStatus.branchNameEn}! your request for become a branch has been rejected by admin now.`
            }
            SendMail.sendAccountVerificationStatus(updateUserStatus.email, notiTitle, message, newMes, (error10, result10) => {
                if (error10) {
                    console.log("Error 10 is=========>", error10);
                }
                else {
                    console.log("mail send is==========>", result10);
                }
            })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Update branch status============================//

    updateBranchStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('branchId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Branch.findByIdAndUpdate({ _id: req.body.branchId }, { $set: { status: req.body.status } }, { new: true })
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

    //========================================Update brand commission===========================//

    updateBrandCommission: async (req, res) => {

        try {
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('commission', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateCommission = await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { commission: req.body.commission } }, { new: true })
            if (!updateCommission) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Commission updated successfully", updateCommission)
            return response.responseHandlerWithMessage(res, 200, "Commission updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Generate qr=====================================//

    generateQr: async (req, res) => {

        try {
            req.checkBody('branchId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let qrCode = await QRCode.toDataURL(req.body.branchId)
            let obj = {
                qrCode: qrCode,
                qrCodeStatus: true
            }
            let updateQr = await Branch.findByIdAndUpdate({ _id: req.body.branchId }, { $set: obj }, { new: true })
            if (!updateQr) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Qr code generated successfully", updateQr)
            return response.responseHandlerWithMessage(res, 200, "Qr code generated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Item list=======================================//

    itemList: async (req, res) => {

        try {
            response.log("Request for get item list is==============>", req.body);
            // let checkBranch = await Branch.findOne({ _id: req.body.branchId })
            // if (!checkBranch) {
            //     response.log("Invalid branch Id");
            //     return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            // }
            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10000,
                sort: { createdAt: -1 },
            }
            let queryCheck = { menuId: req.body.menuId }
            let result = await Product.paginate(queryCheck, options)
            response.log("Item List Found", result)
            return response.responseHandlerWithData(res, 200, "Item List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Update Item status================================//

    updateItemStatus: async (req, res) => {

        try {
            response.log("Request for update item status is=========>", req.body);
            req.checkBody('itemId', 'Something went wrong').notEmpty();
            req.checkBody('changeRequestApporve', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateItemStatus = await Product.findByIdAndUpdate({ _id: req.body.itemId }, { $set: { changeRequestApporve: req.body.changeRequestApporve } }, { new: true })
            if (!updateItemStatus) {
                response.log("Invalid Item Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Status updated successfully", updateItemStatus)
            response.responseHandlerWithMessage(res, 200, "Status updated successfully");
            let brandDeatil = await Restaurant.findOne({ _id: updateItemStatus.brandId })
            let menuDeatil = await Menu.findOne({ _id: updateItemStatus.menuId })
            if (req.body.changeRequestApporve == "Disapprove") {
                let notiTitle = "Request Disapproved!"
                let newMes = "Welcome to Bite.me App"
                let message = `Hi ${brandDeatil.storeName}! Your item ${updateItemStatus.productName} request for menu ${menuDeatil.menuName} has been disapproved by admin. Please contact with admin for more detail.`
                SendMail.sendAccountVerificationStatus(brandDeatil.email, notiTitle, message, newMes, (error10, result10) => {
                    if (error10) {
                        console.log("Error 10 is=========>", error10);
                    }
                    else {
                        console.log("mail send is==========>", result10);
                    }
                })
            }

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Item detail======================================//

    getItemDetail: async (req, res) => {

        try {
            response.log("Request for get item detail is============>", req.body);
            req.checkBody('itemId', 'Something went wrong').notEmpty().isLength({ min: 24 });
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkItem = await Product.findOne({ _id: req.body.itemId }).select({ password: 0 })
            if (!checkItem) {
                response.log("Invalid Item Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Item Detail Found", checkItem)
            return response.responseHandlerWithData(res, 200, "Item Detail Found", checkItem);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Update commission================================//

    updateBranchCommission: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('branchId', 'Something went wrong').notEmpty();
            req.checkBody('commission', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserCommission = await Branch.findByIdAndUpdate({ _id: req.body.branchId }, { $set: { commission: req.body.commission } }, { new: true })
            if (!updateUserCommission) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Commission updated successfully", updateUserCommission)
            return response.responseHandlerWithMessage(res, 200, "Commission updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Update vat=======================================//

    updateBranchVat: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('branchId', 'Something went wrong').notEmpty();
            req.checkBody('vat', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserVat = await Branch.findByIdAndUpdate({ _id: req.body.branchId }, { $set: { vat: req.body.vat } }, { new: true })
            if (!updateUserVat) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("VAT updated successfully", updateUserVat)
            return response.responseHandlerWithMessage(res, 200, "VAT updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Update branch service=============================//

    updateBranchService: async (req, res) => {

        try {
            response.log("Request for update service type is=========>", req.body);
            req.checkBody('branchId', 'Something went wrong').notEmpty();
            req.checkBody('serviceType', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserService = await Branch.findByIdAndUpdate({ _id: req.body.branchId }, { $set: { serviceType: req.body.serviceType } }, { new: true })
            if (!updateUserService) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Service type updated successfully", updateUserService)
            return response.responseHandlerWithMessage(res, 200, "Service type updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //======================================Brand lis for banner===============================//

    brandListForBanner: async (req, res) => {

        try {
            response.log("Request for get brand list is=============>", req.body);
            let query = { $and: [{ adminVerificationStatus: 'Approve' }, { status: 'Active' }, { userType: 'Brand' }, { deleteStatus: false }] }
            let brandList = await Restaurant.find(query).select('storeName _id')
            response.log("Brand list found successfully", brandList)
            return response.responseHandlerWithData(res, 200, "Brand list found successfully", brandList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Get restaurant for banner========================//

    getRestaurantForBanner: async (req, res) => {

        try {
            response.log("Request for get restaurant list is=============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let query = { $and: [{ adminVerificationStatus: 'Approve' }, { status: 'Active' }, { brandId: req.body.brandId }] }
            let branchList = await Branch.find(query)
            let list = []
            for (let i = 0; i < branchList.length; i++) {
                let checkBanner = await Banner.findOne({ "restaurantData.restaurantId": branchList[i]._id, status: 'Active' })
                if (!checkBanner) {
                    let obj = {
                        item_id: branchList[i]._id,
                        item_text: branchList[i].branchNameEn
                    }
                    list.push(obj)
                }
            }
            response.log("Branch list found successfully", list)
            return response.responseHandlerWithData(res, 200, "Branch list found successfully", list);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=====================================Add area===========================================//

    addArea: async (req, res) => {

        try {
            response.log("Request for add area is============>", req.body);
            req.checkBody('minimumOrderValue', 'Something went wrong').notEmpty();
            req.checkBody('deliveryFee', 'Something went wrong').notEmpty();
            req.checkBody('deliveryTime', 'Something went wrong').notEmpty();
            req.checkBody('polygonAddress', 'Something went wrong').notEmpty();
            req.checkBody('areaName', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let points = []
            let mydata = req.body.polygonData
            for (let i = 0; i < mydata.length; i++) {
                let a = [mydata[i].lng, mydata[i].lat]
                points.push(a)
            }
            points.push([mydata[0].lng, mydata[0].lat])
            console.log("Data is==========>", points)
            let branchIds = req.body.selectedItems
            for (let j = 0; j < branchIds.length; j++) {
                let checkBranch = await Branch.findOne({ _id: branchIds[j]._id })
                let obj = new Area({
                    minimumOrderValue: req.body.minimumOrderValue,
                    deliveryFee: req.body.deliveryFee,
                    deliveryTime: req.body.deliveryTime,
                    polygonData: req.body.polygonData,
                    polygonLong: req.body.polygonLong,
                    polygonLat: req.body.polygonLat,
                    polygonAddress: req.body.polygonAddress,
                    areaName: req.body.areaName,
                    branchId: checkBranch._id,
                    brandId: checkBranch.brandId,
                    polygon: {
                        "type": "Polygon",
                        "coordinates": [points]
                    }
                })
                await obj.save()
            }
            response.log("Area added successfully")
            return response.responseHandlerWithMessage(res, 200, `Area added successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===============================================Update area=======================================//

    updateArea: async (req, res) => {

        try {
            response.log("Request for add area is============>", req.body);
            req.checkBody('minimumOrderValue', 'Something went wrong').notEmpty();
            req.checkBody('deliveryFee', 'Something went wrong').notEmpty();
            req.checkBody('deliveryTime', 'Something went wrong').notEmpty();
            req.checkBody('polygonAddress', 'Something went wrong').notEmpty();
            req.checkBody('areaName', 'Something went wrong').notEmpty();
            req.checkBody('areaId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkArea = await Area.findOne({ _id: req.body.areaId })
            if (!checkArea) {
                response.log("Invalid area Id")
                return response.responseHandlerWithMessage(res, 503, "Something went wrong");
            }
            let points = []
            let mydata = req.body.polygonData
            for (let i = 0; i < mydata.length; i++) {
                let a = [mydata[i].lng, mydata[i].lat]
                points.push(a)
            }
            points.push([mydata[0].lng, mydata[0].lat])
            console.log("Data is==========>", points)
            let obj = {
                minimumOrderValue: req.body.minimumOrderValue,
                deliveryFee: req.body.deliveryFee,
                deliveryTime: req.body.deliveryTime,
                polygonData: req.body.polygonData,
                polygonLong: req.body.polygonLong,
                polygonLat: req.body.polygonLat,
                polygonAddress: req.body.polygonAddress,
                areaName: req.body.areaName,
                polygon: {
                    "type": "Polygon",
                    "coordinates": [points]
                }

            }
            await Area.findByIdAndUpdate({ _id: req.body.areaId }, { $set: obj }, { new: true })
            response.log("Area added successfully")
            return response.responseHandlerWithMessage(res, 200, `Area added successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Area list=========================================//

    areaList: async (req, res) => {

        try {
            response.log("Request for get area list is==============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let ids = []
            let myIds = req.body.selectedItems
            for (let i = 0; i < myIds.length; i++) {
                ids.push(ObjectId(myIds[i]._id))
            }
            var queryCheck = { branchId: req.body.branchId, branchId: { $in: ids } }
            let result = await Area.find(queryCheck).sort({ createdAt: -1 })
            response.log("Area List Found", result)
            return response.responseHandlerWithData(res, 200, "Area List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===========================================Area detail======================================//

    getAreaDetails: async (req, res) => {

        try {
            response.log("Request for area get is==========>", req.body);
            req.checkBody('areaId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkArea = await Area.findOne({ "_id": req.body.areaId })
            if (!checkArea) {
                response.log("Invalid area Id");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Details found successfully", checkArea);
            return response.responseHandlerWithData(res, 200, "Details found successfully", checkArea);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Get restaurant for area==========================//

    getRestaurantForArea: async (req, res) => {

        try {
            response.log("Request for get restaurant list is=============>", req.body);
            let query = { $and: [{ adminVerificationStatus: 'Approve' }, { status: 'Active' }, { serviceType: 'Full Service' }] }
            let branchList = await Branch.find(query)
            response.log("Branch list found successfully", branchList)
            return response.responseHandlerWithData(res, 200, "Branch list found successfully", branchList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Add dietary==================================//

    addDietaryNeed: async (req, res) => {

        try {
            response.log("Request for add dietary is============>", req.body);
            req.checkBody('name', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkData = await Dietary.findOne({ name: req.body.name })
            if (checkData) {
                response.log("Dietary already exist");
                return response.responseHandlerWithMessage(res, 501, "Dietary already exist");
            }
            let obj = new Dietary({
                name: req.body.name,
                nameAr: req.body.nameAr
            })
            let data = await obj.save()
            response.log("Dietary added successfully")
            return response.responseHandlerWithData(res, 200, "Dietary added successfully", data);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Update dietary===============================//

    updateDietary: async (req, res) => {

        try {
            response.log("Request for update dietary is============>", req.body);
            req.checkBody('name', 'Something went wrong').notEmpty();
            req.checkBody('dietaryId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkData = await Dietary.findOne({ _id: req.body.dietaryId })
            if (!checkData) {
                response.log("Invalid dietart Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let checkName = await Dietary.findOne({ name: req.body.name, _id: { $ne: req.body.dietaryId } })
            if (checkName) {
                response.log("Dietary already exist");
                return response.responseHandlerWithMessage(res, 501, "Dietary already exist");
            }
            let obj = {
                name: req.body.name,
                nameAr: req.body.nameAr
            }
            let data = await Dietary.findByIdAndUpdate({ _id: req.body.dietaryId }, { $set: obj }, { new: true })
            response.log("Dietary updated successfully")
            return response.responseHandlerWithData(res, 200, "Dietary updated successfully", data);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Delete dietary==============================//

    deleteDietary: async (req, res) => {

        try {
            response.log("Request for dietary delete is============>", req.body);
            req.checkBody('dietaryId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let dietaryData = await Dietary.findByIdAndRemove({ _id: req.body.dietaryId })
            if (!dietaryData) {
                response.log("Invalid dietary Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Dietary deleted successfully", dietaryData)
            return response.responseHandlerWithMessage(res, 200, "Dietary deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Dietary list================================//

    dietaryList: async (req, res) => {

        try {
            response.log("Request for get dietary list is==============>", req.body);
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
            }
            let queryCheck = {}
            if (!req.body.startDate == '' && !req.body.endDate == "") {
                queryCheck.createdAt = { $gte: req.body.startDate, $lte: req.body.endDate }
            }
            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "name": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "nameAr": { $regex: "^" + req.body.search, $options: 'i' } }
                    ]
                }]
            }
            let result = await Dietary.paginate(queryCheck, options)
            response.log("Dietary List Found", result)
            return response.responseHandlerWithData(res, 200, "Dietary List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Get item verification list====================//

    getitemVerificationList: async (req, res) => {

        try {
            response.log("Request for get item list is==============>", req.body);
            let itemList = await Product.aggregate([
                {
                    $match: { changeRequestApporve: 'Pending', deleteStatus: false }
                },
                {
                    $lookup:
                    {
                        from: "menus",
                        localField: "menuId",
                        foreignField: "_id",
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
                    $lookup:
                    {
                        from: "brands",
                        localField: "brandId",
                        foreignField: "_id",
                        as: "brandData"
                    }
                },
                {
                    $unwind: {
                        path: "$brandData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: { "menuData.branchAssignStatus": true }
                },
                {
                    "$project": {
                        "_id": 1,
                        "createdAt": 1,
                        "menuId": 1,
                        "menuData": 1,
                        "price": 1,
                        "productImage": 1,
                        "changeRequestId": 1,
                        "changeRequestMsg": 1,
                        "changeRequest": 1,
                        "menuCategoryName": 1,
                        "productName": 1,
                        "changeRequestApporve": 1,
                        "brandData.storeName": 1,
                        "brandData._id": 1,

                    }
                },
                { "$sort": { createdAt: -1 } }
            ])
            response.log("Item List Found", itemList)
            return response.responseHandlerWithData(res, 200, "Item List Found", itemList);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Get all area list=============================//

    areaListAll: async (req, res) => {

        try {
            response.log("Request for get area list is==============>", req.body);
            let ids = []
            let myIds = req.body.selectedItems
            for (let i = 0; i < myIds.length; i++) {
                ids.push(ObjectId(myIds[i]._id))
            }
            var queryCheck = { branchId: { $in: ids } }
            let result = await Area.find(queryCheck).sort({ createdAt: -1 }).populate({ path: 'branchId', select: 'branchNameEn address' })
            response.log("Area List Found", result)
            return response.responseHandlerWithData(res, 200, "Area List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Download inactive branch======================//

    downloadInactiveBranch: async (req, res) => {

        try {
            response.log("Request for download inactive is============>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let checkBrand = await Restaurant.findOne({ _id: req.body.brandId })
            if (!checkBrand) {
                response.log("Invalid brand Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            let obj = {
                filename: checkBrand.filename,
                excel: checkBrand.excel
            }
            response.log("Inactive restaurants excel downloaded successfully", obj)
            return response.responseHandlerWithData(res, 200, "Inactive restaurants excel downloaded successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Delete brand==================================//

    deleteBrand: async (req, res) => {

        try {
            response.log("Request for delete brand is=========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { deleteStatus: true } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            await Branch.updateMany({ brandId: req.body.brandId }, { $set: { status: true } }, { new: true })
            response.log("Brand deleted successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Brand deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Order list===================================//

    orddrList: async (req, res) => {

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
                populate: [{ path: 'restaurantId', select: 'branchNameEn address' }, { path: 'brandId', select: 'storeName' }, { path: 'userId', select: 'firstName lastName email countryCode mobileNumber' }, { path: 'driverId', select: 'firstName email countryCode mobileNumber' }]
            }
            let today = new Date();
            let month = today.getUTCMonth() + 1;
            let day = today.getUTCDate();
            let year = today.getUTCFullYear();
            let queryCheck = {}
            let status = ""
            if (req.body.status == "Pending") {
                status = 'Pending'
            }
            if (req.body.status == "Accepted") {
                status = 'Confirmed'
            }
            if (req.body.status == "Order Ready for pickup") {
                status = 'Order Ready for pickup'
            }
            if (req.body.status == "Out for delivery") {
                status = 'Out for delivery'
            }
            if (req.body.status == "Delivered") {
                status = 'Delivered'
            }
            if (req.body.status == "Reject") {
                status = 'Reject'
            }
            if (req.body.status == "Cancel") {
                status = 'Cancel'
            }

            if (req.body.timeframe == "Today") {
                if (status) {
                    queryCheck = {
                        day: day,
                        month: month,
                        year: year,
                        status: status
                    }
                }
                if (status == '') {
                    queryCheck = {
                        day: day,
                        month: month,
                        year: year,
                    }
                }

            }
            if (req.body.timeframe == "Yesterday") {
                let today = new Date()
                today.setDate(today.getDate() - 1)
                let month = today.getUTCMonth() + 1;
                let day = today.getUTCDate();
                let year = today.getUTCFullYear();
                if (status) {
                    queryCheck = {
                        day: day,
                        month: month,
                        year: year,
                        status: status
                    }
                }
                if (status == '') {
                    queryCheck = {
                        day: day,
                        month: month,
                        year: year,
                    }
                }
            }
            let result = await Order.paginate(queryCheck, options)
            response.log("Order List Found", result)
            return response.responseHandlerWithData(res, 200, "Order List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Dashboard count==============================//

    dashboardCount: async (req, res) => {

        try {
            response.log("Request for get dashboard count is============>", req.body);
            let today = new Date();
            let month = today.getUTCMonth() + 1;
            let day = today.getUTCDate();
            let year = today.getUTCFullYear();
            let totalOrderQuery = { day: day, month: month, year }
            let totalOrder = await Order.find(totalOrderQuery).count()
            let totalCancelOrderQuery = {
                $and: [
                    {
                        $or: [
                            { "status": "Cancel" },
                            { "status": "Reject" }
                        ]
                    },
                    {
                        "day": day
                    },
                    {
                        month: month
                    },
                    {
                        year: year
                    }
                ]
            }
            let totalCancelOrder = await Order.find(totalCancelOrderQuery).count()
            let offlineRestro = await Branch.find({ "adminVerificationStatus": "Approve", status: 'Active', closeStatus: true }).count()
            let totalActiveBrand = await Restaurant.find({ "adminVerificationStatus": "Approve", status: 'Active' }).count()
            let onlineRestro = await Branch.find({ "adminVerificationStatus": "Approve", status: 'Active', oepnStatus: true }).count()
            let onlineDriver = await Driver.find({ "adminVerificationStatus": "Approve", status: 'Active', dutyStatus: true }).count()
            let offlineDriver = await Driver.find({ "adminVerificationStatus": "Approve", status: 'Active', dutyStatus: false }).count()
            let obj = {
                totalOrder: totalOrder,
                totalCancelOrder: totalCancelOrder,
                offlineRestro: offlineRestro,
                totalActiveBrand: totalActiveBrand,
                onlineRestro: onlineRestro,
                onlineDriver: onlineDriver,
                offlineDriver: offlineDriver
            }
            response.log("Data found successfully", obj)
            return response.responseHandlerWithData(res, 200, "Data found successfully", obj);

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Offline driver list==========================//

    offlineDriverList: async (req, res) => {

        try {
            response.log("Request for get offline driver list is==============>", req.body);
            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10000,
                sort: { createdAt: -1 },
                select: { password: 0 }
            }
            let queryCheck = { userType: 'Driver', "adminVerificationStatus": "Approve", dutyStatus: false }
            let result = await Driver.paginate(queryCheck, options)
            response.log("Driver List Found", result)
            return response.responseHandlerWithData(res, 200, "Driver List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================Online driver list===========================//

    onlineDriverList: async (req, res) => {

        try {
            response.log("Request for get online driver list is==============>", req.body);
            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10000,
                sort: { createdAt: -1 },
                select: { password: 0 }
            }
            let queryCheck = { userType: 'Driver', "adminVerificationStatus": "Approve", dutyStatus: true }
            let result = await Driver.paginate(queryCheck, options)
            response.log("Driver List Found", result)
            return response.responseHandlerWithData(res, 200, "Driver List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Online restro list==========================//

    onlineRestroList: async (req, res) => {

        try {
            response.log("Request for get online restro list is==============>", req.body);
            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10000,
                sort: { createdAt: -1 },
                select: { password: 0 },
                populate: { path: 'brandId', select: 'storeName' }
            }
            let queryCheck = { "adminVerificationStatus": "Approve", status: 'Active', oepnStatus: true }
            let result = await Branch.paginate(queryCheck, options)
            response.log("Branch List Found", result)
            return response.responseHandlerWithData(res, 200, "Branch List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Offline restro list=========================//

    offlineRestroList: async (req, res) => {

        try {
            response.log("Request for get offline restro list is==============>", req.body);
            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10000,
                sort: { createdAt: -1 },
                select: { password: 0 },
                populate: { path: 'brandId', select: 'storeName' }
            }
            let queryCheck = { "adminVerificationStatus": "Approve", status: 'Active', closeStatus: true }
            let result = await Branch.paginate(queryCheck, options)
            response.log("Branch List Found", result)
            return response.responseHandlerWithData(res, 200, "Branch List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Active brand list==========================//

    activeBrandList: async (req, res) => {

        try {
            response.log("Request for get active brand list is==============>", req.body);
            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10000,
                sort: { createdAt: -1 },
                select: { password: 0 },
                populate: { path: 'brandId', select: 'storeName' }
            }
            let queryCheck = { "adminVerificationStatus": "Approve", status: 'Active', userType: 'Brand' }
            let result = await Restaurant.paginate(queryCheck, options)
            response.log("Brand List Found", result)
            return response.responseHandlerWithData(res, 200, "Brand List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Driver dashboard===========================//

    driverDashboard: async (req, res) => {

        try {

            response.log("Request for get driver dashboard is=============>", req.body);
            let today = new Date();
            let month = today.getUTCMonth() + 1;
            let day = today.getUTCDate();
            let year = today.getUTCFullYear();
            let totalRideQuery = { day: day, month: month, year, status: 'Out for delivery', serviceType: 'Full Service' }
            let totalRide = await Order.find(totalRideQuery).count()
            let start = new Date();
            start.setHours(0, 0, 0, 0);
            let end = new Date();
            end.setHours(23, 59, 59, 999);
            let todayRegQuery = { createdAt: { $gte: start, $lt: end } }
            let todayRegis = await Driver.find(todayRegQuery).count()
            let obj = {
                totalRide: totalRide,
                todayRegis: todayRegis
            }
            response.log("Data List Found", obj)
            return response.responseHandlerWithData(res, 200, "Data List Found", obj);

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Graph data==================================//

    graphData: async (req, res) => {

        try {
            response.log("Request for get graph is===========>", req.body);
            let dateList = []
            let queryCheck = { status: 'Delivered', serviceType: req.body.serviceType }
            let stDate = ''
            let enDate = ''
            let getDaysBetweenDates = function (startDate, endDate) {
                let now = startDate.clone(), dates = [];

                while (now.isSameOrBefore(endDate)) {
                    dates.push(now.format('YYYY-MM-DD'));
                    now.add(1, 'days');
                }
                return dates;
            };
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let convertedWeekDate = moment().startOf('isoWeek').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedWeekDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                stDate = moment().startOf('isoWeek').format('ll')
                enDate = moment().format('ll')
                queryCheck.orderDate = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                let convertedMonthDate = moment().startOf('month').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedMonthDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                stDate = moment().startOf('month').format('ll')
                enDate = moment().format('ll')
                queryCheck.orderDate = { $gte: monthDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Year") {
                let yearDate = new Date(moment().startOf('year').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                let convertedYearDate = moment().startOf('year').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedYearDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                stDate = moment().startOf('year').format('ll')
                enDate = moment().format('ll')
                queryCheck.orderDate = { $gte: yearDate, $lte: todayDate }
            }
            if (req.body.fromDate && req.body.toDate) {
                let fromDate = new Date(moment(req.body.fromDate).format())
                let todayDate = new Date(req.body.toDate)
                todayDate.setHours(23, 59, 59, 999);
                let startDate = moment(req.body.fromDate);
                let endDate = moment(req.body.toDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                stDate = moment(req.body.fromDate).format('ll')
                enDate = moment(req.body.toDate).format('ll')
                queryCheck.orderDate = { $gte: fromDate, $lte: todayDate }
            }
            let actualGraphData = []
            for (let i = 0; i < dateList.length; i++) {
                let orderList = await Order.aggregate([
                    {
                        $match: {
                            deliveryDate: dateList[i],
                            serviceType: req.body.serviceType,
                            status: 'Delivered'
                        }
                    },
                    {
                        $group:
                        {
                            _id: "$deliveryDate",
                            "orderCount": { "$sum": 1 }

                        }
                    }
                ])
                if (orderList.length > 0) {
                    let obj = {
                        date: dateList[i],
                        value: orderList[0].orderCount
                    }
                    actualGraphData.push(obj)
                }
                if (orderList.length == 0) {
                    let obj = {
                        date: dateList[i],
                        value: 0
                    }
                    actualGraphData.push(obj)
                }
            }
            let totalOrder = await Order.find(queryCheck).count()
            queryCheck.status = "Cancel"
            let cancelOrders = await Order.find(queryCheck).count()
            // let obj = {
            //     orderList: actualGraphData,
            //     totalOrder: totalOrder,
            //     cancelOrders: cancelOrders,
            //     startDate: stDate,
            //     endDate: enDate
            // }
            let obj = {
                orderList: [],
                totalOrder: 0,
                cancelOrders: 0,
                startDate: stDate,
                endDate: enDate
            }
            response.log("Order list found successfully", obj);
            return response.responseHandlerWithData(res, 200, "Order list found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Revenue data===============================//

    revenueData: async (req, res) => {

        try {
            response.log("Request for get revenue is===========>", req.body);
            let dateList = []
            let queryCheck = { status: 'Delivered', serviceType: req.body.serviceType }
            let stDate = ''
            let enDate = ''
            let getDaysBetweenDates = function (startDate, endDate) {
                let now = startDate.clone(), dates = [];

                while (now.isSameOrBefore(endDate)) {
                    dates.push(now.format('YYYY-MM-DD'));
                    now.add(1, 'days');
                }
                return dates;
            };
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let convertedWeekDate = moment().startOf('isoWeek').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedWeekDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                stDate = moment().startOf('isoWeek').format('ll')
                enDate = moment().format('ll')
                queryCheck.orderDate = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                let convertedMonthDate = moment().startOf('month').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedMonthDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                stDate = moment().startOf('month').format('ll')
                enDate = moment().format('ll')
                queryCheck.orderDate = { $gte: monthDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Year") {
                let yearDate = new Date(moment().startOf('year').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                let convertedYearDate = moment().startOf('year').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedYearDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                stDate = moment().startOf('year').format('ll')
                enDate = moment().format('ll')
                queryCheck.orderDate = { $gte: yearDate, $lte: todayDate }
            }
            if (req.body.fromDate && req.body.toDate) {
                let fromDate = new Date(moment(req.body.fromDate).format())
                let todayDate = new Date(req.body.toDate)
                todayDate.setHours(23, 59, 59, 999);
                let startDate = moment(req.body.fromDate);
                let endDate = moment(req.body.toDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                stDate = moment(req.body.fromDate).format('ll')
                enDate = moment(req.body.toDate).format('ll')
                queryCheck.orderDate = { $gte: fromDate, $lte: todayDate }
            }
            let actualGraphData = []
            for (let i = 0; i < dateList.length; i++) {
                let orderList = await Order.aggregate([
                    {
                        $match: {
                            deliveryDate: dateList[i],
                            serviceType: req.body.serviceType,
                            status: 'Delivered'
                        }
                    },
                    {
                        $group:
                        {
                            _id: "$deliveryDate",
                            sumTotal: { "$sum": "$total" },
                        }
                    }
                ])
                if (orderList.length > 0) {
                    let obj = {
                        date: dateList[i],
                        value: orderList[0].sumTotal
                    }
                    actualGraphData.push(obj)
                }
                if (orderList.length == 0) {
                    let obj = {
                        date: dateList[i],
                        value: 0
                    }
                    actualGraphData.push(obj)
                }
            }
            let totalRevenue = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $group:
                    {
                        _id: "$deliveryDate",
                        sumTotal: { "$sum": "$total" },
                    }
                }
            ])
            let revenue = 0
            if (totalRevenue.length > 0) {
                revenue = totalRevenue[0].sumTotal
            }
            queryCheck.status = "Cancel"
            let cancellRevenue = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $group:
                    {
                        _id: "$deliveryDate",
                        sumTotal: { "$sum": "$total" },
                    }
                }
            ])
            let cancelledRevenue = 0
            if (cancellRevenue.length > 0) {
                cancelledRevenue = cancellRevenue[0].sumTotal
            }
            // let obj = {
            //     orderList: actualGraphData,
            //     totalRevenue: revenue,
            //     cancelledRevenue: cancelledRevenue,
            //     startDate: stDate,
            //     endDate: enDate
            // }
            let obj = {
                orderList: [],
                totalRevenue: 0,
                cancelledRevenue: 0,
                startDate: stDate,
                endDate: enDate
            }
            response.log("Order list found successfully", obj);
            return response.responseHandlerWithData(res, 200, "Order list found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Revenue per order============================//

    revenuePerOrderData: async (req, res) => {

        try {
            response.log("Request for get revenue is===========>", req.body);
            let dateList = []
            let queryCheck = { status: 'Delivered', serviceType: req.body.serviceType }
            let stDate = ''
            let enDate = ''
            let getDaysBetweenDates = function (startDate, endDate) {
                let now = startDate.clone(), dates = [];

                while (now.isSameOrBefore(endDate)) {
                    dates.push(now.format('YYYY-MM-DD'));
                    now.add(1, 'days');
                }
                return dates;
            };
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let convertedWeekDate = moment().startOf('isoWeek').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedWeekDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                stDate = moment().startOf('isoWeek').format('ll')
                enDate = moment().format('ll')
                queryCheck.orderDate = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                let convertedMonthDate = moment().startOf('month').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedMonthDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                stDate = moment().startOf('month').format('ll')
                enDate = moment().format('ll')
                queryCheck.orderDate = { $gte: monthDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Year") {
                let yearDate = new Date(moment().startOf('year').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                let convertedYearDate = moment().startOf('year').format("YYYY-MM-DD")
                let convertedTodayDate = moment().format('YYYY-MM-DD')
                let startDate = moment(convertedYearDate);
                let endDate = moment(convertedTodayDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                stDate = moment().startOf('year').format('ll')
                enDate = moment().format('ll')
                queryCheck.orderDate = { $gte: yearDate, $lte: todayDate }
            }
            if (req.body.fromDate && req.body.toDate) {
                let fromDate = new Date(moment(req.body.fromDate).format())
                let todayDate = new Date(req.body.toDate)
                todayDate.setHours(23, 59, 59, 999);
                let startDate = moment(req.body.fromDate);
                let endDate = moment(req.body.toDate);
                dateList = getDaysBetweenDates(startDate, endDate);
                stDate = moment(req.body.fromDate).format('ll')
                enDate = moment(req.body.toDate).format('ll')
                queryCheck.orderDate = { $gte: fromDate, $lte: todayDate }
            }
            let actualGraphData = []
            for (let i = 0; i < dateList.length; i++) {
                let orderList = await Order.aggregate([
                    {
                        $match: {
                            deliveryDate: dateList[i],
                            serviceType: req.body.serviceType,
                            status: 'Delivered'
                        }
                    },
                    {
                        $group:
                        {
                            _id: "$deliveryDate",
                            sumTotal: { "$sum": "$total" },
                        }
                    }
                ])
                if (orderList.length > 0) {
                    let obj = {
                        date: dateList[i],
                        value: orderList[0].sumTotal
                    }
                    actualGraphData.push(obj)
                }
                if (orderList.length == 0) {
                    let obj = {
                        date: dateList[i],
                        value: 0
                    }
                    actualGraphData.push(obj)
                }
            }
            let totalOrder = await Order.find(queryCheck).count()
            let totalRevenue = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $group:
                    {
                        _id: "$deliveryDate",
                        sumTotal: { "$sum": "$total" },
                    }
                }
            ])
            let revenue = 0
            let perOrderRevenue = 0
            if (totalRevenue.length > 0) {
                revenue = totalRevenue[0].sumTotal
                perOrderRevenue = revenue / totalOrder
            }
            // let obj = {
            //     orderList: actualGraphData,
            //     totalOrder: totalOrder,
            //     perOrderRevenue: perOrderRevenue,
            //     startDate: stDate,
            //     endDate: enDate
            // }
            let obj = {
                orderList: [],
                totalOrder: 0,
                perOrderRevenue: 0,
                startDate: stDate,
                endDate: enDate
            }
            response.log("Order list found successfully", obj);
            return response.responseHandlerWithData(res, 200, "Order list found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Get driver list for map======================//

    getDriverDataForMap: async (req, res) => {

        try {
            response.log("Request for get driver data for map is=============>", req.body);
            let restDriverList = await Driver.aggregate([
                {
                    $match: {
                        status: "Active",
                        adminVerificationStatus: "Approve",
                        trackingStatus: 'Rest'
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        firstName: 1,
                        countryCode: 1,
                        mobileNumber: 1,
                        email: 1,
                        profilePic: 1,
                        trackingStatus: 1,
                        orderMaintain: 1,
                        latitude: 1,
                        longitude: 1
                    }
                },
                { "$sort": { createdAt: -1 } }
            ])
            response.log("Rest driver data========>", restDriverList)
            let busyDriverQuery = {
                $and: [
                    {
                        $or: [
                            { "trackingStatus": "Restaurant" },
                            { "trackingStatus": "User" }
                        ]
                    },
                    {
                        status: "Active"
                    },
                    {
                        adminVerificationStatus: "Approve"
                    }
                ]
            }
            let busyDriver = await Driver.aggregate([
                {
                    $match: busyDriverQuery
                },
                {
                    $unwind: {
                        path: "$orderMaintain",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup:
                    {
                        from: "branchs",
                        localField: "orderMaintain.restaurantId",
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
                        localField: "orderMaintain.userId",
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
                    $lookup:
                    {
                        from: "productorders",
                        localField: "orderMaintain.orderId",
                        foreignField: "_id",
                        as: "orderData"
                    }
                },
                {
                    $unwind: {
                        path: "$orderData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {

                    "$project": {
                        "_id": 1,
                        firstName: 1,
                        countryCode: 1,
                        mobileNumber: 1,
                        email: 1,
                        profilePic: 1,
                        orderMaintain: 1,
                        trackingStatus: 1,
                        "orderData.orderNumber": 1,
                        "orderData.status": 1,
                        "orderData.orderAcceptByRestroTime": 1,
                        "orderData.etaTime": 1,
                        "userData.firstName": 1,
                        "userData.lastName": 1,
                        "userData.countryCode": 1,
                        "userData.mobileNumber": 1,
                        "restaurantData.mobileNumber": 1,
                        "restaurantData.countryCode": 1,
                        "restaurantData.branchNameEn": 1,
                        latitude: 1,
                        longitude: 1
                    }
                },
                { "$sort": { createdAt: -1 } }
            ])
            response.log("Busy driver is========>", busyDriver);
            let obj = {
                restDriverList: restDriverList.concat(busyDriver),
                totalDrivers: restDriverList.length + busyDriver.length
            }
            response.log("Driver list found successfully", obj);
            return response.responseHandlerWithData(res, 200, "Driver list found successfully", obj);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },


    //========================================Add cuisine==================================//

    addCuisineCategory: async (req, res) => {

        try {
            response.log("Request for add cuisine is============>", req.body);
            req.checkBody('name', 'Something went wrong').notEmpty();
            req.checkBody('cuisineId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            let checkCuisine = await Cuisinecategory.findOne({ name: req.body.name, cuisineId: req.body.cuisineId })
            if (checkCuisine) {
                response.log("Cuisine already exist");
                return response.responseHandlerWithMessage(res, 501, "Cuisine already exist");
            }

            let obj = new Cuisinecategory({
                name: req.body.name,
                cuisineId: req.body.cuisineId
            })
            let data = await obj.save()
            response.log("Cuisine added successfully")
            return response.responseHandlerWithData(res, 200, "Cuisine added successfully", data);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=======================================Update cuisine===============================//

    updateCuisineCategory: async (req, res) => {

        try {
            response.log("Request for update cuisine is============>", req.body);
            req.checkBody('name', 'Something went wrong').notEmpty();
            req.checkBody('cuisineCategoryId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                name: req.body.name
            }
            let data = await Cuisinecategory.findByIdAndUpdate({ _id: req.body.cuisineCategoryId }, { $set: obj }, { new: true })
            if (!data) {
                response.log("Invalid cuisine Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Cuisine updated successfully")
            return response.responseHandlerWithData(res, 200, "Cuisine updated successfully", data);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Delete cuisine==============================//

    deleteCuisineCategory: async (req, res) => {

        try {
            response.log("Request for cuisine delete is============>", req.body);
            req.checkBody('cuisineCategoryId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            let cuisineData = await Cuisine.findByIdAndUpdate({ _id: req.body.cuisineId }, { $set: { deleteStatus: true } }, { new: true })

            // let cuisineData = await Cuisinecategory.findByIdAndRemove({ _id: req.body.cuisineCategoryId })
            if (!cuisineData) {
                response.log("Invalid cuisine Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Cuisine deleted successfully", cuisineData)
            return response.responseHandlerWithMessage(res, 200, "Cuisine deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Cuisine list================================//

    cuisineCategoryList: async (req, res) => {

        try {
            response.log("Request for get notification list is==============>", req.body);
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
            }
            let queryCheck = { deleteStatus: false }
            if (!req.body.startDate == '' && !req.body.endDate == "") {
                queryCheck.createdAt = { $gte: req.body.startDate, $lte: req.body.endDate }
            }
            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "name": { $regex: "^" + req.body.search, $options: 'i' } }
                    ]
                }]
            }
            let result = await Cuisinecategory.paginate(queryCheck, options)
            response.log("Cuisine List Found", result)
            return response.responseHandlerWithData(res, 200, "Cuisine List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================CuisineCategory list by id =======================//

    cuisineSubCategoryList: async (req, res) => {

        try {
            response.log("Request for get notification list is==============>", req.body);
            req.checkBody('pageNumber', 'Something went wrong').notEmpty();
            req.checkBody('limit', 'Something went wrong').notEmpty();
            req.checkBody('cuisineId', 'Something went wrong').notEmpty();

            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = { cuisineId: req.body.cuisineId, deleteStatus: false }
            if (!req.body.startDate == '' && !req.body.endDate == "") {
                queryCheck.createdAt = { $gte: req.body.startDate, $lte: req.body.endDate }
            }
            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "name": { $regex: "^" + req.body.search, $options: 'i' } }
                    ]
                }]
            }
            let result = await Cuisinecategory.paginate(queryCheck, options)
            response.log("Cuisine List Found", result)
            return response.responseHandlerWithData(res, 200, "Cuisine List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //========================================= Particular Sub-Cuisine =========================//

    particularSubCuisine: async (req, res) => {

        try {
            response.log("Request for cuisine is============>", req.body);
            req.checkBody('cuisineCategoryId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let cuisineData = await Cuisinecategory.findOne({ _id: req.body.cuisineCategoryId })
            if (!cuisineData) {
                response.log("Invalid cuisine Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Cuisine data", cuisineData)
            return res.send({ status: 200, message: "Cuisine Data", Data: cuisineData })
            // return response.responseHandlerWithMessage(res, 200, "Cuisine Data",cuisineData);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================YUpdate Status Sub-Cuisine ======================//

    statusUpdateCuisineCategory: async (req, res) => {

        try {
            response.log("Request for update cuisine is============>", req.body);
            // req.checkBody('name', 'Something went wrong').notEmpty();
            req.checkBody('cuisineCategoryId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let obj = {
                status: req.body.status
            }
            let data = await Cuisinecategory.findByIdAndUpdate({ _id: req.body.cuisineCategoryId }, { $set: obj }, { new: true })
            if (!data) {
                response.log("Invalid cuisine Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Status updated successfully")
            return response.responseHandlerWithData(res, 200, "Status updated successfully", data);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==========================================Get menuList ===========================//

    menuList: async (req, res) => {
        try {

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }

            let totalMenu = await Menu.find({ "brandId": ObjectId(req.body.brandId) }).count()



            let MenuList = await Menu.aggregate([
                {
                    $match: {
                        "brandId": ObjectId(req.body.brandId),
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'deleteStatus': 1,
                        'adminVerificationStatus': 1,
                        'menuName': 1,
                        'status': 1,
                        'brandId': 1,
                        'updatedAt': 1,
                        'createdAt': 1,

                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])

            return res.send({ response_code: 200, message: "Menu List", Data: MenuList, TotalCount: totalMenu })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //============================================ menu verify by Admin ==================//

    verifyMenu: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('menuId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Menu.findByIdAndUpdate({ _id: req.body.menuId }, { $set: { adminVerificationStatus: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid menu Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Status updated successfully", updateUserStatus)
            response.responseHandlerWithMessage(res, 200, "Status updated successfully");

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================== update menu status =============================//

    updateMenuStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('menuId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Menu.findByIdAndUpdate({ _id: req.body.menuId }, { $set: { status: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            return response.responseHandlerWithMessage(res, 200, "Status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===================================== Delete menu ====================================//

    deleteMenu: async (req, res) => {

        try {
            response.log("Request for cuisine delete is============>", req.body);
            req.checkBody('menuId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let menuData = await Menu.findByIdAndRemove({ _id: req.body.menuId })
            if (!menuData) {
                response.log("Invalid cuisine Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("Cuisine deleted successfully", menuData)
            return response.responseHandlerWithMessage(res, 200, "Cuisine deleted successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //================================== sell items ========================================//

    sellItemsList: async (req, res) => {
        try {

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }

            let menuIdArr = []


            let totalmenus = await Menu.find({ "brandId": ObjectId(req.body.brandId) })

            console.log("totalmenus==>", totalmenus)

            for (let i = 0; i < totalmenus.length; i++) {
                menuIdArr.push(ObjectId(totalmenus[i]._id))
            }

            console.log("menuIdArr==>", menuIdArr)

            let totalRestaurant = await Products.find({ "sellingStatus": true, "menuId": { "$in": menuIdArr } }).count()


            let sellItemList = await Products.aggregate([
                {
                    $match: {
                        "sellingStatus": true,
                        "menuId": { "$in": menuIdArr },

                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'foodName': 1,
                        'description': 1,
                        'foodImage': 1,
                        'expiryDate': 1,
                        'expiryTime': 1,
                        'foodQuantity': 1,
                        'price': 1,
                        'status': 1,
                        'discountAmount': 1,
                        'discountPer': 1,
                        'updatedAt': 1,
                        'createdAt': 1,

                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])


            return res.send({ response_code: 200, message: "Restaurant List", Data: sellItemList, TotalCount: totalRestaurant })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    updateSellproduct: async (req, res) => {
        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Products.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { status: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            // await Restaurant.updateMany({ brandId: req.body.brandId }, { $set: { status: req.body.status } }, { new: true })

            response.log("Status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    updateProdutStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('menuId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Product.findByIdAndUpdate({ _id: req.body.menuId }, { $set: { status: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            return response.responseHandlerWithMessage(res, 200, "Status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===================================  Order List      =============================================//

    orderListAdmin: async (req, res) => {
        try {

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = {}

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
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

                let totalOrder = await Order.find(queryCheck).count()

                if (req.body.search) {
                    queryCheck.$and = [{
                        $or: [
    
                            { "orderNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                            // { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                            // { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                        ]
                    }]
                }

                let orderList = await Order.aggregate([
                    {
                        $match: queryCheck
                    },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "usersDetail"
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "brands",
                            localField: "storeId",
                            foreignField: "_id",
                            as: "restaurantDetail"
                        }
                    },
    
    
                    {
                        $project: {
                            '_id': 1,
                            'status': 1,
                            'saveAmount': 1,
                            'paymentStatus': 1,
                            'refundStatus': 1,
                            'orderNumber': 1,
                            'paymentMode': 1,
                            'total': 1,
                            'status': 1,
                            'storeId': 1,
                            'updatedAt': 1,
                            'createdAt': 1,
                            'orderData': 1,
                            'usersDetail.name': 1,
                            'actualOrderDate': 1,
                            'usersDetail._id': 1,
                            'usersDetail.userNumber': 1,
                            'restaurantDetail._id': 1,
                            'restaurantDetail.empNumber': 1,
                            'restaurantDetail.businessName': 1,
                            'restaurantDetail.address': 1,
                        }
                    },
                    // {
                    //     $match: {
                    //         "menuDetails.status":"Active"
                    //     }
                    // },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    // { $skip: skip },
                    // { $limit: limit },
                ])
    
                return res.send({ response_code: 200, message: "Restaurant List", Data: orderList, TotalCount: totalOrder })
    

                // let monthDate = new Date(moment().clone().startOf('month').format())
                // let todayDate = new Date()
                // todayDate.setHours(23, 59, 59, 999);
                // queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
            }

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [

                        { "orderNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }

            console.log("queryCheck==>", queryCheck)

            let totalOrder = await Order.find(queryCheck).count()


            let orderList = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "restaurantDetail"
                    }
                },


                {
                    $project: {
                        '_id': 1,
                        'status': 1,
                        'saveAmount': 1,
                        'paymentStatus': 1,
                        'refundStatus': 1,
                        'orderNumber': 1,
                        'paymentMode': 1,
                        'total': 1,
                        'status': 1,
                        'storeId': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'orderData': 1,
                        'usersDetail.name': 1,
                        'actualOrderDate': 1,
                        'usersDetail._id': 1,
                        'usersDetail.userNumber': 1,
                        'restaurantDetail._id': 1,
                        'restaurantDetail.empNumber': 1,
                        'restaurantDetail.businessName': 1,
                        'restaurantDetail.address': 1,
                    }
                },
                // {
                //     $match: {
                //         "menuDetails.status":"Active"
                //     }
                // },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])

            return res.send({ response_code: 200, message: "Restaurant List", Data: orderList, TotalCount: totalOrder })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===================================  Download Complete Order List      =============================================//

    downloadOrderListAdmin: async (req, res) => {
        try {
            // var skip = 0
            // var limit = 10
            // if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
            //     skip = (Number(req.body.pageNumber) - 1) * 10
            // }
            // if (req.body.limit && Number(req.body.limit) != 0) {
            //     limit = Number(req.body.limit)
            // }
            // let options = {
            //     page: Number(req.body.pageNumber) || 1,
            //     limit: Number(req.body.limit) || 50,
            //     sort: { createdAt: -1 },
            // }
            let queryCheck = {}

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
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

                let totalOrder = await Order.find(queryCheck).count()

                if (req.body.search) {
                    queryCheck.$and = [{
                        $or: [
    
                            { "orderNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                            // { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                            // { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                        ]
                    }]
                }

                let orderList = await Order.aggregate([
                    {
                        $match: queryCheck
                    },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "usersDetail"
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "brands",
                            localField: "storeId",
                            foreignField: "_id",
                            as: "restaurantDetail"
                        }
                    },
    
    
                    {
                        $project: {
                            '_id': 1,
                            'status': 1,
                            'saveAmount': 1,
                            'paymentStatus': 1,
                            'refundStatus': 1,
                            'orderNumber': 1,
                            'paymentMode': 1,
                            'total': 1,
                            'status': 1,
                            'storeId': 1,
                            'updatedAt': 1,
                            'createdAt': 1,
                            'orderData': 1,
                            'usersDetail.name': 1,
                            'actualOrderDate': 1,
                            'usersDetail._id': 1,
                            'usersDetail.userNumber': 1,
                            'restaurantDetail._id': 1,
                            'restaurantDetail.empNumber': 1,
                            'restaurantDetail.businessName': 1,
                            'restaurantDetail.address': 1,
                        }
                    },
                    // {
                    //     $match: {
                    //         "menuDetails.status":"Active"
                    //     }
                    // },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    // { $skip: skip },
                    // { $limit: limit },
                ])
    
                return res.send({ response_code: 200, message: "Restaurant List", Data: orderList, TotalCount: totalOrder })
    

                // let monthDate = new Date(moment().clone().startOf('month').format())
                // let todayDate = new Date()
                // todayDate.setHours(23, 59, 59, 999);
                // queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
            }

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [

                        { "orderNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }

            console.log("queryCheck==>", queryCheck)

            let totalOrder = await Order.find(queryCheck).count()
            // console.log("totalOrder===============================>", totalOrder)



            let orderList = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "restaurantDetail"
                    }
                },
                {
                    $unwind:
                    {
                        path: '$usersDetail',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind:
                    {
                        path: '$restaurantDetail'
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'status': 1,
                        'saveAmount': 1,
                        'paymentStatus': 1,
                        'refundStatus': 1,
                        'orderNumber': 1,
                        'paymentMode': 1,
                        'total': 1,
                        'status': 1,
                        'storeId': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'orderData': 1,
                        'usersName':'$usersDetail.name',
                        'actualOrderDate': 1,
                        'userId': '$usersDetail._id',
                        'usersNumber':'$usersDetail.userNumber',
                        'restaurantId': '$restaurantDetail._id',
                        'restaurantEmpNumber': '$restaurantDetail.empNumber',
                        'restaurantBusinessName': '$restaurantDetail.businessName',
                        'restaurantAddress': '$restaurantDetail.address'
                    }
                },
                // {
                //     $match: {
                //         "menuDetails.status":"Active"
                //     }
                // },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                // { $skip: skip },
                // { $limit: limit },
            ])
            console.log("totalOrder===============================>", orderList.length)
            
            orderList = orderList.map(
                d => {
                  return {
                    _id : d._id,
                    userId : d.userId,
                    saveAmount : d.saveAmount,
                    paymentStatus : d.paymentStatus,
                    refundStatus : d.refundStatus,
                    orderNumber : d.orderNumber,
                    paymentMode :d.paymentMode,
                    total : d.total,
                    storeId : d.storeId,
                    updatedAt: d.updatedAt,
                    createdAt: date.format(d.createdAt, "DD/MM/YYYY HH:mm"),
                    orderData: d.orderData,
                    usersName: d.usersName,
                    actualOrderDate: d.actualOrderDate,
                    usersNumber: d.usersNumber,
                    restaurantId: d.restaurantId,
                    restaurantEmpNumber: d.restaurantEmpNumber,
                    restaurantBusinessName: d.restaurantBusinessName,
                    restaurantAddress: d.restaurantAddress,
                  }
                }          
              )
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Sheet1'); //creating worksheet
            //  WorkSheet Header
            worksheet.columns = [
            {
                header: 'Order ID',
                key: 'orderNumber',
                width: 20
            },
            {
                header: 'Customer ID',
                key: 'usersNumber',
                width: 20
            },
            {
                header: 'Restaurant ID',
                key: 'restaurantEmpNumber',
                width: 20
            },
            {
                header: 'Customer Name',
                key: 'usersName',
                width: 20
            },
            {
                header: 'Restaurant Name',
                key: 'restaurantBusinessName',
                width: 20
            },
            {
                header: 'Restaurant Location',
                key: 'restaurantAddress',
                width: 20
            },
            {
                header: 'Amount',
                key: 'total',
                width: 20
            },
            {
                header: 'Order Date & Time',
                key: 'createdAt',
                width: 20
            },
            {
                header: 'Order Status',
                key: 'status',
                width: 20
            },
            {
                header: 'Refund Status & type',
                key: 'refundStatus',
                width: 20
            }    
            ];
            //Add Array Rows
            worksheet.addRows(orderList);
    
            //create file
            let file = await workbook.xlsx.writeFile(`orderList.xlsx`)
            let link = `https://saveeat.in:3035/api/v1/adminUser/getOrderListFile/orderList.xlsx`

            return res.send({ response_code: 200, message: "Download link", Data: link, TotalCount: totalOrder })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    downloadTransectionListAdmin: async (req, res) => {
        try {
            // var skip = 0
            // var limit = 10
            // if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
            //     skip = (Number(req.body.pageNumber) - 1) * 10
            // }
            // if (req.body.limit && Number(req.body.limit) != 0) {
            //     limit = Number(req.body.limit)
            // }
            // let options = {
            //     page: Number(req.body.pageNumber) || 1,
            //     limit: Number(req.body.limit) || 50,
            //     sort: { createdAt: -1 },
            // }
            let queryCheck = {}
            let orderList

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
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

                let totalOrder = await Order.find(queryCheck).count()

                if (req.body.search) {
                    queryCheck.$and = [{
                        $or: [
    
                            { "orderNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                            // { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                            // { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                        ]
                    }]
                }

                orderList = await Order.aggregate([
                    {
                        $match: queryCheck
                    },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "usersDetail"
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "brands",
                            localField: "storeId",
                            foreignField: "_id",
                            as: "restaurantDetail"
                        }
                    },
    
    
                    {
                        $project: {
                            '_id': 1,
                            'status': 1,
                            'saveAmount': 1,
                            'paymentStatus': 1,
                            'refundStatus': 1,
                            'orderNumber': 1,
                            'paymentMode': 1,
                            'total': 1,
                            'status': 1,
                            'storeId': 1,
                            'updatedAt': 1,
                            'createdAt': 1,
                            'orderData': 1,
                            'usersDetail.name': 1,
                            'actualOrderDate': 1,
                            'usersDetail._id': 1,
                            'usersDetail.userNumber': 1,
                            'restaurantDetail._id': 1,
                            'restaurantDetail.empNumber': 1,
                            'restaurantDetail.businessName': 1,
                            'restaurantDetail.address': 1,
                        }
                    },
                    // {
                    //     $match: {
                    //         "menuDetails.status":"Active"
                    //     }
                    // },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    // { $skip: skip },
                    // { $limit: limit },
                ])
    
                // return res.send({ response_code: 200, message: "Restaurant List", Data: orderList, TotalCount: totalOrder })
    

                // let monthDate = new Date(moment().clone().startOf('month').format())
                // let todayDate = new Date()
                // todayDate.setHours(23, 59, 59, 999);
                // queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
            }

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [

                        { "orderNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }

            console.log("queryCheck==>", queryCheck)

            let totalOrder = await Order.find(queryCheck).count()
            // console.log("totalOrder===============================>", totalOrder)



            orderList = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "restaurantDetail"
                    }
                },
                {
                    $unwind:
                    {
                        path: '$usersDetail',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind:
                    {
                        path: '$restaurantDetail'
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'status': 1,
                        'saveAmount': 1,
                        'paymentStatus': 1,
                        'refundStatus': 1,
                        'orderNumber': 1,
                        'paymentMode': 1,
                        'total': 1,
                        'status': 1,
                        'storeId': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'orderData': 1,
                        'usersName':'$usersDetail.name',
                        'actualOrderDate': 1,
                        'userId': '$usersDetail._id',
                        'usersNumber':'$usersDetail.userNumber',
                        'restaurantId': '$restaurantDetail._id',
                        'restaurantEmpNumber': '$restaurantDetail.empNumber',
                        'restaurantBusinessName': '$restaurantDetail.businessName',
                        'restaurantAddress': '$restaurantDetail.address'
                    }
                },
                // {
                //     $match: {
                //         "menuDetails.status":"Active"
                //     }
                // },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                // { $skip: skip },
                // { $limit: limit },
            ])
            console.log("totalOrder===============================>", orderList.length)
            
            orderList = orderList.map(
                d => {
                  return {
                    _id : d._id,
                    userId : d.userId,
                    saveAmount : d.saveAmount,
                    paymentStatus : d.paymentStatus,
                    refundStatus : d.refundStatus,
                    orderNumber : d.orderNumber,
                    paymentMode :d.paymentMode,
                    total : d.total,
                    storeId : d.storeId,
                    updatedAt: d.updatedAt,
                    createdAt: date.format(d.createdAt, "DD/MM/YYYY HH:mm"),
                    orderData: d.orderData,
                    usersName: d.usersName,
                    actualOrderDate: d.actualOrderDate,
                    usersNumber: d.usersNumber,
                    restaurantId: d.restaurantId,
                    restaurantEmpNumber: d.restaurantEmpNumber,
                    restaurantBusinessName: d.restaurantBusinessName,
                    restaurantAddress: d.restaurantAddress,
                    status : d.status
                  }
                }          
              )
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Sheet1'); //creating worksheet
            //  WorkSheet Header
            worksheet.columns = [
            {
                header: 'Order ID',
                key: 'orderNumber',
                width: 20
            },
            {
                header: 'Customer ID',
                key: 'usersNumber',
                width: 20
            },
            {
                header: 'Customer Name',
                key: 'usersName',
                width: 20
            },
            {
                header: 'Restaurant Name',
                key: 'restaurantBusinessName',
                width: 20
            },
            {
                header: 'Order Amount',
                key: 'total',
                width: 20
            },
            {
                header: 'Payment mode',
                key: 'paymentMode',
                width: 20
            },
            {
                header: 'Status',
                key: 'status',
                width: 20
            },
            {
                header: 'Refund Status & type',
                key: 'refundStatus',
                width: 20
            },
            {
                header: 'Store ID',
                key: 'restaurantEmpNumber',
                width: 20
            },
            {
                header: 'Location',
                key: 'restaurantAddress',
                width: 20
            },       
            {
                header: 'Order Date & Time',
                key: 'createdAt',
                width: 20
            }
            ];
            //Add Array Rows
            worksheet.addRows(orderList);
    
            //create file
            let file = await workbook.xlsx.writeFile(`transectionList.xlsx`)
            let link = `https://saveeat.in:3035/api/v1/adminUser/getOrderListFile/transectionList.xlsx`

            return res.send({ response_code: 200, message: "Download link", Data: link, TotalCount: totalOrder })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    getOrderListFile: async (req, res) => {
        try {
          var filePath = path.join(__dirname, '../' + req.params.fileName);
          console.log("File path is===========>", filePath);
          res.writeHead(200, {
              'Content-Type': 'application/vnd.ms-excel',
          });
          var readStream = fs.createReadStream(filePath);
          readStream.pipe(res);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================== Particular Order ============================================//

    // particularOrderAmin: async (req, res) => {
    //     try {

             
    //         let totalAmount = 0
    //         let totalPrice = 0
    //         let totalQuantity = 0
    //         let totalDiscount = 0
    //         let totalAmountQnty = 0
    //         let itemtax = 0
    //         let totalTax = 0
    //         let restaurantTotalAmount = 0
    //         let totalCommisionAmount = 0
    //         let totalCommisionIntax = 0
    //         let totalStoreProeceds = 0
    //         let totalSaveItAmount = 0
    //         let userTotal = 0
    //         let totalWeight = 0

    //         let productPrice

    //         let totalCommisionRes = 0
    //         let totalDiscountPrice = 0
    //         let totalAmountafterDiscount = 0 
    //         let totalcommissionInx = 0
    //         let commissionAmount = 0
    //         let storeProceed = 0
    //         let totalSaveeatFee = 0

    //         let saveEatFees = 0
    //         let SaveEatFeesTax = 0

    //         let userTotals = 0





    //         let orderList = await Order.aggregate([
    //             {
    //                 $match:
    //                 {
    //                     _id: ObjectId(req.body.orderId)
    //                 }

    //             },
    //             {
    //                 $lookup:
    //                 {
    //                     from: "users",
    //                     localField: "userId",
    //                     foreignField: "_id",
    //                     as: "usersDetail"
    //                 }
    //             },
    //             {
    //                 $lookup:
    //                 {
    //                     from: "brands",
    //                     localField: "storeId",
    //                     foreignField: "_id",
    //                     as: "restaurantDetail"
    //                 }
    //             },
    //             {
    //                 $lookup:
    //                 {
    //                     from: "mainorders",
    //                     localField: "storeData[0].storeId",
    //                     foreignField: "_id",
    //                     as: "orderDetail"
    //                 }
    //             },


    //             {
    //                 $project: {
    //                     '_id': 1,
    //                     'status': 1,
    //                     'saveAmount': 1,
    //                     'paymentStatus': 1,
    //                     'refundStatus': 1,
    //                     'orderNumber': 1,
    //                     'pickupDate': 1,
    //                     'pickupTime': 1,
    //                     'convertedPickupDate': 1,
    //                     'actualOrderDate': 1,
    //                     'orderDate': 1,
    //                     'subTotal': 1,
    //                     'offerPrice': 1,
    //                     'fixCommissionPer':1,
    //                     'tax': 1,
    //                     'saveEatFees':1,
    //                     'paymentStatus': 1,
    //                     'commissionPer': 1,
    //                     'commissionAmount': 1,
    //                     'orderAcceptedTime': 1,
    //                     'orderRejectedTime': 1,
    //                     'orderCancelledTime': 1,
    //                     'orderDeliveredTime': 1,
    //                     'rescusedFood': 1,
    //                     'storeAmount': 1,
    //                     'adminAmount': 1,
    //                     'deductedPoints':1,
    //                     'orderFullSubTotal': 1,
    //                     'orderFullTax': 1,
    //                     'orderFullTotal': 1,
    //                     'paymentMode': 1,
    //                     'orderFullSaveAmount': 1,
    //                     'paymentStatus': 1,
    //                     'priceObj': 1,
    //                     'total': 1,
    //                     'status': 1,
    //                     'storeId': 1,
    //                     'updatedAt': 1,
    //                     'createdAt': 1,
    //                     'orderData': 1,
    //                     // 'totalPrice':{$sum:"$$orderData.price" },
    //                     'orderDetail': 1,
    //                     'usersDetail.name': 1,
    //                     'actualOrderDate': 1,
    //                     'usersDetail._id': 1,
    //                     'usersDetail.userNumber': 1,
    //                     'usersDetail.userNumber': 1,
    //                     'usersDetail.address': 1,
    //                     'restaurantDetail._id': 1,
    //                     'restaurantDetail.empNumber': 1,
    //                     'restaurantDetail.businessName': 1,
    //                     'restaurantDetail.tax': 1,
    //                     'restaurantDetail.commission':1,
    //                     'restaurantDetail.address':1,
    //                 }
    //             },
    //         ])


    //         for (let i = 0; i < orderList.length; i++) {

    //             var adminTax = 0
    //             var adminFee = 0

    //             var restorentCommission = 0

    //             let admin = await Admin.findOne({"userType" : "Admin"})
    //             let brandData = await Restaurant.findOne({"_id" : orderList[i].restaurantDetail[0]._id})

    //             let refundCheck = await Refund.findOne({"orderId" : ObjectId(orderList[i]._id)})

    //             if(refundCheck){
    //                 orderList[i].refundCheck = refundCheck
    //             }
                

                
    //             if(admin){
    //                 adminTax = Number(admin.tax)
    //                 adminFee = Number(admin.fee)
    //             }
                
    //             if(brandData){
    //                 restorentCommission = Number(brandData.commission)

    //                 console.log("restorentCommission==>",restorentCommission)
    //             }

    //             var producePrice = 0


    //             var choiceTotalPrice = 0


    //             var fixcomm = orderList[i].fixCommissionPer
    //             console.log("fixcomm==========>",fixcomm)
    //             var commper = orderList[i].commissionPer
    //             console.log("commper===========>",commper)


    //             for (let j = 0; j < orderList[i].orderData.length; j++) {
    //                 var commisionPercentage = 0

    //                 if(orderList[i].orderData[j].productData.sellingStatus == true){
    //                     // if(orderList[i].orderData[j].productData.sellingStatus == false){

    //                     console.log("orderList[i].orderData[j].productData.sellingStatus 5239===>",orderList[i].orderData[j].productData.sellingStatus)
    //                     producePrice = orderList[i].orderData[j].productData.offeredPrice
    //                     commisionPercentage = fixcomm
    //                 }

    //                 if(orderList[i].orderData[j].productData.sellingStatus == false){
    //                     // if(orderList[i].orderData[j].productData.sellingStatus == true){

    //                     console.log("orderList[i].orderData[j].productData.sellingStatus 5247===>",orderList[i].orderData[j].productData.sellingStatus)
    //                     producePrice = orderList[i].orderData[j].productData.price
    //                     commisionPercentage = commper
    //                     console.log("orderList[i].fixCommissionPer=====>",orderList[i].fixCommissionPer)
    //                     console.log("commisionPercentage=====>",commisionPercentage)

    //                 }

    //                 if(orderList[i].orderData[j].mainChoice.length > 0){
    //                     for (let p = 0; p < orderList[i].orderData[j].mainChoice.length; p++){

    //                         // let checkChoiceTax = 0 

    //                         orderList[i].orderData[j].mainChoice[p].choicesTax =  ( ( (orderList[i].orderData[j].mainChoice[p].fixCommissionAmount) + orderList[i].orderData[j].mainChoice[p].fixBrandAmount ) - (orderList[i].orderData[j].mainChoice[p].price) )

    //                         orderList[i].orderData[j].mainChoice[p].choicesTotaltax =  ( (orderList[i].orderData[j].mainChoice[p].fixCommissionAmount) + orderList[i].orderData[j].mainChoice[p].fixBrandAmount )
    
    //                         choiceTotalPrice += ( (orderList[i].orderData[j].mainChoice[p].fixCommissionAmount) + orderList[i].orderData[j].mainChoice[p].fixBrandAmount )

    //                     }

    //                     orderList[i].choiceTotalPrice = choiceTotalPrice



    //                 }





    //                 orderList[i].orderData[j].restorentCommission = restorentCommission
                    
    //                 // totalCommisionRes += orderList[i].orderData[j].restorentCommission
    //                 totalCommisionRes += commisionPercentage

                    

    //                 totalPrice += Number(orderList[i].orderData[j].actualproductAmount)  //  ====> full Price
    //                 orderList[i].orderData[j].discountPrice = (Number(orderList[i].orderData[j].productData.price) - Number(producePrice))
    //                 totalDiscountPrice += (Number(orderList[i].orderData[j].productDiscountAmount))
    //                 totalQuantity += orderList[i].orderData[j].quantity
    //                 // totalDiscount += orderList[i].orderData[j].productDiscountAmount
    //                 totalAmountQnty += orderList[i].orderData[j].amountWithQuantuty
    //                 orderList[i].orderData[j].itemAmount = (producePrice * (orderList[i].orderData[j].quantity) )
    //                 totalAmount += (producePrice * (orderList[i].orderData[j].quantity) )
    //                 orderList[i].orderData[j].totalAmount = producePrice * orderList[i].orderData[j].quantity
    //                 let checkAmount = producePrice * orderList[i].orderData[j].quantity
    //                 orderList[i].orderData[j].itemTax = (adminTax / 100) * checkAmount
    //                 totalTax += (adminTax / 100) * checkAmount

    //                 let restaurentAmount = (((adminTax / 100) * checkAmount) + (Number(producePrice) * orderList[i].orderData[j].quantity))
    //                 orderList[i].orderData[j].restaurantAmount = restaurentAmount
    //                 restaurantTotalAmount += restaurentAmount
    //                 console.log("commisionPercentage check===================>",commisionPercentage)

    //                 orderList[i].orderData[j].commissionPercets = commisionPercentage


    //                 // orderList[i].orderData[j].commissionInx = (Number(producePrice) *  (Number(restorentCommission)/100)) +( (Number(producePrice) *  (Number(restorentCommission)/100)) * 0.18 )
    //                 orderList[i].orderData[j].commissionInx = (Number(producePrice) *  (Number(restorentCommission)/100))
    //                 orderList[i].orderData[j].commissionAmount2 = ( (Number(producePrice) *  (Number(restorentCommission)/100)) * 0.18 )

    //                 // orderList[i].orderData[j].commissionInx = (Number(producePrice) *  (Number(commisionPercentage)/100)) +( (Number(producePrice) *  (Number(commisionPercentage)/100)) * 0.18 )
    //                 // totalcommissionInx += (Number(producePrice) *  (Number(commisionPercentage)/100)) + (Number(producePrice) *  (Number(commisionPercentage)/100)) * 0.18 
    //                 totalcommissionInx += (Number(producePrice) *  (Number(commisionPercentage)/100)) 
                    
    //                 commissionAmount +=  (Number(producePrice) *  (Number(commisionPercentage)/100)) * 0.18

                    

    //                 orderList[i].orderData[j].storePoceed = restaurentAmount -(Number(producePrice) *  ((Number(commisionPercentage)/100)) + (Number(producePrice) *  (Number(commisionPercentage)/100)) * 0.18 ) - orderList[i].orderData[j].itemTax

    //                 storeProceed += restaurentAmount -(Number(producePrice) *  ((Number(commisionPercentage)/100)) + (Number(producePrice) *  (Number(commisionPercentage)/100)) * 0.18 ) - orderList[i].orderData[j].itemTax

    //                 orderList[i].orderData[j].totalSaveeatFee = (((Number(producePrice) *  (Number(adminFee))/100)) + ((Number(producePrice) *  ((Number(adminFee))/100))*0.18 ))

    //                 totalSaveeatFee += ((Number(producePrice) *  (Number(adminFee)/100)) + ((Number(producePrice) *  (Number(adminFee)/100))*(18/100) ))

                 
    //                 orderList[i].orderData[j].userTotals = Number(restaurentAmount + (((Number(producePrice) *  (Number(adminFee))/100)) + ((Number(producePrice) *  ((Number(adminFee))/100))*0.18 )))
                 
                    

    //                 // console.log("Number(restaurentAmount", ( (producePrice *  (adminFee)/100))*18) 
    //                 // orderList[i].orderData[j].restaurantAmount = ((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) + (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) * (adminTax / 100))
    //                 // restaurantTotalAmount += ((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) + (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) * (adminTax / 100))

    //                 let commisionAmount = ((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) + (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) * (adminTax / 100))

    //                 orderList[i].orderData[j].commisionAmount = (restorentCommission / 100) * commisionAmount
    //                 // orderList[i].orderData[j].commisionAmount =  (((orderList[i].orderData[j].actualproductAmount -  orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) +  (((orderList[i].orderData[j].actualproductAmount -  orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity)  * (adminTax/100)) * (2adminTax/100))
    //                 totalCommisionAmount += (restorentCommission / 100) * commisionAmount




    //                 orderList[i].orderData[j].commisionInTax = (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) + ((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty)) * (18 / 100)

    //                 totalCommisionIntax += (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) + ((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty)* (18 / 100)) 

    //                 orderList[i].orderData[j].storeProeceds = ((orderList[i].orderData[j].actualproductAmount) - (orderList[i].orderData[j].productDiscountAmount)) - ((restorentCommission / 100) * commisionAmount)

    //                 totalStoreProeceds += ((orderList[i].orderData[j].actualproductAmount) - (orderList[i].orderData[j].productDiscountAmount)) - ((restorentCommission / 100) * commisionAmount)

    //                 orderList[i].orderData[j].saveItAmount = ((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) + (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) * (18 / 100))

    //                 totalSaveItAmount += ((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) + (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) * (18 / 100))

    //                 orderList[i].orderData[j].userTotal = (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) + (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) * (adminTax / 100))) + (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) + (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) * (18 / 100)))

    //                 userTotal += (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) + (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) * (adminTax / 100))) + (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) + (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) * (18 / 100)))


    //                 orderList[i].orderData[j].itemWeight = (orderList[i].orderData[j].productData.foodQuantity) * (0.001)

    //                 totalWeight += ((orderList[i].orderData[j].productData.foodQuantity) * (0.001))

    //                 saveEatFees += (orderList[i].subTotal + totalTax) * 0.02
    //                 SaveEatFeesTax += (saveEatFees) * 0.18

    //             }






    //             orderList[i].fullPrice = totalPrice
    //             orderList[i].saveEatFees = saveEatFees
    //             orderList[i].SaveEatFeesTax = SaveEatFeesTax
    //             orderList[i].totalQuantity = totalQuantity
    //             orderList[i].totalDiscount = totalDiscountPrice
    //             orderList[i].totalAmountQnty = totalAmount
    //             orderList[i].restaurantTotalAmount = restaurantTotalAmount
    //             orderList[i].totalTax = totalTax
    //             orderList[i].totalCommisionAmount = totalCommisionAmount
    //             orderList[i].totalCommisionIntax = totalCommisionIntax
    //             orderList[i].totalStoreProeceds = storeProceed
    //             orderList[i].totalSaveItAmount = totalSaveItAmount
    //             orderList[i].userTotal = userTotal
    //             orderList[i].totalWeight = totalWeight
    //             orderList[i].totalCommisionRes = totalCommisionRes

    //             orderList[i].totalcommissionInx =totalcommissionInx
    //             // orderList[i].commissionInx =commissionInx 
    //             orderList[i].commissionAmount =commissionAmount
    //             orderList[i].totalSaveeatFee =totalSaveeatFee

    //             // orderList[i].userTotals = (restaurantTotalAmount) + orderList[i].saveEatFees
    //             orderList[i].userTotals = restaurantTotalAmount


    //             // orderList[i].totalstoreProceed =totalcommissionInx

             
                




    //             // totalCommisionIntax





    //         }



    //         return res.send({ response_code: 200, message: "Restaurant List", Data: orderList })

    //     } catch (error) {
    //         response.log("Error is=========>", error);
    //         return response.responseHandlerWithMessage(res, 500, "Internal server error");
    //     }
    // },

    particularOrderAmin: async (req, res) => {
        try {

             
            let totalAmount = 0
            let totalPrice = 0
            let totalQuantity = 0
            let totalDiscount = 0
            let totalAmountQnty = 0
            let itemtax = 0
            let totalTax = 0
            let restaurantTotalAmount = 0
            let totalCommisionAmount = 0
            let totalCommisionIntax = 0
            let totalStoreProeceds = 0
            let totalSaveItAmount = 0
            let userTotal = 0
            let totalWeight = 0

            let productPrice

            let totalCommisionRes = 0
            let totalDiscountPrice = 0
            let totalAmountafterDiscount = 0 
            let totalcommissionInx = 0
            let commissionAmount = 0
            let storeProceed = 0
            let totalSaveeatFee = 0

            let saveEatFees = 0
            let SaveEatFeesTax = 0

            let userTotals = 0





            let orderList = await Order.aggregate([
                {
                    $match:
                    {
                        _id: ObjectId(req.body.orderId)
                    }

                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "restaurantDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "mainorders",
                        localField: "storeData[0].storeId",
                        foreignField: "_id",
                        as: "orderDetail"
                    }
                },


                {
                    $project: {
                        '_id': 1,
                        'status': 1,
                        'saveAmount': 1,
                        'paymentStatus': 1,
                        'refundStatus': 1,
                        'orderNumber': 1,
                        'pickupDate': 1,
                        'pickupTime': 1,
                        'convertedPickupDate': 1,
                        'actualOrderDate': 1,
                        'orderDate': 1,
                        'subTotal': 1,
                        'offerPrice': 1,
                        'fixCommissionPer':1,
                        'tax': 1,
                        'saveEatFees':1,
                        'paymentStatus': 1,
                        'commissionPer': 1,
                        'commissionAmount': 1,
                        'orderAcceptedTime': 1,
                        'orderRejectedTime': 1,
                        'orderCancelledTime': 1,
                        'orderDeliveredTime': 1,
                        'rescusedFood': 1,
                        'storeAmount': 1,
                        'adminAmount': 1,
                        'deductedPoints':1,
                        'orderFullSubTotal': 1,
                        'orderFullTax': 1,
                        'orderFullTotal': 1,
                        'paymentMode': 1,
                        'orderFullSaveAmount': 1,
                        'paymentStatus': 1,
                        'priceObj': 1,
                        'total': 1,
                        'status': 1,
                        'storeId': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'orderData': 1,
                        // 'totalPrice':{$sum:"$$orderData.price" },
                        'orderDetail': 1,
                        'usersDetail.name': 1,
                        'actualOrderDate': 1,
                        'usersDetail._id': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.address': 1,
                        'restaurantDetail._id': 1,
                        'restaurantDetail.empNumber': 1,
                        'restaurantDetail.businessName': 1,
                        'restaurantDetail.tax': 1,
                        'restaurantDetail.commission':1,
                        'restaurantDetail.address':1,
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
            ])


            for (let i = 0; i < orderList.length; i++) {

                var adminTax = 0
                var adminFee = 0

                var restorentCommission = 0

                let admin = await Admin.findOne({"userType" : "Admin"})
                let brandData = await Restaurant.findOne({"_id" : orderList[i].restaurantDetail[0]._id})

                let refundCheck = await Refund.findOne({"orderId" : ObjectId(orderList[i]._id)})

                if(refundCheck){
                    orderList[i].refundCheck = refundCheck
                }
                

                
                if(admin){
                    adminTax = Number(admin.tax)
                    adminFee = Number(admin.fee)
                }
                
                if(brandData){
                    restorentCommission = Number(brandData.commission)

                    console.log("restorentCommission==>",restorentCommission)
                }

                var producePrice = 0


                var choiceTotalPrice = 0


                var fixcomm = orderList[i].fixCommissionPer
                console.log("fixcomm==========>",fixcomm)
                var commper = orderList[i].commissionPer
                console.log("commper===========>",commper)


                for (let j = 0; j < orderList[i].orderData.length; j++) {
                    var commisionPercentage = 0

                    if(orderList[i].orderData[j].productData.sellingStatus == true){
                        // if(orderList[i].orderData[j].productData.sellingStatus == false){

                        console.log("orderList[i].orderData[j].productData.sellingStatus 5239===>",orderList[i].orderData[j].productData.sellingStatus)
                        producePrice = orderList[i].orderData[j].productData.offeredPrice
                        commisionPercentage = fixcomm
                    }

                    if(orderList[i].orderData[j].productData.sellingStatus == false){
                        // if(orderList[i].orderData[j].productData.sellingStatus == true){

                        console.log("orderList[i].orderData[j].productData.sellingStatus 5247===>",orderList[i].orderData[j].productData.sellingStatus)
                        producePrice = orderList[i].orderData[j].productData.price
                        commisionPercentage = commper
                        console.log("orderList[i].fixCommissionPer=====>",orderList[i].fixCommissionPer)
                        console.log("commisionPercentage=====>",commisionPercentage)

                    }

                    if(orderList[i].orderData[j].mainChoice.length > 0){
                        for (let p = 0; p < orderList[i].orderData[j].mainChoice.length; p++){

                            // let checkChoiceTax = 0 

                            orderList[i].orderData[j].mainChoice[p].choicesTax =  ( ( (orderList[i].orderData[j].mainChoice[p].fixCommissionAmount) + orderList[i].orderData[j].mainChoice[p].fixBrandAmount ) - (orderList[i].orderData[j].mainChoice[p].price) )

                            orderList[i].orderData[j].mainChoice[p].choicesTotaltax =  ( (orderList[i].orderData[j].mainChoice[p].fixCommissionAmount) + orderList[i].orderData[j].mainChoice[p].fixBrandAmount )
    
                            choiceTotalPrice += ( (orderList[i].orderData[j].mainChoice[p].fixCommissionAmount) + orderList[i].orderData[j].mainChoice[p].fixBrandAmount )

                        }

                        orderList[i].choiceTotalPrice = choiceTotalPrice



                    }





                    orderList[i].orderData[j].restorentCommission = restorentCommission
                    
                    // totalCommisionRes += orderList[i].orderData[j].restorentCommission
                    totalCommisionRes += commisionPercentage

                    

                    totalPrice += Number(orderList[i].orderData[j].actualproductAmount)  //  ====> full Price
                    orderList[i].orderData[j].discountPrice = (Number(orderList[i].orderData[j].productData.price) - Number(producePrice))
                    totalDiscountPrice += (Number(orderList[i].orderData[j].productDiscountAmount))
                    totalQuantity += orderList[i].orderData[j].quantity
                    // totalDiscount += orderList[i].orderData[j].productDiscountAmount
                    totalAmountQnty += orderList[i].orderData[j].amountWithQuantuty
                    orderList[i].orderData[j].itemAmount = (producePrice * (orderList[i].orderData[j].quantity) )
                    totalAmount += (producePrice * (orderList[i].orderData[j].quantity) )
                    orderList[i].orderData[j].totalAmount = producePrice * orderList[i].orderData[j].quantity
                    let checkAmount = producePrice * orderList[i].orderData[j].quantity
                    orderList[i].orderData[j].itemTax = (adminTax / 100) * checkAmount
                    totalTax += (adminTax / 100) * checkAmount

                    let restaurentAmount = (((adminTax / 100) * checkAmount) + (Number(producePrice) * orderList[i].orderData[j].quantity))
                    orderList[i].orderData[j].restaurantAmount = restaurentAmount
                    restaurantTotalAmount += restaurentAmount
                    console.log("commisionPercentage check===================>",commisionPercentage)

                    orderList[i].orderData[j].commissionPercets = commisionPercentage


                    // orderList[i].orderData[j].commissionInx = (Number(producePrice) *  (Number(restorentCommission)/100)) +( (Number(producePrice) *  (Number(restorentCommission)/100)) * 0.18 )
                    orderList[i].orderData[j].commissionInx = (Number(producePrice) *  (Number(restorentCommission)/100))
                    orderList[i].orderData[j].commissionAmount2 = ( (Number(producePrice) *  (Number(restorentCommission)/100)) * 0.18 )

                    // orderList[i].orderData[j].commissionInx = (Number(producePrice) *  (Number(commisionPercentage)/100)) +( (Number(producePrice) *  (Number(commisionPercentage)/100)) * 0.18 )
                    // totalcommissionInx += (Number(producePrice) *  (Number(commisionPercentage)/100)) + (Number(producePrice) *  (Number(commisionPercentage)/100)) * 0.18 
                    totalcommissionInx += (Number(producePrice) *  (Number(commisionPercentage)/100)) 
                    
                    commissionAmount +=  (Number(producePrice) *  (Number(commisionPercentage)/100)) * 0.18

                    

                    orderList[i].orderData[j].storePoceed = restaurentAmount -(Number(producePrice) *  ((Number(commisionPercentage)/100)) + (Number(producePrice) *  (Number(commisionPercentage)/100)) * 0.18 ) - orderList[i].orderData[j].itemTax

                    storeProceed += restaurentAmount -(Number(producePrice) *  ((Number(commisionPercentage)/100)) + (Number(producePrice) *  (Number(commisionPercentage)/100)) * 0.18 ) - orderList[i].orderData[j].itemTax

                    orderList[i].orderData[j].totalSaveeatFee = (((Number(producePrice) *  (Number(adminFee))/100)) + ((Number(producePrice) *  ((Number(adminFee))/100))*0.18 ))

                    totalSaveeatFee += ((Number(producePrice) *  (Number(adminFee)/100)) + ((Number(producePrice) *  (Number(adminFee)/100))*(18/100) ))

                 
                    orderList[i].orderData[j].userTotals = Number(restaurentAmount + (((Number(producePrice) *  (Number(adminFee))/100)) + ((Number(producePrice) *  ((Number(adminFee))/100))*0.18 )))
                 
                    

                    // console.log("Number(restaurentAmount", ( (producePrice *  (adminFee)/100))*18) 
                    // orderList[i].orderData[j].restaurantAmount = ((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) + (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) * (adminTax / 100))
                    // restaurantTotalAmount += ((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) + (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) * (adminTax / 100))

                    let commisionAmount = ((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) + (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) * (adminTax / 100))

                    orderList[i].orderData[j].commisionAmount = (restorentCommission / 100) * commisionAmount
                    // orderList[i].orderData[j].commisionAmount =  (((orderList[i].orderData[j].actualproductAmount -  orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) +  (((orderList[i].orderData[j].actualproductAmount -  orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity)  * (adminTax/100)) * (2adminTax/100))
                    totalCommisionAmount += (restorentCommission / 100) * commisionAmount




                    orderList[i].orderData[j].commisionInTax = (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) + ((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty)) * (18 / 100)

                    totalCommisionIntax += (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) + ((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty)* (18 / 100)) 

                    orderList[i].orderData[j].storeProeceds = ((orderList[i].orderData[j].actualproductAmount) - (orderList[i].orderData[j].productDiscountAmount)) - ((restorentCommission / 100) * commisionAmount)

                    totalStoreProeceds += ((orderList[i].orderData[j].actualproductAmount) - (orderList[i].orderData[j].productDiscountAmount)) - ((restorentCommission / 100) * commisionAmount)

                    orderList[i].orderData[j].saveItAmount = ((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) + (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) * (18 / 100))

                    totalSaveItAmount += ((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) + (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) * (18 / 100))

                    orderList[i].orderData[j].userTotal = (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) + (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) * (adminTax / 100))) + (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) + (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) * (18 / 100)))

                    userTotal += (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) + (((orderList[i].orderData[j].actualproductAmount - orderList[i].orderData[j].productDiscountAmount) * orderList[i].orderData[j].quantity) * (adminTax / 100))) + (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) + (((restorentCommission / 100) * orderList[i].orderData[j].amountWithQuantuty) * (18 / 100)))


                    orderList[i].orderData[j].itemWeight = (orderList[i].orderData[j].productData.foodQuantity) * (0.001)

                    totalWeight += ((orderList[i].orderData[j].productData.foodQuantity) * (0.001))

                    saveEatFees += (orderList[i].subTotal + totalTax) * 0.02
                    SaveEatFeesTax += (saveEatFees) * 0.18

                }






                orderList[i].fullPrice = totalPrice
                orderList[i].saveEatFees = saveEatFees
                orderList[i].SaveEatFeesTax = SaveEatFeesTax
                orderList[i].totalQuantity = totalQuantity
                orderList[i].totalDiscount = totalDiscountPrice
                orderList[i].totalAmountQnty = totalAmount
                orderList[i].restaurantTotalAmount = restaurantTotalAmount
                orderList[i].totalTax = totalTax
                orderList[i].totalCommisionAmount = totalCommisionAmount
                orderList[i].totalCommisionIntax = totalCommisionIntax
                orderList[i].totalStoreProeceds = storeProceed
                orderList[i].totalSaveItAmount = totalSaveItAmount
                orderList[i].userTotal = userTotal
                orderList[i].totalWeight = totalWeight
                orderList[i].totalCommisionRes = totalCommisionRes

                orderList[i].totalcommissionInx =totalcommissionInx
                // orderList[i].commissionInx =commissionInx 
                orderList[i].commissionAmount =commissionAmount
                orderList[i].totalSaveeatFee =totalSaveeatFee

                // orderList[i].userTotals = (restaurantTotalAmount) + orderList[i].saveEatFees
                orderList[i].userTotals = restaurantTotalAmount


                // orderList[i].totalstoreProceed =totalcommissionInx

             
                




                // totalCommisionIntax





            }



            return res.send({ response_code: 200, message: "Restaurant List", Data: orderList })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================== User order details ==============================================//

    userOrderList: async (req, res) => {
        try {

            let totalPrice = 0
            let totalQuantity = 0
            let totalDiscount = 0
            let totalAmountQnty = 0

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = { "userId": ObjectId(req.body.userId) }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
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

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [

                        { "businessName": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }

            if (req.body.paymentMethod) {
                queryCheck.paymentMode = req.body.paymentMethod
            }

            if (req.body.orderStatus) {
                queryCheck.status = req.body.paymentMethod
            }

            if (req.body.refundStatus) {
                queryCheck.refundStatus = req.body.refundStatus
            }

            console.log("queryCheck==>", queryCheck)

            let totalOrder = await Order.find(queryCheck).count()



            let orderList = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "restaurantDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "mainorders",
                        localField: "storeData[0].storeId",
                        foreignField: "_id",
                        as: "orderDetail"
                    }
                },


                {
                    $project: {
                        '_id': 1,
                        'status': 1,
                        'saveAmount': 1,
                        'paymentStatus': 1,
                        'refundStatus': 1,
                        'orderNumber': 1,
                        'pickupDate': 1,
                        'pickupTime': 1,
                        'convertedPickupDate': 1,
                        'actualOrderDate': 1,
                        'orderDate': 1,
                        'subTotal': 1,
                        'offerPrice': 1,
                        'tax': 1,
                        'paymentStatus': 1,
                        'commissionPer': 1,
                        'commissionAmount': 1,
                        'orderAcceptedTime': 1,
                        'orderRejectedTime': 1,
                        'orderCancelledTime': 1,
                        'orderDeliveredTime': 1,
                        'rescusedFood': 1,
                        'storeAmount': 1,
                        'adminAmount': 1,
                        'orderFullSubTotal': 1,
                        'orderFullTax': 1,
                        'orderFullTotal': 1,
                        'paymentMode': 1,
                        'orderFullSaveAmount': 1,
                        'paymentStatus': 1,
                        'priceObj': 1,
                        'total': 1,
                        'status': 1,
                        'storeId': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'orderData': 1,
                        // 'totalPrice':{$sum:"$$orderData.price" },
                        'orderDetail': 1,
                        'usersDetail.name': 1,
                        'actualOrderDate': 1,
                        'usersDetail._id': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.address': 1,
                        'restaurantDetail._id': 1,
                        'restaurantDetail.empNumber': 1,
                        'restaurantDetail.businessName': 1,
                        'restaurantDetail.address': 1,
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])


            for (let i = 0; i < orderList.length; i++) {

                for (let j = 0; j < orderList[i].orderData.length; j++) {
                    totalPrice += orderList[i].orderData[j].productAmount
                    totalQuantity += orderList[i].orderData[j].quantity
                    totalDiscount += orderList[i].orderData[j].productDiscountAmount
                    totalAmountQnty += orderList[i].orderData[j].amountWithQuantuty
                }

                orderList[i].fullPrice = totalPrice
                orderList[i].totalQuantity = totalQuantity
                orderList[i].totalDiscount = totalDiscount
                orderList[i].totalAmountQnty = totalAmountQnty



            }



            return res.send({ response_code: 200, message: "Restaurant List", Data: orderList, Total: totalOrder })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //====================================  Store Transection List =========================================//

    particularStoreTransection: async (req, res) => {
        try {

            let totalPrice = 0
            let totalQuantity = 0
            let totalDiscount = 0
            let totalAmountQnty = 0

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }

            let queryCheck = { "storeId": ObjectId(req.body.storeId) }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
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

            if (req.body.search) {
                var regex = new RegExp(req.body.search, "i")

                queryCheck.$and = [{
                    $or: [
                        { "orderNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "orderData": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }

            if (req.body.paymentMethod) {
                queryCheck.paymentMode = req.body.paymentMethod
            }

            if (req.body.orderStatus) {
                queryCheck.status = req.body.paymentMethod
            }

            if (req.body.refundStatus) {
                queryCheck.refundStatus = req.body.refundStatus
            }

            console.log("queryCheck==>", queryCheck)
            // ============================================================================//

            let brandList = await Restaurant.aggregate([
                {
                    $match: {
                        "_id": ObjectId(req.body.storeId)
                    }
                },
                {
                    $project: {
                        'businessName': 1,
                        'adminVerificationStatus': 1,
                        'mobileNumber': 1,
                        'name': 1,
                        'brandId': 1,
                        'status': 1,
                        'empNumber': 1,
                        'address': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'menuDetails.menuName': 1,
                        'menuDetails.status': 1,

                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])


            for (let j = 0; j < brandList.length; j++) {

                let restaurantEarnings = 0

                let restrauntList = await Order.aggregate([
                    {
                        $match: queryCheck
                    },
                    {
                        $match: {
                            storeId: ObjectId(brandList[j]._id)
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "usersDetail"
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "brands",
                            localField: "storeId",
                            foreignField: "_id",
                            as: "restaurantDetail"
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "mainorders",
                            localField: "storeData[0].storeId",
                            foreignField: "_id",
                            as: "orderDetail"
                        }
                    },
                    {
                        $project: {
                            '_id': 1,
                            'status': 1,
                            'saveAmount': 1,
                            'paymentStatus': 1,
                            'refundStatus': 1,
                            'orderNumber': 1,
                            'pickupDate': 1,
                            'pickupTime': 1,
                            'convertedPickupDate': 1,
                            'actualOrderDate': 1,
                            'orderDate': 1,
                            'subTotal': 1,
                            'offerPrice': 1,
                            'tax': 1,
                            'paymentStatus': 1,
                            'commissionPer': 1,
                            'commissionAmount': 1,
                            'orderAcceptedTime': 1,
                            'orderRejectedTime': 1,
                            'orderCancelledTime': 1,
                            'orderDeliveredTime': 1,
                            'rescusedFood': 1,
                            'storeAmount': 1,
                            'adminAmount': 1,
                            'orderFullSubTotal': 1,
                            'orderFullTax': 1,
                            'orderFullTotal': 1,
                            'paymentMode': 1,
                            'orderFullSaveAmount': 1,
                            'paymentStatus': 1,
                            'priceObj': 1,
                            'total': 1,
                            'status': 1,
                            'storeId': 1,
                            'updatedAt': 1,
                            'createdAt': 1,
                            'orderData': 1,
                            // 'totalPrice':{$sum:"$$orderData.price" },
                            'orderDetail': 1,
                            'usersDetail.name': 1,
                            'actualOrderDate': 1,
                            'usersDetail._id': 1,
                            'usersDetail.userNumber': 1,
                            'usersDetail.userNumber': 1,
                            'usersDetail.address': 1,
                            'restaurantDetail._id': 1,
                            'restaurantDetail.empNumber': 1,
                            'restaurantDetail.businessName': 1,
                            'restaurantDetail.address': 1,
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                ])

                for (let k = 0; k < restrauntList.length; k++) {



                    restaurantEarnings += restrauntList[k].total




                    // totalPrice +=  orderList[i].orderData[j].productAmount
                    // totalQuantity += orderList[i].orderData[j].quantity
                    // totalDiscount += orderList[i].orderData[j].productDiscountAmount
                    // totalAmountQnty += orderList[i].orderData[j].amountWithQuantuty
                }

                brandList[j].totalRestaurentEarn = restaurantEarnings
                brandList[j].totalOrder = restrauntList.length

                // orderList[i].fullPrice = totalPrice
                // orderList[i].totalQuantity = totalQuantity
                // orderList[i].totalDiscount = totalDiscount
                // orderList[i].totalAmountQnty = totalAmountQnty

            }

            //===============================================================================//
            let totalOrder = await Order.find(queryCheck).count()


            let orderList = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },

                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "restaurantDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "mainorders",
                        localField: "storeData[0].storeId",
                        foreignField: "_id",
                        as: "orderDetail"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'status': 1,
                        'saveAmount': 1,
                        'paymentStatus': 1,
                        'refundStatus': 1,
                        'orderNumber': 1,
                        'pickupDate': 1,
                        'pickupTime': 1,
                        'convertedPickupDate': 1,
                        'actualOrderDate': 1,
                        'orderDate': 1,
                        'subTotal': 1,
                        'offerPrice': 1,
                        'tax': 1,
                        'paymentStatus': 1,
                        'commissionPer': 1,
                        'commissionAmount': 1,
                        'orderAcceptedTime': 1,
                        'orderRejectedTime': 1,
                        'orderCancelledTime': 1,
                        'orderDeliveredTime': 1,
                        'rescusedFood': 1,
                        'storeAmount': 1,
                        'adminAmount': 1,
                        'orderFullSubTotal': 1,
                        'orderFullTax': 1,
                        'orderFullTotal': 1,
                        'paymentMode': 1,
                        'orderFullSaveAmount': 1,
                        'paymentStatus': 1,
                        'priceObj': 1,
                        'total': 1,
                        'status': 1,
                        'storeId': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'orderData': 1,
                        // 'totalPrice':{$sum:"$$orderData.price" },
                        'orderDetail': 1,
                        'usersDetail.name': 1,
                        'actualOrderDate': 1,
                        'usersDetail._id': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.address': 1,
                        'restaurantDetail._id': 1,
                        'restaurantDetail.empNumber': 1,
                        'restaurantDetail.businessName': 1,
                        'restaurantDetail.address': 1,
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])


            for (let i = 0; i < orderList.length; i++) {

                for (let j = 0; j < orderList[i].orderData.length; j++) {
                    totalPrice += orderList[i].orderData[j].productAmount
                    totalQuantity += orderList[i].orderData[j].quantity
                    totalDiscount += orderList[i].orderData[j].productDiscountAmount
                    totalAmountQnty += orderList[i].orderData[j].amountWithQuantuty
                }

                orderList[i].fullPrice = totalPrice
                orderList[i].totalQuantity = totalQuantity
                orderList[i].totalDiscount = totalDiscount
                orderList[i].totalAmountQnty = totalAmountQnty


            }

            return res.send({ response_code: 200, message: "Restaurant List", Data: orderList, StoreData: brandList, Total: totalOrder })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },


    storeTransectionList: async (req, res) => {
        try {

            let totalPrice = 0
            let totalQuantity = 0
            let totalDiscount = 0
            let totalAmountQnty = 0

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = {}
            // "userType": "Store"
            let queryCheck1 = {}

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
            }

            if (req.body.timeframe == "All") {

            }

            if (req.body.search) {
                queryCheck1.$and = [{
                    $or: [

                        { "orderNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }

            if (req.body.paymentMethod) {
                queryCheck.paymentMode = req.body.paymentMethod
            }

            if (req.body.orderStatus) {
                queryCheck.status = req.body.paymentMethod
            }

            if (req.body.refundStatus) {
                queryCheck.refundStatus = req.body.refundStatus
            }

            console.log("queryCheck==>", queryCheck)

            // let totalOrder = await Order.find(queryCheck).count()

            let orderList = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "restaurantDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "mainorders",
                        localField: "storeData[0].storeId",
                        foreignField: "_id",
                        as: "orderDetail"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'status': 1,
                        'saveAmount': 1,
                        'paymentStatus': 1,
                        'refundStatus': 1,
                        'orderNumber': 1,
                        'pickupDate': 1,
                        'pickupTime': 1,
                        'convertedPickupDate': 1,
                        'actualOrderDate': 1,
                        'orderDate': 1,
                        'subTotal': 1,
                        'offerPrice': 1,
                        'tax': 1,
                        'paymentStatus': 1,
                        'commissionPer': 1,
                        'commissionAmount': 1,
                        'orderAcceptedTime': 1,
                        'orderRejectedTime': 1,
                        'orderCancelledTime': 1,
                        'orderDeliveredTime': 1,
                        'rescusedFood': 1,
                        'storeAmount': 1,
                        'adminAmount': 1,
                        'orderFullSubTotal': 1,
                        'orderFullTax': 1,
                        'orderFullTotal': 1,
                        'paymentMode': 1,
                        'orderFullSaveAmount': 1,
                        'paymentStatus': 1,
                        'priceObj': 1,
                        'total': 1,
                        'status': 1,
                        'storeId': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'orderData': 1,
                        // 'totalPrice':{$sum:"$$orderData.price" },
                        'orderDetail': 1,
                        'usersDetail.name': 1,
                        'actualOrderDate': 1,
                        'usersDetail._id': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.address': 1,
                        'restaurantDetail._id': 1,
                        'restaurantDetail.empNumber': 1,
                        'restaurantDetail.businessName': 1,
                        'restaurantDetail.address': 1,
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
            ])

            var storeIdArr = []

            for (let i = 0; i < orderList.length; i++) {
                storeIdArr.push(Object(orderList[i].storeId))
            }

            let uniueAds = _.uniqWith(storeIdArr, _.isEqual)

            let totalRestaurentEarn = 0
            let totalOrder = 0



            let totalBrandList = await Restaurant.find({ "_id": { $in: uniueAds } }).count()



            let brandList = await Restaurant.aggregate([
                {
                    $match: {
                        "_id": { $in: uniueAds }
                    }
                },
                {
                    $project: {
                        'businessName': 1,
                        'adminVerificationStatus': 1,
                        'mobileNumber': 1,
                        'name': 1,
                        'brandId': 1,
                        'status': 1,
                        'empNumber': 1,
                        'address': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'menuDetails.menuName': 1,
                        'menuDetails.status': 1,

                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])


            for (let j = 0; j < brandList.length; j++) {

                let restaurantEarnings = 0

                let restrauntList = await Order.aggregate([
                    {
                        $match: queryCheck
                    },
                    {
                        $match: {
                            storeId: ObjectId(brandList[j]._id)
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "usersDetail"
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "brands",
                            localField: "storeId",
                            foreignField: "_id",
                            as: "restaurantDetail"
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "mainorders",
                            localField: "storeData[0].storeId",
                            foreignField: "_id",
                            as: "orderDetail"
                        }
                    },
                    {
                        $project: {
                            '_id': 1,
                            'status': 1,
                            'saveAmount': 1,
                            'paymentStatus': 1,
                            'refundStatus': 1,
                            'orderNumber': 1,
                            'pickupDate': 1,
                            'pickupTime': 1,
                            'convertedPickupDate': 1,
                            'actualOrderDate': 1,
                            'orderDate': 1,
                            'subTotal': 1,
                            'offerPrice': 1,
                            'tax': 1,
                            'paymentStatus': 1,
                            'commissionPer': 1,
                            'commissionAmount': 1,
                            'orderAcceptedTime': 1,
                            'orderRejectedTime': 1,
                            'orderCancelledTime': 1,
                            'orderDeliveredTime': 1,
                            'rescusedFood': 1,
                            'storeAmount': 1,
                            'adminAmount': 1,
                            'orderFullSubTotal': 1,
                            'orderFullTax': 1,
                            'orderFullTotal': 1,
                            'paymentMode': 1,
                            'orderFullSaveAmount': 1,
                            'paymentStatus': 1,
                            'priceObj': 1,
                            'total': 1,
                            'status': 1,
                            'storeId': 1,
                            'updatedAt': 1,
                            'createdAt': 1,
                            'orderData': 1,
                            // 'totalPrice':{$sum:"$$orderData.price" },
                            'orderDetail': 1,
                            'usersDetail.name': 1,
                            'actualOrderDate': 1,
                            'usersDetail._id': 1,
                            'usersDetail.userNumber': 1,
                            'usersDetail.userNumber': 1,
                            'usersDetail.address': 1,
                            'restaurantDetail._id': 1,
                            'restaurantDetail.empNumber': 1,
                            'restaurantDetail.businessName': 1,
                            'restaurantDetail.address': 1,
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                ])

                for (let k = 0; k < restrauntList.length; k++) {



                    restaurantEarnings += restrauntList[k].total




                    // totalPrice +=  orderList[i].orderData[j].productAmount
                    // totalQuantity += orderList[i].orderData[j].quantity
                    // totalDiscount += orderList[i].orderData[j].productDiscountAmount
                    // totalAmountQnty += orderList[i].orderData[j].amountWithQuantuty
                }

                brandList[j].totalRestaurentEarn = restaurantEarnings
                brandList[j].totalOrder = restrauntList.length

                // orderList[i].fullPrice = totalPrice
                // orderList[i].totalQuantity = totalQuantity
                // orderList[i].totalDiscount = totalDiscount
                // orderList[i].totalAmountQnty = totalAmountQnty

            }

            return res.send({ response_code: 200, message: "Restaurant List", Data: brandList, TotalRestorent: totalBrandList })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    downloadStoreTransectionList: async (req, res) => {
        try {

            let totalPrice = 0
            let totalQuantity = 0
            let totalDiscount = 0
            let totalAmountQnty = 0

            // var skip = 0
            // var limit = 10
            // if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
            //     skip = (Number(req.body.pageNumber) - 1) * 10
            // }
            // if (req.body.limit && Number(req.body.limit) != 0) {
            //     limit = Number(req.body.limit)
            // }


            let options = {
                // page: Number(req.body.pageNumber) || 1,
                limit:100000000,
                sort: { createdAt: -1 },
            }
            let queryCheck = {}
            // "userType": "Store"
            let queryCheck1 = {}

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
            }

            if (req.body.timeframe == "All") {

            }

            if (req.body.search) {
                queryCheck1.$and = [{
                    $or: [

                        { "orderNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }

            if (req.body.paymentMethod) {
                queryCheck.paymentMode = req.body.paymentMethod
            }

            if (req.body.orderStatus) {
                queryCheck.status = req.body.paymentMethod
            }

            if (req.body.refundStatus) {
                queryCheck.refundStatus = req.body.refundStatus
            }

            console.log("queryCheck==>", queryCheck)

            // let totalOrder = await Order.find(queryCheck).count()

            let orderList = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "restaurantDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "mainorders",
                        localField: "storeData[0].storeId",
                        foreignField: "_id",
                        as: "orderDetail"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'status': 1,
                        'saveAmount': 1,
                        'paymentStatus': 1,
                        'refundStatus': 1,
                        'orderNumber': 1,
                        'pickupDate': 1,
                        'pickupTime': 1,
                        'convertedPickupDate': 1,
                        'actualOrderDate': 1,
                        'orderDate': 1,
                        'subTotal': 1,
                        'offerPrice': 1,
                        'tax': 1,
                        'paymentStatus': 1,
                        'commissionPer': 1,
                        'commissionAmount': 1,
                        'orderAcceptedTime': 1,
                        'orderRejectedTime': 1,
                        'orderCancelledTime': 1,
                        'orderDeliveredTime': 1,
                        'rescusedFood': 1,
                        'storeAmount': 1,
                        'adminAmount': 1,
                        'orderFullSubTotal': 1,
                        'orderFullTax': 1,
                        'orderFullTotal': 1,
                        'paymentMode': 1,
                        'orderFullSaveAmount': 1,
                        'paymentStatus': 1,
                        'priceObj': 1,
                        'total': 1,
                        'status': 1,
                        'storeId': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'orderData': 1,
                        // 'totalPrice':{$sum:"$$orderData.price" },
                        'orderDetail': 1,
                        'usersDetail.name': 1,
                        'actualOrderDate': 1,
                        'usersDetail._id': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.address': 1,
                        'restaurantDetail._id': 1,
                        'restaurantDetail.empNumber': 1,
                        'restaurantDetail.businessName': 1,
                        'restaurantDetail.address': 1,
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
            ])

            var storeIdArr = []

            for (let i = 0; i < orderList.length; i++) {
                storeIdArr.push(Object(orderList[i].storeId))
            }

            let uniueAds = _.uniqWith(storeIdArr, _.isEqual)

            let totalRestaurentEarn = 0
            let totalOrder = 0
            let totalBrandList = await Restaurant.find({ "_id": { $in: uniueAds } }).count()
            let brandList = await Restaurant.aggregate([
                {
                    $match: {
                        "_id": { $in: uniueAds }
                    }
                },
                {
                    $project: {
                        'businessName': 1,
                        'adminVerificationStatus': 1,
                        'mobileNumber': 1,
                        'name': 1,
                        'brandId': 1,
                        'status': 1,
                        'empNumber': 1,
                        'address': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'menuDetails.menuName': 1,
                        'menuDetails.status': 1,

                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                // { $skip: skip },
                // { $limit: limit },
            ])


            for (let j = 0; j < brandList.length; j++) {

                let restaurantEarnings = 0

                let restrauntList = await Order.aggregate([
                    {
                        $match: queryCheck
                    },
                    {
                        $match: {
                            storeId: ObjectId(brandList[j]._id)
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "usersDetail"
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "brands",
                            localField: "storeId",
                            foreignField: "_id",
                            as: "restaurantDetail"
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "mainorders",
                            localField: "storeData[0].storeId",
                            foreignField: "_id",
                            as: "orderDetail"
                        }
                    },
                    {
                        $project: {
                            '_id': 1,
                            'status': 1,
                            'saveAmount': 1,
                            'paymentStatus': 1,
                            'refundStatus': 1,
                            'orderNumber': 1,
                            'pickupDate': 1,
                            'pickupTime': 1,
                            'convertedPickupDate': 1,
                            'actualOrderDate': 1,
                            'orderDate': 1,
                            'subTotal': 1,
                            'offerPrice': 1,
                            'tax': 1,
                            'paymentStatus': 1,
                            'commissionPer': 1,
                            'commissionAmount': 1,
                            'orderAcceptedTime': 1,
                            'orderRejectedTime': 1,
                            'orderCancelledTime': 1,
                            'orderDeliveredTime': 1,
                            'rescusedFood': 1,
                            'storeAmount': 1,
                            'adminAmount': 1,
                            'orderFullSubTotal': 1,
                            'orderFullTax': 1,
                            'orderFullTotal': 1,
                            'paymentMode': 1,
                            'orderFullSaveAmount': 1,
                            'paymentStatus': 1,
                            'priceObj': 1,
                            'total': 1,
                            'status': 1,
                            'storeId': 1,
                            'updatedAt': 1,
                            'createdAt': 1,
                            'orderData': 1,
                            // 'totalPrice':{$sum:"$$orderData.price" },
                            'orderDetail': 1,
                            'usersDetail.name': 1,
                            'actualOrderDate': 1,
                            'usersDetail._id': 1,
                            'usersDetail.userNumber': 1,
                            'usersDetail.userNumber': 1,
                            'usersDetail.address': 1,
                            'restaurantDetail._id': 1,
                            'restaurantDetail.empNumber': 1,
                            'restaurantDetail.businessName': 1,
                            'restaurantDetail.address': 1,
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                ])

                for (let k = 0; k < restrauntList.length; k++) {



                    restaurantEarnings += restrauntList[k].total




                    // totalPrice +=  orderList[i].orderData[j].productAmount
                    // totalQuantity += orderList[i].orderData[j].quantity
                    // totalDiscount += orderList[i].orderData[j].productDiscountAmount
                    // totalAmountQnty += orderList[i].orderData[j].amountWithQuantuty
                }

                brandList[j].totalRestaurentEarn = restaurantEarnings
                brandList[j].totalOrder = restrauntList.length

                // orderList[i].fullPrice = totalPrice
                // orderList[i].totalQuantity = totalQuantity
                // orderList[i].totalDiscount = totalDiscount
                // orderList[i].totalAmountQnty = totalAmountQnty

            }

            brandList = brandList.map(
                d => {
                  return {
                    _id : d._id,
                    empNumber : d.empNumber,
                    businessName : d.businessName,
                    address : d.address,
                    totalOrder : d.totalOrder,
                    totalRestaurentEarn : d.totalRestaurentEarn
                  }
                }          
              )
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Sheet1'); //creating worksheet
            //  WorkSheet Header
            worksheet.columns = [
            {
                header: 'Store ID',
                key: 'empNumber',
                width: 20
            },
            {
                header: 'Store Name',
                key: 'businessName',
                width: 20
            },
            {
                header: 'Location',
                key: 'address',
                width: 20
            },
            {
                header: 'Total Orders',
                key: 'totalOrder',
                width: 20
            },
            {
                header: 'Amount to be paid',
                key: 'totalRestaurentEarn',
                width: 20
            }        
            ];
            //Add Array Rows
            worksheet.addRows(brandList);
    
            //create file
            let file = await workbook.xlsx.writeFile(`storeTransactionsList.xlsx`)
            let link = `https://saveeat.in:3035/api/v1/adminUser/getOrderListFile/storeTransactionsList.xlsx`
            return res.send({ response_code: 200, message: "Download link", Data: link, TotalRestorent: brandList.length })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // =================================== User Dash Board  ================================================//

    userDashboard: async (req, res) => {
        try {


            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = { "userType": "User" }

            let queryCheck1 = { "userType": "User" }



            if (req.body.status != '') {

                if (req.body.status == 'Total') {
                    // queryCheck.status = 'Active'
                    // queryCheck1.status = 'Active'
                }

                if (req.body.status == 'Active') {
                    queryCheck.status = 'Active'
                    queryCheck1.status = 'Active'
                }

                if (req.body.status == 'Inactive') {
                    queryCheck.status = 'Inactive'
                    queryCheck1.status = 'Inactive'
                }

            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
            }


            console.log("queryCheck==>", queryCheck)

            console.log("queryCheck111==>", queryCheck1)



            let result = await User.find(queryCheck).count()

            let result1 = await User.find(queryCheck1).count()

            let totalPercentage = (result / result1) * (100)

            if (result == 0 && result1 == 0) {
                totalPercentage = 0
            }


            // let result = await User.paginate(queryCheck, options)


            return res.send({ response_code: 200, message: "User Dashboard", Data: result, totalData: result1, TotalPercentage: totalPercentage })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // ================================== Restaurnt Dash Board =============================================//


    restaurntDashboard: async (req, res) => {
        try {


            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = { "userType": "Brand" }

            let queryCheck1 = { "userType": "Brand" }



            if (req.body.status != '') {

                if (req.body.status == 'Total') {
                    // queryCheck.status = 'Active'
                    // queryCheck1.status = 'Active'
                }

                if (req.body.status == 'Pending') {
                    queryCheck.status = 'Pending'
                    // queryCheck1.status = 'Pending'
                }

                if (req.body.status == 'Approve') {
                    queryCheck.status = 'Approve'
                    // queryCheck1.status = 'Approve'
                }

                if (req.body.status == 'Inactive') {
                    queryCheck.status = 'Inactive'
                    // queryCheck1.status = 'Approve'
                }

                if (req.body.status == 'Disapprov') {
                    queryCheck.status = 'Disapprov'
                    // queryCheck1.status = 'Disapprov'
                }

            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
            }


            console.log("queryCheck==>", queryCheck)

            console.log("queryCheck111==>", queryCheck1)



            let result = await Restaurant.find(queryCheck).count()

            let result1 = await Restaurant.find(queryCheck1).count()

            let totalPercentage = (result / result1) * (100)

            if (result == 0 && result1 == 0) {
                totalPercentage = 0
            }

            // let result = await User.paginate(queryCheck, options)


            return res.send({ response_code: 200, message: "Restaurant Dashboard", Data: result, totalData: result1, TotalPercentage: totalPercentage })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================== Order Dashboard =================================================//

    orderDashboard: async (req, res) => {
        try {


            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = {}

            let queryCheck1 = {}



            if (req.body.status != '') {

                // enum:['Pending','Accepted','Rejected','Cancelled','On the way','Out for delivery','Delivered','Arrive','Order Ready for pickup'],

                if (req.body.status == 'Total') {
                    // queryCheck.status = 'Active'
                    // queryCheck1.status = 'Active'
                }

                if (req.body.status == 'Pending') {
                    queryCheck.status = 'Pending'
                    // queryCheck1.status = 'Pending'
                }

                if (req.body.status == 'Delivered') {
                    queryCheck.status = 'Delivered'
                    // queryCheck1.status = 'Delivered'
                }

                if (req.body.status == 'Rejected') {
                    queryCheck.status = 'Rejected'
                    // queryCheck1.status = 'Rejected'
                }

                if (req.body.status == 'Cancelled') {
                    queryCheck.status = 'Cancelled'
                    // queryCheck1.status = 'Cancelled'
                }

            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
            }


            console.log("queryCheck==>", queryCheck)

            console.log("queryCheck111==>", queryCheck1)



            let result = await Order.find(queryCheck).count()

            console.log("result==>", result)

            let result1 = await Order.find(queryCheck1).count()

            console.log("result1==>", result1)

            let totalPercentage = (result / result1) * (100)

            if (result == 0 && result1 == 0) {
                totalPercentage = 0
            }

            console.log("totalPercentage===>", totalPercentage)


            // let result = await User.paginate(queryCheck, options)


            return res.send({ response_code: 200, message: "Order DashBoard", Data: result, totalData: result1, TotalPercentage: totalPercentage })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=================================== Items Dashboard =================================================//

    itemDashboard: async (req, res) => {
        try {


            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = {}

            let queryCheck1 = {}



            if (req.body.status != '') {

                // enum:['Pending','Accepted','Rejected','Cancelled','On the way','Out for delivery','Delivered','Arrive','Order Ready for pickup'],

                if (req.body.status == 'Total') {
                    // queryCheck.status = 'Active'
                    // queryCheck1.status = 'Active'
                }

                if (req.body.status == 'Start') {
                    queryCheck.status = 'Start'
                    // queryCheck1.status = 'Pending'
                }

                // if (req.body.status == 'Delivered') {
                //     queryCheck.status = 'Delivered'
                //     // queryCheck1.status = 'Delivered'
                // }

                if (req.body.status == 'Stop') {
                    queryCheck.status = 'Stop'
                    // queryCheck1.status = 'Rejected'
                }



            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
            }


            console.log("queryCheck==>", queryCheck)

            console.log("queryCheck111==>", queryCheck1)



            let result = await sellItems.find(queryCheck).count()

            console.log("result==>", result)

            let result1 = await sellItems.find(queryCheck1).count()

            console.log("result1==>", result1)

            let totalPercentage = (result / result1) * (100)

            if (result == 0 && result1 == 0) {
                totalPercentage = 0
            }

            console.log("totalPercentage===>", totalPercentage)


            // let result = await User.paginate(queryCheck, options)


            return res.send({ response_code: 200, message: "Order DashBoard", Data: result, totalData: result1, TotalPercentage: totalPercentage })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //==================================== Financial Dashboard ============================================//

    financeDashboard: async (req, res) => {
        try {


            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = {}

            let queryCheck1 = { }



            if (req.body.status != '') {

                if (req.body.status == 'gross') {
                    // queryCheck.status = 'Active'
                    // queryCheck1.status = 'Active'
                }

                if (req.body.status == 'saveeat') {

                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await Order.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$saveEatFees" }
                            }
                        }
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes[0].totalQuantity
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await Order.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$saveEatFees" }
                            }
                        }
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1[0].totalQuantity
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Finance Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'commission') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await Order.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$totalCommissionAmount" }
                            }
                        }
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes[0].totalQuantity
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await Order.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$totalCommissionAmount" }
                            }
                        }
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1[0].totalQuantity
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Finance Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'proceeds') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await Order.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$storeProceeds" }
                            }
                        }
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes[0].totalQuantity
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await Order.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$storeProceeds" }
                            }
                        }
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1[0].totalQuantity
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Finance Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'refund') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await Refund.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$refundAmount" }
                            }
                        }
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes[0].totalQuantity
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await Refund.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$refundAmount" }
                            }
                        }
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1[0].totalQuantity
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Finance Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
            }


            let totalRescuedItems = 0
            let itemsRes = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    "$group": {
                        _id: "$_id",
                        totalQuantity: { "$sum": "$total" }
                    }
                }
            ])
            if (itemsRes.length > 0) {
                totalRescuedItems = itemsRes[0].totalQuantity
            }


            let totalRescuedItems1 = 0
            let itemsRes1 = await Order.aggregate([
                {
                    $match: queryCheck1
                },
                {
                    "$group": {
                        _id: "$_id",
                        totalQuantity: { "$sum": "$total" }
                    }
                }
            ])
            if (itemsRes.length > 0) {
                totalRescuedItems1 = itemsRes1[0].totalQuantity
            }

            console.log("queryCheck==>", queryCheck)

            console.log("queryCheck111==>", queryCheck1)



            let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)

            if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                totalPercentage = 0
            }




            return res.send({ response_code: 200, message: "Finance Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===================================== Credit Dashboard =============================================//

    creditDashboard: async (req, res) => {
        try {


            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = {  }

            let queryCheck1 = {  }



            if (req.body.status != '') {

                if (req.body.status == 'Total') {
                    // queryCheck.status = 'Active'
                    // queryCheck1.status = 'Active'
                }

                if (req.body.status == 'Pending') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let result = await CouponUsed.find(queryCheck).count()
        
                    let result1 = await CouponUsed.find(queryCheck1).count()
        
                    let totalPercentage = (result / result1) * (100)
        
                    if (result == 0 && result1 == 0) {
                        totalPercentage = 0
                    }
        
        
                    // let result = await User.paginate(queryCheck, options)
        
        
                    return res.send({ response_code: 200, message: "Credit Dashboard", Data: result, totalData: result1, TotalPercentage: totalPercentage })
        
                }

                // if (req.body.status == 'Inactive') {
                //     queryCheck.status = 'Inactive'
                //     queryCheck1.status = 'Inactive'
                // }

            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
            }


            console.log("queryCheck==>", queryCheck)

            console.log("queryCheck111==>", queryCheck1)



            let result = await Coins.find(queryCheck).count()

            let result1 = await Coins.find(queryCheck1).count()

            let totalPercentage = (result / result1) * (100)

            if (result == 0 && result1 == 0) {
                totalPercentage = 0
            }


            // let result = await User.paginate(queryCheck, options)


            return res.send({ response_code: 200, message: "Credit Dashboard", Data: result, totalData: result1, TotalPercentage: totalPercentage })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //===================================== Reward Dashboard =============================================//

    rewardDashboard: async (req, res) => {
        try {


            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = {}

            let queryCheck1 = { }



            if (req.body.status != '') {

                if (req.body.status == 'food') {
                    // queryCheck.name = "Food Lover"
                    // queryCheck1.status = 'Active'
                }

                if (req.body.status == 'tree') {

                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await badgesEarn.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
        
                    {
                        "$match": { "usersDetail.name": "Tree Lover" }
                    },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes.length
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await badgesEarn.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
                        {
                            "$match": { "usersDetail.name": "Tree Lover" }
                        },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1.length
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Reward Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'little') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await badgesEarn.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
        
                    {
                        "$match": { "usersDetail.name": "Little Saver" }
                    },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes.length
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await badgesEarn.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
                        {
                            "$match": { "usersDetail.name": "Little Saver" }
                        },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1.length
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Reward Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'co2') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await badgesEarn.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
        
                    {
                        "$match": { "usersDetail.name": "Co2 Minator" }
                    },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes.length
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await badgesEarn.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
                        {
                            "$match": { "usersDetail.name": "Co2 Minator" }
                        },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1.length
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Reward Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'super') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await badgesEarn.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
        
                    {
                        "$match": { "usersDetail.name": "Super Saver" }
                    },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes.length
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await badgesEarn.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
                        {
                            "$match": { "usersDetail.name": "Super Saver" }
                        },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1.length
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Reward Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'king') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await badgesEarn.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
        
                    {
                        "$match": { "usersDetail.name": "King Corn" }
                    },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes.length
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await badgesEarn.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
                        {
                            "$match": { "usersDetail.name": "King Corn" }
                        },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1.length
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Reward Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'lord') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await badgesEarn.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
        
                    {
                        "$match": { "usersDetail.name": "Lord of the Planet" }
                    },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes.length
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await badgesEarn.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
                        {
                            "$match": { "usersDetail.name": "Lord of the Planet" }
                        },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1.length
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Reward Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'conqueror') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await badgesEarn.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
        
                    {
                        "$match": { "usersDetail.name": "Conqueror" }
                    },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes.length
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await badgesEarn.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
                        {
                            "$match": { "usersDetail.name": "Conqueror" }
                        },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1.length
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Reward Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'carbon') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await badgesEarn.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
        
                    {
                        "$match": { "usersDetail.name": "Carbon Capturer" }
                    },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes.length
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await badgesEarn.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
                        {
                            "$match": { "usersDetail.name": "Carbon Capturer" }
                        },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1.length
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Reward Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'champion') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await badgesEarn.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
        
                    {
                        "$match": { "usersDetail.name": "Champion" }
                    },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes.length
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await badgesEarn.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
                        {
                            "$match": { "usersDetail.name": "Champion" }
                        },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1.length
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Reward Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'Weekend') {
                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await badgesEarn.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
        
                    {
                        "$match": { "usersDetail.name": "Weekend Warrior" }
                    },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes.length
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await badgesEarn.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            $lookup:
                            {
                                from: "badges",
                                localField: "badgeId",
                                foreignField: "_id",
                                as: "usersDetail"
                            }
                        },
                        {
                            $project: {
            
                                "_id": 1,
                                "badgeId":1,
                                "createdAt":1,
                                "updatedAt":1,
        
                                // "fullName": 1,
                                // "profilePic": 1,
                                "usersDetail": 1,
                            }
                        },
                        {
                            "$match": { "usersDetail.name": "Weekend Warrior" }
                        },
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems1 = itemsRes1.length
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Reward Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
            }

            // queryCheck.name = "Food Lover"

            // queryCheck1.name = "Food Lover"

            let totalRescuedItems = 0
            let itemsRes = await badgesEarn.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "badges",
                        localField: "badgeId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $project: {
    
                        "_id": 1,
                        "badgeId":1,
                        "createdAt":1,
                        "updatedAt":1,

                        // "fullName": 1,
                        // "profilePic": 1,
                        "usersDetail": 1,
                    }
                },

            {
                "$match": { "usersDetail.name": "Food Lover" }
            },
            ])
            if (itemsRes.length > 0) {
                totalRescuedItems = itemsRes.length
            }


            let totalRescuedItems1 = 0
            let itemsRes1 = await badgesEarn.aggregate([
                {
                    $match: queryCheck1
                },
                {
                    $lookup:
                    {
                        from: "badges",
                        localField: "badgeId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $project: {
    
                        "_id": 1,
                        "badgeId":1,
                        "createdAt":1,
                        "updatedAt":1,

                        // "fullName": 1,
                        // "profilePic": 1,
                        "usersDetail": 1,
                    }
                },
                {
                    "$match": { "usersDetail.name": "Food Lover" }
                },
            ])
            if (itemsRes.length > 0) {
                totalRescuedItems1 = itemsRes1.length
            }

            console.log("queryCheck==>", queryCheck)

            console.log("queryCheck111==>", queryCheck1)



            let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)

            if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                totalPercentage = 0
            }




            return res.send({ response_code: 200, message: "Reward Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // ==================================== saved Dashboard ===============================================//

    savedDashboard: async (req, res) => {
        try {


            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = {}

            let queryCheck1 = { }



            if (req.body.status != '') {

                if (req.body.status == 'co2') {
                    // queryCheck.name = "Food Lover"
                    // queryCheck1.status = 'Active'
                }

                if (req.body.status == 'kg') {

                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await Order.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$quantity" }
                            }
                        }
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes[0].totalQuantity
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await Order.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$quantity" }
                            }
                        }
                    ])
                    if (itemsRes1.length > 0) {
                        totalRescuedItems1 = itemsRes1[0].totalQuantity
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Saved Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'meals') {

                    queryCheck.status= 'Delivered'
                    queryCheck1.status= 'Delivered'


                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await Order.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$rescusedFood" }
                            }
                        }
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes[0].totalQuantity
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await Order.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$rescusedFood" }
                            }
                        }
                    ])
                    if (itemsRes1.length > 0) {
                        totalRescuedItems1 = itemsRes1[0].totalQuantity
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Saved Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

                if (req.body.status == 'user') {

                    if (!req.body.startDate == '' && !req.body.endDate == "") {
                        let endDates = new Date(req.body.endDate)
        
                        endDates.setDate(endDates.getDate() + 1)
        
                        console.log("endDates==>", endDates)
                        queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    }
        
                    if (req.body.timeframe == "Today") {
                        let startTodayDate = new Date(moment().format())
                        let setTodayDate = new Date()
                        setTodayDate.setHours(00, 00, 59, 999);
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Week") {
                        let weekDate = new Date(moment().startOf('isoWeek').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                    }
                    if (req.body.timeframe == "Month") {
                        let monthDate = new Date(moment().clone().startOf('month').format())
                        let todayDate = new Date()
                        todayDate.setHours(23, 59, 59, 999);
                        queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                        // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                    }
        
        
                    let totalRescuedItems = 0
                    let itemsRes = await Order.aggregate([
                        {
                            $match: queryCheck
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$saveAmount" }
                            }
                        }
                    ])
                    if (itemsRes.length > 0) {
                        totalRescuedItems = itemsRes[0].totalQuantity
                    }
        
        
                    let totalRescuedItems1 = 0
                    let itemsRes1 = await Order.aggregate([
                        {
                            $match: queryCheck1
                        },
                        {
                            "$group": {
                                _id: "$_id",
                                totalQuantity: { "$sum": "$saveAmount" }
                            }
                        }
                    ])
                    if (itemsRes1.length > 0) {
                        totalRescuedItems1 = itemsRes1[0].totalQuantity
                    }
        
                    console.log("queryCheck==>", queryCheck)
        
                    console.log("queryCheck111==>", queryCheck1)
        
        
        
                    let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
        
                    if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                        totalPercentage = 0
                    }
        
        
        
        
                    return res.send({ response_code: 200, message: "Saved Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
        
                }

            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
                let setTodayDate = new Date()
                setTodayDate.setHours(00, 00, 59, 999);
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Week") {
                let weekDate = new Date(moment().startOf('isoWeek').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
            }
            if (req.body.timeframe == "Month") {
                let monthDate = new Date(moment().clone().startOf('month').format())
                let todayDate = new Date()
                todayDate.setHours(23, 59, 59, 999);
                queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
            }

            // queryCheck.name = "Food Lover"

            // queryCheck1.name = "Food Lover"

            let totalRescuedItems = 0
            let itemsRes = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    "$group": {
                        _id: "$_id",
                        totalQuantity: { "$sum": "$rescusedFood" }
                    }
                }
            ])
            if (itemsRes.length > 0) {
                totalRescuedItems = itemsRes[0].totalQuantity
            }


            let totalRescuedItems1 = 0
            let itemsRes1 = await Order.aggregate([
                {
                    $match: queryCheck1
                },
                {
                    "$group": {
                        _id: "$_id",
                        totalQuantity: { "$sum": "$rescusedFood" }
                    }
                }
            ])
            if (itemsRes1.length > 0) {
                totalRescuedItems1 = itemsRes1[0].totalQuantity
            }

            console.log("queryCheck==>", queryCheck)

            console.log("queryCheck111==>", queryCheck1)



            let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)

            if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                totalPercentage = 0
            }




            return res.send({ response_code: 200, message: "Saved Dashboard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // =================================== Admin Commission List ===========================================//

    updateRestaurntCommission: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            // req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let getBrand = await Brand.findOne({_id: req.body.brandId})
            
            let updateUserStatus = await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { fixCommissionPer: req.body.fixCommissionPer, commission: req.body.commission } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
             //zoho
             response.log('===========================================ZOHO Works================================================');
             let dataString = {
                 "data": [
                     {
                        "Surplus_Commission": req.body.fixCommissionPer, 
                        "Full_Price_Commission": req.body.commission
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
                     response.log('===========================================Saved================================================>',data);
                 }else{
                     response.log('===========================================Not Saved================================================',error);
                 }
             });

            response.log("Status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Commission updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    onCreateCoin: async (req, res) => {
        try {
            response.log("Request for coin create is=============>", req.body)
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            let mainAdmin = await Admin.findOne({ userType: "Admin" })
            let subAdminId = (mainAdmin.creditNumber)



            if(req.body.creditType == "Direct"){
                for (let i = 0; i < req.body.userId.length; i++) {

                    let mainAdmin = await Admin.findOne({ userType: "Admin" })
                    let subAdminId = (mainAdmin.creditNumber)

                    let todayDate = new Date(req.body.toDate)
                    todayDate.setHours(23, 59, 59, 999);

                    let user = await User.findOne({ "_id": req.body.userId[i]._id })
                    if (user) {
                        let obj = new Coins({
                            userId: ObjectId(user._id),
                            creditNumber: "CR" + subAdminId,
                            creditTitle: req.body.creditTitle,
                            creditCode: req.body.creditCode,
                            creditType: req.body.creditType,
                            remaningFrequency: req.body.creditAmount,
                            // totalFrequency: req.body.totalFrequency,
                            creditAmount: req.body.creditAmount,

                            description: req.body.description,

                            // fromDate: req.body.fromDate,
                            expiryDate: req.body.expiryDate
                        })

                        await obj.save()

                        let subAdminIds = (mainAdmin.creditNumber) + 1
                        await Admin.findByIdAndUpdate({ _id: mainAdmin._id }, { $set: { "creditNumber": subAdminIds } }, { new: true, lean: true })

                        let totalCreaditedAmount = Number(user.walletAmount)+Number(req.body.creditAmount)
                        await User.findOneAndUpdate({ _id: ObjectId(user._id) }, { $set: { "walletAmount": totalCreaditedAmount } }, { new: true, lean: true })

                        let notiTitle = `${user.name}! You received ${req.body.creditAmount} amount in your wallet.`
                        let notiMessage = `${user.name}! You received ${req.body.creditAmount} amount in your wallet and it would be expired ${req.body.expiryDate}`
                        let notiType = 'credit'
                        let newId = user._id
                        let deviceToken = user.deviceToken
                        let deviceType = user.deviceType
                          
              
                        notificationFunction.sendNotificationForAndroid(deviceToken,notiTitle, notiMessage, notiType, newId, deviceType, (error10, result10) => {
                              response.log("Notification Sent");
                          })

                          //zoho
                            response.log('===========================================ZOHO Works================================================');
                            let dataString = {
                                "data": [
                                    {
                                        "Unused_Credits": req.body.creditAmount
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
            }

            if(req.body.creditType == "Code"){

                let todayDate = new Date(req.body.toDate)
                todayDate.setHours(23, 59, 59, 999);

                let checkCode = await Coins.findOne({ creditCode: req.body.creditCode })
                if(checkCode){
                    return response.responseHandlerWithMessagtie(res, 500, "Code Already exists");
                }

    
                let obj = new Coins({
                    creditNumber: "CR" + subAdminId,
                    creditTitle: req.body.creditTitle,
                    creditCode: req.body.creditCode,
                    creditType: req.body.creditType,
                    totalFrequency: req.body.totalFrequency,
                    remaningFrequency: req.body.totalFrequency,
                    creditAmount: req.body.creditAmount,
                    fromDate: req.body.fromDate,
                    toDate: todayDate,
                    description: req.body.description,
                })
    
                await obj.save()
    
                let subAdminIds = (mainAdmin.creditNumber) + 1
             await Admin.findByIdAndUpdate({ _id: mainAdmin._id }, { $set: { "creditNumber": subAdminIds } }, { new: true, lean: true })
    
            }



            // if (req.body.userId.length > 0) {

            //     for (let i = 0; i < req.body.userId.length; i++) {

            //         let mainAdmin = await Admin.findOne({ userType: "Admin" })
            //         let subAdminId = (mainAdmin.creditNumber)

            //         let todayDate = new Date(req.body.toDate)
            //         todayDate.setHours(23, 59, 59, 999);

            //         let user = await User.findOne({ "userNumber": req.body.userId[i] })
            //         if (user) {
            //             let obj = new Coins({
            //                 userId: ObjectId(user._id),
            //                 creditNumber: "CR" + subAdminId,
            //                 creditTitle: req.body.creditTitle,
            //                 creditCode: req.body.creditCode,
            //                 creditType: req.body.creditType,
            //                 remaningFrequency: req.body.totalFrequency,
            //                 totalFrequency: req.body.totalFrequency,
            //                 creditAmount: req.body.creditAmount,
            //                 fromDate: req.body.fromDate,
            //                 toDate: todayDate,
            //             })

            //             await obj.save()

            //             let subAdminIds = (mainAdmin.creditNumber) + 1
            //             await Admin.findByIdAndUpdate({ _id: mainAdmin._id }, { $set: { "creditNumber": subAdminIds } }, { new: true, lean: true })

            //         }

            //     }

            // }else{

            //     let todayDate = new Date(req.body.toDate)
            //     todayDate.setHours(23, 59, 59, 999);
    
            //     let obj = new Coins({
            //         creditNumber: "CR" + subAdminId,
            //         creditTitle: req.body.creditTitle,
            //         creditCode: req.body.creditCode,
            //         creditType: req.body.creditType,
            //         totalFrequency: req.body.totalFrequency,
            //         remaningFrequency: req.body.totalFrequency,
            //         creditAmount: req.body.creditAmount,
            //         fromDate: req.body.fromDate,
            //         toDate: todayDate,
            //     })
    
            //     await obj.save()
    
            //     let subAdminIds = (mainAdmin.creditNumber) + 1
            //  await Admin.findByIdAndUpdate({ _id: mainAdmin._id }, { $set: { "creditNumber": subAdminIds } }, { new: true, lean: true })
    
            // }



            response.log("Coin added successfully")
            return response.responseHandlerWithData(res, 200, `Coin added successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    //=======================expiry credits cron =====================
    //50 23 * * * wget -O - -q -t 1 http://13.234.94.41:3032/api/v1/adminUser/expireCreditsCron
    expireCreditsCron: async (req, res) => {
        try {
            let todayDate = date.format(new Date(),"YYYY-MM-DD")
            response.log("todayDate============================>",todayDate)
            let findExpiryCredits = await Coins.aggregate([{
                $match: {
                    status: 'Active',
                    creditType: 'Direct',
                    // expiryDate: todayDate
                    expiryDate: {
                        $lte : todayDate
                    }
                }
            }])
            if(findExpiryCredits && findExpiryCredits.length > 0){
                response.log("findExpiryCredits.length============================>",findExpiryCredits.length)
                for (x of findExpiryCredits) {
                    let user = await User.findOne({ "_id": x.userId })
                    // let user = await User.findOne({ "_id": ObjectId('61c97eff97ef732fd45e90f2') })
                    let coinUpdate = await Coins.findOneAndUpdate({
                        _id: x._id
                    }, {
                        status: 'Expired'
                    });
                    if(coinUpdate){
                        if(user.walletAmount - x.creditAmount < 0){
                            let userCoinUpdate = await User.findOneAndUpdate({
                                _id: x.userId
                            }, {
                                // $inc: {
                                //     walletAmount: -user.creditAmount
                                // }
                                walletAmount:0
                            }); 
                        }else{
                            let userCoinUpdate = await User.findOneAndUpdate({
                                _id: x.userId
                            }, {
                                $inc: {
                                    walletAmount: -x.remaningFrequency
                                }
                            }); 
                        }                                               
                        response.log("works=====================>",x.remaningFrequency)
                        let notiTitle = `${user.name}! Your ${x.remaningFrequency} Credits has been expired.`
                        let notiMessage = `${user.name}! Your ${x.remaningFrequency} Credits has been expired.`
                        let notiType = 'expired'
                        let newId = user._id
                        let deviceToken = user.deviceToken
                        let deviceType = user.deviceType
                          
              
                        notificationFunction.sendNotificationForAndroid(deviceToken,notiTitle, notiMessage, notiType, newId, deviceType, (error10, result10) => {
                              response.log("Notification Sent");
                        })
                        //zoho
                        let userUpdated = await User.findOne({ "_id": x.userId })

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
                return response.responseHandlerWithData(res, 200, `Data found successfully`, findExpiryCredits);
            }else{
                return response.responseHandlerWithData(res, 200, `Data not found.`);
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    onCreditListing: async (req, res) => {
        try {
            response.log("Request for coin create is=============>", req.body)
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10,
                sort: { createdAt: -1 },
                select: { password: 0 },
                lean: true
            }
            let queryCheck = {}

            if(req.body.creditType){
                queryCheck.creditType = req.body.creditType
            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

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

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "creditCode": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "creditTitle": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "creditNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }
            // let result = await Coins.paginate(queryCheck, options)

            let coinDetails = await Coins.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'userId': 1,
                        'creditNumber': 1,
                        'creditTitle': 1,
                        'creditCode': 1,
                        'creditType': 1,
                        'description': 1,
                        'transectionType': 1,
                        'status': 1,
                        'remaningFrequency': 1,
                        'totalFrequency': 1,
                        'creditAmount': 1,
                        'fromDate': 1,
                        'toDate': 1,
                        'createdAt': 1,
                        'expiryDate':1,
                        'convertedFrom': 1,
                        'convertedTo': 1,
                        'usersDetail.name': 1,
                        'usersDetail.email': 1,
                        'usersDetail.mobileNumber': 1,
                        'usersDetail.userNumber': 1,
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])

            let totalDocument = await Coins.find(queryCheck).count()

            console.log("totalDocument===>", totalDocument)
            // response.log("User List Found", result)
            return res.send({ status: 200, message: "Coins List Found", data: coinDetails, total: totalDocument })
            // return response.responseHandlerWithData(res, 200, "Coins List Found", coinDetails,totalDocument);



        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    onUserCreditListing: async (req, res) => {
        try {
            response.log("Request for coin create is=============>", req.body)
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10,
                sort: { createdAt: -1 },
                select: { password: 0 },
                lean: true
            }
            let queryCheck = {"userId":ObjectId(req.body.userId)}

            if(req.body.creditType){
                queryCheck.creditType = req.body.creditType
            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

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

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "creditCode": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "creditTitle": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "creditNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }
            // let result = await Coins.paginate(queryCheck, options)

            let coinDetails = await Coins.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'userId': 1,
                        'creditNumber': 1,
                        'creditTitle': 1,
                        'creditCode': 1,
                        'creditType': 1,
                        'description': 1,
                        'transectionType': 1,
                        'status': 1,
                        'remaningFrequency': 1,
                        'totalFrequency': 1,
                        'creditAmount': 1,
                        'fromDate': 1,
                        'toDate': 1,
                        'createdAt': 1,
                        'convertedFrom': 1,
                        'convertedTo': 1,
                        'usersDetail.name': 1,
                        'usersDetail.email': 1,
                        'usersDetail.mobileNumber': 1,
                        'usersDetail.userNumber': 1,
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])

            let totalDocument = await Coins.find(queryCheck).count()

            console.log("totalDocument===>", totalDocument)
            // response.log("User List Found", result)
            return res.send({ status: 200, message: "Coins List Found", data: coinDetails, total: totalDocument })
            // return response.responseHandlerWithData(res, 200, "Coins List Found", coinDetails,totalDocument);



        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    updateCouponCode: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            // req.checkBody('brandId', 'Something went wrong').notEmpty();
            // req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            let checkCreditCode = await Coins.findOne({_id: req.body.couponId})
            if(!checkCreditCode){
                return response.responseHandlerWithMessage(res, 501, "Credit code Not found");
            }

            if(checkCreditCode.totalFrequency >  req.body.totalFrequency){
                return response.responseHandlerWithMessage(res, 500, "new total frequency is less then old total frequency");
            }

            let remainingFrequency = Number(checkCreditCode.totalFrequency) - Number(checkCreditCode.remaningFrequency)

            let TotalFrequency = Number(req.body.totalFrequency) -  Number(remainingFrequency)

            let todayDate = new Date(new Date((req.body.toDate)).getTime()-(1*24*60*60*1000) )
            todayDate.setHours(23, 59, 59, 999);

            let updateUserStatus = await Coins.findByIdAndUpdate({ _id: req.body.couponId }, { $set: { creditTitle: req.body.creditTitle, creditCode: req.body.creditCode, totalFrequency: req.body.totalFrequency, creditAmount: req.body.creditAmount, fromDate: req.body.fromDate, toDate: todayDate, description: req.body.description, remaningFrequency: Number(TotalFrequency) } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }

            response.log("Status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    onParticularCreditDetails:async (req, res) =>{
        try {
            response.log("Request for coin create is=============>", req.body)
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10,
                sort: { createdAt: -1 },
                select: { password: 0 },
                lean: true
            }
            let queryCheck = {"_id":ObjectId(req.body.couponId)}

            if(req.body.creditType){
                queryCheck.creditType = req.body.creditType
            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

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

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "creditCode": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "creditTitle": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "creditNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }
            // let result = await Coins.paginate(queryCheck, options)

            let coinDetails = await Coins.aggregate([
                {
                    $match:  {"_id":ObjectId(req.body.couponId)}
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'userId': 1,
                        'creditNumber': 1,
                        'creditTitle': 1,
                        'creditCode': 1,
                        'creditType': 1,
                        'description': 1,
                        'transectionType': 1,
                        'status': 1,
                        'remaningFrequency': 1,
                        'totalFrequency': 1,
                        'creditAmount': 1,
                        'fromDate': 1,
                        'toDate': 1,
                        'createdAt': 1,
                        'convertedFrom': 1,
                        'convertedTo': 1,
                        'usersDetail.name': 1,
                        'usersDetail.email': 1,
                        'usersDetail.mobileNumber': 1,
                        'usersDetail.userNumber': 1,
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                // { $skip: skip },
                // { $limit: limit },
            ])

            let totalDocument = await Coins.find(queryCheck).count()

            console.log("totalDocument===>", totalDocument)
            // response.log("User List Found", result)
            return res.send({ status: 200, message: "Coin Found Sucessfully", data: coinDetails })
            // return response.responseHandlerWithData(res, 200, "Coins List Found", coinDetails,totalDocument);



        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    onSearchUser: async (req, res) => {

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

            let queryCheck = { userType: 'User' }

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

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "firstName": { $regex:   req.body.search, $options: 'i' } },
                        { "name": { $regex:   req.body.search, $options: 'i' } },
                        { "lastName": { $regex:   req.body.search, $options: 'i' } },
                        { "email": { $regex:   req.body.search, $options: 'i' } },
                        {
                            "userNumber": {
                                $in: req.body.search.split(',')
                            }
                        },
                    ]
                }]
            }

            // if (req.body.search) {
            //     queryCheck.$and = [{
            //         $or: [
            //             { "firstName": { $regex:   req.body.search, $options: 'i' } },
            //             { "name": { $regex:   req.body.search, $options: 'i' } },
            //             { "lastName": { $regex:   req.body.search, $options: 'i' } },
            //             { "email": { $regex:   req.body.search, $options: 'i' } },
            //             { "userNumber": { $regex:   req.body.search, $options: 'i' } },
            //         ]
            //     }]
            // }

            let project1 = {
                _id: 1,
                userNumber: 1,
                firstName:1,
                lastName:1,
                name:1,
                email:1,
                mobileNumber:1,
                walletAmount:1
            }

            let result = await User.find(queryCheck, project1)

            // let result = await User.paginate(queryCheck, options)
            response.log("User List Found", result)
            return response.responseHandlerWithData(res, 200, "User List Found", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    onMakeRefund: async (req, res) => {
        try {
            response.log("Request for coin create is=============>", req.body)
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }


            let userCheck = await User.findOne({ _id: ObjectId(req.body.userId) })
            if (!userCheck) {
                return res.send({ status: 400, message: "user not found" })
            }

            let totalAmount = parseInt(userCheck.walletAmount) + parseInt(req.body.refundAmount)

            let updateUserRefund = await User.findByIdAndUpdate({ _id: userCheck._id }, { $set: { "walletAmount": totalAmount } }, { new: true, lean: true })

            let orderRefund = await Order.findOneAndUpdate({ _id: ObjectId(req.body.orderId) }, { $set: { "refundStatus": "Refund" } }, { new: true, lean: true })

            let mainAdmin = await Admin.findOne({ userType: "Admin" })
            let subAdminId = (mainAdmin.refundNumber)

            let obj = new Refund({
                userId: ObjectId(req.body.userId),
                adminId: ObjectId(req.body.adminId),
                refundNumber: "RF" + subAdminId,
                refundAmount: req.body.refundAmount,
                reason: req.body.reason,
                refundType: req.body.refundType,
                refundedBy: req.body.refundedBy,
                orderId: ObjectId(req.body.orderId),
                storeId: ObjectId(req.body.storeId),
            })

            await obj.save()

            let subAdminIds = (mainAdmin.refundNumber) + 1
            let updateSubAdminCount = await Admin.findByIdAndUpdate({ _id: mainAdmin._id }, { $set: { "refundNumber": subAdminIds } }, { new: true, lean: true })

            let user = await User.findOne({ "_id": ObjectId(req.body.userId) })
            if(user){

                // let totalCreaditedAmount = Number(user.walletAmount)+Number(req.body.refundAmount)

                // await User.findOneAndUpdate({ _id: ObjectId(user._id) }, { $set: { "walletAmount": totalCreaditedAmount } }, { new: true, lean: true })
           
              let notiTitle = `${user.name}! You recived ${req.body.refundAmount} amount in your wallet.`
              let notiMessage = `${user.name}! You recived ${req.body.refundAmount} amount in your wallet.`
              let notiType = 'credit'
              let newId = user._id
              let deviceToken = user.deviceToken
              let deviceType = user.deviceType
                
    
              notificationFunction.sendNotificationForAndroid(deviceToken,notiTitle, notiMessage, notiType, newId, deviceType, (error10, result10) => {
                    response.log("Notification Sent");
                })
            }


            


            response.log("Refunded successfully")
            return response.responseHandlerWithData(res, 200, `Refunded successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    onRefundCreditList: async (req, res) => {
        try {
            response.log("Request for credit request is=============>", req.body)
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10,
                sort: { createdAt: -1 },
                select: { password: 0 },
                lean: true
            }
            let queryCheck = { "refundType": "Credit" }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

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
                        { "refundNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "reason": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "refundAmount": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "refundAmount": req.body.search},

                    ]
                }]
            }
            // let result = await Coins.paginate(queryCheck, options)

            let refundDetails = await Refund.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "storeDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "productorders",
                        localField: "orderId",
                        foreignField: "_id",
                        as: "orderDetail"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'userId': 1,
                        'adminId': 1,
                        'refundNumber': 1,
                        'refundAmount': 1,
                        'reason': 1,
                        'refundType': 1,
                        'refundedBy': 1,
                        'orderId': 1,
                        'storeId': 1,
                        'createdAt': 1,
                        'usersDetail.name': 1,
                        'usersDetail.email': 1,
                        'usersDetail.mobileNumber': 1,
                        'usersDetail.userNumber': 1,
                        'storeDetail.businessName': 1,
                        'storeDetail.empNumber': 1,
                        'orderDetail.orderNumber': 1,
                        'orderDetail._id': 1,
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])

            let totalDocument = await Refund.find(queryCheck).count()

            console.log("totalDocument===>", totalDocument)
            // response.log("User List Found", result)
            return res.send({ status: 200, message: "Coins List Found", data: refundDetails, total: totalDocument })
            // return response.responseHandlerWithData(res, 200, "Coins List Found", coinDetails,totalDocument);



        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    downloadRefundCreditList: async (req, res) => {
        try {
            response.log("Request for credit request is=============>", req.body)
            // const errors = req.validationErrors();
            // if (errors) {
            //     let error = errors[0].msg;
            //     response.log("Field is missing")
            //     return response.responseHandlerWithMessage(res, 503, error);
            // }

            // var skip = 0
            // var limit = 10
            // if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
            //     skip = (Number(req.body.pageNumber) - 1) * 10
            // }
            // if (req.body.limit && Number(req.body.limit) != 0) {
            //     limit = Number(req.body.limit)
            // }


            let options = {
                // page: Number(req.body.pageNumber) || 1,
                limit: 100000000,
                sort: { createdAt: -1 },
                // select: { password: 0 },
                // lean: true
            }
            let queryCheck = { "refundType": "Credit" }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

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
                        { "refundNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "reason": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "refundAmount": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "refundAmount": req.body.search},

                    ]
                }]
            }
            // let result = await Coins.paginate(queryCheck, options)

            let refundDetails = await Refund.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "storeDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "productorders",
                        localField: "orderId",
                        foreignField: "_id",
                        as: "orderDetail"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'userId': 1,
                        'adminId': 1,
                        'refundNumber': 1,
                        'refundAmount': 1,
                        'reason': 1,
                        'refundType': 1,
                        'refundedBy': 1,
                        'orderId': 1,
                        'storeId': 1,
                        'createdAt': 1,
                        'usersDetail.name': 1,
                        'usersDetail.email': 1,
                        'usersDetail.mobileNumber': 1,
                        'usersDetail.userNumber': 1,
                        'storeDetail.businessName': 1,
                        'storeDetail.empNumber': 1,
                        'orderDetail.orderNumber': 1,
                        'orderDetail._id': 1,
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                // { $skip: skip },
                // { $limit: limit },
            ])

            let totalDocument = await Refund.find(queryCheck).count()

            refundDetails = refundDetails.map(
                d => {
                  return {
                    refundNumber : d.refundNumber,
                    createdAt: date.format(d.createdAt, "DD/MM/YYYY"),
                    orderId : d.orderDetail[0].orderNumber,
                    userId : d.usersDetail[0].userNumber,
                    customerName : d.orderDetail[0].name,
                    storeId : d.storeDetail[0].empNumber,
                    storeName : d.storeDetail[0].businessName,
                    creditAmount : d.refundAmount,
                    refundReason :d.reason
                  }
                }          
            )
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Sheet1'); //creating worksheet
            //  WorkSheet Header
            worksheet.columns = [
            {
                header: 'Txn. ID',
                key: 'refundNumber',
                width: 20
            },
            {
                header: 'Order Date',
                key: 'createdAt',
                width: 20
            },
            {
                header: 'Order ID',
                key: 'orderId',
                width: 20
            },
            {
                header: 'Customer ID',
                key: 'userId',
                width: 20
            },
            {
                header: 'Customer Name',
                key: 'customerName',
                width: 20
            },
            {
                header: 'Store ID',
                key: 'storeId',
                width: 20
            },
            {
                header: 'Store Name',
                key: 'storeName',
                width: 20
            },
            {
                header: 'Credit Amount',
                key: 'creditAmount',
                width: 20
            },
            {
                header: 'Refund Reason',
                key: 'refundReason',
                width: 20
            }
            ];
            //Add Array Rows
            worksheet.addRows(refundDetails);
    
            //create file
            let file = await workbook.xlsx.writeFile(`creditRedeemTransactionList.xlsx`)
            let link = `https://saveeat.in:3035/api/v1/adminUser/getRestaurantsListFile/creditRedeemTransactionList.xlsx`

            return res.send({ status: 200, message: "Download Link", Data: link, total: totalDocument })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    onRefundAmountList: async (req, res) => {
        try {
            response.log("Request for credit request is=============>", req.body)
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10,
                sort: { createdAt: -1 },
                select: { password: 0 },
                lean: true
            }
            let queryCheck = { "refundType": "Amount" }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

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
                        { "refundNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "reason": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "refundAmount": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "refundAmount": req.body.search},

                    ]
                }]
            }
            // let result = await Coins.paginate(queryCheck, options)

            let refundDetails = await Refund.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "storeDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "productorders",
                        localField: "orderId",
                        foreignField: "_id",
                        as: "orderDetail"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'userId': 1,
                        'adminId': 1,
                        'refundNumber': 1,
                        'refundAmount': 1,
                        'reason': 1,
                        'refundType': 1,
                        'refundedBy': 1,
                        'orderId': 1,
                        'storeId': 1,
                        'createdAt': 1,
                        'usersDetail.name': 1,
                        'usersDetail.email': 1,
                        'usersDetail.mobileNumber': 1,
                        'usersDetail.userNumber': 1,
                        'storeDetail.businessName': 1,
                        'storeDetail.empNumber': 1,
                        'orderDetail.orderNumber': 1,
                        'orderDetail._id': 1,
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])

            let totalDocument = await Refund.find(queryCheck).count()

            console.log("totalDocument===>", totalDocument)
            // response.log("User List Found", result)
            return res.send({ status: 200, message: "Coins List Found", data: refundDetails, total: totalDocument })
            // return response.responseHandlerWithData(res, 200, "Coins List Found", coinDetails,totalDocument);



        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    onRewardList: async (req, res) => {
        try {
            response.log("Request for credit request is=============>", req.body)
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10,
                sort: { createdAt: -1 },
                select: { password: 0 },
                lean: true
            }
            let queryCheck = {  }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

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
                        { "rewardNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "rewardType": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "claimedStatus": { $regex: "^" + req.body.search, $options: 'i' } },

                        // { "refundAmount": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "refundAmount": req.body.search},

                    ]
                }]
            }
            // let result = await Coins.paginate(queryCheck, options)

            let rewardDetails = await Rewards.aggregate([
                {
                    $match: queryCheck
                },
                // {
                //     $lookup: {
                //         from: "rewards",
                //         let: { brandId: '$_id' },
                //         pipeline: [
                //             {
                //                 $match:
                //                 {
                //                     $expr:
                //                     {
                //                         $and:
                //                             [
                //                                 { $eq: ["$_id", "$$brandId"] },

                //                             ]
                //                     }

                //                 }


                //             },
                //             {
                //                 $sort: {
                //                     createdAt: -1
                //                 }
                //             },
                //             { $limit: 1 }
                //         ],

                //         as: "rewardsDetails"
                //     }
                // },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },

                {
                    $project: {
                        '_id': 1,
                        'userId': 1,
                        'rewardNumber':1,
                        'createdAt': 1,
                        'recievedDate':1,
                        'claimedDate':1,
                        'rewardsDetails':1,
                        'usersDetail.name': 1,
                        'usersDetail.email': 1,
                        'usersDetail.mobileNumber': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.createdAt': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail._id': 1
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])

            for(let i = 0; i < rewardDetails.length;i++ ){

                let totalRewardClaimed = await Rewards.find({"userId":ObjectId(rewardDetails[i].usersDetail[0]._id)}).count()

                rewardDetails[i].rewardClaimed = totalRewardClaimed

            }

            let totalDocument = await Rewards.find(queryCheck).count()

            console.log("totalDocument===>", totalDocument)
            // response.log("User List Found", result)
            return res.send({ status: 200, message: "Reward List Found", data: rewardDetails, total: totalDocument })
            // return response.responseHandlerWithData(res, 200, "Coins List Found", coinDetails,totalDocument);



        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    onUserRewardList: async(req, res) => {
        try {
            response.log("Request for credit request is=============>", req.body)
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10,
                sort: { createdAt: -1 },
                select: { password: 0 },
                lean: true
            }
            let queryCheck = { userId: ObjectId(req.body.userId) }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

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

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "rewardNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "rewardType": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "claimedStatus": { $regex: "^" + req.body.search, $options: 'i' } },

                        // { "refundAmount": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "refundAmount": req.body.search},

                    ]
                }]
            }
            // let result = await Coins.paginate(queryCheck, options)

            let rewardDetails = await Rewards.aggregate([
                {
                    $match: queryCheck
                },
                // {
                //     $lookup: {
                //         from: "rewards",
                //         let: { brandId: '$_id' },
                //         pipeline: [
                //             {
                //                 $match:
                //                 {
                //                     $expr:
                //                     {
                //                         $and:
                //                             [
                //                                 { $eq: ["$_id", "$$brandId"] },

                //                             ]
                //                     }

                //                 }


                //             },
                //             {
                //                 $sort: {
                //                     createdAt: -1
                //                 }
                //             },
                //             { $limit: 1 }
                //         ],

                //         as: "rewardsDetails"
                //     }
                // },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },

                {
                    $project: {
                        '_id': 1,
                        'claimedStatus':1,
                        'rewardType':1,
                        'userId': 1,
                        'rewardNumber':1,
                        'createdAt': 1,
                        'rewardsDetails':1,
                        'usersDetail.name': 1,
                        'usersDetail.email': 1,
                        'usersDetail.mobileNumber': 1,
                        'usersDetail.userNumber': 1
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])

            let totalDocument = await Rewards.find(queryCheck).count()

            console.log("totalDocument===>", totalDocument)
            // response.log("User List Found", result)
            return res.send({ status: 200, message: "Reward List Found", data: rewardDetails, total: totalDocument })
            // return response.responseHandlerWithData(res, 200, "Coins List Found", coinDetails,totalDocument);

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    particularUserTransection: async (req, res) => {
        try {

            let totalPrice = 0
            let totalQuantity = 0
            let totalDiscount = 0
            let totalAmountQnty = 0

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }

            let queryCheck = { "userId": ObjectId(req.body.userId) }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
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

            if (req.body.search) {
                var regex = new RegExp(req.body.search, "i")

                queryCheck.$and = [{
                    $or: [
                        { "orderNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "orderData": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }

            if (req.body.paymentMethod) {
                queryCheck.paymentMode = req.body.paymentMethod
            }

            if (req.body.orderStatus) {
                queryCheck.status = req.body.paymentMethod
            }

            if (req.body.refundStatus) {
                queryCheck.refundStatus = req.body.refundStatus
            }

            console.log("queryCheck==>", queryCheck)


            let totalOrder = await Order.find(queryCheck).count()


            let orderList = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },

                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "restaurantDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "mainorders",
                        localField: "storeData[0].storeId",
                        foreignField: "_id",
                        as: "orderDetail"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'status': 1,
                        'saveAmount': 1,
                        'paymentStatus': 1,
                        'refundStatus': 1,
                        'orderNumber': 1,
                        'pickupDate': 1,
                        'pickupTime': 1,
                        'convertedPickupDate': 1,
                        'actualOrderDate': 1,
                        'orderDate': 1,
                        'subTotal': 1,
                        'offerPrice': 1,
                        'tax': 1,
                        'paymentStatus': 1,
                        'commissionPer': 1,
                        'commissionAmount': 1,
                        'orderAcceptedTime': 1,
                        'orderRejectedTime': 1,
                        'orderCancelledTime': 1,
                        'orderDeliveredTime': 1,
                        'rescusedFood': 1,
                        'storeAmount': 1,
                        'adminAmount': 1,
                        'orderFullSubTotal': 1,
                        'orderFullTax': 1,
                        'orderFullTotal': 1,
                        'paymentMode': 1,
                        'orderFullSaveAmount': 1,
                        'paymentStatus': 1,
                        'priceObj': 1,
                        'total': 1,
                        'status': 1,
                        'storeId': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'orderData': 1,
                        // 'totalPrice':{$sum:"$$orderData.price" },
                        'usersDetail.name': 1,
                        'actualOrderDate': 1,
                        'usersDetail._id': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.address': 1,
                        'restaurantDetail._id': 1,
                        'restaurantDetail.empNumber': 1,
                        'restaurantDetail.businessName': 1,
                        'restaurantDetail.address': 1,
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])


            for (let i = 0; i < orderList.length; i++) {

                for (let j = 0; j < orderList[i].orderData.length; j++) {
                    totalPrice += orderList[i].orderData[j].productAmount
                    totalQuantity += orderList[i].orderData[j].quantity
                    totalDiscount += orderList[i].orderData[j].productDiscountAmount
                    totalAmountQnty += orderList[i].orderData[j].amountWithQuantuty
                }

                orderList[i].fullPrice = totalPrice
                orderList[i].totalQuantity = totalQuantity
                orderList[i].totalDiscount = totalDiscount
                orderList[i].totalAmountQnty = totalAmountQnty


            }

            return res.send({ response_code: 200, message: "Restaurant List", Data: orderList, StoreData: brandList, Total: totalOrder })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // =================================== hidden restaurent =====================================//

    generateCodeHidden: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            let restaurntDetails = await Restaurant.findOne({ _id: req.body.brandId })


            let splitedRestaurentName = restaurntDetails.businessName.substring(0,3)
            // .substring(3)

            let randomNumber = Math.floor(100 + Math.random() * 900)

            let generateRandomCode = splitedRestaurentName.concat(randomNumber)

            let updateUserStatus = await Restaurant.findByIdAndUpdate({ _id: req.body.brandId }, { $set: { hiddenCode: generateRandomCode,hiddenStatus:true } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }

            await Restaurant.updateMany({ brandId: req.body.brandId }, { $set: { hiddenCode: generateRandomCode,hiddenStatus:true } }, { new: true })

            response.log("Status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // =================================== hidden status =========================================//

    updateRestaurntHiddenStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('brandId', 'Something went wrong').notEmpty();
            req.checkBody('hiddenStatus', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Restaurant.findOneAndUpdate({ _id: ObjectId(req.body.brandId) }, { $set: { "hiddenStatus": req.body.hiddenStatus } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            await Restaurant.updateMany({ brandId: req.body.brandId }, { $set: { "hiddenStatus": req.body.hiddenStatus } }, { new: true })

            response.log("Status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },



    // ======================================== Restaurnt History ================================= //


    restaurntOrderListAdmin: async (req, res) => {
        try {

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 50,
                sort: { createdAt: -1 },
            }
            let queryCheck = {"storeId": ObjectId(req.body.storeId) }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

            if (req.body.timeframe == "Today") {
                let startTodayDate = new Date(moment().format())
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



            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [

                        { "orderNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "mobileNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                        // { "address": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }

            console.log("queryCheck==>", queryCheck)

            let totalOrder = await Order.find(queryCheck).count()


            let orderList = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "brands",
                        localField: "storeId",
                        foreignField: "_id",
                        as: "restaurantDetail"
                    }
                },


                {
                    $project: {
                        '_id': 1,
                        'status': 1,
                        'saveAmount': 1,
                        'paymentStatus': 1,
                        'refundStatus': 1,
                        'orderNumber': 1,
                        'paymentMode': 1,
                        'total': 1,
                        'status': 1,
                        'storeId': 1,
                        'updatedAt': 1,
                        'createdAt': 1,
                        'orderData': 1,
                        'usersDetail.name': 1,
                        'actualOrderDate': 1,
                        'usersDetail._id': 1,
                        'usersDetail.userNumber': 1,
                        'usersDetail.mobileNumber': 1,
                        'restaurantDetail._id': 1,
                        'restaurantDetail.empNumber': 1,
                        'restaurantDetail.businessName': 1,
                        'restaurantDetail.address': 1,
                    }
                },
                // {
                //     $match: {
                //         "menuDetails.status":"Active"
                //     }
                // },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])


            let amount = 0
            let amountStore = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    "$group": {
                        _id: "$storeId",
                        totalQuantity: { "$sum": "$total" }
                    }
                }
            ])
            if (amountStore.length > 0) {
                amount = amountStore[0].totalQuantity
            }


            let credit = 0
            let creditStore = await Order.aggregate([
                {
                    $match: queryCheck
                },
                {
                    "$group": {
                        _id: "$storeId",
                        totalQuantity: { "$sum": "$deductedPoints" }
                    }
                }
            ])
            if (amountStore.length > 0) {
                credit = creditStore[0].totalQuantity
            }

            



            return res.send({ response_code: 200, message: "Restaurant List", Data: orderList, TotalCount: totalOrder,Amount:amount,Credit:credit })

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },
    

        //=================================== Order Dashboard =================================================//

        restaurntOrderDashboard: async (req, res) => {
            try {
    
    
                if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                    skip = (Number(req.body.pageNumber) - 1) * 10
                }
                if (req.body.limit && Number(req.body.limit) != 0) {
                    limit = Number(req.body.limit)
                }
    
    
                let options = {
                    page: Number(req.body.pageNumber) || 1,
                    limit: Number(req.body.limit) || 50,
                    sort: { createdAt: -1 },
                }
                let queryCheck = {"storeId": ObjectId(req.body.storeId)}
    
                let queryCheck1 = {"storeId": ObjectId(req.body.storeId)}
    
    
    
                if (req.body.status != '') {
    
                    // enum:['Pending','Accepted','Rejected','Cancelled','On the way','Out for delivery','Delivered','Arrive','Order Ready for pickup'],
    
                    if (req.body.status == 'Total') {
                        // queryCheck.status = 'Active'
                        // queryCheck1.status = 'Active'
                    }
    
                    if (req.body.status == 'Pending') {
                        queryCheck.status = 'Pending'
                        // queryCheck1.status = 'Pending'
                    }
    
                    if (req.body.status == 'Delivered') {
                        queryCheck.status = 'Delivered'
                        // queryCheck1.status = 'Delivered'
                    }
    
                    if (req.body.status == 'Rejected') {
                        queryCheck.status = 'Rejected'
                        // queryCheck1.status = 'Rejected'
                    }
    
                    if (req.body.status == 'Cancelled') {
                        queryCheck.status = 'Cancelled'
                        // queryCheck1.status = 'Cancelled'
                    }
    
                }
    
                if (!req.body.startDate == '' && !req.body.endDate == "") {
                    let endDates = new Date(req.body.endDate)
    
                    endDates.setDate(endDates.getDate() + 1)
    
                    console.log("endDates==>", endDates)
                    queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                }
    
                if (req.body.timeframe == "Today") {
                    let startTodayDate = new Date(moment().format())
                    let setTodayDate = new Date()
                    setTodayDate.setHours(00, 00, 59, 999);
                    let todayDate = new Date()
                    todayDate.setHours(23, 59, 59, 999);
                    queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                }
                if (req.body.timeframe == "Week") {
                    let weekDate = new Date(moment().startOf('isoWeek').format())
                    let todayDate = new Date()
                    todayDate.setHours(23, 59, 59, 999);
                    queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                    // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                }
                if (req.body.timeframe == "Month") {
                    let monthDate = new Date(moment().clone().startOf('month').format())
                    let todayDate = new Date()
                    todayDate.setHours(23, 59, 59, 999);
                    queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                    // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                }
    
    
                console.log("queryCheck==>", queryCheck)
    
                console.log("queryCheck111==>", queryCheck1)
    
    
    
                let result = await Order.find(queryCheck).count()
    
                console.log("result==>", result)
    
                let result1 = await Order.find(queryCheck1).count()
    
                console.log("result1==>", result1)
    
                let totalPercentage = (result / result1) * (100)
    
                if (result == 0 && result1 == 0) {
                    totalPercentage = 0
                }
    
                console.log("totalPercentage===>", totalPercentage)
    
    
                // let result = await User.paginate(queryCheck, options)
    
    
                return res.send({ response_code: 200, message: "Order DashBoard", Data: result, totalData: result1, TotalPercentage: totalPercentage })
    
            } catch (error) {
                response.log("Error is=========>", error);
                return response.responseHandlerWithMessage(res, 500, "Internal server error");
            }
        },
    
        //=================================== Items Dashboard =================================================//
    
        restaurntItemDashboard: async (req, res) => {
            try {
    
    
                if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                    skip = (Number(req.body.pageNumber) - 1) * 10
                }
                if (req.body.limit && Number(req.body.limit) != 0) {
                    limit = Number(req.body.limit)
                }
    
    
                let options = {
                    page: Number(req.body.pageNumber) || 1,
                    limit: Number(req.body.limit) || 50,
                    sort: { createdAt: -1 },
                }
                let queryCheck = {"brandId": ObjectId(req.body.storeId)}
    
                let queryCheck1 = {"brandId": ObjectId(req.body.storeId)}
    
    
    
                if (req.body.status != '') {
                    console.log("ppppppp")
                    // enum:['Pending','Accepted','Rejected','Cancelled','On the way','Out for delivery','Delivered','Arrive','Order Ready for pickup'],
    
                    if (req.body.status == 'Total') {
                        // queryCheck.status = 'Active'
                        // queryCheck1.status = 'Active'


                        if (!req.body.startDate == '' && !req.body.endDate == "") {
                            let endDates = new Date(req.body.endDate)
            
                            endDates.setDate(endDates.getDate() + 1)
            
                            console.log("endDates==>", endDates)
                            queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                            // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        }
            
                        if (req.body.timeframe == "Today") {
                            let startTodayDate = new Date(moment().format())
                            let setTodayDate = new Date()
                            setTodayDate.setHours(00, 00, 59, 999);
                            let todayDate = new Date()
                            todayDate.setHours(23, 59, 59, 999);
                            queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                            // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        }
                        if (req.body.timeframe == "Week") {
                            let weekDate = new Date(moment().startOf('isoWeek').format())
                            let todayDate = new Date()
                            todayDate.setHours(23, 59, 59, 999);
                            queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                            // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                        }
                        if (req.body.timeframe == "Month") {
                            let monthDate = new Date(moment().clone().startOf('month').format())
                            let todayDate = new Date()
                            todayDate.setHours(23, 59, 59, 999);
                            queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                            // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                        }
            
            
                        console.log("queryCheck==>", queryCheck)
            
                        console.log("queryCheck111==>", queryCheck1)

                        let itemsRes2 = await Products.aggregate([
                            {
                                $match:queryCheck
                            },
                            // {
                            //     "$group": {
                            //         _id: "$userId",
                            //         totalQuantity: { "$sum": "$quantity" }
                            //     }
                            // }
                        ])

                        let result1 =  itemsRes2.length


                        let totalRescuedItems = 0
                        let itemsRes = await Products.aggregate([
                            {
                                $match:queryCheck
                            },
                            {
                                "$group": {
                                    _id: "$userId",
                                    totalQuantity: { "$sum": "$addedQuantity" }
                                }
                            }
                        ])
                        if (itemsRes.length > 0) {
                            totalRescuedItems = itemsRes[0].totalQuantity
                        }


                        let totalRescuedItems1 = 0
                        let itemsRes1 = await Products.aggregate([
                            {
                                $match:queryCheck1
                            },
                            {
                                "$group": {
                                    _id: "$userId",
                                    totalQuantity: { "$sum": "$addedQuantity" }
                                }
                            }
                        ])

                        if (itemsRes.length > 0) {
                            totalRescuedItems1 = itemsRes1[0].totalQuantity
                        }
            
            
            
                        // let result = await Order.find(queryCheck).count()
            
                        // console.log("result==>", result)
            
                        // let result1 = await Order.find(queryCheck1).count()
            
                        // console.log("result1==>", result1)
            
                        let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
            
                        if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                            totalPercentage = 0
                        }
            
                        console.log("totalPercentage===>", totalPercentage)
            
            
                        // let result = await User.paginate(queryCheck, options)
            
            
                        return res.send({ response_code: 200, message: "Order DashBoard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
            

                    }
    
                    if (req.body.status == 'Start') {
                        // queryCheck.status = 'Active'
                        // queryCheck1.status = 'Active'


                        if (!req.body.startDate == '' && !req.body.endDate == "") {
                            let endDates = new Date(req.body.endDate)
            
                            endDates.setDate(endDates.getDate() + 1)
            
                            console.log("endDates==>", endDates)
                            queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                            // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        }
            
                        if (req.body.timeframe == "Today") {
                            let startTodayDate = new Date(moment().format())
                            let setTodayDate = new Date()
                            setTodayDate.setHours(00, 00, 59, 999);
                            let todayDate = new Date()
                            todayDate.setHours(23, 59, 59, 999);
                            queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                            // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        }
                        if (req.body.timeframe == "Week") {
                            let weekDate = new Date(moment().startOf('isoWeek').format())
                            let todayDate = new Date()
                            todayDate.setHours(23, 59, 59, 999);
                            queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                            // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                        }
                        if (req.body.timeframe == "Month") {
                            let monthDate = new Date(moment().clone().startOf('month').format())
                            let todayDate = new Date()
                            todayDate.setHours(23, 59, 59, 999);
                            queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                            // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                        }
            
            
                        console.log("queryCheck==>", queryCheck)
            
                        console.log("queryCheck111==>", queryCheck1)

                        let itemsRes2 = await Productearning.aggregate([
                            {
                                $match:queryCheck
                            },
                            // {
                            //     "$group": {
                            //         _id: "$userId",
                            //         totalQuantity: { "$sum": "$quantity" }
                            //     }
                            // }
                        ])

                        let result1 =  itemsRes2.length


                        let totalRescuedItems = 0
                        let itemsRes = await Productearning.aggregate([
                            {
                                $match:queryCheck
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


                        let totalRescuedItems1 = 0
                        let itemsRes1 = await Productearning.aggregate([
                            {
                                $match:queryCheck1
                            },
                            {
                                "$group": {
                                    _id: "$userId",
                                    totalQuantity: { "$sum": "$quantity" }
                                }
                            }
                        ])

                        if (itemsRes.length > 0) {
                            totalRescuedItems1 = itemsRes1[0].totalQuantity
                        }
            
            
            
                        // let result = await Order.find(queryCheck).count()
            
                        // console.log("result==>", result)
            
                        // let result1 = await Order.find(queryCheck1).count()
            
                        // console.log("result1==>", result1)
            
                        let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
            
                        if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                            totalPercentage = 0
                        }
            
                        console.log("totalPercentage===>", totalPercentage)
            
            
                        // let result = await User.paginate(queryCheck, options)
            
            
                        return res.send({ response_code: 200, message: "Order DashBoard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
            

                    }
    
                    // if (req.body.status == 'Delivered') {
                    //     queryCheck.status = 'Delivered'
                    //     // queryCheck1.status = 'Delivered'
                    // }
    
                    if (req.body.status == 'Stop') {
                        // queryCheck.status = 'Active'
                        // queryCheck1.status = 'Active'


                        if (!req.body.startDate == '' && !req.body.endDate == "") {
                            let endDates = new Date(req.body.endDate)
            
                            endDates.setDate(endDates.getDate() + 1)
            
                            console.log("endDates==>", endDates)
                            queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                            // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                        }
            
                        if (req.body.timeframe == "Today") {
                            let startTodayDate = new Date(moment().format())
                            let setTodayDate = new Date()
                            setTodayDate.setHours(00, 00, 59, 999);
                            let todayDate = new Date()
                            todayDate.setHours(23, 59, 59, 999);
                            queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                            // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                        }
                        if (req.body.timeframe == "Week") {
                            let weekDate = new Date(moment().startOf('isoWeek').format())
                            let todayDate = new Date()
                            todayDate.setHours(23, 59, 59, 999);
                            queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                            // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                        }
                        if (req.body.timeframe == "Month") {
                            let monthDate = new Date(moment().clone().startOf('month').format())
                            let todayDate = new Date()
                            todayDate.setHours(23, 59, 59, 999);
                            queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                            // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                        }
            
            
                        console.log("queryCheck==>", queryCheck)
            
                        console.log("queryCheck111==>", queryCheck1)

                        let itemsRes2 = await Productearning.aggregate([
                            {
                                $match:queryCheck
                            },
                            // {
                            //     "$group": {
                            //         _id: "$userId",
                            //         totalQuantity: { "$sum": "$quantity" }
                            //     }
                            // }
                        ])

                        let result1 =  itemsRes2.length


                        let totalRescuedItems = 0
                        let itemsRes = await Productearning.aggregate([
                            {
                                $match:queryCheck
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


                        let totalRescuedItems1 = 0
                        let itemsRes1 = await Productearning.aggregate([
                            {
                                $match:queryCheck1
                            },
                            {
                                "$group": {
                                    _id: "$userId",
                                    totalQuantity: { "$sum": "$quantity" }
                                }
                            }
                        ])

                        if (itemsRes.length > 0) {
                            totalRescuedItems1 = itemsRes1[0].totalQuantity
                        }
            
            
            
                        // let result = await Order.find(queryCheck).count()
            
                        // console.log("result==>", result)
            
                        // let result1 = await Order.find(queryCheck1).count()
            
                        // console.log("result1==>", result1)
            
                        let totalPercentage = (totalRescuedItems / totalRescuedItems1) * (100)
            
                        if (totalRescuedItems1 == 0 && totalRescuedItems == 0) {
                            totalPercentage = 0
                        }
            
                        console.log("totalPercentage===>", totalPercentage)
            
            
                        // let result = await User.paginate(queryCheck, options)
            
            
                        return res.send({ response_code: 200, message: "Order DashBoard", Data: totalRescuedItems, totalData: totalRescuedItems1, TotalPercentage: totalPercentage })
            

                    }
    
    
    
                }
    
                if (!req.body.startDate == '' && !req.body.endDate == "") {
                    let endDates = new Date(req.body.endDate)
    
                    endDates.setDate(endDates.getDate() + 1)
    
                    console.log("endDates==>", endDates)
                    queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                    // queryCheck1.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
                }
    
                if (req.body.timeframe == "Today") {
                    let startTodayDate = new Date(moment().format())
                    let setTodayDate = new Date()
                    setTodayDate.setHours(00, 00, 59, 999);
                    let todayDate = new Date()
                    todayDate.setHours(23, 59, 59, 999);
                    queryCheck.createdAt = { $gte: setTodayDate, $lte: todayDate }
                    // queryCheck1.createdAt = { $gte: setTodayDate, $lte: todayDate }
                }
                if (req.body.timeframe == "Week") {
                    let weekDate = new Date(moment().startOf('isoWeek').format())
                    let todayDate = new Date()
                    todayDate.setHours(23, 59, 59, 999);
                    queryCheck.createdAt = { $gte: weekDate, $lte: todayDate }
                    // queryCheck1.createdAt = { $gte: weekDate, $lte: todayDate }
                }
                if (req.body.timeframe == "Month") {
                    let monthDate = new Date(moment().clone().startOf('month').format())
                    let todayDate = new Date()
                    todayDate.setHours(23, 59, 59, 999);
                    queryCheck.createdAt = { $gte: monthDate, $lte: todayDate }
                    // queryCheck1.createdAt = { $gte: monthDate, $lte: todayDate }
                }
    
    
                console.log("queryCheck==>", queryCheck)
    
                console.log("queryCheck111==>", queryCheck1)
    
    
    
                let result = await sellItems.find(queryCheck).count()
    
                console.log("result==>", result)
    
                let result1 = await sellItems.find(queryCheck1).count()
    
                console.log("result1==>", result1)
    
                let totalPercentage = (result / result1) * (100)
    
                if (result == 0 && result1 == 0) {
                    totalPercentage = 0
                }
    
                console.log("totalPercentage===>", totalPercentage)
    
    
                // let result = await User.paginate(queryCheck, options)
    
    
                return res.send({ response_code: 200, message: "Order DashBoard", Data: result, totalData: result1, TotalPercentage: totalPercentage })
    
            } catch (error) {
                response.log("Error is=========>", error);
                return response.responseHandlerWithMessage(res, 500, "Internal server error");
            }
        },

        //=================================  reward Dashboard ======================================//



    // ======================================== refund ============================================ //

         refundAmountRazorPay:async(req, res) =>  {
        try {
            response.log("Request for coin create is=============>", req.body)
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }


            request({
                method: 'POST',
                url: 'https://rzp_test_sGoeuZ1XejwLSl:y34YdNSVvj5JWS2UOYzfAkMt@api.razorpay.com/v1/payments/pay_I9EeKkQGt0IRgT/refund',
              }, function (error, response, body) {
                //   console.log('response:======>', response)
                console.log('Status:======>', response.statusCode);
                console.log('Headers:=======>', JSON.stringify(response.headers));
                console.log('Response:========>', body);
              });


            // let userCheck = await User.findOne({ _id: ObjectId(req.body.userId) })
            // if (!userCheck) {
            //     return res.send({ status: 400, message: "user not found" })
            // }

            // let totalAmount = parseInt(userCheck.walletAmount) + parseInt(req.body.refundAmount)

            // let updateUserRefund = await User.findByIdAndUpdate({ _id: userCheck._id }, { $set: { "walletAmount": totalAmount } }, { new: true, lean: true })

            // let orderRefund = await Order.findOneAndUpdate({ _id: ObjectId(req.body.orderId) }, { $set: { "refundStatus": "Refund" } }, { new: true, lean: true })

            // let mainAdmin = await Admin.findOne({ userType: "Admin" })
            // let subAdminId = (mainAdmin.refundNumber)

            // let obj = new Refund({
            //     userId: ObjectId(req.body.userId),
            //     adminId: ObjectId(req.body.adminId),
            //     refundNumber: "RF" + subAdminId,
            //     refundAmount: req.body.refundAmount,
            //     reason: req.body.reason,
            //     refundType: req.body.refundType,
            //     refundedBy: req.body.refundedBy,
            //     orderId: ObjectId(req.body.orderId),
            //     storeId: ObjectId(req.body.storeId),
            // })

            // await obj.save()

            // let subAdminIds = (mainAdmin.refundNumber) + 1
            // let updateSubAdminCount = await Admin.findByIdAndUpdate({ _id: mainAdmin._id }, { $set: { "refundNumber": subAdminIds } }, { new: true, lean: true })

            response.log("Refunded successfully")
            return response.responseHandlerWithData(res, 200, `Refunded successfully`);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
         },

     // ======================================== user credit History ===============================//
     
     userCreditHistory: async (req, res) => {
        try {
            response.log("Request for coin create is=============>", req.body)
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }

            var skip = 0
            var limit = 10
            if (req.body.pageNumber && Number(req.body.pageNumber) != 0) {
                skip = (Number(req.body.pageNumber) - 1) * 10
            }
            if (req.body.limit && Number(req.body.limit) != 0) {
                limit = Number(req.body.limit)
            }


            let options = {
                page: Number(req.body.pageNumber) || 1,
                limit: Number(req.body.limit) || 10,
                sort: { createdAt: -1 },
                select: { password: 0 },
                lean: true
            }
            let queryCheck = {"couponId":ObjectId(req.body.couponId)}

            if(req.body.creditType){
                queryCheck.creditType = req.body.creditType
            }

            if (!req.body.startDate == '' && !req.body.endDate == "") {
                let endDates = new Date(req.body.endDate)

                endDates.setDate(endDates.getDate() + 1)

                console.log("endDates==>", endDates)
                queryCheck.createdAt = { $gte: new Date(req.body.startDate), $lte: endDates }
            }

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

            if (req.body.search) {
                queryCheck.$and = [{
                    $or: [
                        { "creditCode": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "creditTitle": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "creditNumber": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }
            // let result = await Coins.paginate(queryCheck, options)

            let coinDetails = await CouponUsed.aggregate([
                {
                    $match: queryCheck
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $lookup:
                    {
                        from: "credits",
                        localField: "couponId",
                        foreignField: "_id",
                        as: "creditDetail"
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'creditDetail':1,
                        'userId': 1,
                        'createdAt': 1,
                        'convertedFrom': 1,
                        'convertedTo': 1,
                        'usersDetail.name': 1,
                        'usersDetail.email': 1,
                        'usersDetail.mobileNumber': 1,
                        'usersDetail.userNumber': 1,
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
            ])

            let totalDocument = await CouponUsed.find(queryCheck).count()

            console.log("totalDocument===>", totalDocument)
            // response.log("User List Found", result)
            return res.send({ status: 200, message: "Coins List Found", data: coinDetails, total: totalDocument })
            // return response.responseHandlerWithData(res, 200, "Coins List Found", coinDetails,totalDocument);



        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessagtie(res, 500, "Internal server error");
        }
    },

    //========================================= credit update status ==============================//

    updateCreditStatus: async (req, res) => {

        try {
            response.log("Request for update user status is=========>", req.body);
            req.checkBody('userId', 'Something went wrong').notEmpty();
            req.checkBody('status', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateUserStatus = await Coins.findByIdAndUpdate({ _id: req.body.userId }, { $set: { status: req.body.status } }, { new: true })
            if (!updateUserStatus) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, 501, "Something went wrong");
            }
            response.log("User status updated successfully", updateUserStatus)
            return response.responseHandlerWithMessage(res, 200, "Coupon status updated successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    // ======================================== wallet history for brand ============================//
    brandWalletHistory: async (req, res) => {
        try {
            let getData = await Order.aggregate([{
                    $match: {
                        storeId: ObjectId(req.body.brandId),
                        status: {
                            $in: ['Cancelled','Accepted','Delivered']
                        },
                        // status: {
                        //     $ne: 'Rejected'
                        // },
                        createdAt: {
                            $gte: ISODate('2022-02-24')
                        }
                    }
                },
                {
                    $project: {
                            orderNumber: 1,
                            createdAt: 1,
                            total: 1,
                            totalCommissionAmount: 1
                    }
                },
                {
                    $sort:{
                        createdAt: -1
                    }
                }
            ])
            if (getData) {
                return response.responseHandlerWithData(res, 200, "List found successfully", getData);   
            }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },
     




}


