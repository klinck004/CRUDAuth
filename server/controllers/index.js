let express = require('express');
let router = express.Router();

// Authentication
let passport = require('passport');
let DB = require('../config/db');
let userModel = require('../models/user.js');
let User = userModel.User;


console.log("1. Index controller loaded!"); /* for dev peace of mind */
module.exports.displayHP = (req, res, next) => {
    res.render('index', {
        title: 'Home',
        displayName: req.user ? req.user.displayName:''
    });
};

module.exports.displayErr = (err, req, res, next) => {
    res.render('error', {
        error: err,
        displayName: req.user ? req.user.displayName:''
    });
};

// Get login auth
module.exports.displayLoginPage = (req, res, next) => {
    if (!req.user) // If not logged in, display login
    {
        res.render('auth/login',
        {
            title:'Login',
            message: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName:''
        })
    } 
    else { // If logged in, do not do anything
        return res.redirect('/')
    }
}

// Post login auth
module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local', function(err, User, info) {
        if (err) // Server error
        {   
            err.type = "Auth server error"
            err.status = 500
            console.log("Auth server error:");
            console.log(err);
            return next(err);
        }
        // Login auth error
        if(!User) 
        {
            req.flash('loginMessage', 'Password is incorrect or missing.');
            return res.redirect('login')
        }

        req.login(User, (err)=>{
            if (err)
            {
                err.type = "Auth login error"
                err.status = 500
                console.log("Auth login error:");
                console.log(err);
                return next(err)
            }
            return res.redirect('/')
        })
    }) (req, res)
}

// Get registration
module.exports.displayRegisterPage = (req, res, next) => {
    if(!req.user) // If not logged in, display login
    {
      res.render('auth/register',
      {
        title:'Register',
        message: 'This is an authentication message!', /* req.flash('registerMessage'), */
        displayName: req.user ? req.user.displayName: ''
      })
    }
    else { // If logged in, do not do anything
      return res.redirect('/')
    }   
}

// Post registration
module.exports.processRegisterPage = (req, res, next) => {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        displayName: req.body.displayName
    })
    User.register(newUser, req.body.password,(err) => {
    if(err)
    {
        console.log("Error: User cannot be created!");
        if(err.name =='UserExistError')
        {
        req.flash('registerMessage', 'Error: The user already exists')}
        return res.render('auth/register',
        {
        title:'Register',
        message: req.flash('registerMessage'),
        displayName: req.user ? req.user.displayName:''
        })
    }
    else{
        return passport.authenticate('local')(req,res,()=>{
        res.redirect('/');
        })
    }
    })   
}

// Get logout
module.exports.displayLogoutPage = (req, res, next) => {
    res.render('auth/logout',
    {
      title:'Logged out', 
    })
    req.logout(function(err){
        if(err)
        {
          return next(err);
        }
      })
    
}
