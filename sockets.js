// const {io} = require("./server");

var {Enemy,Hit, Hulk, Static} = require("./serverSideEnemy");
var {io} = require("./server");


var statics = [Static.getTreeData(600,150),
               Static.getHouse1Data(500,400),
               Static.getHouse1Data(650,400),
               Static.getHouse1Data(800,400),
               Static.getHouse1Data(950,400),
               Static.getHouse2Data(300,330)
  ];
var connectedPlayersData = {};
var enemiesData;
var lastTime = 0;
var lastTimeForCheckingIfPlayersAreActive = 0;


var entitiesCreated = false;
var tableOfSockets = {};

var allEnemies = {};

var handleSocketsWork = (socket,io) => {

  socket.on("playerCreation", (playerData) => { //trigered at the client side creation of user
    socket.broadcast.emit("playerCreation",playerData);
    socket.emit("addUsers", connectedPlayersData);
    socket.emit("addStatics", statics);
    socket.emit("addEnemies", enemiesData);
    connectedPlayersData[playerData.id] = playerData;
    tableOfSockets[playerData.id] = socket;
  });



  if(!entitiesCreated){
    for(var i=0;i<100;i++){
      allEnemies[i + "a"] = new Hit(i + "a",Math.floor(Math.random()*700 + 200 ),Math.floor(Math.random()*700 + 200 ),connectedPlayersData,enemiesData,tableOfSockets,statics,io);
    }
    entitiesCreated = true;
    console.log("CREATED ENTITIES");
  }
  var enemies = [];
  for(var i=0;i<100;i++){
    enemies[i] = allEnemies[i + "a"];
  }


  socket.on("damageEnemy",(data) => {
    if(allEnemies[data.idOfEnemy]){
      allEnemies[data.idOfEnemy].health -= data.damage;
    }
  });


  function updateEnemyData(){
    enemies = enemies.filter(enemy => {
      if(enemy && enemy.health > 0){
        return true;
      }else{
        if(enemy){
          delete allEnemies[enemy.id];

            io.emit("removeEnemy", {
              id : enemy.id
            });
        }
        return false;
      }
    });
    enemiesData = enemies.map(enemy => {
      return {
        x : enemy.x,
        y : enemy.y,
        id : enemy.id,
        type : enemy.type,
        currentSprite : enemy.currentSprite,
        collisionWidth : enemy.collisionWidth,
        collisionHeight : enemy.collisionHeight,
        width : enemy.width,
        height : enemy.height
      };
    })
  }

  updateEnemyData();








  // socket.on('disconnect', () => {
  //   console.log('User was disconnected');
  // });



  socket.on('userData', (playerData) => {
    if(connectedPlayersData[playerData.id]){
      connectedPlayersData[playerData.id] = playerData;
      connectedPlayersData[playerData.id].active = true;
    }
  });

  socket.on("checkedConnection", (playerData) => {
    if(connectedPlayersData[playerData.id])
      connectedPlayersData[playerData.id].active = true;
  })


  var sendToUserData = (time) => {
    requestAnimationFrame(sendToUserData);


    if(time - lastTime > 1000/20){
      updateEnemyData();
      enemies.forEach(enemy => enemy.tick());

      for (var playerID in connectedPlayersData) {
          // skip loop if the property is from prototype
        if (!connectedPlayersData.hasOwnProperty(playerID)) continue;
        var player = connectedPlayersData[playerID];

        if(player.health < player.maxHealth){
          connectedPlayersData[playerID].health += player.healthRegeneration;
        }

        if(player.mana < player.maxMana){
          connectedPlayersData[playerID].mana += player.manaRegeneration;
        }
      }
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
      setTimeout(function(){
        for (var playerID in connectedPlayersData) {
            // skip loop if the property is from prototype
            if (!connectedPlayersData.hasOwnProperty(playerID)) continue;



            if(!connectedPlayersData[playerID]) continue;
            var player = connectedPlayersData[playerID];
            if(!connectedPlayersData[playerID].active){
              io.emit("removePlayer", {
                id : playerID
              })
              delete tableOfSockets[playerID];
              delete connectedPlayersData[playerID];
            }
        }
      }, 5000);


		}
  };

  sendToUserData();
  checkForConnection();
}


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



module.exports = {
  handleSocketsWork,
  connectedPlayersData
}
