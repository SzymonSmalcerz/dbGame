

const staticSprite =  new Image();
const staticSprite32px = new Image();
class StaticEntity{

  constructor(spriteX, spriteY,x ,y,collisionHeight,collisionWidth,widthInImage ,heightInImage ){
    this.handler = Game.handler;
    this.xPositionInImage = spriteX;
  	this.yPositionInImage = spriteY;

    this.sprite = staticSprite;
    staticSprite.src = "dbgame/js/dragonBallGame/sprites/spriteStaticEntities.png";

  	this.x = x;
  	this.renderX = x;
  	this.y = y;
  	this.renderY = y;



  	this.widthInImage = widthInImage || 64;
  	this.width = this.widthInImage;
  	this.heightInImage = heightInImage || 64;
  	this.height = this.heightInImage;
  	this.collisionHeight = collisionHeight || this.height/8;
  	this.collisionWidth = collisionWidth || this.width/3;

    this.gridSize = 64;
  };

  draw(){

  	this.handler.ctx.drawImage(this.sprite,																	// imagesource
  							   this.xPositionInImage*this.gridSize,this.yPositionInImage*this.gridSize,	// x and y position of particular image in sprite
  							   this.widthInImage,this.heightInImage,												// width and height of particular image in sprite
  							   this.renderX,this.renderY,											// x and y on the screen
  							   this.width,this.height);		// width and height of the particular image on the screen

  	this.handler.collisionCtx.fillStyle = "rgba(1,0,0,1.0)";
  	this.handler.collisionCtx.fillRect((this.renderX + (this.width - this.collisionWidth)/2),(this.renderY + (this.height - this.collisionHeight - this.height/10)), this.collisionWidth, this.collisionHeight);

  };

}

class StaticEntity32 extends StaticEntity{
  constructor(spriteX, spriteY,x ,y,collisionHeight,collisionWidth){
      super(spriteX, spriteY,x ,y,13,32/2,32,32);
      this.gridSize = 32;
      this.sprite = staticSprite32px;
      staticSprite32px.src = "dbgame/js/dragonBallGame/sprites/spriteStaticEntities32px.png";
  }
}

//PARTICULAR STATICS :
class Skeleton1 extends StaticEntity32{
  constructor(x,y){
    super(0,0,x,y);
      this.flatRendering = true;//it means that we do not want to render it as normal entity, rather as a tile on tile
      this.collisionWidth = 0;
      this.collisionHeight = 0;
  }
};

class Skeleton2 extends StaticEntity32{
  constructor(x,y){
    super(1,0,x,y);
    this.flatRendering = true;//it means that we do not want to render it as normal entity, rather as a tile on tile
    this.collisionWidth = 0;
    this.collisionHeight = 0;
  }
};

class Skeleton3 extends StaticEntity32{
  constructor(x,y){
    super(2,0,x,y);
    this.flatRendering = true;//it means that we do not want to render it as normal entity, rather as a tile on tile
    this.collisionWidth = 0;
    this.collisionHeight = 0;
  }
};


class Cactus1 extends StaticEntity32{
  constructor(x,y){
    super(3,0,x,y);
  }
}
class DessertPlant1 extends StaticEntity32{
  constructor(x,y){
    super(4,0,x,y);
  }
}
class DessertPlant2 extends StaticEntity32{
  constructor(x,y){
    super(5,0,x,y);
  }
}
class Rock1 extends StaticEntity32{
  constructor(x,y){
    super(6,0,x,y);
  }
}
class DessertSign extends StaticEntity32{
  constructor(x,y){
    super(7,0,x,y);
  }
}


class BigSkeleton1 extends StaticEntity{

  constructor(x,y){
    super(5,4,x,y,0,0,64,64);
    this.flatRendering = true;//it means that we do not want to render it as normal entity, rather as a tile on tile
    this.collisionWidth = 0;
    this.collisionHeight = 0;
  }
}

class Tree extends StaticEntity{

  constructor(x,y){
    super(1,0,x,y,null,128/3,128,128);
  }

};

class House1 extends StaticEntity{

  constructor(x,y){

    super(0,2,x,y,128/5,128/1.05,128,128);

  }
}



class House2 extends StaticEntity{

  constructor(x,y){
    super(6,0,x,y,210/5,128*0.87,128,210);
  }
}
