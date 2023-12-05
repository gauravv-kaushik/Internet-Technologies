const http=require("http")
const hostname='127.0.0.1'
const port=10000
function sayHello(req,res){
    res.statusCode=200
    res.setHeader('Content-Type','text/plain')
    res.write("Hello World,This is my Node.js server")
    res.end()
}
const server =http.createServer(sayHello)
server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}`)
})