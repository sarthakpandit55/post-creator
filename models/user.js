const mongoose = require('mongoose');
const { ref } = require('process');

mongoose.connect(`mongodb://127.0.0.1:27017/post-creater`);

const userSchema = mongoose.Schema({
    username : String,
    name : String,
    age : Number,
    email : String,
    password : String,
    posts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ]    
});

module.exports = mongoose.model('user', userSchema);