var SkillStatic = {
  width : 32,
  height : 32
}

class Skill{
  constructor(id,x,y,turn,damage,radius, frameTable, speed, attackTable,skillName, players,statics,enemies, io){

    this.id = id;
    this.tickCounter = 0;
  	this.speed = speed|| 15;
  	this.x = x;
  	this.y = y;
  	this.turn = turn;
  	this.damage = damage || 500;
  	this.radius = radius || 30;
  	this.frameTable = frameTable;
  	this.height = 32;
  	this.width = 32;
  	this.detonated = false;
  	this.attackTable = attackTable;

    this.skillName = skillName;
    this.connectedPlayersData = players;
    this.statics = statics;
    this.enemies = enemies;
    this.io = io;

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

    this.tickCounter+=1;

    if(this.turn === "left"){
      this.x -= this.speed;
    }else if(this.turn === "right"){
      this.x += this.speed;
    }else if(this.turn === "up"){
      this.y -= this.speed;
    }else if(this.turn === "down"){
      this.y += this.speed;
    }

    this.checkForCollisionWithEntity();
    if(this.frameTable){
      this.emitData();
    }
  }

  emitData(){
    this.io.emit("skillData", {
      x : this.x,
      y : this.y,
      skillName : this.skillName,
      turn : this.turn,
      frameTable : this.frameTable,
      id : this.id
    })
  }

  handleDetonation(){
    this.frameTable = [{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},{x:5,y:1}];

    this.speed = this.speed/3;

    this.tickCounter = 0;
  }

  checkForCollisionWithEntity(){

  	if(!this.detonated ){
      for (var playerID in this.connectedPlayersData) {
        if (!this.connectedPlayersData.hasOwnProperty(playerID)) continue;
        var player = this.connectedPlayersData[playerID];
        if((Math.sqrt(Math.pow(player.collisionWidth/2,2) + Math.pow(player.collisionHeight/2,2))) +
         (Math.sqrt(Math.pow(this.width/2,2) + Math.pow(this.height/2,2))) >= (Math.sqrt(Math.pow((player.x + player.width/2) - (this.x + this.width/2),2) +
         Math.pow((player.y + player.height * 0.9 - player.collisionHeight/2) - (this.y + this.height/2),2)))){
           this.detonated = true;
           player.health = player.health - this.damage;
         }
      }

      for (var enemyID in this.enemies) {
        if (!this.enemies.hasOwnProperty(enemyID)) continue;
        var enemy = this.enemies[enemyID];
        if((Math.sqrt(Math.pow(enemy.collisionWidth/2,2) + Math.pow(enemy.collisionHeight/2,2))) +
         (Math.sqrt(Math.pow(this.width/2,2) + Math.pow(this.height/2,2))) >= (Math.sqrt(Math.pow((enemy.x + enemy.width/2) - (this.x + this.width/2),2) +
         Math.pow((enemy.y + enemy.height * 0.9 - enemy.collisionHeight/2) - (this.y + this.height/2),2)))){
           this.detonated = true;
           enemy.health = enemy.health - this.damage;
         }
      }

      for(var i=0;i<this.statics.length;i++){
        var staticEntity = this.statics[i];
        if((Math.sqrt(Math.pow(staticEntity.collisionWidth/2,2) + Math.pow(staticEntity.collisionHeight/2,2))) +
         (Math.sqrt(Math.pow(this.width/2,2) + Math.pow(this.height/2,2))) >= (Math.sqrt(Math.pow((staticEntity.x + staticEntity.width/2) - (this.x + this.width/2),2) +
         Math.pow((staticEntity.y + staticEntity.height * 0.9 - staticEntity.collisionHeight/2) - (this.y + this.height/2),2)))){
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
  constructor(id,x,y,turn,skillName, players,statics,enemies, io){
    super(id,x,y,turn,null,25,null,15,[[{x:0,y:2}],[{x:1,y:2}],[{x:2,y:2}],[{x:3,y:2}]],skillName, players,statics,enemies, io);
  }
}

module.exports = {
  Skill,
  KamehamehaWave
}
