var staticRoutes=require('express').Router();
var staticController=require('../userControllers/staticController.js');

staticRoutes.get('/getStaticContent',staticController.getStaticContent);
staticRoutes.get('/getFaq',staticController.getFaq);
staticRoutes.post('/getStaticContentByType',staticController.getStaticContentByType);

module.exports=staticRoutes;