
class Camera{
  constructor(){
    this.handler = Game.handler;
  }


  tick(){
    var level = this.handler.currentLevel;
  	var player = this.handler.character;

    if(player.renderX + player.width/2 >= window.innerWidth/2 ){

    	if(player.currentSprite === player.left && level.moveX <= 0 && (player.renderX + player.width/2 - player.speed < window.innerWidth/2)){

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
  		}else if(player.currentSprite === player.right && (player.renderX + player.width/2 - this.handler.scale * level.moveX <  TileStatic.width * level.widthOfMap - window.innerWidth/2)){

  			level.moveX -= player.speed;
        for(var i=0;i<level.statics.length;i++){
  				level.statics[i].renderX-=player.speed;
  			}
        for(var i=0;i<level.players.length;i++){
  				level.players[i].renderX-=player.speed;
  			}
        for(var i=0;i<level.enemies.length;i++){
  				level.enemies[i].renderX-=player.speed;
  			}
  		}

  	}
  	if(player.renderY + player.height>= window.innerHeight/2){

  		if(player.currentSprite === player.up && level.moveY <0 && (player.renderY + player.height/2 - player.speed < window.innerHeight/2)){

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

  		}else if(player.currentSprite === player.down && (player.renderY + player.height/2 - level.moveY < level.heightOfMap *  TileStatic.height - window.innerHeight/2)){

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

  		}

  	}
  }
}
