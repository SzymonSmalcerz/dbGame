

Tile = function(xPositionInImage,yPositionInImage){

	this.handler = Game.handler;
	this.xPositionInImage = xPositionInImage; //xPos.. * Tile.width = x position of sprite in spritesheet
	this.yPositionInImage = yPositionInImage; // the same goes here

};

Tile.width = 32;
Tile.height = 32;
var bool = 0;
Tile.sprite = new Image();
Tile.sprite.onload = function(){
	bool = 1;
}
Tile.sprite.src = "sprites/spriteTiles.png";


Tile.G = new Tile(0,0);
Tile.D = new Tile(1,0);
//Tile.W = new AnimatedTile([{x:2,y:0},{x:3,y:0},{x:4,y:0}]);

Tile.prototype.draw = function(x,y){
	if(bool === 1){
		this.handler.ctx.drawImage(Tile.sprite,this.xPositionInImage*Tile.width,this.yPositionInImage*Tile.width,Tile.width,Tile.height,x*this.handler.scale,y*this.handler.scale,Tile.width*this.handler.scale,Tile.height*this.handler.scale);
	}
};
