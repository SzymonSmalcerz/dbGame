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
