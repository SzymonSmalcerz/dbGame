
class Camera{
  constructor(){
    this.handler = Game.handler;
  }


  tick(){
    return;

    var level = this.handler.currentLevel;
  	var player = this.handler.character;

    if(player.currentSprite === player.right && player.renderX + player.width/2 >= (this.handler.gameCanvasesWidth)/2){

    	if( (player.renderX + player.width -  level.moveX <= player.speed + TileStatic.width * level.widthOfMap - (this.handler.widthOfDisplayWindow)/2)){

  			level.moveX -= player.speed;
        for(var i=0;i<level.statics.length;i++){
  				level.statics[i].renderX-=player.speed;
  			}

        for(var i=0;i<level.players.length;i++){
  				level.players[i].renderX-=player.speed;
  			}
        for(var i=0;i<level.skillTable.length;i++){
  				level.skillTable[i].renderX-=player.speed;
  			}
        for(var i=0;i<level.enemies.length;i++){
  				level.enemies[i].renderX-=player.speed;
  			}
  		}

  	}else if(player.currentSprite === player.left && level.moveX <= (window.innerWidth - this.handler.widthOfDisplayWindow)/2 && (player.renderX + player.width/2 - player.speed  <  (this.handler.gameCanvasesWidth)/2 )){

      level.moveX += player.speed;
      for(var i=0;i<level.statics.length;i++){
        level.statics[i].renderX+=player.speed;
      }
      for(var i=0;i<level.players.length;i++){
        level.players[i].renderX+=player.speed;
      }
      for(var i=0;i<level.enemies.length;i++){
        level.enemies[i].renderX+=player.speed;
      }
      for(var i=0;i<level.skillTable.length;i++){
        level.skillTable[i].renderX+=player.speed;
      }
    }
  	if(player.renderY + player.height/2>= this.handler.gameCanvasesHeight/2){


      if(player.currentSprite === player.down && (player.renderY  - level.moveY  + player.height < player.speed  +  level.heightOfMap *  TileStatic.height - (this.handler.heightOfDisplayWindow/2 ) )){

        level.moveY -= player.speed;
        for(var i=0;i<level.statics.length;i++){
          level.statics[i].renderY-=player.speed;
        }
        for(var i=0;i<level.players.length;i++){
          level.players[i].renderY-=player.speed;
        }
        for(var i=0;i<level.enemies.length;i++){
          level.enemies[i].renderY-=player.speed;
        }
        for(var i=0;i<level.skillTable.length;i++){
  				level.skillTable[i].renderY-=player.speed;
  			}

      }

  	}else if(player.currentSprite === player.up && level.moveY < (window.innerHeight - this.handler.heightOfDisplayWindow)/2 && (player.renderY + player.speed < this.handler.gameCanvasesHeight/2 - player.height)){

      level.moveY += player.speed;
      for(var i=0;i<level.statics.length;i++){
        level.statics[i].renderY+=player.speed;
      }
      for(var i=0;i<level.players.length;i++){
        level.players[i].renderY+=player.speed;
      }
      for(var i=0;i<level.enemies.length;i++){
        level.enemies[i].renderY+=player.speed;
      }
      for(var i=0;i<level.skillTable.length;i++){
        level.skillTable[i].renderY+=player.speed;
      }

    }
  }
}
