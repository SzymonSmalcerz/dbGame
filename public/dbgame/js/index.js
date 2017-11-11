var socket = socket || io();
console.log(playerID);
window.onload = function(){

  socket.on('connect', function () {
    console.log('Connected to server');
    socket.emit("getPlayerID",{
      id : playerID
    });
    socket.on("playerID",(playerData) => {
      Game.createMainCharacter(playerData);
      Game.handler.currentLevel = new Level(playerData.currentMapLevel);
      Game.init();
      socket.on("playerID", () => {
        console.log("DO NOTHING !!!!");
      })
    })
    socket.on("alreadyLoggedIn", (data) => {
      alert(data.msg);
    })
  });
};





const Game = {
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
    skillTable : {},
    tiles : {},
    character : undefined,
    gameCanvasesWidth : window.innerWidth,
    gameCanvasesHeight : window.innerHeight,


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


    Game.handler.collisionCanvas = document.getElementById("ccoll");
    if(!Game.handler.collisionCanvas){
      Game.handler.collisionCanvas = document.createElement("canvas");
      Game.handler.collisionCanvas.setAttribute("id", "ccoll");
    }

    Game.handler.collisionCtx = Game.handler.collisionCanvas.getContext('2d');

    Game.handler.collisionCanvas.width = window.innerWidth;
    Game.handler.collisionCanvas.height = window.innerHeight;
    document.body.appendChild(Game.handler.collisionCanvas);
    //item canvas
    Game.handler.itemCanvas = document.getElementById("citem");
    if(!Game.handler.itemCanvas){
      Game.handler.itemCanvas = document.createElement("canvas");
      Game.handler.itemCanvas.setAttribute("id", "ccoll");
    }
    Game.handler.itemCtx = Game.handler.itemCanvas.getContext('2d');
    Game.handler.itemCanvas.width = window.innerWidth;
    Game.handler.itemCanvas.height = window.innerHeight;
    document.body.appendChild(Game.handler.itemCanvas);
    //eq canvas
    Game.handler.eqCanvas = document.getElementById("ceq");
    if(!Game.handler.eqCanvas){
      Game.handler.eqCanvas = document.createElement("canvas");
      Game.handler.eqCanvas.setAttribute("id", "ccoll");
    }
    Game.handler.eqCtx = Game.handler.eqCanvas.getContext('2d');
    Game.handler.eqCanvas.width = window.innerWidth;
    Game.handler.eqCanvas.height = window.innerHeight;
    document.body.appendChild(Game.handler.eqCanvas);
    Game.handler.eqCanvas.style.display = "none";

    //main canvas
    Game.handler.canvas = document.getElementById("cnorm");
    if(!Game.handler.canvas){

  		Game.handler.canvas = document.createElement("canvas");
      Game.handler.canvas.setAttribute("id", "cnorm");
    }

    Game.handler.ctx = Game.handler.canvas.getContext('2d');
    Game.handler.ctx.imageSmoothingEnabled = false;
    Game.handler.ctx.oImageSmoothingEnabled = false;
    Game.handler.ctx.webkitImageSmoothingEnabled = false;

    Game.handler.canvas.width = window.innerWidth;
    Game.handler.canvas.height = window.innerHeight;
    document.body.appendChild(Game.handler.canvas);

    // Game.handler.collisionCanvas = document.createElement("canvas");
		// Game.handler.collisionCanvas.width = window.innerWidth;
		// Game.handler.collisionCanvas.height = window.innerHeight;
		// Game.handler.collisionCtx = Game.handler.collisionCanvas.getContext('2d');
		// document.body.appendChild(Game.handler.collisionCanvas);

    Game.handler.gameCanvasesWidth = window.innerWidth;
    Game.handler.gameCanvasesHeight = window.innerHeight;
    Game.handler.camera = new Camera();
    Game.handler.menu.headImage = new Image();
    Game.handler.ctx.fillStyle = "rgb(120,120,120)";
    Game.handler.ctx.fillRect(0,0,Game.handler.canvas.width,Game.handler.canvas.height);
		Game.handler.menu.headImage.src = "dbgame/js/dragonBallGame/sprites/gokuHead.png";
    Game.handler.ctx.drawImage(Game.handler.menu.headImage,0,0,256,256,window.innerWidth/2 - 128,window.innerHeight/2 - 128 ,256 ,256 );
    Game.handleSockets();
    Game.handleTilesLevelsAndOther();
    Game.handleMoveXandMoveY();
    socket.emit("initialized", (this.handler.character.id));
    socket.on("permissionToLoop", function() {
      setTimeout(Game.mainLoop,500);
    });
  },
  mainLoop : function(time){
		requestAnimationFrame(Game.mainLoop);



		if(time - Game.handler.lastTime > 1000/Game.handler.fps){
      Game.handler.itemCtx.fillStyle = "rgba(0,0,0,1.0)";
      Game.handler.itemCtx.fillRect(0,0,Game.handler.itemCanvas.width,Game.handler.itemCanvas.height);
      Game.handler.collisionCtx.fillStyle = "rgba(0,120,120,1.0)";
      Game.handler.collisionCtx.fillRect(0,0,Game.handler.collisionCanvas.width,Game.handler.collisionCanvas.height);
      Game.handler.collisionCtx.fillStyle = "rgba(1,0,0,0.2)";
      Game.handler.lastTime = time;
      Game.handler.currentLevel.tick();

      Game.handler.globalTickCounter += 1;
			Game.drawMenu();

		}
	},
  drawMenu : function(){

			var player = Game.handler.character;

      //draw image
			Game.handler.ctx.drawImage(Game.handler.menu.headImage,0,0,256,256,window.innerWidth/100,window.innerHeight - 150 ,128 ,128 );


      //draw player health
			Game.handler.ctx.fillStyle = "rgb(90,0,0)";
			Game.handler.ctx.fillRect(140  ,window.innerHeight - 64 , window.innerWidth/6,	Math.min(10,Math.max(Math.floor(player.height/2),7)));
			Game.handler.ctx.fillStyle = "rgb(255,0,0)";
			Game.handler.ctx.fillRect(140  ,window.innerHeight - 64 , window.innerWidth/6 * player.health/player.maxHealth,	Math.min(8,Math.max(Math.floor(player.height/2),5)));


      //draw player mana
      Game.handler.ctx.fillStyle = "rgb(0,0,20)";
			Game.handler.ctx.fillRect(140  ,window.innerHeight - 48 , window.innerWidth/10,	Math.min(10,Math.max(Math.floor(player.height/2),4)));
			var manaColor = 150;
			if( player.isRegeneratingMana){
				manaColor = Math.floor(Math.random()*(255-225) + 225);
			}
			Game.handler.ctx.fillStyle = "rgb(0," + (manaColor - 150) + "," + manaColor + ")";
			Game.handler.ctx.fillRect(140  ,window.innerHeight - 48 , window.innerWidth/10 * player.mana/player.maxMana,	Math.min(8,Math.max(Math.floor(player.height/3),3)));

      //draw player experience
			Game.handler.ctx.fillStyle = "rgb(125,125,50)";
			Game.handler.ctx.fillRect(140  ,window.innerHeight - 80 , window.innerWidth/6,	Math.min(10,Math.max(Math.floor(player.height/2),7)));
			Game.handler.ctx.fillStyle = "rgb(250,250,100)";
			Game.handler.ctx.fillRect(140  ,window.innerHeight - 80 , window.innerWidth/6 * (player.experience/player.requiredExperience),	Math.min(8,Math.max(Math.floor(player.height/2),5)));

      //fonts etc TODO !!!! zrob to duuzo ladniej ! za duzo liczenia w tym momencie :C
      Game.handler.ctx.font = Math.min(10,Math.max(Math.floor(player.height/2),7)) + "px Arial";
      Game.handler.ctx.fillStyle = "rgb(0,0,0)";

      Game.handler.ctx.fillText("exp : " + player.experience + "/" + player.requiredExperience,150,window.innerHeight - 80 + Math.min(7,Math.max(Math.floor(player.height/2),5)) );

      Game.handler.ctx.fillText("hp  : " + Math.floor(player.health) + "/" + player.maxHealth,150,window.innerHeight - 64 + Math.min(7,Math.max(Math.floor(player.height/2),5)) );

      Game.handler.ctx.fillText("mana: " + Math.floor(player.mana) + "/" + player.maxMana,150,window.innerHeight - 48 + Math.min(7,Math.max(Math.floor(player.height/2),5)) );


      Game.handler.ctx.font = "20px Arial";
      Game.handler.ctx.fillText("lv: " + player.level,150,window.innerHeight - 100 + Math.min(7,Math.max(Math.floor(player.height/2),5)) );

  },
  createMainCharacter : function(playerData) {
    this.handler.character = new MainCharacter(playerData);
  },
  handleMoveXandMoveY(){
    var player = this.handler.character;
    var level  = this.handler.currentLevel;

    while(player.renderY + player.height - player.speed >= Math.floor(this.handler.gameCanvasesHeight/2) + 1 ){
      if(player.y + this.handler.gameCanvasesHeight/2 + player.height >= level.heightOfMap *  TileStatic.height && player.renderY + player.height <= this.handler.gameCanvasesHeight){
        level.moveY -= level.heightOfMap *  TileStatic.height - (player.y + player.height + player.speed);
        player.renderY -= level.heightOfMap *  TileStatic.height - (player.y + player.height + player.speed);
        console.log("break1!");
        break;
      }
      level.moveY -= player.speed;
      player.renderY -= player.speed;
  	}

    while(player.renderX + player.width/2 - player.speed >= Math.floor(this.handler.gameCanvasesWidth/2) + 1 ){
      if(player.x + this.handler.gameCanvasesWidth/2 + player.width  >= level.widthOfMap *  TileStatic.width &&player.renderX + player.width <= this.handler.gameCanvasesWidth){
        level.moveX -= level.widthOfMap *  TileStatic.width - (player.x + player.width + player.speed);
        player.renderX -= level.widthOfMap *  TileStatic.width - (player.x + player.width + player.speed);
        console.log("break2!");
        break;
      }
      level.moveX -= player.speed;
      player.renderX -= player.speed;
  	}

    for(var i=0;i<level.allEntities.length;i++){
      if(level.allEntities[i] !== player){
        level.allEntities[i].renderX = level.allEntities[i].x + level.moveX;
        level.allEntities[i].renderY = level.allEntities[i].y + level.moveY;
      }
    }
  },
  handleTilesLevelsAndOther : function(){
    Game.handler.tiles.G = new Tile(0,0);
    Game.handler.tiles.D = new Tile(1,0);
    Game.handler.tiles.S = new Tile(5,0);
    Game.handler.tiles.L = new Tile(6,0);
    Game.handler.tiles.P = new Tile(7,0);

  },

  addEnemies : function (type,numberOfEnemies) {
    type = type || "hit",
    numberOfEnemies = numberOfEnemies || 20;
    socket.emit("addEnemies", {
      type,
      numberOfEnemies
    });
  },
  handleSockets : function() {

    socket.on("playerCreation", (newPlayerData) => {

      var playerID = newPlayerData.id;
      if(!Game.handler.players[playerID]){
        console.log("NEW PLAYER HAS BEEN CREATED");
        Game.handler.players[playerID] = new OtherPlayer(playerID);//adding player to player list
        Game.handler.players[playerID].x = newPlayerData.x;
        Game.handler.players[playerID].y = newPlayerData.y;
        Game.handler.players[playerID].currentSprite = newPlayerData.currentSprite;
        Game.handler.currentLevel.players.push(Game.handler.players[playerID]);

        console.log("ALL PLAYERS: ");
        console.log(Game.handler.players);
      }

    });

    socket.on("playerData", (playerData) => {


      for (var playerID in playerData) {
          // skip loop if the property is from prototype
          if (!playerData.hasOwnProperty(playerID)) continue;
          if(!Game.handler.players[playerID]) continue;
          var player = playerData[playerID].gameData;

          Game.handler.players[playerID].health = player.health;
          Game.handler.players[playerID].mana = player.mana;
          Game.handler.players[playerID].maxHealth = player.maxHealth;
          Game.handler.players[playerID].maxMana = player.maxMana;

          Game.handler.players[playerID].width = player.width;
          Game.handler.players[playerID].height = player.height;
          Game.handler.players[playerID].collisionWidth = player.collisionWidth;
          Game.handler.players[playerID].collisionHeight = player.collisionHeight;
          Game.handler.players[playerID].level = player.level;

          if(playerID == Game.handler.character.id){
            Game.handler.players[playerID].experience = player.experience;
            Game.handler.players[playerID].requiredExperience = player.requiredExperience;
            Game.handler.players[playerID].speed = player.speed;
             continue;
          }
          Game.handler.players[playerID].x = player.x;
          Game.handler.players[playerID].y = player.y;
          Game.handler.players[playerID].renderX = player.x + Game.handler.currentLevel.moveX;
          Game.handler.players[playerID].renderY = player.y + Game.handler.currentLevel.moveY;
          Game.handler.players[playerID].currentSprite = player.currentSprite;
      }
    });

    socket.on("addUsers", (playerData) => {
      Game.handler.players = {};
      Game.handler.players[Game.handler.character.id] = Game.handler.character;
      for (var playerID in playerData) {
          // skip loop if the property is from prototype
          if (!playerData.hasOwnProperty(playerID)) continue;

          if(playerID == Game.handler.character.id) continue;
          var player = playerData[playerID].gameData;
          if(!Game.handler.players[playerID]){
            console.log("NEW PLAYER HAS BEEN ADDED");
            Game.handler.players[playerID] = new OtherPlayer(player.id);//adding player to player list
            Game.handler.players[playerID].x = player.x;
            Game.handler.players[playerID].y = player.y;
            Game.handler.players[playerID].level = player.level;
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
        var staticEntity;
        if(staticData[i].type == "tree"){
          staticEntity = new Tree(staticData[i].x, staticData[i].y);
        }else if(staticData[i].type == "house1"){
          staticEntity = new House1(staticData[i].x, staticData[i].y);
        }else if(staticData[i].type == "house2"){
          staticEntity = new House2(staticData[i].x, staticData[i].y);
        }else if(staticData[i].type == "skeleton1"){
          staticEntity = new Skeleton1(staticData[i].x, staticData[i].y);
        }else if(staticData[i].type == "skeleton2"){
          staticEntity = new Skeleton2(staticData[i].x, staticData[i].y);
        }else if(staticData[i].type == "skeleton3"){
          staticEntity = new Skeleton3(staticData[i].x, staticData[i].y);
        }else if(staticData[i].type == "bigSkeleton1"){
          staticEntity = new BigSkeleton1(staticData[i].x, staticData[i].y);
        }else if(staticData[i].type == "rock1"){
          staticEntity = new Rock1(staticData[i].x, staticData[i].y);
        }else if(staticData[i].type == "dessertPlant1"){
          staticEntity = new DessertPlant1(staticData[i].x, staticData[i].y);
        }else if(staticData[i].type == "dessertPlant2"){
          staticEntity = new DessertPlant2(staticData[i].x, staticData[i].y);
        }else if(staticData[i].type == "cactus1"){
          staticEntity = new Cactus1(staticData[i].x, staticData[i].y);
        }else if(staticData[i].type == "dessertSign"){
          staticEntity = new DessertSign(staticData[i].x, staticData[i].y);
        }else{
          continue;
        }

        staticEntity.renderX += Game.handler.currentLevel.moveX;
        staticEntity.renderY += Game.handler.currentLevel.moveY;
        Game.handler.currentLevel.statics.push(staticEntity);
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
        Game.handler.enemies[enemyData.id].maxHealth = enemyData.maxHealth;
        Game.handler.enemies[enemyData.id].mana = enemyData.mana;
        Game.handler.enemies[enemyData.id].maxMana = enemyData.maxMana;
        Game.handler.enemies[enemyData.id].speed = enemyData.speed;
        Game.handler.enemies[enemyData.id].width = enemyData.width;
        Game.handler.enemies[enemyData.id].height = enemyData.height;
        Game.handler.enemies[enemyData.id].collisionHeight = enemyData.collisionHeight;
        Game.handler.enemies[enemyData.id].collisionWidth = enemyData.collisionWidth;
        Game.handler.enemies[enemyData.id].currentSprite = enemyData.currentSprite;
      }


    });

    socket.on("pushNewEnemy", (enemyData) => {
      if(!Game.handler.enemies[(enemyData.id)]){
        if(enemyData.type == "hit"){
          Game.handler.enemies[(enemyData.id)] = new Hit(enemyData.id,enemyData.x, enemyData.y);
          Game.handler.enemies[(enemyData.id)].renderX += Game.handler.currentLevel.moveX;
          Game.handler.enemies[(enemyData.id)].renderY += Game.handler.currentLevel.moveY;
          Game.handler.currentLevel.enemies.push(Game.handler.enemies[enemyData.id]);
        }else if(enemyData.type == "hulk"){
          Game.handler.enemies[(enemyData.id)] = new Hulk(enemyData.id,enemyData.x, enemyData.y);
          Game.handler.enemies[(enemyData.id)].renderX += Game.handler.currentLevel.moveX;
          Game.handler.enemies[(enemyData.id)].renderY += Game.handler.currentLevel.moveY;
          Game.handler.currentLevel.enemies.push(Game.handler.enemies[enemyData.id]);
        }else if(enemyData.type == "dragon"){
          Game.handler.enemies[(enemyData.id)] = new Dragon(enemyData.id,enemyData.x, enemyData.y);
          Game.handler.enemies[(enemyData.id)].renderX += Game.handler.currentLevel.moveX;
          Game.handler.enemies[(enemyData.id)].renderY += Game.handler.currentLevel.moveY;
          Game.handler.currentLevel.enemies.push(Game.handler.enemies[enemyData.id]);
        }else if(enemyData.type == "yeti"){
          Game.handler.enemies[(enemyData.id)] = new Yeti(enemyData.id,enemyData.x, enemyData.y);
          Game.handler.enemies[(enemyData.id)].renderX += Game.handler.currentLevel.moveX;
          Game.handler.enemies[(enemyData.id)].renderY += Game.handler.currentLevel.moveY;
          Game.handler.currentLevel.enemies.push(Game.handler.enemies[enemyData.id]);
        }
      }
    })

    socket.on("addEnemies", (enemyData) => {
      delete Game.handler.enemies;
      Game.handler.enemies = {};
      for(var i=0;i<enemyData.length;i++){
        if(!Game.handler.enemies[(enemyData[i].id)]){
          if(enemyData[i].type == "hit"){
            Game.handler.enemies[(enemyData[i].id)] = new Hit(enemyData[i].id,enemyData[i].x, enemyData[i].y);
            Game.handler.enemies[(enemyData[i].id)].renderX += Game.handler.currentLevel.moveX;
            Game.handler.enemies[(enemyData[i].id)].renderY += Game.handler.currentLevel.moveY;
            Game.handler.currentLevel.enemies.push(Game.handler.enemies[enemyData[i].id]);
          }else if(enemyData[i].type == "hulk"){
            Game.handler.enemies[(enemyData[i].id)] = new Hulk(enemyData[i].id,enemyData[i].x, enemyData[i].y);
            Game.handler.enemies[(enemyData[i].id)].renderX += Game.handler.currentLevel.moveX;
            Game.handler.enemies[(enemyData[i].id)].renderY += Game.handler.currentLevel.moveY;
            Game.handler.currentLevel.enemies.push(Game.handler.enemies[enemyData[i].id]);
          }else if(enemyData[i].type == "dragon"){
            Game.handler.enemies[(enemyData[i].id)] = new Dragon(enemyData[i].id,enemyData[i].x, enemyData[i].y);
            Game.handler.enemies[(enemyData[i].id)].renderX += Game.handler.currentLevel.moveX;
            Game.handler.enemies[(enemyData[i].id)].renderY += Game.handler.currentLevel.moveY;
            Game.handler.currentLevel.enemies.push(Game.handler.enemies[enemyData[i].id]);
          }else if(enemyData[i].type == "yeti"){
            Game.handler.enemies[(enemyData[i].id)] = new Yeti(enemyData[i].id,enemyData[i].x, enemyData[i].y);
            Game.handler.enemies[(enemyData[i].id)].renderX += Game.handler.currentLevel.moveX;
            Game.handler.enemies[(enemyData[i].id)].renderY += Game.handler.currentLevel.moveY;
            Game.handler.currentLevel.enemies.push(Game.handler.enemies[enemyData[i].id]);
          }
        }
      }
    });

    socket.on("removeEnemy", (data) => {

      delete this.handler.enemies[data.id];

    });

    socket.on("skillData", (skillData) => {
      if(!this.handler.skillTable[skillData.id]){
          this.handler.skillTable[skillData.id] = new KamehamehaWave(skillData.x, skillData.y, skillData.turn);
          this.handler.skillTable[skillData.id].frameTable = skillData.frameTable;
          this.handler.skillTable[skillData.id].renderX = skillData.x + this.handler.currentLevel.moveX;
          this.handler.skillTable[skillData.id].renderY = skillData.y + this.handler.currentLevel.moveY;
      }else{
          this.handler.skillTable[skillData.id].renderX += skillData.x - this.handler.skillTable[skillData.id].x;
          this.handler.skillTable[skillData.id].renderY += skillData.y - this.handler.skillTable[skillData.id].y;
          this.handler.skillTable[skillData.id].x = skillData.x;
          this.handler.skillTable[skillData.id].y = skillData.y;
          this.handler.skillTable[skillData.id].frameTable = skillData.frameTable;

      }


    });

    socket.on("removeSkill", (skillData) => {
      if(this.handler.skillTable[skillData.id]){
        delete this.handler.skillTable[skillData.id];
      }
    });

    socket.on("changeMapLevel", (data) => {
      delete this.handler.currentLevel;
      this.handler.currentLevel = new Level(data.levelData);

      this.handler.currentLevel.moveX = data.moveX;
      this.handler.currentLevel.moveY = data.moveY;
      this.handler.character.x = data.playerNewX;
      this.handler.character.y = data.playerNewY;
      this.handler.character.renderX = data.playerNewX;
      this.handler.character.renderY = data.playerNewY;


      this.handleMoveXandMoveY();
    })


  },

  setWidthAndHeightOfCanvases : function(){
    this.handler.canvas.width = this.handler.gameCanvasesWidth;
    this.handler.canvas.height = this.handler.gameCanvasesHeight;
    this.handler.collisionCanvas.width = this.handler.gameCanvasesWidth;
    this.handler.collisionCanvas.height = this.handler.gameCanvasesHeight;
    this.handler.itemCanvas.height = this.handler.gameCanvasesHeight;
    this.handler.eqCanvas.width = this.handler.gameCanvasesWidth;
    this.handler.eqCanvas.height = this.handler.gameCanvasesHeight;
    this.handler.itemCanvas.width = this.handler.gameCanvasesWidth;
  }
}

window.addEventListener("click", function(event){
  var x = event.clientX;
  var y = event.clientY;
  var data = Game.handler.itemCtx.getImageData(x,y,1,1).data[0];
  if(data != 0){
    console.log("WOOORKING :3");
  }

});


window.addEventListener("resize", function(){
  var temp = 0;
  if(Game.handler.eqCanvas.style.display == "block"){
    temp = 200;
  }

  Game.handler.gameCanvasesWidth += window.innerWidth - Game.handler.gameCanvasesWidth - temp;
  Game.handler.gameCanvasesHeight += window.innerHeight - Game.handler.gameCanvasesHeight;
  Game.setWidthAndHeightOfCanvases();

  Game.handler.currentLevel.moveX = 0;
  Game.handler.currentLevel.moveY = 0;
  Game.handler.character.renderX = Game.handler.character.x;
  Game.handler.character.renderY = Game.handler.character.y;

  Game.handleMoveXandMoveY();


});

window.addEventListener("keypress", function(event){
  var char = event.key;

  if(char === "i"){

    if(Game.handler.eqCanvas.style.display == "none"){
      Game.handler.gameCanvasesWidth = Game.handler.gameCanvasesWidth - 200;
      Game.setWidthAndHeightOfCanvases();
      Game.handler.eqCanvas.style.display = "block";
    }else{
      Game.handler.gameCanvasesWidth = Game.handler.gameCanvasesWidth + 200;
      Game.setWidthAndHeightOfCanvases();
      Game.handler.eqCanvas.style.display = "none";
    }

    Game.setWidthAndHeightOfCanvases();
    Game.handler.currentLevel.moveX = 0;
    Game.handler.currentLevel.moveY = 0;
    Game.handler.character.renderX = Game.handler.character.x;
    Game.handler.character.renderY = Game.handler.character.y;

    Game.handleMoveXandMoveY();
  }
});
