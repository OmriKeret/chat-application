/**
 * Created by omrikeret on 5/24/16.
 */
var express = require('express');
var quotesVal = ['I love gaming and bananas', 'I will not be impressed of technology untill I could download food', 'With great power comes a great electricty bill'];



var Ctrl = {
  getQuotel: function(req, res, next) {
    var val = Math.floor(Math.random() * 3);
    res.json({value: quotesVal[val]});
  }
};


module.exports = Ctrl;