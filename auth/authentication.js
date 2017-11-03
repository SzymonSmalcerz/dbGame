const {User} = require("../db/models/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {SECRET} = require("../configuration/constans");
const session = require("client-sessions");


var checkIfNickIsAvaliable = async (req,res,next) => {
  try {
    var user = await User.findOne({email : req.body.email});
    if(!user){
      user = await User.findOne({nick : req.body.nick});
      if(!user){

        var newUser = await new User(req.body);
        await newUser.save();
        next();
      }else{
        res.render("home",{message: "nick already taken"});
      }
    }else{
      res.render("home",{message: "email already taken"});
    }
  }catch(e){
    console.log(e);
    res.send(e);
  }
}


var loginMiddleware = async (req,res,next) => {
  try {
    var user = await User.findOne({nick : req.body.nick});
    if(bcrypt.compareSync(req.body.password, user.password)){
      var token = await user.genAuthToken();
      await user.save();
      req.session.jwt = token;
      req.user = user;
      next();
    }else{
      res.render("home",{message : "bad password or login"});
    }
  }catch(e){
    res.render("home",{message : "bad password or login"});
  }
}
var authenticate = async (req,res,next) => {
  try {
    //console.log(JSON.stringify(req.headers));
    if(req.session && req.session.jwt){
      var user = await User.findByToken(req.session.jwt);
      req.user = user;
      if(user){
        next();
      }else{
        res.render("home",{message : "you have to log in to get to this page"});
      }
    }else{
      res.render("home",{message : "you have to log in to get to this page"});
    }
  }catch(e){
    res.send(e);
  }
}

var logoutUser = async (req,res,next) => {
  try {
    if(req.session && req.session.jwt){
      var user = await User.findByToken(req.session.jwt);
      if(user){
        await user.deleteToken(req.session.jwt);
        //await User.deleteToken(req.session.jwt);
        req.session.reset();
        next();
      }else{
        res.render("home",{message : "you have to log in to get to this page"});
      }
    }else{
      res.render("home",{message : "you have to log in to get to this page"});
    }
  }catch(e){
    res.send(e);
  }
}




module.exports = {
  checkIfNickIsAvaliable,
  loginMiddleware,
  authenticate,
  logoutUser
}
