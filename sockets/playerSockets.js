

var setSokcets(socket,io,connectedPlayersData,enemiesData,statics){
  socket.on("getPlayerID", (data) => {
    // if(connectedPlayersData[data.id]){
    //   socket.emit("alreadyLoggedIn", {
    //     msg : "You are already logged in !"
    //   })
    // }else{
    //   socket.emit("playerID", {
    //     id : data.id
    //   })
    // }

    socket.emit("playerID", {
      id : Math.floor(Math.random() * 100000)
    })
  });

  socket.on("playerCreation", (playerData) => { //trigered at the client side creation of user
     socket.broadcast.emit("playerCreation",playerData);
     socket.emit("addUsers", connectedPlayersData);
     socket.emit("addStatics", statics);
     socket.emit("addEnemies", enemiesData);
     connectedPlayersData[playerData.id] = playerData;
     tableOfSockets[playerData.id] = socket;
   });
}

module.expors = {
  setSokcets
}
