require('dotenv').config();

const express = require('express');
const app = express();
const _ = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongoUrl = process.env.MONGOURL;
const mongoAlt = process.env.MONGOALT;

const hostname = '0.0.0.0';
let port = process.env.PORT || 3000;


const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Set EJS as templating engine
app.set("view engine", "ejs");

app.use(express.static("app"));

let userId;

mongoose.connect(mongoAlt || mongoUrl,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });
    mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    completed: Number,
    incomplete: Number,
    pending: Number,
    balance: Number
});

const user = new mongoose.model('Profile', userSchema);

app.get("/", (req, res)=>{
    userId = "";
    res.sendFile(__dirname + "/index.html")
});


app.route("/register")
.get(function(req, res){
    userId = "";
    res.render('signup', {message: "Create Account"});
})
.post((req, res)=> {
    const username = _.upperFirst(req.body.username);
    const email = _.lowerFirst(req.body.email)
    const password = req.body.password;
    const passwordConfirmation = req.body.confirmPassword;

    bcrypt.hash(password, saltRounds, function(err, hash){
        const person = new user ({
            username: username,
            email: email,
            password: hash,
            completed: 0,
            incomplete: 0,
            pending: 0,
            balance: 0
        });
                if(password === passwordConfirmation){
                    person.save();
                    res.redirect('/login');
                } else {
                    res.render('signup', {message: "An error Occured. Please try again"});
                }
    });

});

app.route("/login")
.get(function(req, res){
    userId = "";
    res.render('login', {message: "Login"});
})
.post((req, res)=> {
    const email = _.lowerFirst(req.body.email);
    const password = req.body.password;

    user.findOne({ email: email }, (err, items) => {
        if (!items) {
            res.render('login', {message: "Your record does not exist"});
        }
        else {

            bcrypt.compare(password, items.password, function(err, response){
                if(response === true){
                    userId = items;
                    res.redirect('/dashboard');
                } else {
                    res.render('login', {message: "Incorrect password. Please try again"});
                }
        });
        }
    });
});

app.get("/dashboard", (req, res)=> {
    if (userId.length === 0) {
        res.redirect('/login');
    } else {
        res.render("dashboard", {userId: userId});
    }
});



app.listen(port, hostname, err => {
    if (err)
        throw err
    console.log(`Server started at  http://${hostname}:${port}/`)
});