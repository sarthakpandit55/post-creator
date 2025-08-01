const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const bcript = require('bcrypt');
const jwt = require('jsonwebtoken');
const { hash } = require('crypto');


// middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({exptended : true}));
app.use(cookieParser());


// routes
app.get('/', (req, res) => {
    res.render("index");
});

// login
app.get('/login', (req, res) => {
    res.render("login");
})

// profile
app.get('/profile', isLoggedIn, (req, res) => {
    console.log(req.user);
    res.render('login');
})

// creating new user
app.post('/register', async (req,res) => {
    let {email, password, username, age, name} = req.body;
    let user = await userModel.findOne({email: email});
    if(user) return res.status(500).send("User already registered");

    bcript.genSalt(10, (err, salt) => {
        bcript.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username : username,
                email : email,
                age : age,
                name : name,
                password : hash
            });
            let token = jwt.sign({email : email, userid : user._id}, "shhhh");
            res.cookie("token", token );
            res.send("registered");
        });
    });
});

// login user
app.post('/login', async (req,res) => {
    let {email, password} = req.body;
    let user = await userModel.findOne({email: email});
    if(!user) return res.status(500).send("User does not exist");

    bcript.compare(password, user.password, (err, result) =>{
        if(result){
            let token = jwt.sign({email : email, userid : user._id}, "shhhh");
            res.cookie("token", token );
            res.status(200).send("you can login");
        }
        else{
            res.render('login');
        }
    })
});

// logout
app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect("login");
})

// middleware to protect
function isLoggedIn(req, res, next){
    if(req.cookies.token === ""){
        res.send("you must login first");
    }
    else{
        let data = jwt.verify(req.cookies.token, "shhhh");
        req.user = data;
        next();
    }
}

// app listen
app.listen(3000);