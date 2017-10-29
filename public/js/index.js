var socket = io(); //socket and Game our global objects;
window.onload = function(){
  socket.on('connect', function () {
    console.log('Connected to server');

    	Game.init();

  });
};





var Game = {
  handler : {
		canvas : undefined,
		ctx : undefined,
		width : undefined,
		height : undefined,
		referencedWidth : undefined,
		currentLevel : undefined,
		camera : undefined,
		levels : [],
		scale : 1.0,
    players : {},
    enemies : {},
    tiles : {},
    character : undefined,


		//technicals
		fps : 20,
		lastTime : 0,
		globalTickCounter : 0, //used only for animations for tiles (nor for mobs)
		menu : {}
	},


  init : function(){
    Game.handler.oldWidthOfMap = null;
		Game.handler.currentWidthOfMap = window.innerWidth;
		Game.handler.oldHeightOfMap = null;
		Game.handler.currentHeightOfMap = window.innerHeight;

    Game.handler.collisionCanvas = document.createElement("canvas");
		Game.handler.collisionCanvas.width = window.innerWidth;
		Game.handler.collisionCanvas.height = window.innerHeight;
		Game.handler.collisionCtx = Game.handler.collisionCanvas.getContext('2d');
		document.body.appendChild(Game.handler.collisionCanvas);




		Game.handler.canvas = document.createElement("canvas");
		Game.handler.canvas.width = window.innerWidth;
		Game.handler.canvas.height = window.innerHeight;
		Game.handler.ctx = Game.handler.canvas.getContext('2d');
		Game.handler.ctx.imageSmoothingEnabled = false;
		Game.handler.ctx.oImageSmoothingEnabled = false;
		Game.handler.ctx.webkitImageSmoothingEnabled = false;
		document.body.appendChild(Game.handler.canvas);

    // Game.handler.collisionCanvas = document.createElement("canvas");
		// Game.handler.collisionCanvas.width = window.innerWidth;
		// Game.handler.collisionCanvas.height = window.innerHeight;
		// Game.handler.collisionCtx = Game.handler.collisionCanvas.getContext('2d');
		// document.body.appendChild(Game.handler.collisionCanvas);

    Game.handler.camera = new Camera();
    Game.handleSockets();
    Game.handleTilesLevelsAndOther();
    Game.mainLoop();
  },
  mainLoop : function(time){
		requestAnimationFrame(Game.mainLoop);



		if(time - Game.handler.lastTime > 1000/Game.handler.fps){

      Game.handler.collisionCtx.fillStyle = "rgba(0,120,120,1.0)";
      Game.handler.collisionCtx.fillRect(0,0,Game.handler.collisionCanvas.width,Game.handler.collisionCanvas.height);


      Game.handler.collisionCtx.fillStyle = "rgba(1,0,0,0.2)";
      // Game.handler.ctx.fillStyle ="rgba(1,0,0)";
      // Game.handler.ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
      Game.handler.lastTime = time;
      Game.handler.currentLevel.tick();

      Game.handler.globalTickCounter += 1;
			Game.drawMenu();


      //console.log(Game.handler.globalTickCounter);

		}
	},
  handleTilesLevelsAndOther : function(){
    Game.handler.tiles.G = new Tile(0,0);
    Game.handler.tiles.D = new Tile(1,0);
    var character = new MainCharacter(Math.floor((Math.random() * 100000) + 1));
    Game.handler.levels.push(new Level(["GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											  			 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											 			 "GGDDDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGDDDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
											   			 "GGGDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
											   			 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
											   			 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
															 "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG"
											   ],[], [character]));
    Game.handler.currentLevel = Game.handler.levels[0];
  },
  handleSockets : function() {

    socket.on("playerCreation", (newPlayerData) => {
      if(!Game.handler.players[newPlayerData.id]){
        console.log("NEW PLAYER HAS BEEN CREATED");
        Game.handler.players[newPlayerData.id] = new OtherPlayer(newPlayerData.id);//adding player to player list
        Game.handler.players[newPlayerData.id].x = newPlayerData.x;
        Game.handler.players[newPlayerData.id].y = newPlayerData.y;
        Game.handler.players[newPlayerData.id].currentSprite = newPlayerData.currentSprite;
        Game.handler.currentLevel.players.push(Game.handler.players[newPlayerData.id]);

        console.log("ALL PLAYERS: ");
        console.log(Game.handler.players);
      }

    });

    socket.on("playerData", (playerData) => {


      for (var playerID in playerData) {
          // skip loop if the property is from prototype
          if (!playerData.hasOwnProperty(playerID)) continue;
          if(!Game.handler.players[playerID]) continue;
          var player = playerData[playerID];

          Game.handler.players[playerID].health = player.health;
          Game.handler.players[playerID].mana = player.mana;
          Game.handler.players[playerID].maxHealth = player.maxHealth;
          Game.handler.players[playerID].maxMana = player.maxMana;
          if(playerID == Game.handler.character.id) continue;
          Game.handler.players[playerID].x = player.x;
          Game.handler.players[playerID].y = player.y;
          Game.handler.players[playerID].renderX = player.x + Game.handler.currentLevel.moveX;
          Game.handler.players[playerID].renderY = player.y + Game.handler.currentLevel.moveY;
          Game.handler.players[playerID].currentSprite = player.currentSprite;
      }
    });

    socket.on("addUsers", (playerData) => {

      for (var playerID in playerData) {
          // skip loop if the property is from prototype
          if (!playerData.hasOwnProperty(playerID)) continue;

          if(playerID == Game.handler.character.id) continue;
          var player = playerData[playerID];
          if(!Game.handler.players[playerID]){
            console.log("NEW PLAYER HAS BEEN ADDED");
            Game.handler.players[playerID] = new OtherPlayer(player.id);//adding player to player list
            Game.handler.players[playerID].x = player.x;
            Game.handler.players[playerID].y = player.y;
            Game.handler.players[playerID].renderX = player.x + Game.handler.currentLevel.moveX;
            Game.handler.players[playerID].renderY = player.y + Game.handler.currentLevel.moveY;
            Game.handler.players[playerID].currentSprite = player.currentSprite;
            Game.handler.currentLevel.players.push(Game.handler.players[playerID]);
            continue;
          }

          Game.handler.players[playerID].x = player.x;
          Game.handler.players[playerID].y = player.y;
          Game.handler.players[playerID].renderX = player.x + Game.handler.currentLevel.moveX;
          Game.handler.players[playerID].renderY = player.y + Game.handler.currentLevel.moveY;
          Game.handler.players[playerID].currentSprite = player.currentSprite;
      }
    });

    socket.on('disconnect', function () {
      console.log('Disconnected from server');
    });

    socket.on("removePlayer", function(playerData){
      delete Game.handler.players[playerData.id];
      Game.handler.currentLevel.players = Game.handler.currentLevel.players.filter((player) => {
        if(player.id == Game.handler.character.id) return true;
        return player.id != playerData.id;
      });
      console.log("User " + playerData.id + " was disconnected");
    })

    socket.on("checkForConnection", () => {
      socket.emit("checkedConnection", {
        id : Game.handler.character.id
      } );
    })

    socket.on("addStatics", (staticData) => {

      for(var i=0;i<staticData.length;i++){
        if(staticData[i].type == "tree"){
          Game.handler.currentLevel.statics.push(new Tree(staticData[i].x, staticData[i].y));
        }else if(staticData[i].type == "house1"){
          Game.handler.currentLevel.statics.push(new House1(staticData[i].x, staticData[i].y));
        }else if(staticData[i].type == "house2"){
          Game.handler.currentLevel.statics.push(new House2(staticData[i].x, staticData[i].y));
        }
      }
   });

    socket.on("enemyTick", (enemyData) => {


      if(Game.handler.enemies[enemyData.id]){

        if(Game.handler.enemies[enemyData.id].renderX){
          Game.handler.enemies[enemyData.id].renderX += enemyData.x - Game.handler.enemies[enemyData.id].x;
          Game.handler.enemies[enemyData.id].renderY += enemyData.y - Game.handler.enemies[enemyData.id].y;
        }else{
          Game.handler.enemies[enemyData.id].renderX = enemyData.x + Game.handler.currentLevel.moveX;
          Game.handler.enemies[enemyData.id].renderY = enemyData.y + Game.handler.currentLevel.moveY;
        }
        Game.handler.enemies[enemyData.id].x = enemyData.x;
        Game.handler.enemies[enemyData.id].y = enemyData.y;
        Game.handler.enemies[enemyData.id].health = enemyData.health;
        Game.handler.enemies[enemyData.id].currentSprite = enemyData.currentSprite;
      }


    });

    socket.on("addEnemies", (enemyData) => {
      for(var i=0;i<enemyData.length;i++){
        if(enemyData[i].type == "hit"){
          Game.handler.enemies[(enemyData[i].id)] = new Hit(enemyData[i].id,enemyData[i].x, enemyData[i].y);
          Game.handler.currentLevel.enemies.push(Game.handler.enemies[enemyData[i].id]);
        }else if(enemyData[i].type == "hulk"){
          Game.handler.enemies[(enemyData[i].id)] = new Hulk(enemyData[i].id,enemyData[i].x, enemyData[i].y);
          Game.handler.currentLevel.enemies.push(Game.handler.enemies[enemyData[i].id]);
        }
      }
    });

    socket.on("removeEnemy", (data) => {

      delete this.handler.enemies[data.id];


    });


  },
	drawMenu : function(){


	}
}
