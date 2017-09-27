var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

var user = {
  id: 'admin',
  password: 'admin'
};

router.post('/', function(req, res){
  if(!req.body.id || !req.body.password){
    res.render('login');
  }else{
    if(user.id === req.body.id && user.password === req.body.password){
      console.log('logedin');
      req.session.authenticated = true;
      res.redirect('/index');
    }else{
      res.render('login');
    }
  }
});

module.exports = router;
