class Level{
  constructor(tilesTable,statics,players,enemies,npcs,maxNumOfEnemies){
    this.handler = Game.handler;
  	this.players = players || [];
  	this.enemies = enemies || [];
    this.maxNumOfEnemies = maxNumOfEnemies;
  	this.statics = statics || [];
  	this.npcs = npcs || [];
  	this.tiles = tilesTable || [];
  	this.allEntities = [];
  	this.shoots = [];

  	this.moveX = 0; // this two variables used onlyt to "move" tiles while moving player
  	this.moveY = 0; //

  	this.widthOfMap = tilesTable[0].length;	//not scaled !!!!
  	this.heightOfMap = tilesTable.length;
  }

  sortEntityTable(){ //sorting for drawing purposes

  	var temp;

  	for(var i =0;i<this.allEntities.length;i++){
  		for(var j=0;j<this.allEntities.length;j++){
        // TODO TODO TODO TODO TODO TODO TODO TODO
  			if(this.allEntities[i] && this.allEntities[j] && this.allEntities[i].y + this.allEntities[i].height < this.allEntities[j].y + this.allEntities[j].height){
  				temp = this.allEntities[i];
  				this.allEntities[i] = this.allEntities[j];
  				this.allEntities[j] = temp;
  			}
  		}
  	}
  }

  tick(){
    this.draw(); //first draw then tick !!! otherwise not working

    this.handler.character.tick();
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
      // TODO TODO TODO TODO TODO TODO TODO TODO
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
  	for(var i=0;i< this.shoots.length; i++){
  		this.allEntities.push(this.shoots[i]);
  		//console.log(this.shoots[i]);
  	}


  	this.sortEntityTable();
  }

}
