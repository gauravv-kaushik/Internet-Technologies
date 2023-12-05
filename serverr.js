const http = require('http');
const fs = require("fs");
const mysql = require("mysql");

const qs = require('querystring');

//creating caonnection to dbms

const mycon = mysql.createConnection({
  host:"localhost",
  user :"root",
  password:"1211",
  database:"entry",
  insecureAuth : true
})


mycon.connect((err,data)=>{
  if(err){
console.log("unable to connect to db ", err.message)
  }else{
    console.log("db connected",)
  }
})


//creating server

const server = http.createServer((req,res)=>{
  const path = req.url

  //storeVisitorsLogs(req);

  if(path == '/welcome'){
    loadWelcome(res)
  }else if(path == '/'){
    loadIndex(res)
  
  }else if(req.method == 'POST' && path =='/signup' ){
    funSignUp(req,res)

  }else if(req.method == 'POST' && path =='/signin'){

    funSignIn(req,res)
  }

})


server.listen(3000,()=>{
  console.log("server started")
})


//------------------------function  to do signup ------------------

function funSignUp(req,res){

  var body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    
  var d = qs.parse(body);
  var query  = `INSERT INTO users VALUES ( ?, ?, ?)`;

  mycon.query(query,[d.username,d.name,d.pass],(err,data)=>{
    if(err){
      console.log("error in insertion ",err)
      res.statusCode = 409
      res.write("chose other user name")
      res.end()
    }else{
      console.log("inserted")
      res.statusCode = 201
      res.writeHead(302, { 'Location': '/' });
      res.end()
    }
    
  })
  })
}


//=====================function  to do sign in ======================


function funSignIn(req,res){

  var body = '';


  //working with the body of a POST request

  req.on('data', (chunk) => {
    body += chunk;
  });


  //---- trigerred when entire entire request has been received.
  //-----when all data has been received for the request.

  req.on('end', () => {
  var d = qs.parse(body);

  var query  = `SELECT * FROM user where username = ? AND password = ? `;

  mycon.query(query,[d.username , d.pass],(err,data)=>{

    if(err){
      console.log("error in server ")
      res.statusCode = 404
      res.write("error in server")
      res.end()
  
    }else{

      console.log(data)
      if(data.length == 1){

        res.statusCode = 200;
        res.writeHead(302, { 'Location': '/welcome'}); 
        res.end();
       
      }else{

        res.statusCode = 409 ;
        res.write("sign in failed")
        res.end();

      }
    }
    
  })
  })


}



//============================function  to load index.html =====================

function loadIndex(res){

  fs.readFile("index.html",async (err,data)=>{
    if(err){
      console.log("reading file failed")
      res.write("text file nii milla")
      res.end()
 
    }else{
      if(res.write(data)){
        res.statusCode = 200
        res.end()
      }
    }
  })
}


//============================function  to LOAD WELCOME PAGE ====================

function loadWelcome(res){

  fs.readFile("welcome.html", async (err,data)=>{
    if(err){
      res.write("error in loading welcome page")
      res.end()
    }else{
      res.write(data)
      res.end();
    }
  })

}

//============================================================================

function storeVisitorsLogs(req){

  var str = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var d = new Date();

  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  fs.appendFile("serverlogs.txt",`${d.getDay()} ${months[d.getMonth()]} ${d.getHours()}::${d.getMinutes()}::${d.getSeconds()}  ${str} : ${req.method} ${req.url}\n`,(err)=>{

    if(err){
      console.log("unable to log")
    }else{
      console.log("logged the visitor to log txt file")
    }

  })

}

