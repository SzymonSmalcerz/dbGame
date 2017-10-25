class Tile{
  constructor(xPositionInImage,yPositionInImage){
    this.handler = Game.handler;
    this.xPositionInImage = xPositionInImage;
    this.yPositionInImage = yPositionInImage;
    this.width = 32;
    this.height = 32;
    this.sprite = new Image();
    this.sprite.src = "./js/dragonBallGame/sprites/spriteTiles.png";
  }

  draw(x,y){
    this.handler.ctx.drawImage(this.sprite,this.xPositionInImage*this.width,this.yPositionInImage*this.width,this.width,this.height,x*this.handler.scale,y*this.handler.scale,this.width*this.handler.scale,this.height*this.handler.scale);
	}
}
