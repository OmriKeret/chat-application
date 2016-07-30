/**
 * Created by omrikeret on 5/24/16.
 */
var express = require('express');
var path = require('path');
var jsonfile = require('jsonfile');
var crypto = require('crypto');
var fileExists = require('file-exists');

function getToken() {
  return crypto.randomBytes(48).toString('hex');
};

var Ctrl = {
  login: function(req, res, next) {
    var userName = req.body.username;
    var pass = req.body.pass;
    var filePath = (path.join(__dirname, '../data/users', userName + '.json'));
    var userObject = jsonfile.readFileSync(filePath);
    var validUser = userObject && userObject.user.pass === pass;

    if (validUser) {
      userObject.token = getToken();
      userObject.timeout = new Date(new Date().setMonth(new Date().getMonth() + 1)).getTime();
      jsonfile.writeFile(filePath, userObject, function (err) {
        if (!err) {
          res.json(userObject);
        } else {
          res.sendStatus(500);
        }

      });
    } else {
      res.sendStatus(401);
    }



  },
  put: function(req, res, next) {
    var userName = req.body.username;
    var token = req.params.token;
    var newUser = {user: req.body};
    var filePath = (path.join(__dirname, '../data/users', userName + '.json'));
    var userObject = jsonfile.readFileSync(filePath);
    var validUser = userObject && userObject.token === token;


    if (validUser) {
      newUser.token = getToken();
      newUser.timeout = new Date(new Date().setMonth(new Date().getMonth() + 1)).getTime();

      var uniqueArray = newUser.user.childCode.filter(function(elem, pos) {
        return newUser.user.childCode.indexOf(elem) == pos;
      });
      newUser.user.childCode = uniqueArray;

      jsonfile.writeFile(filePath, newUser, function (err) {
        if (!err) {
          res.json(newUser);
        } else {
          res.sendStatus(500);
        }

      });
    } else {
      res.sendStatus(401);
    }



  },
  register: function(req, res, next) {
    var userName = req.body.username;
    var registeredUser = {user: req.body};

    var filePath = (path.join(__dirname, '../data/users', userName + '.json'));
    var userObjectExists = fileExists(filePath);
    var validUser = !userObjectExists;

    if (validUser) {
      registeredUser.token = getToken();
      registeredUser.timeout = new Date(new Date().setMonth(new Date().getMonth() + 1)).getTime();

      var uniqueArray = registeredUser.user.childCode.filter(function(elem, pos) {
        return registeredUser.user.childCode.indexOf(elem) == pos;
      });
      registeredUser.user.childCode = uniqueArray;

      jsonfile.writeFile(filePath, registeredUser, function (err) {
        if (!err) {
          res.json(registeredUser);
        } else {
          res.sendStatus(500);
        }

      });
    } else {
      res.sendStatus(400);
    }

  },
  getChild: function(req, res, next) {
    var userName = req.params.username;
    var childId = req.params.childrenId;
    var filePath = (path.join(__dirname, '../data/children', childId + '.json'));
    res.json(jsonfile.readFileSync(filePath));
  }
};


module.exports = Ctrl;