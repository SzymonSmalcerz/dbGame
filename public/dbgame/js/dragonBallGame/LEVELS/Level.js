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



  //draw ^^
  draw(){

    //we dont want to draw unneeded tiles and entities so we must declare leftBorderOfDisplayWindow etc
    //we want to draw tiles and entities inside rectangle with width:(leftBorderOfDisplayWindow to right..)
    //and height : (top.. to bottom..)
    //of cource this rectangle must be at the center of the screen

      //creating 4 border points and putting them relatively from the center of the screen
      var leftBorderOfDisplayWindow = window.innerWidth/2 - this.handler.widthOfDisplayWindow/2;
      var rightBorderOfDisplayWindow = window.innerWidth/2 + this.handler.widthOfDisplayWindow/2;

      var topBorderOfDisplayWindow = window.innerHeight/2 - this.handler.heightOfDisplayWindow/2;
      var bottomBorderOfDisplayWindow = window.innerHeight/2 + this.handler.heightOfDisplayWindow/2;






    this.handler.camera.tick();

    //32 is the width and height of tile rectangle, we can assume that it wont change, so we will not
    //stretch for this value to Tile.js file but we will statically type in 32 (faster loading)
  	for(var i = 0;i < this.tiles.length; i++){
  		for(var j = 0;j < this.tiles[i].length; j++){
  			if(  (j*32 + this.moveX) >= leftBorderOfDisplayWindow - 32
          && (j*32 + this.moveX) <= rightBorderOfDisplayWindow + 32
  			  && (i*32 + this.moveY) >= topBorderOfDisplayWindow - 32
          && (i*32 + this.moveY) <= bottomBorderOfDisplayWindow + 32){
  				      this.handler.tiles[this.tiles[i][j]].draw(j*32 + this.moveX, i*32 + this.moveY);
  			}

  		}
  	}


    this.handleEntities();//description of handleEntities above function declaration

  	for(var i=0;i<this.allEntities.length;i++){
      var entityTemp = this.allEntities[i];
  		if(   entityTemp
         && entityTemp.renderX >= leftBorderOfDisplayWindow - entityTemp.width
         && entityTemp.renderX <= rightBorderOfDisplayWindow + entityTemp.width
  			 && entityTemp.renderY >= topBorderOfDisplayWindow - entityTemp.height
         && entityTemp.renderY <= bottomBorderOfDisplayWindow + entityTemp.height){
  			      entityTemp.draw();
  		}

  	};

  }


  //this function just adds all of entities into one table and then sorts this table
  //this one SORTED table of entities is usefull when drawing map
  handleEntities(){

    var tempArrayOfEntities = [];
    var tempArrayOfEnemies = [];
    var tempArrayOfSkills = [];


    for(var i=0;i< this.players.length; i++){
  		tempArrayOfEntities.push(this.players[i]);
  	}

  	for(var i=0;i< this.statics.length; i++){
  		tempArrayOfEntities.push(this.statics[i]);
  	}

    for(var enemyID in this.handler.enemies){

      if (!this.handler.enemies.hasOwnProperty(enemyID)) continue;
      var enemy = this.handler.enemies[enemyID];

      tempArrayOfEnemies.push(enemy);

    }

    for(var i=0;i< this.enemies.length; i++){
      tempArrayOfEntities.push(this.enemies[i]);
    }

    this.skillTable = [];
    for(var skillID in this.handler.skillTable){

      if (!this.handler.skillTable.hasOwnProperty(skillID)) continue;
      var skill = this.handler.skillTable[skillID];

      tempArrayOfSkills.push(skill);

    }
  	for(var i=0;i< this.skillTable.length; i++){
  		tempArrayOfEntities.push(this.skillTable[i]);
  	}

    this.skillTable = tempArrayOfSkills;
    this.enemies = tempArrayOfEnemies;
    this.allEntities = tempArrayOfEntities;
  	this.sortEntityTable();
  }

}
