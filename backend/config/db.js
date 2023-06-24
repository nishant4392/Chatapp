const mongoose=require("mongoose");
const dotenv=require("dotenv");

dotenv.config();

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database connected successfully");
    }
    catch(err){
        console.log(err);
    }
}

module.exports=connectDb;