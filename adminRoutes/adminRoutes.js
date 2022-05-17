var adminRoutes=require('express').Router();
var adminController=require('../adminControllers/adminController.js');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


adminRoutes.get('/refreshAcessToken',adminController.refreshAcessToken);
adminRoutes.get('/refreshDunzoAcessToken',adminController.refreshDunzoAcessToken);
adminRoutes.get('/latestOrderForWebsite',adminController.latestOrderForWebsite);


var authHandler=require('../authHandler/auth.js')

adminRoutes.post('/adminLogout',adminController.adminLogout);
adminRoutes.post('/updateAdminDetail',multipartMiddleware,adminController.updateAdminDetail),

adminRoutes.post('/updateAdminTaxAndSaveitfee',multipartMiddleware,adminController.updateAdminTaxAndSaveitfee),


adminRoutes.get('/getExcel/:fileName',adminController.getExcel);
adminRoutes.post('/adminLogin',adminController.adminLogin);
adminRoutes.post('/adminForgotPassword',adminController.adminForgotPassword);
adminRoutes.post('/staticContentGet',adminController.staticContentGet);
adminRoutes.post('/StaticContentUpdate',adminController.StaticContentUpdate);
adminRoutes.post('/resetPassword',adminController.resetPassword);
adminRoutes.post('/verifyOtp',adminController.verifyOtp);
adminRoutes.post('/passwordChange',adminController.passwordChange);
adminRoutes.post('/getAdminDetailss',adminController.getAdminDetailss);

adminRoutes.post('/createAdminRole',adminController.createAdminRole);
adminRoutes.post('/adminRoleList',adminController.adminRoleList);
adminRoutes.post('/updateRoleStatus',adminController.updateRoleStatus);
adminRoutes.post('/deleteRole',adminController.deleteRole);
adminRoutes.post('/adminAllRoleList',adminController.adminAllRoleList);





// ======================= sub-admin===================================== //

adminRoutes.post('/createSubAdmin',adminController.createSubAdmin);
adminRoutes.post('/subAdminUpdate',adminController.subAdminUpdate);
adminRoutes.post('/subAdminStatus',adminController.subAdminStatus);
adminRoutes.post('/deleteSubAdmin',adminController.deleteSubAdmin);
adminRoutes.post('/subAdminList',adminController.subAdminList);
adminRoutes.post('/particularSubAdmin',adminController.particularSubAdmin);

//CT
adminRoutes.post('/getCtCreditsDetails',adminController.getCtCreditsDetails);
adminRoutes.post('/ctDetailsUpdate',adminController.ctDetailsUpdate);
adminRoutes.get('/ctCreditsGiven',adminController.ctCreditsGiven);

//Delivery fee
adminRoutes.post('/getDeliveryDetails',adminController.getDeliveryDetails);
adminRoutes.post('/updateDeliveryFee',adminController.updateDeliveryFee);



adminRoutes.use(authHandler.auth);

adminRoutes.get('/getAdminDetail',adminController.getAdminDetail);
adminRoutes.get('/dashboardCount',adminController.dashboardCount);

module.exports=adminRoutes;