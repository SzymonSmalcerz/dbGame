
class MainCharacter extends Mob{

  constructor(playerData){
    const spritePlayer = new Image();
    spritePlayer.src = "dbgame/js/dragonBallGame/sprites/spriteGokuSupix.png";
    super(playerData.id,spritePlayer,playerData.x,playerData.y);

    this.level = playerData.level;
    this.experience = playerData.experience;

    this.renderX = this.x;//must be that way !!
    this.renderY = this.y;//must be that way !!

    Game.handler.players[this.id] = this;

    this.setSprites();

    this.isFighting = false;
    this.usingSkill = false;

    this.requiredExperience = playerData.requiredExperience;
    this.speed = playerData.speed;
    this.mana = playerData.mana;
    this.maxMana = playerData.maxMana;
    this.health = playerData.health;
    this.maxHealth = playerData.maxHealth;
    this.manaRegeneration =  playerData.manaRegeneration;
    this.healthRegeneration =  playerData.healthRegeneration;
    this.width = playerData.width;
    this.height = playerData.height;
    this.collisionHeight = playerData.collisionHeight;
    this.collisionWidth = playerData.collisionWidth ;

    socket.emit('message',"user " + this.id + " has been created");
    socket.emit("playerCreated", {id : this.id});//and now add enemies statics etc.

  }

  tick(){
    //TEMPORARY ADDED BELOW @@@@@@@@@@@@@@@@@@@@@@@@@@@@
    this.emitDataToOthers();

    this.currentSprite = this.idle;

    if(keyHandler["37"] || keyHandler["38"] || keyHandler["39"] || keyHandler["40"] ){
  		this.manageKeyPressing();
  	}

    if(this.isRegeneratingMana ){
  		this.manageRegenerationMana();
  		return;
  	}

    if(this.usingSkill && this.mana >= 3){
  		this.manageSkills();
  		return;
  	}

    if(this.isFighting){
      this.manageFighting();
  		return;
    }
  }

  manageFighting(){
    var enemies = this.handler.currentLevel.enemies;
    if(this.currentSprite == this.idleLeft || this.currentSprite == this.idleRight){
      for(var i = 0; i<enemies.length; i++){
        var enemy = enemies[i];
        var dp = this.y + this.height * 0.9;
        var gp = dp - this.collisionHeight;
        var de = enemy.y + enemy.height * 0.9;
        var ge = de - enemy.collisionHeight;
        if(Math.abs(ge - gp) + Math.abs(de - dp) <= this.collisionHeight*4 + enemy.collisionHeight){

          if(this.currentSprite == this.idleLeft){//left
            if(this.x + this.width/2 + this.collisionWidth/2 > enemy.x + enemy.width/2 + enemy.collisionWidth/2 &&
               this.x + this.width/2 + this.collisionWidth/2 < enemy.x + enemy.width/2 + enemy.collisionWidth/2 + this.collisionWidth*5/2){
              socket.emit("damageEnemy", {
                 idOfEnemy : enemy.id,
                 idOfPlayer : this.id
               });
            }
          }else{//right
            if(this.x + this.width/2 + this.collisionWidth/2 < enemy.x + enemy.width/2 + enemy.collisionWidth/2 &&
               this.x + this.width/2 + this.collisionWidth/2 + this.collisionWidth*2 > enemy.x + enemy.width/2 - enemy.collisionWidth/2){
                 socket.emit("damageEnemy", {
                    idOfEnemy : enemy.id,
                    idOfPlayer : this.id
                  });
            }
          }
        }
      }
    }else if(this.currentSprite == this.idleDown || this.currentSprite == this.idleUp) {
      for(var i = 0; i<enemies.length; i++){
        var enemy = enemies[i];
        var lp = this.x + this.width/2 - this.collisionWidth/2;
        var pp = this.x + this.width/2 + this.collisionWidth/2;
        var le = enemy.x + enemy.width/2 - enemy.collisionWidth/2;
        var pe = enemy.x + enemy.width/2 + enemy.collisionWidth/2;
        if(Math.abs(le - lp) + Math.abs(pe - pp) <= this.collisionWidth*4 + enemy.collisionWidth ){


          if(this.currentSprite == this.idleDown){//down
            if(this.y + this.height*0.9 - this.collisionHeight/2 < enemy.y + enemy.height*0.9 - enemy.collisionHeight/2 &&
               this.y + this.height*0.9 - this.collisionHeight/2 + this.collisionHeight*5/2 > enemy.y + enemy.height*0.9 - enemy.collisionHeight){
                 socket.emit("damageEnemy", {
                    idOfEnemy : enemy.id,
                    idOfPlayer : this.id
                  });
            }
          }else{//up
            if(this.y + this.height*0.9 - this.collisionHeight/2 > enemy.y + enemy.height*0.9 - enemy.collisionHeight/2 &&
               this.y + this.height*0.9 - this.collisionHeight/2 < enemy.y + enemy.height*0.9 - enemy.collisionHeight/2 + this.collisionHeight*5/2){
                 socket.emit("damageEnemy", {
                    idOfEnemy : enemy.id,
                    idOfPlayer : this.id
                  });
            }
          }
        }
      }
    }

    if(this.currentSprite == this.idleLeft){
        this.currentSprite = this.left_fight;
    }else if (this.currentSprite == this.idleRight){
        this.currentSprite = this.right_fight;
    }else if (this.currentSprite == this.idleUp){
        this.currentSprite = this.up_fight;
    }else if (this.currentSprite == this.idleDown){
        this.currentSprite = this.down_fight;
    }
  }
  move(x,y){

  	this.currentSprite = this.idle;
    var canMove = false;
    //console.log(this.idle);
  	if(x > 0){
  		if(this.x < this.handler.currentLevel.widthOfMap * TileStatic.width - this.width &&
         this.handler.collisionCtx.getImageData(this.renderX + this.speed + (this.width + this.collisionWidth)/2,this.renderY + this.height*0.9 - this.collisionHeight/2,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.renderX + this.speed + (this.width + this.collisionWidth)/2,this.renderY + this.height*0.9 - this.collisionHeight,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.renderX + this.speed + (this.width + this.collisionWidth)/2,this.renderY + this.height*0.9,1,1).data[0] !== 1)
  			{
  				this.x += this.speed;
  				this.renderX += this.speed;
  				this.currentSprite = this.right;
  			}
  	}else if(x < 0){
  		if(
         this.x  > 0 &&
         this.handler.collisionCtx.getImageData(this.renderX - this.speed + (this.width - this.collisionWidth)/2,this.renderY + this.height*0.9 - this.collisionHeight,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.renderX - this.speed + (this.width - this.collisionWidth)/2,this.renderY + this.height*0.9 - this.collisionHeight/2,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.renderX - this.speed + (this.width - this.collisionWidth)/2,this.renderY + this.height*0.9,1,1).data[0] !== 1)
  			{
  				this.x -= this.speed;
          this.renderX -= this.speed;
  				this.currentSprite = this.left;
  			}
  	}else if(y > 0){
  		if(
         this.y < this.handler.currentLevel.heightOfMap * TileStatic.height - this.height &&
         this.handler.collisionCtx.getImageData(this.renderX + (this.width + this.collisionWidth)/2,this.renderY + this.speed + this.height*0.9,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.renderX + (this.width )/2,this.renderY + this.speed + this.height*0.9,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.renderX + (this.width - this.collisionWidth)/2,this.renderY + this.speed + this.height*0.9,1,1).data[0] !== 1)
  			{
          this.y += this.speed;
          this.renderY += this.speed;
  				this.currentSprite = this.down;
  			}
  	}else if(y < 0){

  		if(this.y > 0&&
         this.handler.collisionCtx.getImageData(this.renderX + (this.width + this.collisionWidth)/2,this.renderY - this.speed + this.height*0.9 - this.collisionHeight,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.renderX + (this.width)/2,this.renderY - this.speed + this.height*0.9 - this.collisionHeight,1,1).data[0] !== 1 &&
  		   this.handler.collisionCtx.getImageData(this.renderX + (this.width - this.collisionWidth)/2,this.renderY - this.speed + this.height*0.9 - this.collisionHeight,1,1).data[0] !== 1)
  			{
  				this.y -= this.speed;
          this.renderY -= this.speed;
  				this.currentSprite = this.up;
  			}
  	}
  }

  emitDataToOthers(){
    socket.emit('userData',{
      id : this.id,
      x : this.x,
      y : this.y,
      currentSprite : this.currentSprite,
      rangeOfSeeingWidth : window.innerWidth/2,
      rangeOfSeeingHeight : window.innerHeight/2
    });
  }

  setSprites(){
    this.up = [{x:11,y:11},{x:12,y:7},{x:4,y:2},{x:11,y:1}];
    this.left = [{x:1,y:11},{x:13,y:11},{x:9,y:11},{x:5,y:11}];
    this.right = [{x:0,y:11},{x:12,y:11},{x:8,y:11},{x:4,y:11}];
    this.down = [{x:10,y:1},{x:3,y:2}];
    this.up_fight = [{x:9,y:3},{x:11,y:9},{x:2,y:4},{x:6,y:4},{x:10,y:8},{x:0,y:6},{x:4,y:6}];
    this.down_fight = [{x:14,y:5},{x:3,y:6},{x:13,y:8},{x:14,y:5},{x:12,y:3},{x:1,y:4},{x:5,y:4}];
    this.left_fight = [{x:13,y:9},{x:5,y:5},{x:2,y:6},{x:1,y:5}];
    this.right_fight = [{x:12,y:9},{x:4,y:5},{x:1,y:6},{x:0,y:5}];
    this.idleDown = [{x:1,y:0}];
    this.idleRight = [{x:1,y:2}];
    this.idleLeft = [{x:2,y:2}];
    this.idleUp = [{x:0,y:2}];
    this.idle = this.idleDown;
  }

  manageKeyPressing(){
    if(keyHandler["37"]	){
      this.idle = this.idleLeft;
      if(!this.isFighting && !this.isRegeneratingMana){
        this.move(-1,0);
      }
    }else if(keyHandler["38"]	){
      this.idle = this.idleUp;
      if(!this.isFighting && !this.isRegeneratingMana)
        this.move(0,-1);
    }else if(keyHandler["39"]	){
      this.idle = this.idleRight;
      if(!this.isFighting && !this.isRegeneratingMana)
        this.move(1,0);
    }else if(keyHandler["40"]	){
      this.idle = this.idleDown;
      if(!this.isFighting && !this.isRegeneratingMana)
        this.move(0,1);
    }
  }
  manageRegenerationMana(){
    this.currentSprite =	[{x:3,y:10},{x:4,y:10},{x:5,y:10},{x:6,y:10},{x:7,y:10},{x:8,y:10}];
  }

  manageSkills(){
    if(this.currentSprite === this.idleLeft){
      if(keyHandler["50"]){
        socket.emit("skillCreation", {
          x : this.x -  SkillStatic.width * 0.8,
          y : this.y,
          turn : "left",
          skillName : "KamehamehaWave",
          ownerID : this.id
        })
        this.currentSprite =	[{x:4,y:8}];
      }
    }else if(this.currentSprite === this.idleRight){


      if(keyHandler["50"]){
        socket.emit("skillCreation", {
          x : this.x +  SkillStatic.width * 0.8,
          y : this.y,
          turn : "right",
          skillName : "KamehamehaWave",
          ownerID : this.id
        })
        this.currentSprite =	[{x:3,y:8}];
      }

    }else if(this.currentSprite === this.idleUp){

      if(keyHandler["50"]){
        socket.emit("skillCreation", {
          x : this.x,
          y : this.y  - SkillStatic.height * 0.4,
          turn : "up",
          skillName : "KamehamehaWave",
          ownerID : this.id
        })
        this.currentSprite =	[{x:2,y:8}];
      }

    }else if(this.currentSprite === this.idleDown){


      if(keyHandler["50"]){
        socket.emit("skillCreation", {
          x : this.x,
          y : this.y  + SkillStatic.height * 0.75,
          turn : "down",
          skillName : "KamehamehaWave",
          ownerID : this.id
        })
        this.currentSprite =	[{x:1,y:8}];
      }
    }
  }
}





var keyHandler = {};

window.addEventListener("keydown",function(event){


	if(event.keyCode === 82){

		Game.handler.character.isRegeneratingMana = true;
		Game.handler.character.isFighting = false;
		Game.handler.character.usingSkill = false;
		keyHandler["37"] = keyHandler["38"] = keyHandler["39"] = keyHandler["40"] = false;
		return;
		//keyHandler["37"] = keyHandler["38"] = keyHandler["39"] = keyHandler["40"] = false;

	};

	if(event.keyCode === 32){

		Game.handler.character.isFighting = true;
		//keyHandler["37"] = keyHandler["38"] = keyHandler["39"] = keyHandler["40"] = false;

	};

	if(event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40){

		keyHandler["37"] = keyHandler["38"] = keyHandler["39"] = keyHandler["40"] = false;


			keyHandler[event.keyCode] = true;


	};

	if(event.keyCode >=  49 && event.keyCode <= 57){

		for(var i = 49;i<58;i++){
			keyHandler[i.toString()] = false;
		};

		Game.handler.character.isFighting = false;
		Game.handler.character.usingSkill = true;

		keyHandler[event.keyCode] = true;
	}




});


window.addEventListener("keyup",function(event){


	if(event.keyCode === 82){

		Game.handler.character.isRegeneratingMana = false;
		//keyHandler["37"] = keyHandler["38"] = keyHandler["39"] = keyHandler["40"] = false;

	};

	if(event.keyCode === 32){

		Game.handler.character.isFighting = false;

	};

	if(event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40){

		keyHandler["37"] = keyHandler["38"]= keyHandler["39"] = keyHandler["40"] = false;

	};


	if(event.keyCode >=  49 && event.keyCode <= 57){

		for(var i = 49;i<58;i++){
			keyHandler[i.toString()] = false;
		};

		Game.handler.character.usingSkill = false;

	}


});
