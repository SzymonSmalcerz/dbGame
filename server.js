const express = require("express");
const mongoose = require("./db/mongoose");
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
const session = require("client-sessions");
const cookieParser = require('cookie-parser');
const {User} = require("./db/models/models")
const {checkIfNickIsAvaliable,loginMiddleware,authenticate,logoutUser} = require("./auth/authentication");
const socketIO = require('socket.io');
const http = require("http");


const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const {handleSocketsWork} = require("./sockets/sockets");
io.on("connection", (socket) => {
  handleSocketsWork(socket, io);
});

app.set("view engine","ejs");
app.use(methodOverride('_method'))
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: 'blargadeeblargblarg', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  httpOnly : true,
  secure : true,
  ephermal : true
}));




var PORT = process.env.PORT || 3000;

app.get("/home",(req,res) => {
  if(req.session && req.session.jwt){
    res.redirect("/secret");
  }else{

    res.render("home");
  }
})

app.get("/db", authenticate, (req,res) => {
  //converting hex to dec
  var firstHalfOfId = req.user._id.toString().substring(0,12);
  var secondtHalfOfId = req.user._id.toString().substring(12);


  var decIDofPlayerFIRSTHALF = parseInt(firstHalfOfId, 16);
  var decIDofPlayerSECONDHALF = parseInt(secondtHalfOfId, 16);
  res.render("dbgame",{id1 : decIDofPlayerFIRSTHALF, id2 : decIDofPlayerSECONDHALF});
})


app.get("/login",(req,res) => {
  res.render("login");
})

app.post("/login",loginMiddleware,(req,res) => {
  res.render("loggedInPage");
})

app.get("/secret3",authenticate,(req,res) => {
  res.send("IM LOGGED IN :OOOO");
})



app.get("/register",(req,res) => {
  res.render("register");
})
app.post("/register",checkIfNickIsAvaliable,(req,res) => {
  res.redirect("/home");
})

app.get("/secret",authenticate,(req,res) => {
  res.render("loggedInPage");
})

app.get("/secret2",authenticate,(req,res) => {
  res.render("loggedInPage");
})

app.delete("/logout",authenticate,logoutUser,(req,res) => {
  res.redirect("/home");
})

app.get("*",(req,res) => {
  res.redirect("/home");
})

server.listen(PORT, () => {
  console.log("server is listening at port", PORT);
})


module.exports = {
  io
}
