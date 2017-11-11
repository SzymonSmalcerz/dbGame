var {Static} = require("./serverSideEnemy");
var levelTiles = require("./serverSideLevelTiles");
var {Enemy,Hit , Hulk, Dragon ,Yeti} = require("./serverSideEnemy");
class Level{
  constructor(name,tilesAndTeleportCoords,players,enemies,statics,skills,socketTable){
    this.name = name;
    this.players = players;
    this.enemies = enemies;
    this.statics = statics;
    this.skills = skills;
    this.socketTable = socketTable;
    this.enemyData = []; //we send this to players !
    this.tilesAndTeleportCoords = tilesAndTeleportCoords;
    this.respawnFrame = 0;
  }

  tick(){
    //players are tickikng on client side
    this.enemiesTick();
    this.skillsTick();

    //functions for managing entities on particular level
    this.checkForEnemies();
    this.checkForSkills();
    this.checkForPlayers();
  }

  enemiesTick(){
    for(var enemyID in this.enemies){
      if(!this.enemies.hasOwnProperty(enemyID)) continue;

      this.enemies[enemyID].tick();
    }
  }

  skillsTick(){
    for(var skillID in this.skills){
      if(!this.skills.hasOwnProperty(skillID)) continue;

      this.skills[skillID].tick();
    }
  }

  checkForSkills(){
    this.skills = this.skills.filter((shoot) => {
  		if(shoot.detonated){
        if(shoot.tickCounter < 10){
          return true;
        }else {
          for(var playerID in this.players){
            if(!this.players.hasOwnProperty(playerID)) continue;

            this.socketTable[playerID].emit("removeSkill", {
              id:shoot.id
            })
          }
          return false;
        }
  		}else{
  			if(shoot.tickCounter < 45){
          return true;
        }else {
          for(var playerID in this.players){
            if(!this.players.hasOwnProperty(playerID)) continue;

            this.socketTable[playerID].emit("removeSkill", {
              id:shoot.id
            })
          }
          return false;
        }
  		}
  	})
  }

  checkForEnemies(){
    var temp = [];
    for(var enemyID in this.enemies){
      if(!this.enemies.hasOwnProperty(enemyID)) continue;
      var enemy = this.enemies[enemyID];
      if(enemy){
        if(enemy.health <= 0){
          for(var playerID in this.players){
            if(!this.players.hasOwnProperty(playerID)) continue;

            this.socketTable[playerID].emit("removeEnemy", {
              id:enemy.id
            })
          }
          this.enemies[enemy.id].onDie();
          delete this.enemies[enemy.id];
        }else{
          temp.push(enemy);
        }
      }
    }

    this.enemyData = temp.map(enemy => {
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

  checkForPlayers(){
    for (var playerID in this.players) {

      if (!this.players.hasOwnProperty(playerID)) continue;
      var player = this.players[playerID].gameData;

      if(player.health < player.maxHealth){
        player.health += player.healthRegeneration;
      }

      if(player.health < 0){
        player.health = 0;
      }

      if(player.mana < player.maxMana){
        player.mana += player.manaRegeneration;
      }

      this.socketTable[playerID].emit("playerData", this.players);
    }
  }


    getNextLevelData(playerID){
      var teleportsTable = this.tilesAndTeleportCoords.teleportsTable
      if(!this.players[playerID]) return {
        error : "player not found"
      }
      var player = this.players[playerID].gameData;
      for(var i =0;i<teleportsTable.length;i++){
        if(player.x + player.speed >= teleportsTable[i].xl && player.x <= teleportsTable[i].xr + player.speed){
          if(player.y + player.speed >= teleportsTable[i].yu && player.y <= teleportsTable[i].yd + player.speed)
            return {
              nextMapName : teleportsTable[i].nextMap,
              playerNewX : teleportsTable[i].playerNewX,
              playerNewY : teleportsTable[i].playerNewY
            }
        }


      }
      return {
        error : "bad coords of player"
      }
    }
}

class LevelFirst extends Level{
  constructor(socketTable){
    var statics = [
                   Static.getHouse1Data(500,400),
                   Static.getHouse1Data(650,400),
                   Static.getHouse1Data(800,400),
                   Static.getHouse1Data(950,400),
                   Static.getHouse2Data(300,330)
      ];

      for(var i=0;i<50;i++){
        statics.push(Static.getTreeData(Math.floor(Math.random() * 1150 + 50),Math.floor(Math.random() * 650 + 650)));
      }
    super("firstMap", levelTiles["firstMap"],{},{},statics,[],socketTable);
    this.numberOfHulks = 0;
  }

  checkForEnemies(){
    super.checkForEnemies();
    this.respawnFrame += 1;
    if(this.numberOfHulks < 20 && this.respawnFrame > 20){

        this.respawnFrame = 0;

      var x = Math.floor(Math.random() * 200 + 200);
      var y = Math.floor(Math.random() * 200 + 200);
      var tempID = "hu" + Math.floor(Math.random() * 10000) + this.name;
      var here = this;
      this.enemies[tempID] = new Hulk(tempID,x,y,this.players,this.enemies,this.statics,this.socketTable, function(){
        here.numberOfHulks -= 1;
      });
      this.numberOfHulks += 1;
      for(var playerID in this.players){

        if(!this.players.hasOwnProperty(playerID)) continue;

        this.socketTable[playerID].emit("pushNewEnemy", {
          x : this.enemies[tempID].x,
          y : this.enemies[tempID].y,
          id : this.enemies[tempID].id,
          type : this.enemies[tempID].type,
          currentSprite : this.enemies[tempID].currentSprite,
          collisionWidth : this.enemies[tempID].collisionWidth,
          collisionHeight : this.enemies[tempID].collisionHeight,
          width : this.enemies[tempID].width,
          height : this.enemies[tempID].height
        })
      }
    }
  }

}

class LevelSecond extends Level{
  constructor(socketTable){
    var statics = [];
    statics.push(Static.getDessertSignData(1320,90));

      for(var i=0;i<40;i++){
        statics.push(Static.getCactus1Data(Math.floor(Math.random()*1300 + 50),Math.floor(Math.random()*1300 + 50)));
      }
      for(var i=0; i<4;i++){
        statics.push(Static.getSkeleton1Data(Math.floor(Math.random()*1300 + 50),Math.floor(Math.random()*1300 + 50)));
        statics.push(Static.getSkeleton3Data(Math.floor(Math.random()*1300 + 50),Math.floor(Math.random()*1300 + 50)));
        statics.push(Static.getRock1Data(Math.floor(Math.random()*1300 + 50),Math.floor(Math.random()*1300 + 50)));
        statics.push(Static.getDessertPlant1Data(Math.floor(Math.random()*1300 + 50),Math.floor(Math.random()*1300 + 50)));
      }
    super("secondMap", levelTiles["secondMap"],{},{},statics,[],socketTable);
    this.numberOfHits = 0;
  }

  checkForEnemies(){
    super.checkForEnemies();
    this.respawnFrame += 1;
    if(this.numberOfHits < 75 && this.respawnFrame > 40){
      this.respawnFrame = 0;
      var x = Math.floor(Math.random() * 1000 + 200);
      var y = Math.floor(Math.random() * 1000 + 200);
      var tempID = "hi" + Math.floor(Math.random() * 10000) + this.name;
      var here = this;
      this.enemies[tempID] = new Hit(tempID,x,y,this.players,this.enemies,this.statics,this.socketTable, function(){
        here.numberOfHits -= 1;
      });
      this.numberOfHits += 1;
      for(var playerID in this.players){

        if(!this.players.hasOwnProperty(playerID)) continue;

        this.socketTable[playerID].emit("pushNewEnemy", {
          x : this.enemies[tempID].x,
          y : this.enemies[tempID].y,
          id : this.enemies[tempID].id,
          type : this.enemies[tempID].type,
          currentSprite : this.enemies[tempID].currentSprite,
          collisionWidth : this.enemies[tempID].collisionWidth,
          collisionHeight : this.enemies[tempID].collisionHeight,
          width : this.enemies[tempID].width,
          height : this.enemies[tempID].height
        })
      }
    }
  }
}


class LevelDragon extends Level{
  constructor(socketTable){
    var statics = [];



      for(var i=0; i<15;i++){
        statics.push(Static.getSkeleton2Data(Math.floor(Math.random()*1300 + 50),Math.floor(Math.random()*1300 + 50)));
      }

      for(var i=0;i<3;i++){
        statics.push(Static.getDessertPlant2Data(Math.floor(Math.random()*1300 + 50),Math.floor(Math.random()*1300 + 50)));
        statics.push(Static.getBigSkeleton1Data(Math.floor(Math.random()*1300 + 50),Math.floor(Math.random()*1300 + 50)));
      }
    super("dragonMap", levelTiles["dragonMap"],{},{},statics,[],socketTable);
    this.numberOfDragons = 0;
  }

  checkForEnemies(){
    super.checkForEnemies();
    this.respawnFrame += 1;
    if(this.numberOfDragons < 75 && this.respawnFrame > 40){
      this.respawnFrame = 0;
      var x = Math.floor(Math.random() * 1000 + 200);
      var y = Math.floor(Math.random() * 1000 + 200);
      var tempID = "dr" + Math.floor(Math.random() * 10000) + this.name;
      var here = this;
      this.enemies[tempID] = new Dragon(tempID,x,y,this.players,this.enemies,this.statics,this.socketTable, function(){
        here.numberOfDragons -= 1;
      });
      this.numberOfDragons += 1;
      for(var playerID in this.players){

        if(!this.players.hasOwnProperty(playerID)) continue;

        this.socketTable[playerID].emit("pushNewEnemy", {
          x : this.enemies[tempID].x,
          y : this.enemies[tempID].y,
          id : this.enemies[tempID].id,
          type : this.enemies[tempID].type,
          currentSprite : this.enemies[tempID].currentSprite,
          collisionWidth : this.enemies[tempID].collisionWidth,
          collisionHeight : this.enemies[tempID].collisionHeight,
          width : this.enemies[tempID].width,
          height : this.enemies[tempID].height
        })
      }
    }
  }
}
module.exports = {
  LevelFirst,
  LevelSecond,
  LevelDragon
};
