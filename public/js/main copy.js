app.get("/register", function(req, res){
    res.render("reg")
})

app.post("/register", function(req, res){
    var type = req.body.type
    if(type=="student"){
    var newUser = new Student({
        username: req.body.username,
        gender: req.body.gender,
        rollnumber: req.body.rollnumber,
        dob: req.body.dob,
        email: req.body.email,
        type: req.body.type,
        password: req.body.password
    })

    req.checkBody('username','UserName is Required').notEmpty();
    req.checkBody('rollnumber','Roll Number is Required').notEmpty();
    req.checkBody('email','Email Required').notEmpty();
    req.checkBody('email','Email Invalid').isEmail();
    req.checkBody('password','Password is Required').notEmpty();
    req.checkBody('password1','Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if(errors){
        res.render('Sregister', {errors: errors});
    }else{
    bcrypt.genSalt(10, function(err,  salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            if(!err){
                newUser.password = hash;
            }
            newUser.save(function(err){
                if(!err){
                    console.log("success in reg");
                    res.redirect("/student/login")
                }
            })
        })
    })
    }}
    else if(type=="teacher"){
        var newUser = new Teacher({
        username: req.body.username,
        gender: req.body.gender,
        rollnumber: req.body.rollnumber,
        dob: req.body.dob,
        email: req.body.email,
        type: req.body.type,
        password: req.body.password
    })

    req.checkBody('username','UserName is Required').notEmpty();
    req.checkBody('rollnumber','Roll Number is Required').notEmpty();
    req.checkBody('email','Email Required').notEmpty();
    req.checkBody('email','Email Invalid').isEmail();
    req.checkBody('password','Password is Required').notEmpty();
    req.checkBody('password1','Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if(errors){
        res.render('Sregister', {errors: errors});
    }else{

             bcrypt.genSalt(10, function(err,  salt){
                 bcrypt.hash(newUser.password, salt, function(err, hash){
                    if(!err){
                         newUser.password = hash;
                  }
                        newUser.save(function(err){
                     if(!err){
                         console.log("success in reg");
                         res.redirect("/teacher/login")
                }
            })
        })
    })
    }}
})

//strategies

passport.use('student', new LocalStrategy(function(username, password, done){
    var query = {username: username};
    Student.findOne(query, function(err, student){
        if(err) throw err;
        if(!student){
            return done(null, false);
        }
        bcrypt.compare(password,student.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch)
                return done(null, student);
            else
                return done(null,false);
        })
    })
}))

passport.use('teacher', new LocalStrategy(function(username, password, done){
    var query = {username: username};
    Teacher.findOne(query, function(err, teacher){
        if(err) throw err;
        if(!teacher){
            console.log("no teach")
            return done(null, false);
        }
        bcrypt.compare(password,teacher.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch)
                return done(null, teacher);
            else
                return done(null,false);
        })
    })
}))

//serialize deserialize

passport.serializeUser(function (entity, done) {
    done(null, { id: entity.id, type: entity.type });
});

passport.deserializeUser(function (obj, done) {
    switch (obj.type) {
        case 'student':
            Student.findById(obj.id)
                .then(user => {
                    if (user) {
                        done(null, user);
                    }
                    else {
                        done(new Error('user id not found:' + obj.id, null));
                    }
                });
            break;
        case 'teacher':
            Teacher.findById(obj.id)
                .then(device => {
                    if (device) {
                        done(null, device);
                    } else {
                        done(new Error('device id not found:' + obj.id, null));
                    }
                });
            break;
        default:
            done(new Error('no entity type:', obj.type), null);
            break;
    }
});
//login routes

app.get("/student/login", function(req, res){
    res.render("slogin")
})

app.get("/teacher/login", function(req, res){
    res.render("tlogin")
})

app.post('/student/login', 
  passport.authenticate('student', { successRedirect: '/student/home', failureRedirect: '/student/login' }));

app.post('/teacher/login', 
  passport.authenticate('teacher', { successRedirect: '/teacher/home', failureRedirect: '/teacher/login' }));


app.get("/", function(req, res){
  res.render("home");  
})

app.get("/student/home", function(req, res){
  res.send("hi student")
})

app.get("/teacher/home", function(req, res){
  res.send("hi teacher")  
})