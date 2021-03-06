// const {io} = require("./server");
var {User} = require("../db/models/models");
var {Enemy,Hit , Hulk, Dragon ,Yeti} = require("./serverSideEnemy");
var {io} = require("../server");
var {Skill,KamehamehaWave} = require("./serverSideSkill");
var Level = require("./serverSideLevel");




var lastTime = 0;
var lastTimeForCheckingIfPlayersAreActive = 0;
var tableOfSockets = {};
var levels = {};
var level1 = new Level.LevelFirst(tableOfSockets);
var level2 = new Level.LevelSecond(tableOfSockets);
var levelDragon = new Level.LevelDragon(tableOfSockets);
var levelMinions1 = new Level.LevelMinions1(tableOfSockets);
levels[level1.name] = level1;
levels[level2.name] = level2;
levels[levelDragon.name] = levelDragon;
levels[levelMinions1.name] = levelMinions1;
var allPlayers = {};
var serverStarted = false;
var findMapNameByPlayerId = {};
var handleSocketsWork = (socket,io) => {

  socket.on("respEnemies", (data) => {
    console.log(data);
    if(data.levelName && levels[data.levelName]){
      console.log(":)))");
      data.numOfEnemies = data.numOfEnemies || 10;
      console.log(data);
      let level = levels[data.levelName];
      for(let i=0;i<data.numOfEnemies;i++){

        var x = Math.floor((Math.random()-0.5) * 300 + data.playerX);
        var y = Math.floor((Math.random()-0.5) * 300 + data.playerY);
        console.log(x + " " + y);

        var tempID = "resp" + Math.floor(Math.random() * 10000);
        level.enemies[tempID] = new Hulk(tempID,x,y,level.players,level.enemies,level.statics,level.socketTable, function(){

        });

        for(var playerID in level.players){

          if(!level.players.hasOwnProperty(playerID)) continue;

          level.socketTable[playerID].emit("pushNewEnemy", {
            x : level.enemies[tempID].x,
            y : level.enemies[tempID].y,
            id : level.enemies[tempID].id,
            type : level.enemies[tempID].type,
            currentSprite : level.enemies[tempID].currentSprite,
            collisionWidth : level.enemies[tempID].collisionWidth,
            collisionHeight : level.enemies[tempID].collisionHeight,
            width : level.enemies[tempID].width,
            height : level.enemies[tempID].height
          })
        }
      };
    }
  })

  socket.on("changeLevel", (data) => {

    var oldMapName = findMapNameByPlayerId[data.idOfPlayer];
    var player = levels[oldMapName].players[data.idOfPlayer].gameData;
    if(allPlayers[player.id].lastTime + 500 > new Date().getTime()){
      return;
    }

    allPlayers[player.id].lastTime = new Date().getTime();

    if(!levels[oldMapName]){
      console.log("LEVELS NIE ISTNIEJE ! ");
      return;
    }
    var nextLevelData = levels[oldMapName].getNextLevelData(player.id);

    if(nextLevelData.error) {
      console.log(nextLevelData.error);
      return;
    }

    if(!nextLevelData.nextMapName || !levels[nextLevelData.nextMapName]){
      console.log("map name nof found");
      return;
    }


    io.emit("removePlayer", {
      id : data.idOfPlayer
    })
    player.x = nextLevelData.playerNewX;
    player.y = nextLevelData.playerNewY;
    player.currentLevelMapName = nextLevelData.nextMapName;
    player.currentMapLevel = levels[nextLevelData.nextMapName].tilesAndTeleportCoords;
    socket.emit("changeMapLevel",{
      levelData : player.currentMapLevel,
      playerNewX : nextLevelData.playerNewX,
      playerNewY : nextLevelData.playerNewY,
      moveX : 0,
      moveY : 0
    });
    levels[nextLevelData.nextMapName].players[data.idOfPlayer] = levels[oldMapName].players[data.idOfPlayer];

    socket.emit("addUsers", levels[nextLevelData.nextMapName].players);
    socket.emit("addStatics", levels[nextLevelData.nextMapName].statics);
    socket.emit("addEnemies", levels[nextLevelData.nextMapName].enemyData);

    delete levels[oldMapName].players[data.idOfPlayer];
    findMapNameByPlayerId[data.idOfPlayer] = nextLevelData.nextMapName;

    //TODO

    for(var playerID in levels[nextLevelData.nextMapName].players){

      if(!levels[nextLevelData.nextMapName].players.hasOwnProperty(playerID)) continue;



      levels[nextLevelData.nextMapName].socketTable[playerID].emit("playerCreation", player);
    }

    //END TODO

  })

  socket.on("getPlayerID",async (data) => {

    if(allPlayers[data.id]){
      socket.emit("alreadyLoggedIn", {
        msg : "You are already logged in !"
      })
    }else{

      try {

        var playerData;
        var user = await User.findById(data.id);
      //  data.id = Math.floor(Math.random() * 100000000) + "abcdefghi";
        playerData = {
          x : user.x,
          y : user.y,
          id : data.id,
          collisionHeight : user.collisionHeight || 11,
          collisionWidth : user.collisionWidth || 11,
          width : user.width || 32,
          height : user.height || 32,
          currentSprite : [{x:1,y:0}],
          health : user.maxHealth * (user.level/10 + 1) || 1000,
          maxHealth : user.maxHealth * (user.level/10 + 1) || 1000,
          healthRegeneration : user.healthRegeneration * (user.level/10 + 1) || 20,
          mana : user.maxMana * (user.level/10 + 1) || 400,
          maxMana : user.maxMana * (user.level/10 + 1) || 400,
          manaRegeneration : user.manaRegeneration * (user.level/10 + 1) * 2 || 5,
          speed : Math.min(Math.floor(7 + user.level/4),10),
          level : user.level || 1,
          experience : user.experience || 0,
          requiredExperience : user.level * 2 * 500 || 1000,
          damage : 30 + 3*user.level || 30 + 3,
          currentLevelMapName : user.currentLevelMapName || "firstMap",
        }
        if(user.currentLevelMapName){
          playerData.currentMapLevel = levels[user.currentLevelMapName].tilesAndTeleportCoords;
        }else{
          playerData.currentMapLevel = levels["firstMap"].tilesAndTeleportCoords;
        }
        socket.emit("playerID", playerData)
        socket.broadcast.emit("playerCreation",playerData);
        levels[playerData.currentLevelMapName].players[playerData.id] = {};
        levels[playerData.currentLevelMapName].players[playerData.id].gameData = playerData;
        findMapNameByPlayerId[playerData.id] = playerData.currentLevelMapName;
        allPlayers[playerData.id] = {};//only used to check whether player is active or not !
        allPlayers[playerData.id].active = true;
        allPlayers[playerData.id].lastTime = 0;

        tableOfSockets[playerData.id] = socket;
      }catch(e){
        console.log("\n\n ERROR IN PLAYER CREATION !!!! \n\n" + e);
        socket.emit("alreadyLoggedIn", {
          msg : e
        })
      }

    }
    socket.on("playerCreated", (data) => {
      // socket.emit("setLevel",{
      //     tableOfTiles : level1Table
      // });
      socket.emit("addUsers", levels[findMapNameByPlayerId[data.id]].players);
      socket.emit("addStatics", levels[findMapNameByPlayerId[data.id]].statics);
      socket.emit("addEnemies", levels[findMapNameByPlayerId[data.id]].enemyData);
      socket.emit("permissionToLoop");
    })

  });

  socket.on("skillCreation", (skillData) => {
    var curLev = levels[findMapNameByPlayerId[skillData.ownerID]];
    var player = curLev.players[skillData.ownerID].gameData;

    if(player.mana >= 10){
      player.mana -= 10;
      curLev.skills.push(new KamehamehaWave(Math.floor(Math.random() * 100000),skillData, curLev.players,curLev.statics,curLev.enemies, tableOfSockets));
    }
  });






  socket.on("damageEnemy",(data) => {
    var allEnemies = levels[findMapNameByPlayerId[data.idOfPlayer]].enemies;
    var connectedPlayersData = levels[findMapNameByPlayerId[data.idOfPlayer]].players;
    if(allEnemies[data.idOfEnemy]){
      allEnemies[data.idOfEnemy].health -= connectedPlayersData[data.idOfPlayer].gameData.damage;
      if(allEnemies[data.idOfEnemy].health<=0){
        connectedPlayersData[data.idOfPlayer].gameData.experience += allEnemies[data.idOfEnemy].experience;
        if(connectedPlayersData[data.idOfPlayer].gameData.experience >= connectedPlayersData[data.idOfPlayer].gameData.requiredExperience ){
          connectedPlayersData[data.idOfPlayer].gameData.experience = 0;
          connectedPlayersData[data.idOfPlayer].gameData.level += 1;
          connectedPlayersData[data.idOfPlayer].gameData.maxHealth += 100;
          connectedPlayersData[data.idOfPlayer].gameData.maxMana += 100;
          connectedPlayersData[data.idOfPlayer].gameData.healthRegeneration = connectedPlayersData[data.idOfPlayer].gameData.maxHealth/100;
          connectedPlayersData[data.idOfPlayer].gameData.manaRegeneration = connectedPlayersData[data.idOfPlayer].gameData.maxMana/100;
          connectedPlayersData[data.idOfPlayer].gameData.speed = Math.min(Math.floor(7 + connectedPlayersData[data.idOfPlayer].gameData.level/4),10);
          connectedPlayersData[data.idOfPlayer].gameData.damage = 30 + 3*connectedPlayersData[data.idOfPlayer].gameData.level;
          connectedPlayersData[data.idOfPlayer].gameData.requiredExperience = connectedPlayersData[data.idOfPlayer].gameData.level * 2 * 500;
        }
      }
    }
  });





  socket.on('userData', (playerData) => {

    if(findMapNameByPlayerId[playerData.id]){
      var connectedPlayersData = levels[findMapNameByPlayerId[playerData.id]].players;
      connectedPlayersData[playerData.id].gameData.x = playerData.x;
      connectedPlayersData[playerData.id].gameData.y = playerData.y;
      connectedPlayersData[playerData.id].gameData.currentSprite = playerData.currentSprite;
      connectedPlayersData[playerData.id].gameData.rangeOfSeeingWidth = playerData.rangeOfSeeingWidth;
      connectedPlayersData[playerData.id].gameData.rangeOfSeeingHeight = playerData.rangeOfSeeingHeight;
      connectedPlayersData[playerData.id].active = true;
    }else{
      socket.emit("someKindOfLogout");//TODO
    }
  });

  socket.on("checkedConnection", (playerData) => {
    if(allPlayers[playerData.id])
      allPlayers[playerData.id].active = true;
  })


  var sendToUserData = (time) => {
    requestAnimationFrame(sendToUserData);


    if(time - lastTime > 1000/20){


      lastTime = time;
      for(var levelID in levels){
        if(!levels.hasOwnProperty(levelID)) continue;
        levels[levelID].tick();
      }

		}
  }





  var checkForConnection = (time) => {
    requestAnimationFrame(checkForConnection);




    if(time - lastTimeForCheckingIfPlayersAreActive > 10000){//every 10 sec we check for connection
      lastTimeForCheckingIfPlayersAreActive = time;
      for (var playerID in allPlayers) {
          // skip loop if the property is from prototype
          if (!allPlayers.hasOwnProperty(playerID)) continue;



          if(!allPlayers[playerID]) continue;
          allPlayers[playerID].active = false;
      }
      io.emit("checkForConnection");
      setTimeout(async function(){
        for (var playerID in allPlayers) {
            // skip loop if the property is from prototype
            if (!allPlayers.hasOwnProperty(playerID)) continue;



            if(!allPlayers[playerID]) continue;
            var player = allPlayers[playerID];
            if(!allPlayers[playerID].active){
              io.emit("removePlayer", {
                id : playerID
              })

              try {
                var player = levels[findMapNameByPlayerId[playerID]].players[playerID];
                var user = await User.findById(playerID);
                user.x = player.gameData.x;
                user.y = player.gameData.y;
                user.level = player.gameData.level;
                user.experience = player.gameData.experience;
                user.currentLevelMapName = player.gameData.currentLevelMapName;
                await user.save();

                console.log("saved statis of :", user._id);
              }catch(e){
                console.log(e);
              }

              delete tableOfSockets[playerID];
              delete allPlayers[playerID];
              delete levels[findMapNameByPlayerId[playerID]].players[playerID];
              delete findMapNameByPlayerId[playerID];

            }
        }
      }, 5000);


		}
  };



  if(!serverStarted){
    sendToUserData();
    checkForConnection();
    serverStarted = true;
  }
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
  handleSocketsWork
}
