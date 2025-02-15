const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = new mongoose.Schema({
    name: {
        type: String,
        required : false,
        trim: true,
        minLength: [3, "Name must be a min {3}"],
        maxLength: [50, "Name must be a max {50}"]
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required : false
    },
    password: {
        type : String , 
        required : false,
        minlength : [8, "Password must be a min {8}"],
    },
    profileImage : {
        type: String,
        default: 'default.jpg'
    },
    phoneNumber : {
        type: String,
        unique: true,
        required : false,
        minLength : [10, "Phone number must be a min {10}"],
        maxLength : [15, "Phone number must be a max {15}"],
    },
    address : {
        City : {
            type: String,
            required : false,
            minLength: [5, "City name must be a min {5}"],
            maxLength: [50, "City name must be a max {50}"]
        },
        Country : {
            type: String,
            required : false,
            minLength: [5, "Country name must be a min {5}"],
            maxLength: [50, "Country name must be a max {50}"]
        },
        Street : {
            type: String,
            required : false,
            minLength: [5, "Street name must be a min {5}"],
            maxLength: [50, "Street name must be a max {50}"]
        },
    },
    role : {
        type : String ,
        required : false ,
        enum : ["buyer" , "seller" , "admin"],
        default : "buyer"
    },
    passwordChanagedAt :{
        type: Date
    },
    passwordResetCode : String,
    passwordResetExpiret : Date,
    passwordResetVerifed : Boolean,
    isVerified : {
        type: Boolean,
        default: false
    },
    IsActive : {
        type: Boolean,
        default: true
    },
    Wishlists :[{
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Product"
    }],
    Cart : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product"
    }],
    // data for seller only
    storeName : {
        type : String ,
        unique : true ,
        sparse : true ,
        minLength: [5, "Store Name must be a min {5}"],
        maxLength: [25, "Store Name must be a max {25}"],
    },
    storeDescription : {
        type : String ,
        required : false ,
        minLength: [5, "Store description must be a min {5}"],
        maxLength: [500, "Store description must be a max {500}"],
    },
    rating : {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    Products : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Product"
    }],

    // data for Admin only
    permissions : [{
        type : String,
        enum : ["create", "read", "update", "delete"],
        default : ["read"]
    }],
}, { timestamps: true })


UserModel.pre("save", async function(next){
    if(!this.isModified('password')) return next();
    // Hash the password before saving it to the database
    this.password = await bcrypt.hash(this.password , 12);
    next();
})


const User = mongoose.model('User', UserModel);
module.exports = User;