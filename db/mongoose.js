const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/DragonBallDatabase', {useMongoClient: true});

module.exports = mongoose;
  
