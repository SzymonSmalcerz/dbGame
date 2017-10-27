// const {io} = require("./server");

var {Enemy,Hit, Hulk} = require("./serverSideEnemy");
var {io} = require("./server");

Static = {
  getTreeData : function(x,y){
    return {

        type : "tree",
        x : x,
        y: y,
        collisionHeight : 64/8,//collision height
        collisionWidth : 128/3, //collision width
        width : 128, //width
        height : 128//height

    }
  },getHouse1Data : function(x,y){
    return {

        type : "house1",
        x : x,
        y: y,
        collisionHeight : 128/5,//collision height
        collisionWidth : 128/1.05, //collision width
        width : 128, //width
        height : 128//height

    }
  },getHouse2Data : function(x,y){
    return {

        type : "house2",
        x : x,
        y: y,
        collisionHeight : 210/5,//collision height
        collisionWidth : 128*0.87, //collision width
        width : 128, //width
        height : 210//height

    }
  }
}

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
var hitsIds = [1,2,3];
var hulksIds = [101,102,103];

var hit1;
var hit2;
var hit3;
var hulk1;

var entitiesCreated = false;
var handleSocketsWork = (socket,io) => {

if(!entitiesCreated){
  hit1 = new Hit(hitsIds[0],750,100,connectedPlayersData,enemiesData,statics,io);
  hit2 = new Hit(hitsIds[1],750,190,connectedPlayersData,enemiesData,statics,io);
  hit3 = new Hit(hitsIds[2],850,130,connectedPlayersData,enemiesData,statics,io);
  hulk1 = new Hulk(hulksIds[1],150,100,connectedPlayersData,enemiesData,statics,io);
  entitiesCreated = true;
  console.log("CREATED ENTITIES");
}
var enemies = [hulk1,hit1,hit2,hit3];



function updateEnemyData(){
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




  socket.on("playerCreation", (playerData) => { //trigered at the client side creation of user
    socket.broadcast.emit("playerCreation",playerData);
    socket.emit("addUsers", connectedPlayersData);
    socket.emit("addStatics", statics);
    socket.emit("addEnemies", enemiesData);
  });



  // socket.on('disconnect', () => {
  //   console.log('User was disconnected');
  // });



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


    if(time - lastTime > 1000/20){
      updateEnemyData();
      enemies.forEach(enemy => enemy.tick());
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
  connectedPlayersData,
  Static
}
