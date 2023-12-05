const http = require('http')
const fs = require('fs')
const mysql = require('mysql');
const qs = require('querystring')
const hostname = '127.0.0.1'
const port = 4000

function onRequest(req, res){
    //var baseURL = 'http://' + req.headers.host + '/';
    //var myURL = new URL(req.url, baseURL);
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/HTML') //implies response body will contain HTML
    console.log(req.url)
    if(req.url == '/'){
        index(req, res)
    }
    else if(req.url=='/showsignin'){
        showsignin(req, res)
    }
    else if(req.url == '/dosignin'){
        dosignin(req, res)
    }
    else if(req.url == '/showsignup'){
        showsignup(req, res)
    }
    else if(req.url == '/dosignup'){
        dosignup(req, res)
    }
    else{
        res.writeHead(404, {'Content-Type': 'text/html' });
        return res.end("404 Not Found");
    }
}
function showsignup(req, res){
    fs.readFile('index.html', function (err, data){
        res.write(data);
        return res.end();
    });
}
function dosignup(req, res){
    var body = ""
    //collect the request data
    req.on('data', function (data){
        body += data
        console.log('Partial body: ' + body)
    })
    req.on('end', function (){
        console.log('Body: ' + body)
        var qs = new URLSearchParams(body)
        var username = qs.get("username")
        var passwd = qs.get('passwd')
        var confpasswd = qs.get('confpasswd')
        if(passwd != confpasswd){
            res.write("<h1>Password Mismatch</h1>")
            return res.end();
        }
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "1211",
            database: "people"
        });
        con.connect(function(err){
            if (err) throw err;
            console.log("Connected!");
            //query set up
            var sql = "INSERT INTO user (username, passwd) VALUES (?,?)";
            //executing the query
            con.query(sql, [username, passwd], function (err, result){
                if (err) throw err;
                console.log("1 record inserted");
                res.writeHead(302,{Location:"http://127.0.0.1:4000/"});;
                res.end()
            });
        });
    })
}
function dosignin(req, res){
    var body = ""
    req.on('data', function (data){
        body += data //collecting the request data in the body variable
        console.log('Partial body: ' + body)
    })
    req.on('end', function (){
        console.log('Body: ' + body)
        var qs = new URLSearchParams(body)
        var username = qs.get("username")
        var passwd = qs.get('passwd')
        //build the connection object
        var con = mysql.createConnection({
            host: "localhost", //IP address of the database server
            user: "root",
            password: "1234",
            database: "it2021"
        });
        //connect to the database
        con.connect(function (err){
            if (err) throw err;
            console.log("Connected!");
            con.query("SELECT * FROM user where username=? and passwd=?", [username,passwd],
            function (err, result, fields){
                if (err) throw err;
                console.log(result);
                if(result.length == 1){
                    res.write("<h1>Sign-In Successful</h1>")
                    res.end()
                }
                else{
                    res.write("<h1>Sign-in Failed</h1>")
                    res.end()
                }
            });
        });
    })
        
}
function showsignin(req, res){
    fs.readFile('signin.html', function (err, data){
        res.write(data);
        return res.end();
    });         
}
            
function index(req, res){
    fs.readFile('index.html', function (err, data){
        res.write(data);
        return res.end();
    });
}        