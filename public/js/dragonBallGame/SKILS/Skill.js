var SkillStatic = {
  width : 32,
  height : 32
};


class Skill{
  constructor(x,y,turn,frameTable, speed, attackTable){
    SkillStatic.sprite = new Image();
    SkillStatic.sprite.src = "./js/dragonBallGame/sprites/shootSprite.png";
  	this.x = x;
  	this.y = y;
  	this.renderX = x;
  	this.renderY = y;
  	this.turn = turn;
  	this.handler = Game.handler;
  	this.frameTable = [{x:0,y:2}];
  	this.height = 32;
  	this.width = 32;
  	this.detonated = false;
  	this.attackTable = attackTable;
    this.tickCounter = 0;

  }

  draw(){
    this.tickCounter+=1;
    //console.log(this.frameTable);
  	this.handler.ctx.drawImage(SkillStatic.sprite,
  		this.frameTable[Math.floor(this.tickCounter)%this.frameTable.length].x*SkillStatic.width,this.frameTable[Math.floor(this.tickCounter)%this.frameTable.length].y*SkillStatic.height,
  		SkillStatic.width, SkillStatic.height,
  		this.renderX, this.renderY,
  		this.width, this.height);
  }

}



class KamehamehaWave extends Skill{
  constructor(x,y,turn){
    super(x,y,turn,null,25,[[{x:0,y:2}],[{x:1,y:2}],[{x:2,y:2}],[{x:3,y:2}]]);
  }
}
