const express = require("express")
const app = express()
const db = require('./config/database')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const passportSetup = require('./config/passport-setup')
// bring ejs template

app.set('view engine', 'ejs')
// bring body parser 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//bring static

app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.static('node_modules'))
// session and flash config .
app.use(session({
    secret: 'lorem ipsum',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000 * 15}
}))
app.use(flash())
// bring passport 
app.use(passport.initialize())
app.use(passport.session())
//store user object 

app.get('*', (req,res,next)=> {
    res.locals.user = req.user || null
    next()
})
app.get('/', (req,res)=> { res.render('partials/welcome') })
app.get('/admin', (req,res)=> { res.render('../admin/views/adminArea') })

// app.get('/', (req,res)=> { res.redirect('/orders') })

// bring orders routes
const orders = require('./routes/orders-routes')
app.use('/orders', orders)

// bring user routes
const users = require('./routes/user-routes')
app.use('/users', users)

// listen to port 3000
app.listen(3000, ()=> {
    console.log(' app is working on port 3000')
})