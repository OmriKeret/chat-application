/**
 * Created by omrikeret on 5/24/16.
 */
var express = require('express');
var path = require('path');
var jsonfile = require('jsonfile');

var Ctrl = {
  saveCalc: function(req, res, next) {

    var filePath = (path.join(__dirname, '../data', 'data.json'));
    var calcVal = req.params.val;
    var obj = {value: calcVal};
    var err = 0;
    jsonfile.writeFile(filePath, obj, function (err) {
      err = 1;
    });

    if (!err) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }

  },
  getCalcVal: function(req, res, next) {
    var filePath = (path.join(__dirname, '../data','data.json'));
    res.json(jsonfile.readFileSync(filePath));
  }
};


module.exports = Ctrl;