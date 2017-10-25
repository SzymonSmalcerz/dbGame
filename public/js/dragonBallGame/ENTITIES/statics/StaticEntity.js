


class StaticEntity{

  constructor(spriteX, spriteY,x ,y,collisionHeight,scale,collisionWidth,widthInImage ,heightInImage ){
    this.handler = Game.handler;
    this.xPositionInImage = spriteX;
  	this.yPositionInImage = spriteY;

    this.sprite = new Image();                           //TODO
    this.sprite.src = "./js/dragonBallGame/sprites/spriteStaticEntities.png";//TODO
  	this.x = x;
  	this.y = y;


  	this.scale = scale || 1.0;
  	this.widthInImage = widthInImage || 64;
  	this.width = this.widthInImage * this.scale;
  	this.heightInImage = heightInImage || 64;
  	this.height = this.heightInImage * this.scale;
  	this.collisionHeight = collisionHeight * this.scale || this.height/8;
  	this.collisionWidth = collisionWidth * this.scale || this.width/3;

  };

  draw(){

  	this.handler.ctx.drawImage(this.sprite,																	// imagesource
  							   this.xPositionInImage*64,this.yPositionInImage*64,	// x and y position of particular image in sprite
  							   this.widthInImage,this.heightInImage,												// width and height of particular image in sprite
  							   this.x,this.y,											// x and y on the screen
  							   this.width,this.height);		// width and height of the particular image on the screen

  	this.handler.collisionCtx.fillStyle = "rgba(1,0,0,1.0)";
  	this.handler.collisionCtx.fillRect((this.x + (this.width - this.collisionWidth)/2),(this.y + (this.height - this.collisionHeight - this.height/10)), this.collisionWidth, this.collisionHeight);

  };

}

//PARTICULAR STATICS :

class Tree extends StaticEntity{

  constructor(x,y){
    super(1,0,x,y,null,1.0,128/3,128,128);
  }

};
