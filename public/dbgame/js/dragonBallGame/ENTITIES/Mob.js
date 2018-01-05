class Mob extends Entity{

  constructor(id,sprite,x,y){


    super(x,y);





    this.id = id || Math.floor((Math.random() * 100000) + 1);
    this.sprite = sprite;

  }


  draw(){
    //draw sprite
    var mob = this;
    
    var isSwiming = false;
    if(this.handler.currentLevel && this.handler.currentLevel.specialTiles.length){

      this.handler.currentLevel.specialTiles.forEach(function(entity){
        if(Helper.areTwoEntitiesInRange(mob,entity)){
          isSwiming = true;
        }
      });
    }
    this.isFloating = isSwiming;

  	if(this.currentSprite && !this.isFloating){
      this.handler.ctx.drawImage(this.sprite,							// imagesource
    							   	this.currentSprite[Math.floor(this.tickCounter)%this.currentSprite.length].x*this.width,this.currentSprite[Math.floor(this.tickCounter)%this.currentSprite.length].y*this.height,	// x and y position of particular image in sprite
    							  	this.width,this.height,							// width and height of particular image in sprite
    							 		this.renderX,this.renderY,											// x and y on the screen
    							  	this.width,this.height);		        // width and height of the particular image on the screen

    }else if(this.currentSprite){


      if(this.floatingFrame){
        this.floatingFrame += 1;
      }else{
        this.floatingFrame = 1;
      }

      var temp = 0;
      var tick = 3.5;
      var timeFrame = tick*8;

      if(this.floatingFrame % timeFrame < tick || (this.floatingFrame % timeFrame >= tick*6 && this.floatingFrame % timeFrame < tick*8)){
        temp = 0;
      }else if((this.floatingFrame % timeFrame >= tick && this.floatingFrame % timeFrame < tick*2) || (this.floatingFrame % timeFrame >= tick*4 && this.floatingFrame % timeFrame < tick*6)){
        temp = 2;
      }else if(this.floatingFrame % timeFrame >= tick*2 && this.floatingFrame % timeFrame < tick*4){
        temp = 4;
      }
      this.handler.ctx.drawImage(this.sprite,																	// imagesource
                      this.currentSprite[Math.floor(this.tickCounter)%this.currentSprite.length].x*this.width,this.currentSprite[Math.floor(this.tickCounter)%this.currentSprite.length].y*this.height,	// x and y position of particular image in sprite
                      this.width,this.height/2,												// width and height of particular image in sprite
                    this.renderX,this.renderY + temp,											// x and y on the screen
                      this.width,this.height/2);		// width and height of the particular image on the screen
    }

    //then draw hp
    this.drawHp();

    // if(this!== Game.handler.character){
    //   this.drawCollisionCtx();
    // }
    this.tickCounter+=0.25;
  }




  // drawCollisionCtx(){
  //   this.handler.collisionCtx.fillStyle = "rgba(1,0,0,1.0)";
  //   //this.handler.collisionCtx.fillRect(this.handler.scale*(this.renderX + (this.width - this.collisionWidth)/2),this.handler.scale*(this.renderY + (this.height - this.collisionHeight - this.height/10)), this.collisionWidth*this.handler.scale, this.collisionHeight*this.handler.scale)
  //   this.handler.collisionCtx.fillRect(this.renderX + (this.width - this.collisionWidth)/2,this.renderY + (this.height*0.9 - this.collisionHeight), this.collisionWidth, this.collisionHeight);
  // }

  drawHp(){
    if(this != this.handler.character && !this.dead){
      this.handler.ctx.fillStyle = "rgb(90,0,0)";
    	this.handler.ctx.fillRect(this.renderX ,this.renderY - this.height/8, this.width,	Math.min(4,Math.max(Math.floor(this.height/15),1)));

    	this.handler.ctx.fillStyle = "rgb(255,0,0)";
    	this.handler.ctx.fillRect(this.renderX ,this.renderY - this.height/8, this.width * this.health/this.maxHealth,	Math.min(4,Math.max(Math.floor(this.height/15),1)));
    }
  }

}
