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
  }],
  level : {
    type : Number,
    default : 1
  },
  experience : {
    type : Number,
    default : 0
  },
  maxHealth : {
    type : Number,
    default : 1000
  },
  maxMana : {
    type : Number,
    default : 300
  },
  width : {
    type : Number,
    default : 32
  },
  height : {
    type : Number,
    default : 32
  },
  collisionWidth : {
    type : Number,
    default : 11
  },
  collisionHeight : {
    type : Number,
    default : 11
  },
  manaRegeneration : {
    type : Number,
    default : 2
  },
  healthRegeneration : {
    type : Number,
    default : 5
  },
  x : {
    type : Number,
    default : 100
  },
  y : {
    type : Number,
    default : 100
  }
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
