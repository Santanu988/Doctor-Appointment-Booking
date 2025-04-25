const mongoose = require('mongoose');

const blogschema = new mongoose.Schema({
    title:{
        type:String,
        required:[true]
    },
    image: {
        type: String, // Store image path or URL
        required:[true]
    },
    category:{
        type:String,
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const blogmodel = mongoose.model('blogModel', blogschema);
module.exports = blogmodel;