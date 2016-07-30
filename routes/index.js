var express = require('express');
var router = express.Router();
var path = require('path');
var userCtrl = require('../controllers/usersCtrl');
var calcCtrl = require('../controllers/calcCtrl');
var quotesCtrl = require('../controllers/quotesCtrl');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../www/app', 'index.html'));
});

router.post('/users/login', userCtrl.login);
router.put('/users/:token', userCtrl.put);
router.post('/users', userCtrl.register);

router.get('/users/:username/childrens/:childrenId', userCtrl.getChild); // TBD
router.get('/children/:childrenId', userCtrl.getChild); // TBD
module.exports = router;
