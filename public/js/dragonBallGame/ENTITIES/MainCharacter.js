
class MainCharacter extends Mob{
  constructor(id){

    super(id,"./js/dragonBallGame/sprites/spriteGokuSupix.png",[[{x:11,y:11},{x:12,y:7},{x:4,y:2},{x:11,y:1}],[{x:10,y:1},{x:3,y:2}],
    [{x:1,y:11},{x:13,y:11},{x:9,y:11},{x:5,y:11}],[{x:0,y:11},{x:12,y:11},{x:8,y:11},{x:4,y:11}],
    [{x:9,y:3},{x:11,y:9},{x:2,y:4},{x:6,y:4},{x:10,y:8},{x:0,y:6},{x:4,y:6}],[{x:14,y:5},{x:3,y:6},{x:13,y:8},{x:14,y:5},{x:12,y:3},{x:1,y:4},{x:5,y:4}],
    [{x:13,y:9},{x:5,y:5},{x:2,y:6},{x:1,y:5}],[{x:12,y:9},{x:4,y:5},{x:1,y:6},{x:0,y:5}],
    [{x:1,y:0}]],100,100);

    //this.id = //TODO change IT !!!!!!!!
    Game.handler.character = this; //TODO LOOK IF IT WORKS !!!!
    Game.handler.players[this.id] = this;
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

    	this.isFighting = false;
    	this.usingSkill = false;


      socket.emit('message',"user " + this.id + " has been created");
      socket.emit('playerCreation',{
        x : this.x,
        y : this.y,
        currentSprite : this.currentSprite,
        id : this.id
      });

  }

  tick(){
    //TEMPORARY ADDED BELOW @@@@@@@@@@@@@@@@@@@@@@@@@@@@
    socket.emit('userData',{
      x : this.x,
      y : this.y,
      currentSprite : this.currentSprite,
      id : this.id
    });

  	if(this.health < 0){
  		this.health = 0;
  	}

    this.currentSprite = this.idle;

    if(keyHandler["37"] || keyHandler["38"] || keyHandler["39"] || keyHandler["40"] ){

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

  	};

    if(this.isRegeneratingMana ){


  		this.currentSprite =	[{x:3,y:10},{x:4,y:10},{x:5,y:10},{x:6,y:10},{x:7,y:10},{x:8,y:10}];
  		if(this.mana + 1.6 < this.maxMana)
  		{
  			this.mana += 1.6;
  		}

  		return;

  	}

    if(this.isFighting){

  		var enemies = this.handler.currentLevel.enemies;
  		if(this.currentSprite === this.idleLeft){
  			this.currentSprite = this.left_fight;

  			for(var i = 0; i<enemies.length; i++){
  				if( player.y + player.height *0.9 - 2.0 * player.collisionWidth <= enemies[i].y + enemies[i].height*0.9 - 0.5 * enemies[i].collisionHeight
  				   && player.y + player.height *0.9 + player.collisionWidth >= enemies[i].y + enemies[i].height*0.9 - 0.5 * enemies[i].collisionHeight
  				   && player.x + (player.width - player.collisionWidth)/2 >= enemies[i].x + (enemies[i].width + enemies[i].collisionWidth)/2
  				   && player.x + player.width/2 - 3.0*player.collisionWidth/2 <= enemies[i].x + (enemies[i].width + enemies[i].collisionWidth)/2
  				   ){
  					enemies[i].getDamage(this.damage);

  				};
  			};


  		}else if(this.currentSprite === this.idleRight){
  			this.currentSprite = this.right_fight;

  			for(var i = 0; i<enemies.length; i++){
  				if( player.y + player.height *0.9 - 2.0 * player.collisionWidth <= enemies[i].y + enemies[i].height*0.9 - 0.5 * enemies[i].collisionHeight
  				   && player.y + player.height *0.9 + player.collisionWidth >= enemies[i].y + enemies[i].height*0.9 - 0.5 * enemies[i].collisionHeight
  				   && player.x + (player.width + player.collisionWidth)/2 <= enemies[i].x + (enemies[i].width - enemies[i].collisionWidth)/2
  				   && player.x + (player.width + 3.0* player.collisionWidth)/2 >= enemies[i].x + (enemies[i].width - enemies[i].collisionWidth)/2
  				   ){
  					enemies[i].getDamage(this.damage);

  				};



  			};

  		}else if(this.currentSprite === this.idleUp){
  			this.currentSprite = this.up_fight;


  			for(var i = 0; i<enemies.length; i++){
  				if(this.x + this.width	>= enemies[i].x + enemies[i].width/2
  				   && this.x <= enemies[i].x + enemies[i].width/2
  				   && player.y + 0.9 * player.height - player.collisionHeight >= enemies[i].y + enemies[i].height * 0.9
  				   && player.y + 0.9 * player.height - 2.0*player.collisionHeight <= enemies[i].y + enemies[i].height * 0.9
  				   ){
  					enemies[i].getDamage(this.damage);


  				};
  			};
  		}else if(this.currentSprite === this.idleDown){
  			this.currentSprite = this.down_fight;

  			for(var i = 0; i<enemies.length; i++){
  				if(this.x + this.width	>= enemies[i].x + enemies[i].width/2
  				   && this.x <= enemies[i].x + enemies[i].width/2
  				   && player.y + 0.9 * player.height <= enemies[i].y + enemies[i].height * 0.9 - enemies[i].collisionHeight
  				   && player.y + 0.9 * player.height + player.collisionHeight >= enemies[i].y + enemies[i].height * 0.9 - enemies[i].collisionHeight
  				   ){
  					enemies[i].getDamage(this.damage);

  				};
  			};
  		}

  		return;
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
