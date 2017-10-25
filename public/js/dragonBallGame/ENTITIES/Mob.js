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
    this.x = x;
    this.y = y;
    this.mana = mana || 100;
  	this.maxMana = mana || 100;
    this.health = health || 1000;
    this.maxHealth = health || 1000;
    this.damage = damage || 3;
    this.speed = speed || 7.5;
  	this.manaRegeneration = manaRegeneration || mana/400 || 2.5;
    this.healthRegeneration = healthRegeneration || health/400 || 25;

    this.handler = Game.handler;
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
    this.handleManaAndHp();
    this.handleSpritePath();//TODO should be called only once at creation of mob try to put it in construtor !!!!
    this.handleScale(); //TODO AND HERE WE WILL HANDLE SCALE !!!!!!!!



  	this.handler.ctx.drawImage(this.sprite,							// imagesource
  							   	this.currentSprite[Math.floor(this.tickCounter)%this.currentSprite.length].x*this.width,this.currentSprite[Math.floor(this.tickCounter)%this.currentSprite.length].y*this.height,	// x and y position of particular image in sprite
  							  	this.width,this.height,							// width and height of particular image in sprite
  							 		this.x,this.y,											// x and y on the screen
  							  	this.width,this.height);		        // width and height of the particular image on the screen



  	this.handler.ctx.fillStyle = "rgb(90,0,0)";
  	this.handler.ctx.fillRect(this.x ,this.y - this.height/8, this.width,	Math.min(4,Math.max(Math.floor(this.height/15),1)));

  	this.handler.ctx.fillStyle = "rgb(255,0,0)";
  	this.handler.ctx.fillRect(this.x ,this.y - this.height/8, this.width * this.health/this.maxHealth,	Math.min(4,Math.max(Math.floor(this.height/15),1)));

  	this.handler.collisionCtx.fillStyle = "rgba(5,0,0,0.2)";
  	//this.handler.collisionCtx.fillRect(this.handler.scale*(this.x + (this.width - this.collisionWidth)/2),this.handler.scale*(this.y + (this.height - this.collisionHeight - this.height/10)), this.collisionWidth*this.handler.scale, this.collisionHeight*this.handler.scale)
  	this.handler.collisionCtx.fillRect(this.x + (this.width - this.collisionWidth)/2,this.y + (this.height*0.9 - this.collisionHeight), this.collisionWidth, this.collisionHeight);

  	this.tickCounter+=0.25;
  }

  move(x,y){

  	this.currentSprite = this.idle;
    var canMove = false;
    //console.log(this.idle);
  	if(x > 0){
  		if(this.handler.collisionCtx.getImageData(this.x + this.speed + (this.width + this.collisionWidth)/2,this.y + this.height*0.9 - this.collisionHeight/2,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.x + this.speed + (this.width + this.collisionWidth)/2,this.y + this.height*0.9 - this.collisionHeight,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.x + this.speed + (this.width + this.collisionWidth)/2,this.y + this.height*0.9,1,1).data[0] !== 1)
  			{
  				this.x += this.speed;
  				this.currentSprite = this.right;
  			}
  	}else if(x < 0){
  		if(this.handler.collisionCtx.getImageData(this.x - this.speed + (this.width - this.collisionWidth)/2,this.y + this.height*0.9 - this.collisionHeight,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.x - this.speed + (this.width - this.collisionWidth)/2,this.y + this.height*0.9 - this.collisionHeight/2,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.x - this.speed + (this.width - this.collisionWidth)/2,this.y + this.height*0.9,1,1).data[0] !== 1)
  			{
  				this.x -= this.speed;
  				this.currentSprite = this.left;
  			}
  	}else if(y > 0){
  		if(this.handler.collisionCtx.getImageData(this.x + (this.width + this.collisionWidth)/2,this.y + this.speed + this.height*0.9,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.x + (this.width + this.collisionWidth/2)/2,this.y + this.speed + this.height*0.9,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.x + (this.width - this.collisionWidth)/2,this.y + this.speed + this.height*0.9,1,1).data[0] !== 1)
  			{
  				this.y += this.speed;
  				this.currentSprite = this.down;
  			}
  	}else if(y < 0){

  		if(this.handler.collisionCtx.getImageData(this.x + (this.width + this.collisionWidth)/2,this.y - this.speed + this.height*0.9 - this.collisionHeight,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.x + (this.width + this.collisionWidth/2)/2,this.y - this.speed + this.height*0.9 - this.collisionHeight,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.x + (this.width - this.collisionWidth)/2,this.y - this.speed + this.height*0.9 - this.collisionHeight,1,1).data[0] !== 1)
  			{
  				this.y -= this.speed;
  				this.currentSprite = this.up;
  			}
  	}
  }
}
