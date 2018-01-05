var staticSprite = new Image();
var staticSprite32px = new Image();




class StaticEntity extends Entity{

  constructor(data){
    // WHAT THE FUUUUUUUUUUUUUCK
    staticSprite.src = "dbgame/js/dragonBallGame/sprites/spriteStaticEntities.png";
    staticSprite32px.src = "dbgame/js/dragonBallGame/sprites/spriteStaticEntities32px.png";
    super(data.x,data.y,);


    this.xPositionInImage = data.xPosInSprite;
  	this.yPositionInImage = data.yPosInSprite;


    this.widthInImage = data.widthInImage || 64;
  	this.width = this.widthInImage;
  	this.heightInImage = data.heightInImage || 64;
  	this.height = this.heightInImage;
  	this.collisionHeight = data.collisionHeight || this.height/8;
  	this.collisionWidth = data.collisionWidth || this.width/3;

    if(data.collisionWidth == 0 || data.collisionHeight == 0){
      this.flatRendering = true;
    }

    this.sprite = staticSprite;
    this.gridSize = 64;
  };

  draw(){

  	this.handler.ctx.drawImage(this.sprite,																	// imagesource
  							   this.xPositionInImage*this.gridSize,this.yPositionInImage*this.gridSize,	// x and y position of particular image in sprite
  							   this.widthInImage,this.heightInImage,												// width and height of particular image in sprite
  							   this.renderX,this.renderY,											// x and y on the screen
  							   this.width,this.height);		// width and height of the particular image on the
                   this.handler.collisionCtx.fillStyle = "rgba(1,0,0,1.0)";


    //this.handler.collisionCtx.fillRect((this.renderX + (this.width - this.collisionWidth)/2),(this.renderY + (this.height - this.collisionHeight - this.height/10)), this.collisionWidth, this.collisionHeight);


  };



}

class StaticEntity32 extends StaticEntity{
  constructor(data){
      super(data);
      this.gridSize = 32;
      this.sprite = staticSprite32px;
  }
}
