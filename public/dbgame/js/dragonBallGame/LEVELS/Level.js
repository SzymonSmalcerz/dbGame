class Level{
  //constructor(tilesTable,teleportsCoords,maxNumOfEnemies){
  constructor(dataFromServer){
    this.handler = Game.handler;
  	this.players = [Game.handler.character];
  	this.enemies = [];

  	this.statics = [];
  	this.allEntities = [];
  	this.skillTable = [];

    Object.defineProperty(this, "tiles", {
      value : dataFromServer.table,
      writable : false,
      enumerable : true,
      configurable : false
    })
    Object.freeze(this.tiles);

    Object.defineProperty(this, "maxNumOfEnemies", {
      value : dataFromServer.maxNumOfEnemies || 50,
      writable : false,
      enumerable : true,
      configurable : false
    })
    Object.freeze(this.maxNumOfEnemies);

    Object.defineProperty(this, "teleportsTable", {
      value : dataFromServer.teleportsTable,
      writable : false,
      enumerable : true,
      configurable : false
    })
    Object.freeze(this.teleportsTable);

  	this.moveX = 0; // this two variables used onlyt to "move" tiles while moving player
  	this.moveY = 0; //

  	this.widthOfMap = this.tiles[0].length;	//not scaled !!!!
  	this.heightOfMap = this.tiles.length;
  }

  sortEntityTable(){ //sorting for drawing purposes
  	var temp;
  	for(var i =0;i<this.allEntities.length;i++){
  		for(var j=0;j<this.allEntities.length;j++){
        //flat rendering => tile on tile we do not want it to be sorted
  			if((this.allEntities[i].flatRendering  || (this.allEntities[i] && this.allEntities[j] && this.allEntities[i].y + this.allEntities[i].height < this.allEntities[j].y + this.allEntities[j].height)) && !this.allEntities[j].flatRendering){
  				temp = this.allEntities[i];
  				this.allEntities[i] = this.allEntities[j];
  				this.allEntities[j] = temp;
  			}
  		}
  	}
  };

  tick(){
    this.draw(); //first draw then tick !!! otherwise not working
    this.handler.character.tick();
    for(var i =0;i<this.teleportsTable.length;i++){

      if(this.handler.character.x >= this.teleportsTable[i].xl && this.handler.character.x <= this.teleportsTable[i].xr){
        if(this.handler.character.y >= this.teleportsTable[i].yu && this.handler.character.y <= this.teleportsTable[i].yd)
          socket.emit("changeLevel", { idOfPlayer : this.handler.character.id});
      }
    }
  };




  draw(){

    this.handler.camera.tick();
  	for(var i = 0;i < this.tiles.length; i++){
  		for(var j = 0;j < this.tiles[i].length; j++){
  			if((j*32 + this.moveX) * this.handler.scale >= -(32*this.handler.scale) && (j*32 + this.moveX) * this.handler.scale <= window.innerWidth + (32*this.handler.scale)
  				&& ( i*32 + this.moveY) * this.handler.scale >= -(32*this.handler.scale) &&  (i*32 + this.moveY) * this.handler.scale <= window.innerHeight + (32*this.handler.scale)){
  				this.handler.tiles[this.tiles[i][j]].draw(j*32 + this.moveX, i*32 + this.moveY);

  			}

  		}
  	}

    this.handleEntities();
  	for(var i=0;i<this.allEntities.length;i++){
  		if(this.allEntities[i] && this.allEntities[i].renderX>= -(this.allEntities[i].width) && this.allEntities[i].renderX <= window.innerWidth + this.allEntities[i].width
  					&& this.allEntities[i].renderY>= -(this.allEntities[i].height) &&  this.allEntities[i].renderY<= window.innerHeight + this.allEntities[i].height){
  			this.allEntities[i].draw();
  		}

  	};

  }

  handleEntities(){
    this.allEntities = [];


    for(var i=0;i< this.players.length; i++){
  		this.allEntities.push(this.players[i]);
  	}

  	for(var i=0;i< this.statics.length; i++){
  		this.allEntities.push(this.statics[i]);
  	}
    this.enemies = [];
    for(var enemyID in this.handler.enemies){

      if (!this.handler.enemies.hasOwnProperty(enemyID)) continue;
      var enemy = this.handler.enemies[enemyID];

      this.enemies.push(enemy);

    }

    for(var i=0;i< this.enemies.length; i++){
      this.allEntities.push(this.enemies[i]);
    }

    this.skillTable = [];
    for(var skillID in this.handler.skillTable){

      if (!this.handler.skillTable.hasOwnProperty(skillID)) continue;
      var skill = this.handler.skillTable[skillID];

      this.skillTable.push(skill);

    }
  	for(var i=0;i< this.skillTable.length; i++){
  		this.allEntities.push(this.skillTable[i]);
  	}


  	this.sortEntityTable();
  }

}
