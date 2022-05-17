const userRoutes=require('express').Router();
const userController=require('../adminControllers/userController.js');
const authHandder=require('../authHandler/auth.js');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

userRoutes.get('/expireCreditsCron',userController.expireCreditsCron);

userRoutes.post('/userList',userController.userList);
userRoutes.post('/getUserList',userController.getUserList);
userRoutes.post('/userDownloadList',userController.userDownloadList);
userRoutes.get('/getUserListFile/:fileName',userController.getUserListFile);

userRoutes.post('/updateUserStatus',userController.updateUserStatus);

userRoutes.post('/restaurantsList',userController.restaurantsList);
userRoutes.post('/restaurantsDownloadList',userController.restaurantsDownloadList);
userRoutes.get('/getRestaurantsListFile/:fileName',userController.getRestaurantsListFile);

userRoutes.post('/restrauntBrandList',userController.restrauntBrandList);
userRoutes.post('/particularRestaurnt',userController.particularRestaurnt);
userRoutes.post('/approveRestaurnt',userController.approveRestaurnt);
userRoutes.post('/updateRestaurntStatus',userController.updateRestaurntStatus);
userRoutes.post('/updateRestaurntWallet',userController.updateRestaurntWallet);
userRoutes.post('/updateRestaurntCommission',userController.updateRestaurntCommission);
userRoutes.post('/updateBrandsStatus',userController.updateBrandsStatus);
userRoutes.post('/brandWalletHistory',userController.brandWalletHistory);

userRoutes.post('/customersDetail',userController.customersDetail);

userRoutes.post('/orderListAdmin',userController.orderListAdmin);
userRoutes.post('/downloadOrderListAdmin',userController.downloadOrderListAdmin);
userRoutes.post('/downloadTransectionListAdmin',userController.downloadTransectionListAdmin);
userRoutes.get('/getOrderListFile/:fileName',userController.getOrderListFile);


userRoutes.post('/particularOrderAmin',userController.particularOrderAmin);

userRoutes.post('/userOrderList',userController.userOrderList);

userRoutes.post('/restaurntOrderListAdmin',userController.restaurntOrderListAdmin);

// ============================ restaurnt Dashboard ===========================//

userRoutes.post('/restaurntOrderDashboard',userController.restaurntOrderDashboard);

userRoutes.post('/restaurntItemDashboard',userController.restaurntItemDashboard);

userRoutes.post('/userCreditHistory',userController.userCreditHistory);

userRoutes.post('/onUserCreditListing',userController.onUserCreditListing);

userRoutes.post('/updateCreditStatus',userController.updateCreditStatus);

userRoutes.post('/onParticularCreditDetails',userController.onParticularCreditDetails);

userRoutes.post('/updateCouponCode',userController.updateCouponCode);

userRoutes.post('/financeDashboard',userController.financeDashboard);

userRoutes.post('/creditDashboard',userController.creditDashboard);

userRoutes.post('/rewardDashboard',userController.rewardDashboard);

userRoutes.post('/savedDashboard',userController.savedDashboard);







userRoutes.post('/particularStoreTransection',userController.particularStoreTransection);

userRoutes.post('/storeTransectionList',userController.storeTransectionList);
userRoutes.post('/downloadStoreTransectionList',userController.downloadStoreTransectionList);





userRoutes.post('/itemList',userController.itemList);




userRoutes.post('/addCuisine',userController.addCuisine);
userRoutes.post('/updateCuisine',userController.updateCuisine);
userRoutes.post('/deleteCuisine',userController.deleteCuisine);
userRoutes.post('/cuisineList',userController.cuisineList);

userRoutes.post('/addCuisineCategory',userController.addCuisineCategory);
userRoutes.post('/updateCuisineCategory',userController.updateCuisineCategory);
userRoutes.post('/deleteCuisineCategory',userController.deleteCuisineCategory);
userRoutes.post('/cuisineCategoryList',userController.cuisineCategoryList);
userRoutes.post('/statusUpdateCuisineCategory',userController.statusUpdateCuisineCategory);
userRoutes.post('/cuisineListAggergation',userController.cuisineListAggergation);

userRoutes.post('/menuList',userController.menuList);
userRoutes.post('/verifyMenu',userController.verifyMenu);
userRoutes.post('/updateMenuStatus',userController.updateMenuStatus);
userRoutes.post('/deleteMenu',userController.deleteMenu);
userRoutes.post('/sellItemsList',userController.sellItemsList);

userRoutes.post('/updateProdutStatus',userController.updateProdutStatus);


userRoutes.post('/updateSellproduct',userController.updateSellproduct);





userRoutes.post('/particularCuisine',userController.particularCuisine);
userRoutes.post('/cuisineSubCategoryList',userController.cuisineSubCategoryList);
userRoutes.post('/particularSubCuisine',userController.particularSubCuisine);


// ================================= user Dashboard ==================================//

userRoutes.post('/userDashboard',userController.userDashboard);
userRoutes.post('/restaurntDashboard',userController.restaurntDashboard);
userRoutes.post('/orderDashboard',userController.orderDashboard);
userRoutes.post('/itemDashboard',userController.itemDashboard);


// ================================ Coin Management =====================================//

userRoutes.post('/onCreateCoin',userController.onCreateCoin);
userRoutes.post('/onCreditListing',userController.onCreditListing);

userRoutes.post('/onSearchUser',userController.onSearchUser);

// =============================== Refund Management =======================================//


userRoutes.post('/onMakeRefund',userController.onMakeRefund);

userRoutes.post('/onRefundCreditList',userController.onRefundCreditList);
userRoutes.post('/downloadRefundCreditList',userController.downloadRefundCreditList);

userRoutes.post('/onRefundAmountList',userController.onRefundAmountList);

// ============================== Rewards ==================================================//

userRoutes.post('/onRewardList',userController.onRewardList);

userRoutes.post('/onUserRewardList',userController.onUserRewardList);

// ============================== Restaurnt hidden status ==============================//

userRoutes.post('/generateCodeHidden',userController.generateCodeHidden);
userRoutes.post('/updateRestaurntHiddenStatus',userController.updateRestaurntHiddenStatus);

userRoutes.post('/refundAmountRazorPay',userController.refundAmountRazorPay);














// userRoutes.post('/createUserExcel',userController.createUserExcel);
// userRoutes.post('/getUserDetail',userController.getUserDetail);
// userRoutes.post('/notificationList',userController.notificationList);
// userRoutes.post('/deleteNotification',userController.deleteNotification);
// userRoutes.post('/sendNotification',userController.sendNotification);
// userRoutes.post('/driverList',userController.driverList);
// userRoutes.post('/updateDriverStatus',userController.updateDriverStatus);
// userRoutes.post('/getDriverDetail',userController.getDriverDetail);

// userRoutes.post('/addBanner',userController.addBanner);
// userRoutes.post('/updateBanner',userController.updateBanner);
// userRoutes.post('/addDriver',multipartMiddleware,userController.addDriver);
// userRoutes.post('/updateBrandLogoImage',multipartMiddleware,userController.updateBrandLogoImage);
// userRoutes.post('/updateDriver',multipartMiddleware,userController.updateDriver);
// userRoutes.post('/deleteBanner',userController.deleteBanner);
// userRoutes.post('/bannerList',userController.bannerList);
// userRoutes.post('/getBannerDetail',userController.getBannerDetail);
// userRoutes.post('/pendingBrandList',userController.pendingBrandList);
// userRoutes.post('/pedningDriverList',userController.pedningDriverList);
// userRoutes.post('/verifyDriverStatus',userController.verifyDriverStatus);
// userRoutes.post('/verifyRestaurantStatus',userController.verifyRestaurantStatus);
// userRoutes.post('/brandList',userController.brandList);
// userRoutes.post('/updateBrandStatus',userController.updateBrandStatus);
// userRoutes.post('/brandLogin',userController.brandLogin);
// userRoutes.post('/getBrandDetail',userController.getBrandDetail);
// userRoutes.post('/verifyBranchStatus',userController.verifyBranchStatus);
// userRoutes.post('/updateBranchStatus',userController.updateBranchStatus);
// userRoutes.post('/updateBrandCommission',userController.updateBrandCommission);
// userRoutes.post('/generateQr',userController.generateQr);
// userRoutes.post('/promocodeList',userController.promocodeList);
// userRoutes.post('/updatePromocodeStatus',userController.updatePromocodeStatus);
// userRoutes.post('/itemList',userController.itemList);
// userRoutes.post('/updateItemStatus',userController.updateItemStatus);
// userRoutes.post('/getItemDetail',userController.getItemDetail);
// userRoutes.post('/updateBranchCommission',userController.updateBranchCommission);
// userRoutes.post('/updateBranchVat',userController.updateBranchVat);
// userRoutes.post('/updateBranchService',userController.updateBranchService);
// userRoutes.post('/getBranchDetail',userController.getBranchDetail);
// userRoutes.get('/brandListForBanner',userController.brandListForBanner);
// userRoutes.post('/getRestaurantForBanner',userController.getRestaurantForBanner);
// userRoutes.post('/getRestaurantForArea',userController.getRestaurantForArea);
// userRoutes.post('/addArea',userController.addArea);
// userRoutes.post('/areaList',userController.areaList);
// userRoutes.post('/addDietaryNeed',userController.addDietaryNeed);
// userRoutes.post('/updateDietary',userController.updateDietary);
// userRoutes.post('/deleteDietary',userController.deleteDietary);
// userRoutes.post('/dietaryList',userController.dietaryList);
// userRoutes.post('/getitemVerificationList',userController.getitemVerificationList);
// userRoutes.post('/areaListAll',userController.areaListAll);
// userRoutes.post('/downloadInactiveBranch',userController.downloadInactiveBranch);
// userRoutes.post('/deleteBrand',userController.deleteBrand);
// userRoutes.post('/sendNotificationToUser',userController.sendNotificationToUser);
// userRoutes.post('/sendNotificationToRestro',userController.sendNotificationToRestro);
// userRoutes.post('/orddrList',userController.orddrList);
// userRoutes.get('/dashboardCount',userController.dashboardCount);
// userRoutes.get('/offlineDriverList',userController.offlineDriverList);
// userRoutes.get('/onlineDriverList',userController.onlineDriverList);
// userRoutes.get('/onlineRestroList',userController.onlineRestroList);
// userRoutes.get('/offlineRestroList',userController.offlineRestroList);
// userRoutes.get('/activeBrandList',userController.activeBrandList);
// userRoutes.get('/driverDashboard',userController.driverDashboard);
// userRoutes.post('/graphData',userController.graphData);
// userRoutes.post('/revenueData',userController.revenueData);
// userRoutes.post('/revenuePerOrderData',userController.revenuePerOrderData);
// userRoutes.get('/getDriverDataForMap',userController.getDriverDataForMap);


module.exports=userRoutes;