const express = require('express')
const router = express.Router()
const Admin = require('../models/Admin')
const passport = require('passport')

// middleware to check if admin is logged in
isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/admin/login')
}
//  login admin view 
router.get('/login', (req,res)=> {
    res.render('admin/login', {
        error: req.flash('error')
    })
})

// login post request 
router.post('/login',
  passport.authenticate('local.login', {
    successRedirect: '/order/show',
      failureRedirect: '/admin/login',
      failureFlash: true })
      )


// sign up form 
    // router.get('/signup', (req,res)=> {
    //     res.render('admin/signup', {
    //         error: req.flash('error')
    //     })
    // })

// sign up post request

    // router.post('/signup',
    // passport.authenticate('local.signup', {
    //     successRedirect: 'show',
    //     failureRedirect: '/admin/signup',
    //     failureFlash: true })
    //     )



// logout admin
router.get('/logout', (req,res)=> {
    req.logout();
    res.redirect('/admin/login');
})

module.exports = router