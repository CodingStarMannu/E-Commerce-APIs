const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: false
        },
    email:{
        type : String,
        required: true,
        unique:true,
    },
    password:{
        type : String ,
        required:true
    },
    image:{
        type : String,
        required : false,
    },
    mobile: {
        type: Number,
        required: false,
        unique: true,
    },
    
    token:{
        type:String,
        default:'',
    }
},
    {
    timestamps:true,
    }
);

const User = mongoose.model('UserSchema', userSchema);

module.exports = User;