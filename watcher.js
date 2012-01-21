var sys = require('util')
var exec = require('child_process').exec;
var express = require('express');

var app = express.createServer();

app.get('/git/push', function(req, res){
    console.log("git push recevied");
});

app.listen(8081); //