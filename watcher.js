var sys = require('util')
var exec = require('child_process').exec;
var express = require('express');
var fs = require('fs');

var app = express.createServer();
app.use(express.bodyParser());



app.post('/git/push', function(req, res){
    var payload = req.param("payload", null);;
    
    console.log(payload);
    var git_data = JSON.parse(payload);
    
    console.log("got a git push for repo: " + git_data.repository.name + " \r\n " 
                + "message: " + git_data.commits[git_data.commits.length - 1].message);
    
    try {
        var stats = fs.lstatSync("./"+git_data.repository.name);
        if(stats.isDirectory()) {
            fs.rmdirSync(".\\"+git_data.repository.name);
            git_clone(git_data);
        }
    } catch (exception) {
            console.log("exception");
            git_clone(git_data);    
    } 
});

app.get("/", function(req, res) {
});


function git_clone(git_data) {
    var repo = git_data.repository.name;
    var git_url = git_data.repository.url.replace("http://", "git://");
    console.log("cloning: " + git_url);
    
    var git_process = exec("git clone " + git_url);
    git_process.stdout.on('data', function (data) {
        if(data == "Password:")
            git_process.stdin.write("trasher");
        
        console.log("Git (" + repo +") - Data: " + data);
    });
    
    git_process.stderr.on('data', function (data) {
        console.log("Git (" + repo +") - Error: " + data);    
    });
    
    git_process.on('exit', function(code) {
        if (code !== 0) {
            console.log("Git (" + repo +") - Error: Exit Code Not 0 was:" + code);
        }
        
        console.log("Git (" + repo +") clone completed.");
        git_process.stdin.end();
        deploy_step(git_data);
    });
}


function deploy_step(git_data) {
    var repo = git_data.repository.name;    
    console.log("running dep code: " + "dotcloud push --all "+ repo + " " + repo);
    var dc = exec("dotcloud push --all "+ repo + " " + repo);
    
    dc.stdout.on('data', function (data) {
        console.log("dotcloud (" + repo +") - Data: " + data);
    });
    
    dc.stderr.on('data', function (data) {
        console.log("dotcloud (" + repo +") - Error: " + data);    
    });
    
    dc.on('exit', function(code) {
        if (code !== 0) {
            console.log("dotcloud (" + repo +") - Error: Exit Code Not 0 was:" + code);
        }
        dc.stdin.end();
    });
};

app.listen(8081);