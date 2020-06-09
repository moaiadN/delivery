const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/User')
const Admin = require('../models/Admin')

// saving user object in the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

// register user
passport.use('local.signup', new localStrategy({
    usernameField : 'email',
    phoneField : 'phone',
    addressField : 'address',
    passwordField: 'password',
    passReqToCallback: true
}, (req,username,password, done)=> {
    if (req.body.password != req.body.confirm_password) {
        return done(null, false, req.flash('error', 'Passwords do not match'))
    } else {
        User.findOne({email: username}, (err,user)=> {
            if(err) {
                return done(err)
            }
            if(user) {
                return done(null, false, req.flash('error', 'Email already used'))
            }

            if (!user) {
                //create user
                let newUser = new User()
                newUser.name = req.body.name
                newUser.lastName = req.body.lastName
                newUser.email = req.body.email
                newUser.phone = req.body.phone
                newUser.address = req.body.address
                newUser.password = newUser.hashPassword(req.body.password),
                newUser.avatar = "profile.png"
                newUser.save ((err,user)=> {
                    if(!err) {
                        return done(null, user, req.flash('success', 'User Added'))
                    } else {
                        console.log(err)
                        console.log('mimomo')
                    }
                }); console.log('newUser');
            }
        })
    }
}))
// ----------------------------

//login strategy

passport.use('local.login', new localStrategy({
    usernameField : 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req,username,password, done)=> {
    //find user
    User.findOne({email: username}, (err,user)=> {
        if (err) {
            return done(null, false, req.flash('error', 'Something wrong happened'))
        } 
        if(!user) {
            return done(null, false, req.flash('error', 'user was not found'))
        }
        if (user) {
            if (user.comparePasswords(password, user.password)) {
                return done(null,user, req.flash('success', ' welcome back'))
            } else {
                return done(null,false, req.flash('error', ' password is wrong'))
            }
        }
    })
}))
/* ================================================================================================= */
// ---------------Admin---------------------
// saving admin object in the session
passport.serializeUser(function(admin, done) {
    done(null, admin.id);
  });
  
  passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, admin) {
      done(err, admin);
    });
  });

//login strategy
passport.use('local.login', new localStrategy({
    usernameField : 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req,username,password, done)=> {
    //find user
    Admin.findOne({email: username}, (err,admin)=> {
        if (err) {
            return done(null, false, req.flash('error', 'Something wrong happened'))
        } 
        if(!admin) {
            return done(null, false, req.flash('error', 'admin was not found'))
        }
        if (admin) {
            if (admin.comparePasswords(password, admin.password)) {
                return done(null,admin, req.flash('success', ' welcome back'))
            } else {
                return done(null,false, req.flash('error', ' password is wrong'))
            }
        }
    })
}))