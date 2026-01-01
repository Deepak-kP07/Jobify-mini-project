import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    firstName :{
        type : String,
        required : [true , 'Please provide first name'],
        maxlength : 50,
        minlength : 3
    },
    lastName :{
        type : String,
        required : [true , 'Please provide last name'],
        maxlength : 50,
        minlength : 1
    },
    email :{
        type : String,
        required : [true , 'Please provide email'],
        unique : true,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email'],
    },
    password :{
        type : String,
        required : [true , 'Please provide password'],
        minlength : 8,
    },
   
    location :{
        type : String,
        default : 'my city',
    },
    role :{
        type : String,
        enum : ['user' , 'admin'],
        // default : 'user',
    } ,
    avatar : {
        type : String,

    },
    avatarPublicId : {
        type : String,
    }


},{timestamps : true})

export default mongoose.model('User',userSchema)