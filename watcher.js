var sys = require('util')
var exec = require('child_process').exec;
var express = require('express');

var app = express.createServer();
app.use(express.bodyParser());



app.post('/git/push', function(req, res){
    var payload = req.payload;
    var git_data = JSON.parse(payload);
    
    console.log("got a git push for repo: " + git_data.repository.name + " \r\n " 
                + "  message: " + git_data.commits[git_data.commits.length - 1].message);
});

app.listen(8081);