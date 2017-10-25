// const {io} = require("./server");



(function() {
    var lastTime = 0;

    if (!global.requestAnimationFrame)
        global.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = global.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!global.cancelAnimationFrame)
        global.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var statics = [{
  type : "tree",
  x : 400,
  y: 100
},{
  type : "tree",
  x : 600,
  y: 150
}];
var connectedPlayersData = {};
var lastTime = 0;
var lastTimeForCheckingIfPlayersAreActive = 0;
var handleSocketsWork = (socket,io) => {





  socket.on("playerCreation", (playerData) => { //trigered at the client side creation of user
    console.log("SERVER SIDE PLAYER CREATION");
    socket.broadcast.emit("playerCreation",playerData);
    socket.emit("addUsers", connectedPlayersData);
    socket.emit("addStatics", statics);
  });



  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });



  socket.on('userData', (playerData) => {
    connectedPlayersData[playerData.id] = playerData;
    connectedPlayersData[playerData.id].active = true;
  });

  socket.on("checkedConnection", (playerData) => {
    if(connectedPlayersData[playerData.id])
      connectedPlayersData[playerData.id].active = true;
  })


  var sendToUserData = (time) => {
    requestAnimationFrame(sendToUserData);


    if(time - lastTime > 1000/10){
      lastTime = time;

      io.emit("playerData", connectedPlayersData);


		}
  };

  var checkForConnection = (time) => {
    requestAnimationFrame(checkForConnection);


    if(time - lastTimeForCheckingIfPlayersAreActive > 10000){//every 10 sec we check for connection
      lastTimeForCheckingIfPlayersAreActive = time;
      for (var playerID in connectedPlayersData) {
          // skip loop if the property is from prototype
          if (!connectedPlayersData.hasOwnProperty(playerID)) continue;



          if(!connectedPlayersData[playerID]) continue;
          var player = connectedPlayersData[playerID];
          connectedPlayersData[playerID].active = false;
      }
      io.emit("checkForConnection");
      console.log("INSIDE OF REQUEST ANIMATION FRAME !!");
      setTimeout(function(){
        for (var playerID in connectedPlayersData) {
            // skip loop if the property is from prototype
            console.log(playerID);
            console.log("INSIDE OF SETTIMOUT CHECKING FOR UNACTIVE PLAYERS")
            if (!connectedPlayersData.hasOwnProperty(playerID)) continue;



            if(!connectedPlayersData[playerID]) continue;
            var player = connectedPlayersData[playerID];
            if(!connectedPlayersData[playerID].active){
              io.emit("removePlayer", {
                id : playerID
              })
              delete connectedPlayersData[playerID];
              console.log("HE HAS BEEN NOT ACTIVE FOR A WHILE : ", playerID);
            }
        }
      }, 5000);


		}
  };

  sendToUserData();
  checkForConnection();
}



module.exports = {
  handleSocketsWork
}
