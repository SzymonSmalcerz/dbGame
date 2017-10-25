const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/DragonBallDatabase', {useMongoClient: true});

module.exports = mongoose;
