
class Camera{
  constructor(){
    this.handler = Game.handler;
  }


  setWidthAndHeightOfDisplayWindow(){
    if(window.innerWidth- 300 < 800){
      Game.handler.widthOfDisplayWindow = window.innerWidth- 300;
    }else{
      Game.handler.widthOfDisplayWindow = 800;
    }

    if(window.innerHeight - 300 < 450){
      Game.handler.heightOfDisplayWindow = window.innerHeight - 300;
    }else{
      Game.handler.heightOfDisplayWindow = 450;
    }
  }


  tick(){

    var level = this.handler.currentLevel;
  	var player = this.handler.character;

    if(player.currentSprite === player.right && player.renderX + player.width/2 >= (this.handler.gameCanvasesWidth)/2){


      if(player.x + player.width + player.speed <= TileStatic.width * level.widthOfMap - Game.handler.widthOfDisplayWindow/2){

        while(player.renderX + player.width/2 - 3 >= window.innerWidth/2 + 1){
          level.moveX -= 1;
          player.renderX -= 1;
        }

  		}

  	}else if(player.currentSprite === player.left && player.renderX + player.width/2 <= this.handler.gameCanvasesWidth/2){

      if(player.x + player.width/2 >=Game.handler.widthOfDisplayWindow/2){

        while(player.renderX + player.width/2 <= window.innerWidth/2 + 4){
          level.moveX += 1;
          player.renderX += 1;
        }

  		}
    }
  	if(player.currentSprite === player.down && player.renderY >= this.handler.gameCanvasesHeight/2){


      if(player.y + player.height <=(TileStatic.height * level.heightOfMap - Game.handler.heightOfDisplayWindow/2)){

        while(player.renderY >= window.innerHeight/2){
          level.moveY -= 1;
          player.renderY -= 1;
        }

  		}

  	}else if(player.currentSprite === player.up && (player.renderY  <= this.handler.gameCanvasesHeight/2)){

      if(player.y + player.height >=Game.handler.heightOfDisplayWindow/2){

        while(player.renderY + player.height<= window.innerHeight/2){
          level.moveY += 1;
          player.renderY += 1;
        }

  		}

    }
  }
}
