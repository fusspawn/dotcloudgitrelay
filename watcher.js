var sys = require('sys')
var exec = require('child_process').exec;
var child;

var logs = [];

var app = express.createServer();

app.get('/git/push', function(req, res){
    console.log("git push recevied");
});

app.listen(8081);