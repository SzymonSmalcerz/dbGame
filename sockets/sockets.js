// const {io} = require("./server");
var {User} = require("../db/models/models");
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




socket.on("getPlayerID",async (data) => {

  if(connectedPlayersData[data.id]){
    socket.emit("alreadyLoggedIn", {
      msg : "You are already logged in !"
    })
  }else{

    try {

      var playerData;
      var user = await User.findById(data.id);
      playerData = {
        x : user.x,
        y : user.y,
        id : data.id,
        collisionHeight : user.collisionHeight,
        collisionWidth : user.collisionWidth,
        width : user.width,
        height : user.height,
        currentSprite : [{x:1,y:0}],
        health : user.maxHealth,
        maxHealth : user.maxHealth,
        healthRegeneration : user.healthRegeneration,
        mana : user.maxMana,
        maxMana : user.maxMana,
        manaRegeneration : user.manaRegeneration,
        speed : 7
      }
      socket.emit("playerID", playerData)

      socket.broadcast.emit("playerCreation",playerData);
      connectedPlayersData[playerData.id] = {};
      connectedPlayersData[playerData.id].gameData = playerData;
      tableOfSockets[playerData.id] = socket;
    }catch(e){
      console.log("\n\n ERROR IN PLAYER CREATION !!!! \n\n" + e);
      socket.emit("alreadyLoggedIn", {
        msg : e
      })
    }

  }

  socket.on("playerCreated", () => {
    socket.emit("addUsers", connectedPlayersData);
    socket.emit("addStatics", statics);
    socket.emit("addEnemies", enemiesData);
  })

  // socket.emit("playerID", {
  //   id : "59fc4d9ab36b8311c9217051"
  // })


});

 // socket.on("playerCreation", (playerData) => { //trigered at the client side creation of user
 //    socket.broadcast.emit("playerCreation",playerData);
 //    socket.emit("addUsers", connectedPlayersData);
 //    socket.emit("addStatics", statics);
 //    socket.emit("addEnemies", enemiesData);
 //    console.log(typeof playerData.id);
 //    console.log(playerData.id);
 //    connectedPlayersData[playerData.id] = {};// TODO DELETE THIS
 //
 //    connectedPlayersData[playerData.id].gameData = playerData;
 //    tableOfSockets[playerData.id] = socket;
 //  });

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
    // console.log(playerData.health);

  //  console.log("PLAYER X FROM userData: " + playerData.x);
    if(connectedPlayersData[playerData.id]){

      connectedPlayersData[playerData.id].gameData.x = playerData.x;
      connectedPlayersData[playerData.id].gameData.y = playerData.y;
      connectedPlayersData[playerData.id].gameData.currentSprite = playerData.currentSprite;
      connectedPlayersData[playerData.id].gameData.rangeOfSeeingWidth = playerData.rangeOfSeeingWidth;
      connectedPlayersData[playerData.id].gameData.rangeOfSeeingHeight = playerData.rangeOfSeeingHeight;
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
        var player = connectedPlayersData[playerID].gameData;
        //console.log(player.mana);
        if(player.health < player.maxHealth){
          player.health += player.healthRegeneration;
        }

        if(player.mana < player.maxMana){
          player.mana += player.manaRegeneration;
        }
        //console.log(player.mana);
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
      setTimeout(async function(){
        for (var playerID in connectedPlayersData) {
            // skip loop if the property is from prototype
            if (!connectedPlayersData.hasOwnProperty(playerID)) continue;



            if(!connectedPlayersData[playerID]) continue;
            var player = connectedPlayersData[playerID];

            if(!connectedPlayersData[playerID].active){
              io.emit("removePlayer", {
                id : playerID
              })

              try {
                var user = await User.findById(playerID);
                user.x = connectedPlayersData[playerID].gameData.x;
                user.y = connectedPlayersData[playerID].gameData.y;
                await user.save();

                console.log("saved statis of :", user._id);
              }catch(e){
                console.log(e);
              }
              // user.level = connectedPlayersData[playerID].gameData.level;
              // user.experience = connectedPlayersData[playerID].gameData.experience;

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
