
let bcrypt = require('bcryptjs');
let saltRounds = 10;

exports.bcrypt = (divPass, cb)=>{
    bcrypt.genSalt(saltRounds,(err, salt)=> {
        bcrypt.hash(divPass, salt, (err, hashPassword)=> {
            cb(null, hashPassword)
        });
    });
};


