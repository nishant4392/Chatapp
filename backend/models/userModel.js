const mongoose=require("mongoose");
const bcrypt= require("bcrypt");

const userModel=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    pic:{
        type:String,
        trim:true,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},{
    timestamps:true
})

userModel.pre("save",async function (next) {
    if(!this.isModified){
        //this case is to check if anything in this object is modified then dont hash the pass word again, but we have to ensure that no
        //one is able to change their password as even modification of the password will result in password not hashing again. 
        next()
    }
    else{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
    }
})

userModel.methods.matchPassword=async function (givenPassword){
    return await bcrypt.compare(givenPassword,this.password);
}

const User= mongoose.model("User",userModel);

module.exports=User;