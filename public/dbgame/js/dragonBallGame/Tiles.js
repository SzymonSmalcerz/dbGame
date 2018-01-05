var TileStatic = {
  width : 32,
  height : 32
};


class Tile{
  constructor(xPositionInImage,yPositionInImage){
    this.handler = Game.handler;
    this.xPositionInImage = xPositionInImage;
    this.yPositionInImage = yPositionInImage;
    this.width = TileStatic.width;
    this.height = TileStatic.height;
    this.sprite = new Image();
    this.sprite.src = "dbgame/js/dragonBallGame/sprites/spriteTiles.png";
  }

  draw(x,y){
    this.handler.ctx.drawImage(this.sprite,this.xPositionInImage*this.width,this.yPositionInImage*this.width,this.width,this.height,x*this.handler.scale,y*this.handler.scale,this.width*this.handler.scale,this.height*this.handler.scale);
	}
}

class SpecialTile extends Tile{
  constructor(xPositionInImage,yPositionInImage,collisionWidth,collisionHeight){
    super(xPositionInImage,yPositionInImage);

    this.collisionWidth = collisionWidth;
    this.collisionHeight = collisionHeight;

    this.special = true;
  }

  draw(x,y){
    super.draw(x,y);
  }
}


class AnimatedTile extends SpecialTile{
  constructor(animationTable){
    super(animationTable[0].x,animationTable[0].y,32,32);
    this.animationTable = animationTable;
  	this.currentFrame = 0;
  }

  draw(x,y){
    super.draw(x,y);
    this.xPositionInImage = this.animationTable[Math.floor(this.handler.globalTickCounter/20)%this.animationTable.length].x;
    this.yPositionInImage = this.animationTable[Math.floor(this.handler.globalTickCounter/20)%this.animationTable.length].y;
    this.currentFrame+=1;

  }
}
