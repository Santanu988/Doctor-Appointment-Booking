const mongoose = require('mongoose');
const schema=mongoose.Schema;
const appmodel = new schema({
    appuserid:{
        type:schema.Types.ObjectId,
        ref:"user"
    },
    dept: {
        type: String,
        required: true,
    },
    doctor: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    time:{
        type:String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    blood: {
        type: String,
        required: true

    },
    age:{
        type: Number,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    appt_Date: {
        type: Date,
        default: Date.now
    },
    isApproved: {
        type: String,
        default: "Pending"//Resolve Reject Approved
    },
    sendmail:{
        type: [],
        default: "ssss"//Resolve Reject Approved
    },
    email:{
        type:String,
        required:[true]
    },
    gender:{
        type:String,
        required:[true]
    },
    pres:{
        type: String,
        default: 'Not Known'
    },
    admi_msg:{
        type: String,
        default: 'Not Known'
    },
    msg:{
        type: String,
        default: 'Not Known'
    },
    isreject:{
         type: Boolean,
        default: false
    },
    address: {
        street: { type: String, default: 'Not provided' },
        city: { type: String, default: 'Not provided' },
        state: { type: String, default: 'Not provided' },
        zip: { type: String, default: 'Not provided' },
        country: { type: String, default: 'Not provided' }
    },
    isdelete: {
        type: Boolean,
        default: false
    },
});

const Appointment = mongoose.model('appointment', appmodel);
module.exports = Appointment;