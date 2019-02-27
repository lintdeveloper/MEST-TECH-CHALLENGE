const express = require('express'),
      router = express.Router(),
      bcrypt = require('bcryptjs'),
      passport = require('passport'),
      {ensureAuthenticated} = require('../config/auth');
      User = require('../models/user');

router.get('/register', (req, res)=>{
  res.render('user/register');
})

router.post('/register', (req, res) => {
  const { email, password, password2 } = req.body;
  let errors = [];

  if (!email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('user/register', {
      errors,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(userEmail => {
      if (userEmail) {
        errors.push({ msg: 'Email already exists' });
        res.render('user/register', {
          errors,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                console.log(user);
                res.redirect('users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.get('/login', (req, res)=>{
    res.render('user/login')
});

//Login
router.post('/login', (req, res, next) =>{
  passport.authenticate('local', {
    successRedirect: 'dashboard',
    failureRedirect: 'login',
    failureFlash: true
  })(req, res, next);
}) 

router.get('/logout', (req, res)=>{
   req.logout()
   req.flash('success_msg', 'You are logged out');
   res.redirect('login');
})

router.get('/dashboard', ensureAuthenticated, (req, res)=>{
  res.render('user/dashboard');
})
module.exports = router;
