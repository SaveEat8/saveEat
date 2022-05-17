let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let adminAccess = mongoose.Schema({

    title: {
        type: String
    },
    // actions: ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
    actions: [],

    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    deleteStatus:{
        type:Boolean,
        default:false
    },
    description:{
        type:String
    },
    module:[],
    accessNumber: {
        type: String
    },
    users:{
        type:Array
    }
}, {
    timestamps: true

})
adminAccess.plugin(mongoosePaginate)
adminAccess.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('adminaccess', adminAccess);
// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "Sell",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });
// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "Orders",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });
// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "Statistics",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });
// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "My user",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });
// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "Brand settings",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });
// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "Inventory",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });
// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "Opening hours",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });
// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "Holiday hours",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });
// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "Store settings",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });

// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "Payout",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });
// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "What's new",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });
// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "About",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });

// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "Reports",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });

// mongoose.model('accesss', access).find((error, result) => {
//     if (result.length == 0) {
//         let obj = {
//             'title': "Settings",
//             'moules': ['View', 'Edit', 'Delete', 'Block', 'Unblock'],
//             'accessNumber': `Access${new Date().getTime()}`
//         };
//         mongoose.model('accesss', access).create(obj, (error, success) => {
//             if (error){
//                 console.log("Error is" + error)
//             }   
//             else{
//                 console.log("Data saved succesfully.", success);
//             }
                
//         })
//     }
// });