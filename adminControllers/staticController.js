var StaticModel = require('../models/staticModel.js');
const response = require("./../utils/httpResponseMessage")

module.exports = {


    //========================================Get Static Content By Type==================================//


    getStaticContentByType: async (req, res) => {

        try {
            response.log("Request for get static content is===========", req.body);
            req.checkBody('contentId', 'Something went wrong').notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let result = await StaticModel.findOne({ "_id": req.body.contentId})
            if (!result) {
                response.log("Id is not correct");
                return response.responseHandlerWithMessage(res, 501, "Invalid Token");
            }
            response.log("Result is=========>", result);
            return response.responseHandlerWithData(res, 200, "Data Found Successfully", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

    //=========================================Get Static Content=========================================//

    //Method-Get
    getStaticContent: async (req, res) => {

        try {
            let result = await StaticModel.find({})
            response.log("Data found successfully", result)
            return response.responseHandlerWithData(res, 200, "Data Found Successfully", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }

    },

    //==========================================Update Content============================================//

    updateContent: async (req, res) => {

        try {
            response.log("Request for update content is=============>", req.body);
            req.checkBody('contentId', 'Something went wrong').notEmpty()
            req.checkBody('description', 'Something went wrong').notEmpty()
            const errors = req.validationErrors();
            if (errors) {
                let error = errors[0].msg;
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, error);
            }
            let updateContent = await StaticModel.findByIdAndUpdate({_id:req.body.contentId}, { $set: {description:req.body.description} }, { new: true })
            response.log("Data Updated successfully", updateContent)
            return response.responseHandlerWithData(res, 200, "Data Updated Successfully", updateContent);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");
        }
    },

        //==========================================Update Content ContactUs============================================//

        updateContentContactus: async (req, res) => {

            try {
                response.log("Request for update content is=============>", req.body);
                req.checkBody('contentId', 'Something went wrong').notEmpty()
                // req.checkBody('description', 'Something went wrong').notEmpty()
                const errors = req.validationErrors();
                if (errors) {
                    let error = errors[0].msg;
                    response.log("Field is missing")
                    return response.responseHandlerWithMessage(res, 503, error);
                }
                let updateContent = await StaticModel.findByIdAndUpdate({_id:req.body.contentId}, { $set: {email:(req.body.email).toLowerCase(),companyName:req.body.companyName,companyAddress:req.body.companyAddress,contactNumber:req.body.contactNumber,webisteUrl:req.body.webisteUrl} }, { new: true })
                response.log("Data Updated successfully", updateContent)
                return response.responseHandlerWithData(res, 200, "Data Updated Successfully", updateContent);
            } catch (error) {
                response.log("Error is=========>", error);
                return response.responseHandlerWithMessage(res, 500, "Internal server error");
            }
        },


}