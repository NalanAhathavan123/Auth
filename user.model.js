const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Username is mandatory"]
    },
    email:{
            type:String,
            required:[true,"email is mandatory"]
    },
    password:{
            type:String,
            required:[true,"password is mandatory"]
    }
})

module.exports = mongoose.model('users',userSchema);