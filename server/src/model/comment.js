const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const commentSchema = mongoose.Schema({
    songID: {
        type: String,
        required: true
    },
    comments: [new Schema({
        username: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    })]
});

// export model user with UserSchema
module.exports = mongoose.model("Comment", commentSchema);