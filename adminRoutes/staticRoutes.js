const staticRoutes=require('express').Router();
const staticController=require('../adminControllers/staticController.js');
const authHandder=require('../authHandler/auth.js')

staticRoutes.get('/getStaticContent',staticController.getStaticContent);
staticRoutes.post('/getStaticContentByType',staticController.getStaticContentByType);
staticRoutes.post('/updateContent',staticController.updateContent);
staticRoutes.post('/updateContentContactus',staticController.updateContentContactus);


module.exports=staticRoutes;