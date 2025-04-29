const mongoose = require('mongoose');

const deptschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Store image path or URL
        required:[true]
    },
    data:{
        type:String,
        required:[true]
    },
    
    isDeleted: {
        type: Boolean,
        default: false
    },
    isDept:{
        type: String,
        required:[true]
    },
    isServ:{
        type: Boolean,
        default:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const departmentmodel = mongoose.model('deptModel', deptschema);
module.exports = departmentmodel;