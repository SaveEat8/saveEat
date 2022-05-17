const userRoutes=require('express').Router();
const userController=require('../userControllers/userController.js');
const brandController=require('../userControllers/brandController.js');
const storeController=require('../userControllers/storeController.js');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const authHandler=require('../authHandler/auth.js');

//=========================Brand Apis==========================================//

userRoutes.post('/checkBrandMobileAndEmail',brandController.checkBrandMobileAndEmail);
userRoutes.post('/verifyOtp',brandController.verifyOtp);
userRoutes.post('/brandLogout',brandController.brandLogout);
userRoutes.post('/brandLoginForPanel',brandController.brandLoginForPanel);
userRoutes.post('/getBrandDetails',brandController.getBrandDetails);
userRoutes.post('/getBrandDetailsForPanel',brandController.getBrandDetailsForPanel);
userRoutes.post('/getBrandNotificationCount',brandController.getBrandNotificationCount);
userRoutes.post('/updateBrandNotificationStatus',brandController.updateBrandNotificationStatus);
userRoutes.post('/updateBrandAccountStatus',brandController.updateBrandAccountStatus);
userRoutes.post('/updateBrandLanguage',brandController.updateBrandLanguage);
userRoutes.post('/brandNotificationList',brandController.brandNotificationList);
userRoutes.post('/deleteBrandNotification',brandController.deleteBrandNotification);
userRoutes.post('/clearBrandNotification',multipartMiddleware,brandController.clearBrandNotification);
userRoutes.post('/checkEmailForForgotBrand',brandController.checkEmailForForgotBrand);
userRoutes.post('/brandResetPassword',brandController.brandResetPassword);
userRoutes.post('/brandChangePassword',brandController.brandChangePassword);
userRoutes.post('/brandSignup',multipartMiddleware,brandController.brandSignup);
userRoutes.post('/updateBrand',brandController.updateBrand);
userRoutes.post('/updateBrandLogoImage',multipartMiddleware,brandController.updateBrandLogoImage);
userRoutes.post('/updateBrandProfile',brandController.updateBrandProfile);
userRoutes.post('/addHoliday',brandController.addHoliday);
userRoutes.post('/updateStoreStatus',brandController.updateStoreStatus);
userRoutes.post('/deleteStore',brandController.deleteStore);
userRoutes.post('/updateHoliday',brandController.updateHoliday);
userRoutes.post('/holidayList',brandController.holidayList);
userRoutes.post('/updateHolidayStatus',brandController.updateHolidayStatus);
userRoutes.post('/updateOpeningHours',brandController.updateOpeningHours);
userRoutes.post('/hoursList',brandController.hoursList);
userRoutes.post('/updateHoursStatus',brandController.updateHoursStatus);
userRoutes.post('/addStore',brandController.addStore);
userRoutes.post('/updateStore',brandController.updateStore);
userRoutes.post('/deleteHoliday',brandController.deleteHoliday);
userRoutes.get('/socialMediaList',brandController.socialMediaList);
userRoutes.post('/getStaticDataList',brandController.getStaticDataList);
userRoutes.get('/getFaqList',brandController.getFaqList);
userRoutes.post('/getStaticDataByType',brandController.getStaticDataByType);
userRoutes.post('/addPayout',brandController.addPayout);
userRoutes.post('/createGroup',brandController.createGroup);
userRoutes.post('/createGroupPayout',brandController.createGroupPayout);
userRoutes.post('/getGroupDetails',brandController.getGroupDetails);
userRoutes.post('/getMenuDetails',brandController.getMenuDetails);
userRoutes.post('/addStoreGroupPayout',brandController.addStoreGroupPayout);
userRoutes.post('/getGroupList',brandController.getGroupList);
userRoutes.get('/getAccessList',brandController.getAccessList);
userRoutes.post('/addRole',brandController.addRole);
userRoutes.post('/deleteRole',brandController.deleteRole);
userRoutes.post('/updateRoleStatus',brandController.updateRoleStatus);
userRoutes.post('/getRoleList',brandController.getRoleList);
userRoutes.post('/addSubadmin',brandController.addSubadmin);
userRoutes.post('/getRoleListForSubAdmin',brandController.getRoleListForSubAdmin);
userRoutes.post('/updateSubAdmin',brandController.updateSubAdmin);
userRoutes.post('/subAdminList',brandController.subAdminList);
userRoutes.post('/deleteSubAdmin',brandController.deleteSubAdmin);
userRoutes.post('/updateStatusSubAdmin',brandController.updateStatusSubAdmin);
userRoutes.post('/getSubAdminDetails',brandController.getSubAdminDetails);
userRoutes.post('/storeList',brandController.storeList);
userRoutes.post('/storeListForPayout',brandController.storeListForPayout);
userRoutes.post('/addMenu',brandController.addMenu);
userRoutes.post('/updateMenu',brandController.updateMenu);
userRoutes.post('/deleteMenu',brandController.deleteMenu);
userRoutes.post('/menuList',brandController.menuList);
userRoutes.post('/updateStatusMenu',brandController.updateStatusMenu);
userRoutes.post('/addItem',brandController.addItem);
userRoutes.post('/updateItem',brandController.updateItem);
userRoutes.post('/itemList',brandController.itemList);
userRoutes.post('/getCuisineList',brandController.getCuisineList);
userRoutes.post('/deleteItem',brandController.deleteItem);
userRoutes.post('/getItemDetails',brandController.getItemDetails);
userRoutes.post('/itemListForSellFixed',brandController.itemListForSellFixed);
userRoutes.post('/hoursByDay',brandController.hoursByDay);
userRoutes.post('/startSelling',brandController.startSelling);
userRoutes.post('/itemListForSell',brandController.itemListForSell);
userRoutes.post('/itemListByMenu',brandController.itemListByMenu);
userRoutes.post('/uploadExcel',multipartMiddleware,brandController.uploadExcel);
userRoutes.post('/uploadChoiceExcel',multipartMiddleware,brandController.uploadChoiceExcel);
userRoutes.post('/uploadImages',multipartMiddleware,brandController.uploadImages);

userRoutes.post('/createMenuItemExcel',brandController.createMenuItemExcel);
userRoutes.post('/menuListForExcel',brandController.menuListForExcel);
userRoutes.post('/pauseSelling',brandController.pauseSelling);
userRoutes.post('/getOrderListForBrand',brandController.getOrderListForBrand);
userRoutes.post('/caneclOrder',brandController.caneclOrder);
userRoutes.post('/acceptOrder',brandController.acceptOrder);
userRoutes.post('/orderDelivered',brandController.orderDelivered);
userRoutes.post('/customerListForReport',brandController.customerListForReport);
userRoutes.get('/cuisineList',brandController.cuisineList);
userRoutes.post('/cuisineCategoryList',brandController.cuisineCategoryList);
userRoutes.post('/addChoice',brandController.addChoice);
userRoutes.post('/updateHolidayTitle',brandController.updateHolidayTitle);
userRoutes.post('/addBadge',brandController.addBadge);
userRoutes.post('/storeListForStatistics',brandController.storeListForStatistics);
userRoutes.post('/getMarketingDataForStatistics',brandController.getMarketingDataForStatistics);
userRoutes.post('/saleListForStatistics',brandController.saleListForStatistics);
userRoutes.post('/revenueData',brandController.revenueData);
userRoutes.post('/followersData',brandController.followersData);
userRoutes.post('/perStoreData',brandController.perStoreData);
userRoutes.post('/itemSalesData',brandController.itemSalesData);
userRoutes.post('/readyForPickupOrder',brandController.readyForPickupOrder);
userRoutes.post('/soldOut',brandController.soldOut);
userRoutes.post('/addItemCategory',brandController.addItemCategory);
userRoutes.post('/updateItemCategory',brandController.updateItemCategory);
userRoutes.post('/deleteItemCategory',brandController.deleteItemCategory);
userRoutes.post('/getItemCategory',brandController.getItemCategory);
userRoutes.post('/checkEmail',brandController.checkEmail);
userRoutes.post('/verifyEmailOtp',brandController.verifyEmailOtp);
userRoutes.post('/checkMobile',brandController.checkMobile);
userRoutes.post('/verifyMobileOtp',brandController.verifyMobileOtp);
userRoutes.post('/addChoiceCategory',brandController.addChoiceCategory);
userRoutes.post('/updateChoiceCategory',brandController.updateChoiceCategory);
userRoutes.post('/deleteChoiceCategory',brandController.deleteChoiceCategory);
userRoutes.post('/updateChoiceCategoryStatus',brandController.updateChoiceCategoryStatus);
userRoutes.post('/getChoiceCategory',brandController.getChoiceCategory);
userRoutes.post('/getChoiceDetail',brandController.getChoiceDetail);
userRoutes.post('/getProductChoiceCategory',brandController.getProductChoiceCategory);
userRoutes.post('/getChoiceCategoryProduct',brandController.getChoiceCategoryProduct);
userRoutes.post('/deleteProduct',brandController.deleteProduct);


userRoutes.get('/cronApis',brandController.cronApis);
userRoutes.get('/unvisitUsersNotification',brandController.unvisitUsersNotification);


//==============================Store Apis=========================================//

userRoutes.post('/storeLoginForPanel',storeController.storeLoginForPanel);
userRoutes.post('/getStoreDetails',storeController.getStoreDetails);
userRoutes.post('/getStoreAdmin',storeController.getStoreAdmin);
userRoutes.post('/updateStoreNotificationStatus',storeController.updateStoreNotificationStatus);
userRoutes.post('/updateStoreAccountStatus',storeController.updateStoreAccountStatus);
userRoutes.post('/updateStoreLanguage',storeController.updateStoreLanguage);
userRoutes.post('/storeLogout',storeController.storeLogout);
userRoutes.post('/updateStoreDetails',storeController.updateStoreDetails);
userRoutes.post('/updateStoreProfile',storeController.updateStoreProfile);
userRoutes.post('/updateStoreLogoImage',storeController.updateStoreLogoImage);
userRoutes.post('/uploadExcelByStore',multipartMiddleware,storeController.uploadExcelByStore);
userRoutes.post('/itemListForSellFixedStore',storeController.itemListForSellFixedStore);
userRoutes.post('/hoursByDayStore',storeController.hoursByDayStore);
userRoutes.post('/itemListForSellStore',storeController.itemListForSellStore);
userRoutes.post('/checkEmailForForgotStore',storeController.checkEmailForForgotStore);
userRoutes.post('/storeResetPassword',storeController.storeResetPassword);
userRoutes.post('/storeChangePassword',storeController.storeChangePassword);
userRoutes.post('/verifyEmailOtp',storeController.verifyEmailOtp);
userRoutes.post('/verifyMobileOtp',storeController.verifyMobileOtp);
userRoutes.post('/checkEmail',storeController.checkEmail);
userRoutes.post('/checkMobile',storeController.checkMobile);


//============================User Apis===========================================//

userRoutes.post('/checkUserMobileAndEmail',userController.checkUserMobileAndEmail);
userRoutes.post('/userSignup',userController.userSignup);
userRoutes.post('/userLogin',userController.userLogin);
userRoutes.post('/forgotPassword',userController.forgotPassword);
userRoutes.post('/checkMobilForForgotPassword',userController.checkMobilForForgotPassword);
userRoutes.post('/checkUserMobile',userController.checkUserMobile);
userRoutes.post('/checkEmailForUser',userController.checkEmailForUser);
userRoutes.post('/restaurantList',userController.restaurantList);
userRoutes.post('/getMenuList',userController.getMenuList);
userRoutes.post('/getItemDetail',userController.getItemDetail);
userRoutes.post('/getRestroDetail',userController.getRestroDetail);
userRoutes.post('/popularRestaurantList',userController.popularRestaurantList);
userRoutes.post('/moreSaveProductList',userController.moreSaveProductList);
userRoutes.post('/newRestaurantList',userController.newRestaurantList);
userRoutes.post('/restaurantFilter',userController.restaurantFilter);
userRoutes.post('/nearByRestaurantDetail',userController.nearByRestaurantDetail);
userRoutes.post('/restaurantForHomeList',userController.restaurantForHomeList);
userRoutes.post('/restaurantListByBrand',userController.restaurantListByBrand);
userRoutes.post('/loginByOtp',userController.loginByOtp);
userRoutes.post('/globalSearch',userController.globalSearch);
userRoutes.post('/saveRecentSearch',userController.saveRecentSearch);
userRoutes.post('/getRecentSearch',userController.getRecentSearch);
userRoutes.post('/deleteRecentSearch',userController.deleteRecentSearch);
userRoutes.post('/popularCuisineProducts',userController.popularCuisineProducts);
userRoutes.get('/cuisineList',userController.cuisineList);
userRoutes.post('/searchSuggestions',userController.searchSuggestions);
userRoutes.post('/cusineSubCategory',userController.cusineSubCategory);
userRoutes.post('/homeFilter',userController.homeFilter);
userRoutes.post('/getMenuListByFilter',userController.getMenuListByFilter);

userRoutes.post('/restaurantListSaleOff',userController.restaurantListSaleOff);



userRoutes.use(authHandler.appAuth);


//=============================User====================================//

userRoutes.get('/getNotificationList',userController.getNotificationList);
userRoutes.get('/getUserDetails',userController.getUserDetails);
userRoutes.get('/getNotificationCount',userController.getNotificationCount);
userRoutes.get('/userLogout',userController.userLogout);
userRoutes.post('/userUpdateDetails',userController.userUpdateDetails);
userRoutes.post('/changePassword',userController.changePassword);
userRoutes.post('/changeMobileNumber',userController.changeMobileNumber);
userRoutes.post('/changeEmail',userController.changeEmail);
userRoutes.post('/notificationSetting',userController.notificationSetting);
userRoutes.post('/deleteNotification',userController.deleteNotification);
userRoutes.get('/clearNotification',userController.clearNotification);
userRoutes.post('/updateAddress',userController.updateAddress);
userRoutes.post('/addToCart',userController.addToCart);
userRoutes.get('/clearCart',userController.clearCart);
userRoutes.post('/updateCart',userController.updateCart);
userRoutes.post('/addToFavourite',userController.addToFavourite);
userRoutes.post('/getFavoriteRestaurants',userController.getFavoriteRestaurants);
userRoutes.post('/getCartItem',userController.getCartItem);
userRoutes.post('/orderItems',userController.orderItems);
userRoutes.post('/getOrderList',userController.getOrderList);   
userRoutes.post('/getOrderDetail',userController.getOrderDetail);
userRoutes.post('/orderCancelByUser',userController.orderCancelByUser);
userRoutes.post('/deleteRestroFromCart',userController.deleteRestroFromCart);
userRoutes.post('/deleteItemFromCart',userController.deleteItemFromCart);
userRoutes.get('/getCartCount',userController.getCartCount);
userRoutes.post('/orderItems',userController.orderItems);
userRoutes.post('/ratingByUser',userController.ratingByUser);
userRoutes.get('/userBadgesEarning',userController.userBadgesEarning);
userRoutes.post('/cartCountParticularRestro',userController.cartCountParticularRestro);
userRoutes.post('/claimCouponCode',userController.claimCouponCode);
userRoutes.post('/unlockHiddenRestaurant',userController.unlockHiddenRestaurant);
userRoutes.post('/claimReward',userController.claimReward);
userRoutes.post('/paymentNotComplete',userController.paymentNotComplete);
userRoutes.post('/cancelByOutOfStock',userController.cancelByOutOfStock);




module.exports=userRoutes;