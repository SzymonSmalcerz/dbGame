const SkillStatic = {
  width : 32,
  height : 32,
  sprite : new Image()
};


class Skill extends Entity{
  constructor(x,y){

    super(x,y);

    if(!SkillStatic.sprite.src)
      SkillStatic.sprite.src = "dbgame/js/dragonBallGame/sprites/shootSprite.png";

  	this.height = SkillStatic.height;
  	this.width = SkillStatic.width;
    this.collisionWidth = SkillStatic.width;
    this.collisionHeight = SkillStatic.height;

  }

  draw(){
    this.tickCounter+=1;
  	this.handler.ctx.drawImage(SkillStatic.sprite,
  		this.frameTable[Math.floor(this.tickCounter)%this.frameTable.length].x*SkillStatic.width,this.frameTable[Math.floor(this.tickCounter)%this.frameTable.length].y*SkillStatic.height,
  		SkillStatic.width, SkillStatic.height,
  		this.renderX, this.renderY,
  		SkillStatic.width, SkillStatic.height);
  }

}



class KamehamehaWave extends Skill{
  constructor(x,y,turn){
    super(x,y);
  }
}
