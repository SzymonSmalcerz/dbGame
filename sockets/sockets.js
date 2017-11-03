// const {io} = require("./server");

var {Enemy,Hit , Hulk, Dragon ,Yeti, Static} = require("./serverSideEnemy");
var {io} = require("../server");
var {Skill,KamehamehaWave} = require("./serverSideSkill");

var statics = [Static.getTreeData(600,150),
               Static.getHouse1Data(500,400),
               Static.getHouse1Data(650,400),
               Static.getHouse1Data(800,400),
               Static.getHouse1Data(950,400),
               Static.getHouse2Data(300,330)
  ];
var connectedPlayersData = {};
var enemiesData = [];
var skillTable = [];
var lastTime = 0;
var lastTimeForCheckingIfPlayersAreActive = 0;
var enemies = [];
var entitiesCreated = false;
var tableOfSockets = {};
var allEnemies = {};

var handleSocketsWork = (socket,io) => {




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

  socket.on("skillCreation", (skillData) => {
    skillTable.push(new KamehamehaWave(Math.floor(Math.random() * 100000),skillData.x,skillData.y,skillData.turn,skillData.skillName, connectedPlayersData,statics,allEnemies, io))
  });

  if(!entitiesCreated){
    for(var i=0;i<10;i++){
      allEnemies[i + "h"] = new Hit(i + "h",Math.floor(Math.random()*500+ 1500),Math.floor(Math.random()*500),connectedPlayersData,enemiesData,tableOfSockets,statics,io);
      allEnemies[i + "y"] = new Yeti(i + "y",Math.floor(Math.random()*850+ 20),Math.floor(Math.random()*400+ 700 ),connectedPlayersData,enemiesData,tableOfSockets,statics,io);
      allEnemies[i + "hu"] = new Hulk(i + "hu",Math.floor(Math.random()*1000+ 500),Math.floor(Math.random()*400),connectedPlayersData,enemiesData,tableOfSockets,statics,io);
    //  allEnemies[i + "b"] = new Hulk(i + "b",Math.floor(Math.random()*700 + 200 ),Math.floor(Math.random()*700 + 200 ),connectedPlayersData,enemiesData,tableOfSockets,statics,io);
    }

    for(var i = 0;i < 50;i++){
      allEnemies[i + "dr"] = new Dragon(i + "dr",Math.floor(Math.random()*1950 + 20),Math.floor(Math.random()*400 + 1000),connectedPlayersData,enemiesData,tableOfSockets,statics,io);
    }

    entitiesCreated = true;
    console.log("CREATED ENTITIES");
    enemies = [];
    var i = 0;
  }


  socket.on("addEnemies", (data) => {
    for(var i =0;i<data.numberOfEnemies;i++){
      var temp = Math.floor(Math.random() * 100000);
      var tempID =  temp + "e";
      if(data.type == "hulk"){
        allEnemies[tempID] = new Hulk(tempID,Math.floor(Math.random()*700 + 200 ),Math.floor(Math.random()*700 + 200 ),connectedPlayersData,enemiesData,tableOfSockets,statics,io);
      }else if(data.type == "dragon"){
        allEnemies[tempID] = new Dragon(tempID,Math.floor(Math.random()*700 + 200 ),Math.floor(Math.random()*700 + 200 ),connectedPlayersData,enemiesData,tableOfSockets,statics,io);
      }else if(data.type == "yeti"){
        allEnemies[tempID] = new Yeti(tempID,Math.floor(Math.random()*700 + 200 ),Math.floor(Math.random()*700 + 200 ),connectedPlayersData,enemiesData,tableOfSockets,statics,io);
      }else {
        allEnemies[tempID] = new Hit(tempID,Math.floor(Math.random()*700 + 200 ),Math.floor(Math.random()*700 + 200 ),connectedPlayersData,enemiesData,tableOfSockets,statics,io);
      }
    }

    updateEnemyData();
    io.emit("addEnemies", enemiesData);
  })

  socket.on("damageEnemy",(data) => {
    if(allEnemies[data.idOfEnemy]){
      allEnemies[data.idOfEnemy].health -= data.damage;
    }
  });





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
      updateShootData();
      updateEnemyData();
      skillTable.forEach(skill => skill.tick());
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
  }

  function updateEnemyData(){
    enemies = [];
    for(var enemyID in allEnemies){
      if(!allEnemies.hasOwnProperty(enemyID)) continue;
      var enemy = allEnemies[enemyID];
      if(enemy){

        if(enemy.health <= 0){
          io.emit("removeEnemy", {
            id : enemy.id
          });
          delete allEnemies[enemy.id];
        }else{
          enemies.push(enemy);
        }
      }
    }

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


  var updateShootData = function(){
    skillTable = skillTable.filter((shoot) => {
  		if(shoot.detonated){
        if(shoot.tickCounter < 10){
          return true;
        }else {
          io.emit("removeSkill", {
            id : shoot.id
          })
          return false;
        }
  		}else{
  			if(shoot.tickCounter < 45){
          return true;
        }else {
          io.emit("removeSkill", {
            id : shoot.id
          })
          return false;
        }
  		}
  	})


  }
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
  updateEnemyData();
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
