const Helper = require("./Helper");

var SkillStatic = {
  width : 32,
  height : 32
}

var detonationTable = [];
detonationTable[0] = [{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},{x:5,y:1}];
detonationTable[1] = [{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3},{x:5,y:3},{x:6,y:3},{x:7,y:3}];

class Skill{
  constructor(id,skillData,damage,radius, frameTable, speed, attackTable, players,statics,enemies, tableOfSockets){

    this.ownerID = skillData.ownerID;
    this.id = id;
    this.tickCounter = 0;
  	this.speed = speed|| 15;
  	this.x = skillData.x;
  	this.y = skillData.y;
  	this.turn = skillData.turn;
  	this.damage = damage || 100;
  	this.radius = radius || 30;
  	this.frameTable = frameTable;
  	this.height = 32;
  	this.width = 32;
    this.collisionWidth = 32;
    this.collisionHeight = 32;

  	this.attackTable = attackTable;

    this.skillName = skillData.skillName;
    this.playersInMap = players;
    this.statics = statics;
    this.enemies = enemies;
    this.tableOfSockets = tableOfSockets;

    this.detonated = false;
    this.deleted = false;
    this.ttl = 45; //time to live, like in ipv4

  }

  tick(){
    if(this.attackTable && !this.detonated){
      if(this.turn === "left"){
        this.frameTable = this.attackTable[1];
      }else if(this.turn === "right"){
        this.frameTable = this.attackTable[0];
      }else if(this.turn === "up"){
        this.frameTable = this.attackTable[3];
      }else if(this.turn === "down"){
        this.frameTable = this.attackTable[2];
      }
    }



    if(this.turn === "left"){
      this.x -= this.speed;
    }else if(this.turn === "right"){
      this.x += this.speed;
    }else if(this.turn === "up"){
      this.y -= this.speed;
    }else if(this.turn === "down"){
      this.y += this.speed;
    }


    this.checkIfSkillIsValid();
    this.checkForCollisionWithEntity();
    if(this.frameTable){
      this.emitData();
    }

    this.tickCounter+=1;
  }

  emitData(){


    for(var playerID in this.playersInMap){
      if(!this.playersInMap.hasOwnProperty(playerID)) continue;

      var player = this.playersInMap[playerID].gameData;

      var realRangeWidth;
      var realRangeHeight;

      var dp; //down corner of player
      var up; //up corner ..
      var lp; //left corner ..
      var rp; //right corenr ..

      if(player.x + player.width + player.speed >= player.rangeOfSeeingWidth){

        if(player.x  >= player.rangeOfSeeingWidth){
          lp = player.x - player.rangeOfSeeingWidth*2 - this.width;
        }else{
          lp = player.x - player.rangeOfSeeingWidth - this.width;
        }

        rp = player.x + player.rangeOfSeeingWidth + this.width;
      }else{
        lp = 0 - this.width;
        rp = 2*player.rangeOfSeeingWidth + this.width;
      }

      if(player.y + player.height + player.speed >= player.rangeOfSeeingHeight){
        if(player.y >= player.rangeOfSeeingHeight){
          up = player.y - player.rangeOfSeeingHeight*2 - this.height;
        }else{
          up = player.y - player.rangeOfSeeingHeight - this.height;
        }

        dp = player.y + player.rangeOfSeeingHeight + this.height + player.height;

      }else{
        up = 0 - this.width;
        dp = 2*player.rangeOfSeeingHeight + this.height;
      }

      if(this.x >= lp && this.x <= rp && this.y <= dp && this.y >= up){
       this.tableOfSockets[player.id].emit("skillData", {
         x : this.x,
         y : this.y,
         skillName : this.skillName,
         turn : this.turn,
         frameTable : this.frameTable,
         id : this.id
       })
      }

    }
  }

  handleDetonation(){

    this.detonated = true;

    this.frameTable = this.detonationTable;

    this.speed = this.speed/3;

    this.tickCounter = 0;
  }

  deleteSkill(){
    this.deleted = true;
  }


  checkIfSkillIsValid(){

    if(this.tickCounter > this.ttl){
      this.deleteSkill();
    }else if(this.detonated){
      if(this.tickCounter >= this.detonationTable.length){
        this.deleteSkill();
      }
    }
  }

  checkForCollisionWithEntity__Helper__CalculateSpeed(){

    var x =0;
    var y=0;
    if(this.turn === "left"){
      x-=this.speed;
    }else if(this.turn === "right"){
      x += this.speed;
    }else if(this.turn === "up"){
      y -= this.speed;
    }else if(this.turn === "down"){
      y += this.speed;
    };

    return {
      x,
      y
    };
  }

  checkForCollisionWithEntity(){



  	if(!this.detonated ){
      for (var playerID in this.playersInMap) {
        if (!this.playersInMap.hasOwnProperty(playerID)) continue;
        var player = this.playersInMap[playerID].gameData;
        var thisSkill = this;
        if(Helper.areTwoEntitiesInRange(thisSkill,player,thisSkill.checkForCollisionWithEntity__Helper__CalculateSpeed())){
           this.detonated = true;
           player.health = player.health - this.damage;
         }
      }


      for (var enemyID in this.enemies) {
        if (!this.enemies.hasOwnProperty(enemyID)) continue;
        var enemy = this.enemies[enemyID];
        var thisSkill = this;
        if(Helper.areTwoEntitiesInRange(thisSkill,enemy,thisSkill.checkForCollisionWithEntity__Helper__CalculateSpeed())){
           this.detonated = true;
           enemy.health = enemy.health - this.playersInMap[this.ownerID].gameData.damage * 3;
           if(enemy.health <= 0){
             this.playersInMap[this.ownerID].gameData.experience += enemy.experience;

             if(this.playersInMap[this.ownerID].gameData.experience >= this.playersInMap[this.ownerID].gameData.requiredExperience){
               this.playersInMap[this.ownerID].gameData.experience = 0;
               this.playersInMap[this.ownerID].gameData.level += 1;
               this.playersInMap[this.ownerID].gameData.maxHealth += 100;
               this.playersInMap[this.ownerID].gameData.maxMana += 50;
               this.playersInMap[this.ownerID].gameData.healthRegeneration = this.playersInMap[this.ownerID].gameData.maxHealth/100 ;
               this.playersInMap[this.ownerID].gameData.manaRegeneration = this.playersInMap[this.ownerID].gameData.maxMana/100;
               this.playersInMap[this.ownerID].gameData.speed = Math.min(Math.floor(7 + this.playersInMap[this.ownerID].gameData.level/4),10);
               this.playersInMap[this.ownerID].gameData.damage = 30 + 3*this.playersInMap[this.ownerID].gameData.level;
               this.playersInMap[this.ownerID].gameData.requiredExperience = this.playersInMap[this.ownerID].gameData.level * 2 * 500;
            }
           }
         }
      }

      var thisSkill = this;
      for(var i=0;i<this.statics.length;i++){
        var staticEntity = this.statics[i];
        if(Helper.areTwoEntitiesInRange(thisSkill,staticEntity)){
           this.detonated = true;
         }
      }

      if(this.detonated){
        this.handleDetonation();
      }
  	}
  }
}

class KamehamehaWave extends Skill{
  constructor(id,skillData,players,statics,enemies, io, tableOfSockets){
    super(id,skillData,null,25,null,15,[[{x:0,y:2}],[{x:1,y:2}],[{x:2,y:2}],[{x:3,y:2}]], players,statics,enemies, io, tableOfSockets);
    this.detonationTable = detonationTable[1];
  }
}

module.exports = {
  Skill,
  KamehamehaWave
}
