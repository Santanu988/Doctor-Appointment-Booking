const mongoose = require('mongoose')
const schema = mongoose.Schema
const userdata = new schema(
    {
        name: {
            type: String,
            require: [true, 'this fild is required']
        },
        email: {
            type: String,
            require: [true, 'this fild is required']
        },
        phone: {
            type: Number,
            require: [true, 'this fild is required']
        },
        password: {
            type: String,
            require: [true, 'this fild is required']
        },
        image: {
            type: String,
            require: [true, 'this fild is required']
        },
        dateofbirth: {
           type: String,
            default: 'Not provided'
        },
        blood_group:{
            type: String,
            default: 'Not provided'
        },
        gender: {
            type: String,
            default: 'Not provided'
        },
        maritalstatus: {
            type: String,
            default: 'Not provided'
        },
        physical_disability: {
            type: String,
            default: 'Not provided'
        },
        altphone: {
            type: String,
            default: 'Not provided'
        },
        address: {
            street: { type: String, default: 'Not provided' },
            city: { type: String, default: 'Not provided' },
            state: { type: String, default: 'Not provided' },
            zip: { type: String, default: 'Not provided' },
            country: { type: String, default: 'Not provided' }
        },
        isadmin: {
            type: Boolean,
            default: false
        },
        isadmindelete: {
            type: Boolean,
            default: false
        },
        isregister: {
            type: Boolean,
            default: false
        },
        isdelete: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)


const usermodel = mongoose.model('usermodel', userdata)
module.exports = usermodel