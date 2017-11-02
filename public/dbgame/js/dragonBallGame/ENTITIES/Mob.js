class Mob {

  constructor(id,spritePath,moveTable,x,y,width,height,collisionHeight,collisionWidth,manaRegeneration,healthRegeneration,health,damage,speed,mana){

    // SPRITE HANDLING THINGS BELOW
    this.id = id || Math.floor((Math.random() * 100000) + 1);
    this.sprite = new Image();
    this.spritePath = spritePath;
    this.moveTable = moveTable;
    this.width = width || 32;
    this.height = height || 32;
    this.collisionHeight = collisionHeight || this.height/3;
  	this.collisionWidth = collisionWidth || this.width/3 ;
    this.tickCounter = 0;
    this.currentSprite = this.idle;

    //PHYSICS AND LOGIC THINGS BELOW


    this.mana = mana || 100;
  	this.maxMana = mana || 100;
    this.health = health || 1000;
    this.maxHealth = health || 1000;
    this.damage = damage || 100;
    this.speed = speed || 3.5;
  	this.manaRegeneration = manaRegeneration || mana/800 || 4;
    this.healthRegeneration = healthRegeneration || health/800 || 4;

    this.handler = Game.handler;

    this.x = x;
    this.y = y;
    this.renderY = y;
    this.renderX = x;
  }

  getDamage(amount){
    this.health -= amount;
  }

  handleManaAndHp(){
    if(this.health < this.maxHealth){
  		this.health += this.healthRegeneration;
  	}

  	if(this.mana < this.maxMana){
  		this.mana += this.manaRegeneration;
  	}
  }

  handleSpritePath(){
    if(!this.currentSprite || !this.sprite.src){
  		this.currentSprite = this.moveTable[4]; // IDLE
  		this.sprite.src = this.spritePath;
  	}
  }

  handleScale(){ //TODO @@@@@@@@@@@@@@

  }

  draw(){
    // this.handleManaAndHp();
    this.handleSpritePath();//TODO should be called only once at creation of mob try to put it in construtor !!!!
    this.handleScale(); //TODO AND HERE WE WILL HANDLE SCALE !!!!!!!!

    // this.renderX = this.x;
    // this.renderY = this.y;

  	this.handler.ctx.drawImage(this.sprite,							// imagesource
  							   	this.currentSprite[Math.floor(this.tickCounter)%this.currentSprite.length].x*this.width,this.currentSprite[Math.floor(this.tickCounter)%this.currentSprite.length].y*this.height,	// x and y position of particular image in sprite
  							  	this.width,this.height,							// width and height of particular image in sprite
  							 		this.renderX,this.renderY,											// x and y on the screen
  							  	this.width,this.height);		        // width and height of the particular image on the screen



  	this.handler.ctx.fillStyle = "rgb(90,0,0)";
  	this.handler.ctx.fillRect(this.renderX ,this.renderY - this.height/8, this.width,	Math.min(4,Math.max(Math.floor(this.height/15),1)));

  	this.handler.ctx.fillStyle = "rgb(255,0,0)";
  	this.handler.ctx.fillRect(this.renderX ,this.renderY - this.height/8, this.width * this.health/this.maxHealth,	Math.min(4,Math.max(Math.floor(this.height/15),1)));

  	this.handler.collisionCtx.fillStyle = "rgba(1,0,0,1.0)";
  	//this.handler.collisionCtx.fillRect(this.handler.scale*(this.renderX + (this.width - this.collisionWidth)/2),this.handler.scale*(this.renderY + (this.height - this.collisionHeight - this.height/10)), this.collisionWidth*this.handler.scale, this.collisionHeight*this.handler.scale)
  	this.handler.collisionCtx.fillRect(this.renderX + (this.width - this.collisionWidth)/2,this.renderY + (this.height*0.9 - this.collisionHeight), this.collisionWidth, this.collisionHeight);

  	this.tickCounter+=0.25;
  }


}
