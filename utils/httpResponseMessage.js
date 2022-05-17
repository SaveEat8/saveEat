module.exports = {

    responseHandlerWithData: (res, code, message, data) => {
        res.send({status:code,message,data});
    },
    responseHandlerWithDataPaginate: (res, code, message, data,page,limit) => {
        res.send({status:code,message,data,page,limit});
    },
    responseHandlerWithDataExt: (res, code, message, data,avg,total,name) => {
        res.send({status:code,message,data,avg,total,name});
    },
    responseHandlerWithMessage: (res, code, message) => {
        res.send({status:code,message,});
    },
    log(message = '',data=""){
        console.log(message,data)
    }
}