let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let Faq = mongoose.Schema({

    question: {
        type: String
    },
    answer: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true

})
Faq.plugin(mongoosePaginate)
Faq.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('faqs', Faq);
mongoose.model('faqs', Faq).find((error, result) => {
    if (result.length == 0) {
        let obj = {
            'question': "How are you?",
            'answer': "Fine",
        };
        mongoose.model('faqs', Faq).create(obj, (error, success) => {
            if (error)
                console.log("Error is" + error)
            else
                console.log("Data saved succesfully.", success);
        })
    }
});