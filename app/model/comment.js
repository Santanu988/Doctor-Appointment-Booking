const mongoose = require('mongoose');
const schema=mongoose.Schema;
const comment = new schema({
    commentuserid:{
        type:schema.Types.ObjectId,
        ref:"usermodels"
    },
    commentcatagoryid:{
        type:schema.Types.ObjectId,
        ref:"blogmodels"
    },   
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isdelete: {
        type: Boolean,
        default: false
    },
});

const Comment = mongoose.model('comment', comment);
module.exports = Comment;