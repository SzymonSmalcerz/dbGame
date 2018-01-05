class SocketHandler{
  constructor(handler){
    this.handler = handler;
  }

  setSockets(){

        //we must do copy of handler, in other way this.handler does not work (this is not in SocketHandler scope)
        //unless we use arrow functions (which do not bind) but arrow function are nor supported in all browsers
        //that is why in client side we use only normal functions, not arrow functions :).
        var handler = this.handler;
        socket.on("playerCreation", function(newPlayerData){

        var playerID = newPlayerData.id;
        if(!handler.players[playerID]){
          console.log("NEW PLAYER HAS BEEN CREATED");
          handler.players[playerID] = new OtherPlayer(playerID);//adding player to player list
          handler.players[playerID].x = newPlayerData.x;
          handler.players[playerID].y = newPlayerData.y;
          handler.players[playerID].currentSprite = newPlayerData.currentSprite;
          handler.currentLevel.players.push(handler.players[playerID]);

          console.log("ALL PLAYERS: ");
          console.log(handler.players);
        }

      });

      socket.on("playerData", function(playerData){


        for (var playerID in playerData) {
            // skip loop if the property is from prototype
            if (!playerData.hasOwnProperty(playerID)) continue;
            if(!handler.players[playerID]) continue;
            var player = playerData[playerID].gameData;

            handler.players[playerID].health = player.health;
            handler.players[playerID].mana = player.mana;
            handler.players[playerID].maxHealth = player.maxHealth;
            handler.players[playerID].maxMana = player.maxMana;

            handler.players[playerID].width = player.width;
            handler.players[playerID].height = player.height;
            handler.players[playerID].collisionWidth = player.collisionWidth;
            handler.players[playerID].collisionHeight = player.collisionHeight;
            handler.players[playerID].level = player.level;

            if(playerID == handler.character.id){
              handler.players[playerID].experience = player.experience;
              handler.players[playerID].requiredExperience = player.requiredExperience;
              handler.players[playerID].speed = player.speed;
               continue;
            }
            handler.players[playerID].x = player.x;
            handler.players[playerID].y = player.y;
            handler.players[playerID].renderX = player.x + handler.currentLevel.moveX;
            handler.players[playerID].renderY = player.y + handler.currentLevel.moveY;
            handler.players[playerID].currentSprite = player.currentSprite;
        }
      });

      socket.on("addUsers", function(playerData){
        handler.players = {};
        handler.players[handler.character.id] = handler.character;
        for (var playerID in playerData) {
            // skip loop if the property is from prototype
            if (!playerData.hasOwnProperty(playerID)) continue;

            if(playerID == handler.character.id) continue;
            var player = playerData[playerID].gameData;
            if(!handler.players[playerID]){
              console.log("NEW PLAYER HAS BEEN ADDED");
              handler.players[playerID] = new OtherPlayer(player.id);//adding player to player list
              handler.players[playerID].x = player.x;
              handler.players[playerID].y = player.y;
              handler.players[playerID].level = player.level;
              handler.players[playerID].renderX = player.x + handler.currentLevel.moveX;
              handler.players[playerID].renderY = player.y + handler.currentLevel.moveY;
              handler.players[playerID].currentSprite = player.currentSprite;
              handler.currentLevel.players.push(handler.players[playerID]);
              continue;
            }

            handler.players[playerID].x = player.x;
            handler.players[playerID].y = player.y;
            handler.players[playerID].renderX = player.x + handler.currentLevel.moveX;
            handler.players[playerID].renderY = player.y + handler.currentLevel.moveY;
            handler.players[playerID].currentSprite = player.currentSprite;
        }
      });

      socket.on('disconnect', function () {
        console.log('Disconnected from server');
      });

      socket.on("removePlayer", function(playerData) {
        console.log(handler);

        delete handler.players[playerData.id];
          console.log(handler.players);
        handler.currentLevel.players = handler.currentLevel.players.filter((player) => {
          if(player.id == handler.character.id) return true;
          return player.id != playerData.id;
        });
        console.log("User " + playerData.id + " was disconnected");
      })

      socket.on("checkForConnection", () => {
        socket.emit("checkedConnection", {
          id : handler.character.id
        } );
      })

      socket.on("addStatics", function(staticData) {

        for(var i=0;i<staticData.length;i++){
          var staticEntity;

            if(staticData[i].typeOfSprite == "32"){
              staticEntity = new StaticEntity32(staticData[i]);
            }else{
              staticEntity = new StaticEntity(staticData[i]);
            }


          staticEntity.renderX += handler.currentLevel.moveX;
          staticEntity.renderY += handler.currentLevel.moveY;
          handler.currentLevel.statics.push(staticEntity);
        }
     });

      socket.on("enemyTick", function(enemyData) {


        if(handler.enemies[enemyData.id]){
          if(handler.enemies[enemyData.id].renderX){
            handler.enemies[enemyData.id].renderX += enemyData.x - handler.enemies[enemyData.id].x;
            handler.enemies[enemyData.id].renderY += enemyData.y - handler.enemies[enemyData.id].y;
          }else{
            handler.enemies[enemyData.id].renderX = enemyData.x + handler.currentLevel.moveX;
            handler.enemies[enemyData.id].renderY = enemyData.y + handler.currentLevel.moveY;
          }

          handler.enemies[enemyData.id].x = enemyData.x;
          handler.enemies[enemyData.id].y = enemyData.y;
          handler.enemies[enemyData.id].health = enemyData.health;
          handler.enemies[enemyData.id].maxHealth = enemyData.maxHealth;
          handler.enemies[enemyData.id].mana = enemyData.mana;
          handler.enemies[enemyData.id].maxMana = enemyData.maxMana;
          handler.enemies[enemyData.id].speed = enemyData.speed;
          handler.enemies[enemyData.id].width = enemyData.width;
          handler.enemies[enemyData.id].height = enemyData.height;
          handler.enemies[enemyData.id].collisionHeight = enemyData.collisionHeight;
          handler.enemies[enemyData.id].collisionWidth = enemyData.collisionWidth;
          handler.enemies[enemyData.id].currentSprite = enemyData.currentSprite;
        }


      });

      socket.on("pushNewEnemy", function(enemyData) {
        if(!handler.enemies[(enemyData.id)]){
          if(enemyData.type == "hit"){
            handler.enemies[(enemyData.id)] = new Hit(enemyData.id,enemyData.x, enemyData.y);
            handler.enemies[(enemyData.id)].renderX += handler.currentLevel.moveX;
            handler.enemies[(enemyData.id)].renderY += handler.currentLevel.moveY;
            handler.currentLevel.enemies.push(handler.enemies[enemyData.id]);
          }else if(enemyData.type == "darkKnight"){
            handler.enemies[(enemyData.id)] = new DarkKnight(enemyData.id,enemyData.x, enemyData.y);
            handler.enemies[(enemyData.id)].renderX += handler.currentLevel.moveX;
            handler.enemies[(enemyData.id)].renderY += handler.currentLevel.moveY;
            handler.currentLevel.enemies.push(handler.enemies[enemyData.id]);
          }else if(enemyData.type == "hulk"){
            handler.enemies[(enemyData.id)] = new Hulk(enemyData.id,enemyData.x, enemyData.y);
            handler.enemies[(enemyData.id)].renderX += handler.currentLevel.moveX;
            handler.enemies[(enemyData.id)].renderY += handler.currentLevel.moveY;
            handler.currentLevel.enemies.push(handler.enemies[enemyData.id]);
          }else if(enemyData.type == "minionSkeleton"){
            handler.enemies[(enemyData.id)] = new MinionSkeleton(enemyData.id,enemyData.x, enemyData.y);
            handler.enemies[(enemyData.id)].renderX += handler.currentLevel.moveX;
            handler.enemies[(enemyData.id)].renderY += handler.currentLevel.moveY;
            handler.currentLevel.enemies.push(handler.enemies[enemyData.id]);
          }else if(enemyData.type == "dragon"){
            handler.enemies[(enemyData.id)] = new Dragon(enemyData.id,enemyData.x, enemyData.y);
            handler.enemies[(enemyData.id)].renderX += handler.currentLevel.moveX;
            handler.enemies[(enemyData.id)].renderY += handler.currentLevel.moveY;
            handler.currentLevel.enemies.push(handler.enemies[enemyData.id]);
          }else if(enemyData.type == "yeti"){
            handler.enemies[(enemyData.id)] = new Yeti(enemyData.id,enemyData.x, enemyData.y);
            handler.enemies[(enemyData.id)].renderX += handler.currentLevel.moveX;
            handler.enemies[(enemyData.id)].renderY += handler.currentLevel.moveY;
            handler.currentLevel.enemies.push(handler.enemies[enemyData.id]);
          }
        }
      })

      socket.on("addEnemies", function(enemyData) {
        handler.enemies = {};
        for(var i=0;i<enemyData.length;i++){
          if(!handler.enemies[(enemyData[i].id)]){
            if(enemyData[i].type == "hit"){
              handler.enemies[(enemyData[i].id)] = new Hit(enemyData[i].id,enemyData[i].x, enemyData[i].y);
              handler.enemies[(enemyData[i].id)].renderX += handler.currentLevel.moveX;
              handler.enemies[(enemyData[i].id)].renderY += handler.currentLevel.moveY;
              handler.currentLevel.enemies.push(handler.enemies[enemyData[i].id]);
            }else if(enemyData[i].type == "darkKnight"){
              handler.enemies[(enemyData[i].id)] = new DarkKnight(enemyData[i].id,enemyData[i].x, enemyData[i].y);
              handler.enemies[(enemyData[i].id)].renderX += handler.currentLevel.moveX;
              handler.enemies[(enemyData[i].id)].renderY += handler.currentLevel.moveY;
              handler.currentLevel.enemies.push(handler.enemies[enemyData[i].id]);
            }else if(enemyData[i].type == "hulk"){
              handler.enemies[(enemyData[i].id)] = new Hulk(enemyData[i].id,enemyData[i].x, enemyData[i].y);
              handler.enemies[(enemyData[i].id)].renderX += handler.currentLevel.moveX;
              handler.enemies[(enemyData[i].id)].renderY += handler.currentLevel.moveY;
              handler.currentLevel.enemies.push(handler.enemies[enemyData[i].id]);
            }else if(enemyData[i].type == "minionSkeleton"){
              handler.enemies[(enemyData[i].id)] = new MinionSkeleton(enemyData[i].id,enemyData[i].x, enemyData[i].y);
              handler.enemies[(enemyData[i].id)].renderX += handler.currentLevel.moveX;
              handler.enemies[(enemyData[i].id)].renderY += handler.currentLevel.moveY;
              handler.currentLevel.enemies.push(handler.enemies[enemyData[i].id]);
            }else if(enemyData[i].type == "dragon"){
              handler.enemies[(enemyData[i].id)] = new Dragon(enemyData[i].id,enemyData[i].x, enemyData[i].y);
              handler.enemies[(enemyData[i].id)].renderX += handler.currentLevel.moveX;
              handler.enemies[(enemyData[i].id)].renderY += handler.currentLevel.moveY;
              handler.currentLevel.enemies.push(handler.enemies[enemyData[i].id]);
            }else if(enemyData[i].type == "yeti"){
              handler.enemies[(enemyData[i].id)] = new Yeti(enemyData[i].id,enemyData[i].x, enemyData[i].y);
              handler.enemies[(enemyData[i].id)].renderX += handler.currentLevel.moveX;
              handler.enemies[(enemyData[i].id)].renderY += handler.currentLevel.moveY;
              handler.currentLevel.enemies.push(handler.enemies[enemyData[i].id]);
            }
          }
        }
      });

      socket.on("removeEnemy", function(data) {

        delete handler.enemies[data.id];

      });

      socket.on("skillData", function(skillData) {
        if(!handler.skillTable[skillData.id]){
            handler.skillTable[skillData.id] = new KamehamehaWave(skillData.x, skillData.y, skillData.turn);
            handler.skillTable[skillData.id].frameTable = skillData.frameTable;
            handler.skillTable[skillData.id].renderX = skillData.x + handler.currentLevel.moveX;
            handler.skillTable[skillData.id].renderY = skillData.y + handler.currentLevel.moveY;
        }else{
            handler.skillTable[skillData.id].renderX += skillData.x - handler.skillTable[skillData.id].x;
            handler.skillTable[skillData.id].renderY += skillData.y - handler.skillTable[skillData.id].y;
            handler.skillTable[skillData.id].x = skillData.x;
            handler.skillTable[skillData.id].y = skillData.y;
            handler.skillTable[skillData.id].frameTable = skillData.frameTable;

        }


      });

      socket.on("removeSkill", function(skillData)  {
        if(handler.skillTable[skillData.id]){
          delete handler.skillTable[skillData.id];
        }
      });

      socket.on("enemyDeadTick", function(data)  {
        if(handler.enemies[data.id]){
          handler.enemies[data.id].dead = true;
        }
      });

      socket.on("changeMapLevel", function(data) {
        delete handler.currentLevel;
        handler.currentLevel = new Level(data.levelData);

        handler.currentLevel.moveX = data.moveX;
        handler.currentLevel.moveY = data.moveY;
        handler.character.x = data.playerNewX;
        handler.character.y = data.playerNewY;
        handler.character.renderX = data.playerNewX;
        handler.character.renderY = data.playerNewY;


        handler.camera.handleMoveXandMoveY();
      })


    }

}
