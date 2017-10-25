const mongoose = require("../mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const {SECRET} = require("../../configuration/constans");
const bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
  nick : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
    validate : {
      validator : validator.isEmail,
      message: '{VALUE} is not a valid email!'
    }
  },
  tokens :[{
    acces :{
      type : String,
      required : true
    },
    token :{
      type : String,
      required : true
    }
  }]
});

userSchema.statics.findByToken = (token) => {

  try {
    var payload = jwt.verify(token, SECRET);


    return User.findOne({
      "tokens.token" : token,
      _id : payload._id
    });
  }catch (err) {

      return Promise.reject("Unauthorized, you have to log in");

  }

};

userSchema.methods.deleteToken = function(token){

  return User.findOneAndUpdate({nick : this.nick}, { $pull : {
    tokens : {
      token
    }
  }
  });


};

userSchema.methods.genAuthToken =  function(){

  var user = this;

  var jwtAuthToken = jwt.sign({ _id : this._id, access : "auth"}, SECRET);

  if(!this.tokens){
    this.tokens = [];
  };
  try {
    this.tokens.push({
      acces : "auth",
      token : jwtAuthToken
    });
  }catch(err){
    console.log(err);
  }
  return jwtAuthToken;
};

userSchema.pre('save', function(next){
const user = this;
  if(!user.isModified('password')){
    return next();
  };

  //this.genAuthToken();
  console.log("USER SCHEMA PRE SAVE !!!!!!!!");
  // console.log(this.tokens);
  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(user.password);

  user.password = hashedPassword;
  next();
});

var User = mongoose.model("User", userSchema);

module.exports = {
  User
};
