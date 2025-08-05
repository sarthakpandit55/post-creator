const mongoose = require('mongoose');
const { type } = require('os');
const { ref } = require('process');

mongoose.connect(`mongodb://127.0.0.1:27017/post-creator`);

const userSchema = mongoose.Schema({
    username : String,
    name : String,
    age : Number,
    email : String,
    password : String,
    profilepic : {
        type : String,
        default : "default.jpg"
    },
    posts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ]    
});

module.exports = mongoose.model('user', userSchema);