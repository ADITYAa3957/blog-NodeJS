const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{
        type:String,
    },
    password:{
        type:String
    }
});
userSchema.pre('save',function(next)//pre hook for saving the hashed password
{
    bcrypt.genSalt().then((salt)=>
    {
        bcrypt.hash(this.password,salt).then((hashedPassword)=>
        {
            this.password = hashedPassword;
            next();
        });
    })
});
const userModel = mongoose.model('user',userSchema);
module.exports = userModel;