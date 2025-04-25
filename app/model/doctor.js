const mongoose = require("mongoose");

const schema = mongoose.Schema;

const doctorSchema = new schema(
    {
        name: {
            type: String,
            required: [true, "This field is required"]
        },
        introduction: {
            type: String,
            required: [true, "This field is required"]
        },
        email: {
            type: String,
            required: [true, "This field is required"],
            unique: true // Prevents duplicate emails
        },
        phone: {
            type: String, // Phone numbers should be stored as a string
            required: [true, "This field is required"]
        },
        department: {
            type: String,
            required: [true, "This field is required"]
        },
        gander: {
            type: String,
            required: [true, "This field is required"]
        },
        experience: {
            type: String,
            required: [true, "This field is required"]
        },
        date_and_time:[
            {
                day:{type:String,required:true},
                time:{type:String,required:true}
            }
        ],    
        education: [
            {
                university: {
                    type: String,
                    required: [true, "University name is required"]
                },
                passing_year: {
                    type: String, // Can be kept as a string for flexibility
                    required: [true, "Passing year is required"]
                },
                degree: {
                    type: String,
                    required: [true, "Degree is required"]
                }
            }
        ],
        message: {
            type: String,
            required: [true, "This field is required"]
        },
        experience: {
            type: String,
            required: [true, "This field is required"]
        },
        image: {
            type: String, // Store file path or URL
            required: [true, "This field is required"]
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isdelete:{
            type:Boolean,
            default:false
        },
        isavalable:{
            type:Boolean,
            default:true
        }
    },
    {
        timestamps: true // Automatically adds createdAt & updatedAt fields
    }
);

const doctorModel = mongoose.model("doctor", doctorSchema);
module.exports = doctorModel;
