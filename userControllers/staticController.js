const StaticModel = require('../models/staticModel.js');
const Faq = require('../models/faqModel.js');
const response = require("./../utils/httpResponseMessage")

module.exports = {


    //========================================Get Static Content By Type==================================//

    getStaticContentByType: async (req, res) => {

        try {
            response.log("Request for get static content is===========", req.body);
            if (!req.body.type) {
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res,503, "Something went wrong");
            }
            let result = await StaticModel.findOne({ "type": req.body.type })
            if (!result) {
                response.log("Type is not correct");
                return response.responseHandlerWithMessage(res,501, "Invalid Token");
            }
            response.log("Result is=========>", result);
            return response.responseHandlerWithData(res,200, "Data Found Successfully", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res,500, "Internal server error");
        }
    },

    //=========================================Get Static Content=========================================//

    getStaticContent: async (req, res) => {

        try {
            let result = await StaticModel.find({})
            response.log("Data found successfully", result)
            return response.responseHandlerWithData(res,200, "Data Found Successfully", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res,500, "Internal server error");
        }

    },

    //==============================================Faq data=============================================//

    getFaq: async (req, res) => {

        try {
            let result = await Faq.find({})
            response.log("Data found successfully", result)
            return response.responseHandlerWithData(res,200, "Data Found Successfully", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res,500, "Internal server error");
        }

    },

}