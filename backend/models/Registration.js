import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
{
    teamId:{
        type:String,
        unique:true
    },

    teamName:{
        type:String,
        required:true
    },

    leaderName:{
        type:String,
        required:true
    },

    leaderEmail:{
        type:String,
        required:true
    },

    leaderMobile:{
        type:String,
        required:true
    },

    college:{
        type:String,
        required:true
    },

    cityState:{
        type:String
    },

    memberCount:{
        type:Number,
        required:true
    },

    members:[
        {
            name:String,
            email:String,
            mobile:String,
            course:String,
            year:String,
            branch:String
        }
    ],

    projectTitle:{
        type:String
    },

    problemStatement:{
        type:String
    },

    themeCategory:{
        type:String
    },

    projectDescription:{
        type:String
    },

    transactionId:{
        type:String,
        required:true
    },

    upiId:{
        type:String
    },

    paymentScreenshot:{
        type:String
    },

    paymentStatus:{
        type:String,
        enum:["Pending","Verified","Rejected"],
        default:"Pending"
    },

    verifiedBy:{
        type:String,
        default:null
    }

},
{
timestamps:true
});

export default mongoose.model("Registration",registrationSchema);