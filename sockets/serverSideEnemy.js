const {EnemySprites} = require("./Sprites");

const Static = {
  getTreeData : function(x,y){
    return {

        type : "tree",
        x : x,
        y: y,
        collisionHeight : 64/8,//collision height
        collisionWidth : 128/3, //collision width
        width : 128, //width
        height : 128//height

    }
  },getHouse1Data : function(x,y){
    return {

        type : "house1",
        x : x,
        y: y,
        collisionHeight : 128/5,//collision height
        collisionWidth : 128/1.05, //collision width
        width : 128, //width
        height : 128//height

    }
  },getHouse2Data : function(x,y){
    return {

        type : "house2",
        x : x,
        y: y,
        collisionHeight : 210/5,//collision height
        collisionWidth : 128*0.87, //collision width
        width : 128, //width
        height : 210//height

    }
  }
}

const playerStatics = {
  width : 32,
  height : 32,
  collisionWidth : 32/3,
  collisionHeight : 32/3
}

class Enemy{

  constructor(io,connectedPlayersData,enemiesData,tableOfSockets,statics,id,moveSprite,x,y,width,height,collisionHeight,collisionWidth,manaRegeneration,healthRegeneration,health,damage,speed,mana,range){

    this.range = range || 400;
    this.id = id || Math.floor((Math.random() * 100000) + 1);
    this.width = width || 32;
    this.height = height || 32;
    this.collisionHeight = collisionHeight || this.height/3;
  	this.collisionWidth = collisionWidth || this.width/3 ;
    this.tickCounter = 0;

    //SPRITES
    this.up = moveSprite.up;
  	this.left = moveSprite.left;
  	this.right = moveSprite.right;
  	this.down = moveSprite.down;
  	this.up_fight = moveSprite.up_fight;
  	this.down_fight = moveSprite.down_fight;
  	this.left_fight = moveSprite.left_fight;
  	this.right_fight = moveSprite.right_fight;
  	this.idle = moveSprite.idle;
    this.currentSprite = this.idle;


    //OTHER ENTITIES ON MAP
    this.tableOfSockets = tableOfSockets;
    this.connectedPlayersData = connectedPlayersData;
    this.enemiesData = enemiesData;
    this.statics = statics;

    //PHYSICS AND LOGIC THINGS BELOW
    this.x = x;
    this.y = y;
    this.mana = mana || 100;
  	this.maxMana = mana || 100;
    this.health = health || 1000;
    this.maxHealth = health || 1000;
    this.damage = damage || 5;
    this.speed = speed || 4.5;
    this.manaRegeneration = manaRegeneration || mana/400 || 2.5;
    this.healthRegeneration = healthRegeneration || health/400 || 10;
    this.experience = 10;

    this.io = io;



  }

  checkForCollisionWithStaticEntity(staticEntity,directionOfThisEnemyMovement){
    if(directionOfThisEnemyMovement == "right"){
      for(var staticEntityID in this.statics){

        if (!this.statics.hasOwnProperty(staticEntityID)) continue;
        var staticEntity = this.statics[staticEntityID]
        var de = this.y + this.height * 0.9;
        var ge = de - this.collisionHeight;
        var ds = staticEntity.y + staticEntity.height * 0.9;
        var gs = ds - staticEntity.collisionHeight;
        if(staticEntity.x + (staticEntity.width - staticEntity.collisionWidth)/2 < this.x + (this.width + this.collisionWidth)/2 &&
           staticEntity.x + (staticEntity.width - staticEntity.collisionWidth)/2 > this.x + (this.width - this.collisionWidth)/2 &&
           Math.abs(ge - gs) + Math.abs(de - ds) < this.collisionHeight + staticEntity.collisionHeight){
            //  console.log("RIGHT BLOCK BY: ", staticEntity)
          return true;
        }
      }
    }else if(directionOfThisEnemyMovement == "left"){
      for(var staticEntityID in this.statics){

        if (!this.statics.hasOwnProperty(staticEntityID)) continue;
        var staticEntity = this.statics[staticEntityID]
        var de = this.y + this.height * 0.9;
        var ge = de - this.collisionHeight;
        var ds = staticEntity.y + staticEntity.height * 0.9;
        var gs = ds - staticEntity.collisionHeight;
        if(staticEntity.x + (staticEntity.width + staticEntity.collisionWidth)/2 > this.x + (this.width - this.collisionWidth)/2 &&
           staticEntity.x + (staticEntity.width + staticEntity.collisionWidth)/2 < this.x + (this.width + this.collisionWidth)/2 &&
           Math.abs(ge - gs) + Math.abs(de - ds) < this.collisionHeight + staticEntity.collisionHeight){
            //  console.log("LEFT BLOCK BY: ", staticEntity)
          return true;
        }
      }
    }else if(directionOfThisEnemyMovement == "down"){
      for(var staticEntityID in this.statics){

        if (!this.statics.hasOwnProperty(staticEntityID)) continue;
        var staticEntity = this.statics[staticEntityID]
        var le = this.x + this.width/2 - this.collisionWidth/2;
        var pe = this.x + this.width/2 + this.collisionWidth/2;
        var ls = staticEntity.x + staticEntity.width/2 - staticEntity.collisionWidth/2;
        var ps = staticEntity.x + staticEntity.width/2 + staticEntity.collisionWidth/2;
        // console.log("___________________________" + "\n" + ps + "\n" + pe + "\n" + ls + "\n" + le)
        if(this.y + this.height*0.9 > staticEntity.y + staticEntity.height*0.9 - staticEntity.collisionHeight &&
           this.y + this.height*0.9 - this.collisionHeight < staticEntity.y + staticEntity.height*0.9 - staticEntity.collisionHeight &&
           Math.abs(le - ls) + Math.abs(pe - ps) < this.collisionWidth + staticEntity.collisionWidth ){
            //  console.log("DOWN BLOCK BY: ", staticEntity)
          return true;
        }
      }
    }else if(directionOfThisEnemyMovement == "up"){
      for(var staticEntityID in this.statics){

        if (!this.statics.hasOwnProperty(staticEntityID)) continue;
        var staticEntity = this.statics[staticEntityID]
        var le = this.x + this.width/2 - this.collisionWidth/2;
        var pe = this.x + this.width/2 + this.collisionWidth/2;
        var ls = staticEntity.x + staticEntity.width/2 - staticEntity.collisionWidth/2;
        var ps = staticEntity.x + staticEntity.width/2 + staticEntity.collisionWidth/2;
        if(this.y + this.height*0.9 - this.collisionHeight < staticEntity.y + staticEntity.height*0.9 &&
           this.y + this.height*0.9 > staticEntity.y + staticEntity.height*0.9 &&
           Math.abs(le - ls) + Math.abs(pe - ps) < this.collisionWidth  + staticEntity.collisionWidth ){
            //  console.log("UP BLOCK BY: ", staticEntity)
          return true;
        }
      }
    }

    return false;
  }

  checkForCollisionWithPlayer(player){



    	  if(player.y + playerStatics.height*0.9 - playerStatics.collisionHeight/2 >= this.y + this.height*0.9 - this.collisionHeight - this.speed
         && player.y + playerStatics.height*0.9- playerStatics.collisionHeight/2 <= this.y + this.height*0.9  + this.collisionHeight  + this.speed){


    		if(player.x + (playerStatics.width + playerStatics.collisionWidth)/2 <= this.x + (this.width - this.collisionWidth)/2
    	       && player.x + (playerStatics.width + playerStatics.collisionWidth)/2 + this.collisionWidth*3/2 > this.x + (this.width - this.collisionWidth)/2){


          player.health -= this.damage;
    			this.currentSprite = this.left_fight;
    			return true;
    		}else if(player.x + (playerStatics.width - playerStatics.collisionWidth)/2 >= this.x + this.width/2
    	             && player.x + (playerStatics.width - playerStatics.collisionWidth)/2 < this.x + this.width + this.collisionWidth){

          player.health -= this.damage;
    			this.currentSprite = this.right_fight;
    			return true;
    		}


    	}

    	if(player.x + playerStatics.width/2 >= this.x + this.width/2 - this.collisionWidth*3/2 - this.speed
    			 && player.x + playerStatics.width/2 <= this.x + this.width/2 + this.collisionWidth*3/2 + this.speed){


    		if(player.y + playerStatics.height*0.9 - playerStatics.collisionHeight/2 <= this.y + this.height*0.9 - this.collisionHeight/2
    		   && player.y + playerStatics.height*0.9 - playerStatics.collisionHeight/2 + this.collisionHeight*3/2 >= this.y + this.height*0.9 - this.collisionHeight/2){

          player.health -= this.damage;
    			this.currentSprite = this.up_fight;
    			return true;
    		}else if(player.y + playerStatics.height*0.9 - playerStatics.collisionHeight/2 -this.collisionHeight*3/2 <= this.y + this.height*0.9 - this.collisionHeight/2
    		   && player.y + playerStatics.height*0.9 - playerStatics.collisionHeight/2 >= this.y + this.height*0.9 - this.collisionHeight/2){

          player.health -= this.damage;
    			this.currentSprite = this.down_fight;
    			return true;
    		}

    	}


    return false;

  };

  tick(){

    this.currentSprite = this.idle;


    for (var playerID in this.connectedPlayersData) {
        // skip loop if the property is from prototype
      if (!this.connectedPlayersData.hasOwnProperty(playerID)) continue;


      var player = this.connectedPlayersData[playerID].gameData;

    	if(!this.checkForCollisionWithPlayer(player)){

    		if(Math.sqrt(Math.pow((player.x - this.x),2) + Math.pow((player.y - this.y),2)) < this.range){


    			if(player.x + (playerStatics.width + playerStatics.collisionWidth)/2 + this.speed< this.x + (this.width - this.collisionWidth)/2){
    				this.move(-1,0);
            this.emitTick();
            return;
    			}else if(player.x + (playerStatics.width - playerStatics.collisionWidth)/2 - this.speed > this.x + (this.width + this.collisionWidth)/2){
            this.move(1,0);
            this.emitTick();
            return;
    			}else if(player.y + playerStatics.height*0.9 + this.speed < this.y + this.height * 0.9 - this.collisionHeight){
            this.move(0,-1);
            this.emitTick();
            return;
    			}else if(player.y + playerStatics.height*0.9 - playerStatics.collisionWidth - this.speed > this.y + this.height * 0.9){
            this.move(0,1);
            this.emitTick();
            return;
    			}

    		};
      }else{
        this.emitTick();
        return;
      }
    }

    this.emitTick();

};

  emitTick(){
    this.handleManaAndHp();
    for(var playerID in this.connectedPlayersData){
      if(!this.connectedPlayersData.hasOwnProperty(playerID)) continue;

      var player = this.connectedPlayersData[playerID].gameData;

      var realRangeWidth;
      var realRangeHeight;

      var dp; //down corner of player
      var up; //up corner ..
      var lp; //left corner ..
      var rp; //right corenr ..

      if(player.x + player.width + player.speed >= player.rangeOfSeeingWidth){

        if(player.x  >= player.rangeOfSeeingWidth){
          lp = player.x - player.rangeOfSeeingWidth*2 - this.width;
        }else{
          lp = player.x - player.rangeOfSeeingWidth - this.width;
        }

        rp = player.x + player.rangeOfSeeingWidth + this.width;
      }else{
        lp = 0 - this.width;
        rp = 2*player.rangeOfSeeingWidth + this.width;
      }

      if(player.y + player.height + player.speed >= player.rangeOfSeeingHeight){
        if(player.y >= player.rangeOfSeeingHeight){
          up = player.y - player.rangeOfSeeingHeight*2 - this.height;
        }else{
          up = player.y - player.rangeOfSeeingHeight - this.height;
        }

        dp = player.y + player.rangeOfSeeingHeight + this.height + player.height;

      }else{
        up = 0 - this.width;
        dp = 2*player.rangeOfSeeingHeight + this.height;
      }

      if(this.x >= lp && this.x <= rp && this.y <= dp && this.y >= up){
        this.tableOfSockets[player.id].emit("enemyTick",{
         id : this.id,
         x : this.x,
         y : this.y,
         currentSprite : this.currentSprite,
         health : this.health,
         maxHealth : this.maxHealth,
         mana : this.mana,
         maxMana : this.maxMana,
         width : this.width,
         height : this.height,
         collisionWidth : this.collisionWidth,
         collisionHeight : this.collisionHeight,
         speed : this.speed
       });
      }

    }

 };

  handleManaAndHp(){
    if(this.health < this.maxHealth){
      this.health += this.healthRegeneration;
    }

    if(this.mana < this.maxMana){
      this.mana += this.manaRegeneration;
    }
  };

  move(x,y){



    this.currentSprite = this.idle;
  	if(x > 0){

      for (var playerID in this.connectedPlayersData) {
          // skip loop if the property is from prototype
        if (!this.connectedPlayersData.hasOwnProperty(playerID)) continue;


        var player = this.connectedPlayersData[playerID].gameData;
        if(player.x + player.width/2 - player.collisionWidth/2 > this.x + this.speed + this.width/2 + this.collisionWidth/2 ){

          for(var staticEntity in this.statics){

            if (!this.statics.hasOwnProperty(staticEntity)) continue;
            if(this.checkForCollisionWithStaticEntity(staticEntity,"right")){

              return;
            }
          }
          this.x += this.speed;
  				this.currentSprite = this.right;
          break;
        }

      }
  	}else if(x < 0){

      for (var playerID in this.connectedPlayersData) {
          // skip loop if the property is from prototype
        if (!this.connectedPlayersData.hasOwnProperty(playerID)) continue;


        var player = this.connectedPlayersData[playerID].gameData;
        if(player.x + player.width/2 + player.collisionWidth/2 < this.x - this.speed + this.width/2 - this.collisionWidth/2 ){

          for(var staticEntity in this.statics){

            if (!this.statics.hasOwnProperty(staticEntity)) continue;
            if(this.checkForCollisionWithStaticEntity(staticEntity,"left")){

              return;
            }
          }
          this.x -= this.speed;

  				this.currentSprite = this.left;
          break;
        }

      }
    }else if(y > 0){

      for (var playerID in this.connectedPlayersData) {
          // skip loop if the property is from prototype
        if (!this.connectedPlayersData.hasOwnProperty(playerID)) continue;


        var player = this.connectedPlayersData[playerID].gameData;

        if(player.y + player.height * 0.9 - player.collisionHeight > this.y + this.speed - this.height * 0.9){
          for(var staticEntity in this.statics){

            if (!this.statics.hasOwnProperty(staticEntity)) continue;
            if(this.checkForCollisionWithStaticEntity(staticEntity,"down")){

              return;
            }
          }
          this.y += this.speed;
  				this.currentSprite = this.down;
          break;
        }

      }
  	}else if(y < 0){

      for (var playerID in this.connectedPlayersData) {
          // skip loop if the property is from prototype
        if (!this.connectedPlayersData.hasOwnProperty(playerID)) continue;


        var player = this.connectedPlayersData[playerID].gameData;

        if(player.y - player.height * 0.9 < this.y - this.speed + this.height * 0.9 - this.collisionHeight){
          for(var staticEntity in this.statics){

            if (!this.statics.hasOwnProperty(staticEntity)) continue;
            if(this.checkForCollisionWithStaticEntity(staticEntity,"up")){

              return;
            }
          }
          this.y -= this.speed;
  				this.currentSprite = this.up;
          break;
        }

      }
  	}
  }
}




class Hit extends Enemy{

	constructor(id,x,y,connectedPlayersData,enemiesData,tableOfSockets,statics,io){
    super( io,connectedPlayersData,enemiesData,tableOfSockets,statics,id,EnemySprites.hit,x,y)
    this.type = "hit";
    this.experience = 2000;
    this.health = 1500;
    this.maxHealth = 1500;
    this.damage = 5;
  }

}

class Hulk extends Enemy{
  constructor(id,x,y,connectedPlayersData,enemiesData,tableOfSockets,statics,io){
    super( io,connectedPlayersData,enemiesData,tableOfSockets,statics,id,EnemySprites.hulk,x,y,100,100,25)
    this.type = "hulk";
    this.experience = 3000;
    this.health = 3000;
    this.maxHealth = 3000;
    this.damage = 15;
  }
}

class Dragon extends Enemy{
  constructor(id,x,y,connectedPlayersData,enemiesData,tableOfSockets,statics,io){
    super( io,connectedPlayersData,enemiesData,tableOfSockets,statics,id,EnemySprites.dragon,x,y,50,50);
    this.type = "dragon";
    this.experience = 2000;
    this.health = 700;
    this.maxHealth = 700;
    this.damage = 5;
  }
}


class Yeti extends Enemy{
  constructor(id,x,y,connectedPlayersData,enemiesData,tableOfSockets,statics,io){
    super( io,connectedPlayersData,enemiesData,tableOfSockets,statics,id,EnemySprites.yeti,x,y,80,80);
    this.type = "yeti";
    this.experience = 1500;
    this.health = 500;
    this.maxHealth = 500;
    this.damage = 3;
  }
}



module.exports = {
  Enemy,
  Hit,
  Hulk,
  Dragon,
  Yeti,
  Static
}
