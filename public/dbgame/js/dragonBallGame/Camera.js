
class Camera{
  constructor(){
    this.handler = Game.handler;
  }


  handleMoveXandMoveY(){

    var player = this.handler.character;
    var level  = this.handler.currentLevel;

    level.moveX = 0;
    level.moveY = 0;
    //by convenction after resizing player.renderY = player.y and after creating new player, player.y = player.renderY
    //maybe it is not beutifull but dont change it, whole camera depends on this principle :)
    player.renderX = Game.handler.character.x;
    player.renderY = Game.handler.character.y;

    if(player.y + player.height/2 < (window.innerHeight)/2) {
      level.moveY += (window.innerHeight - Game.handler.heightOfDisplayWindow)/2;
      player.renderY += (window.innerHeight - Game.handler.heightOfDisplayWindow)/2;
    }
    if(player.renderY + player.height/2 > (window.innerHeight)/2){
      var diffrenceBetweenBottomBorderAndYCenterOfPlayer = (TileStatic.height * level.heightOfMap) - (player.height + player.y);
      if(diffrenceBetweenBottomBorderAndYCenterOfPlayer < Game.handler.heightOfDisplayWindow/2){
        var yChangeTemp = (window.innerHeight - Game.handler.heightOfDisplayWindow)/2 + (Game.handler.heightOfDisplayWindow - diffrenceBetweenBottomBorderAndYCenterOfPlayer);
        level.moveY -= (player.y  - yChangeTemp);
        player.renderY -= (player.y  - yChangeTemp);
      }else {

        while(player.renderY + player.height/2>= Math.floor(window.innerHeight/2)){
          level.moveY -= 1;
          player.renderY -= 1;
        }
      }
    }




    if(player.x + player.width/2< (window.innerWidth)/2 ){
      level.moveX += (window.innerWidth - Game.handler.widthOfDisplayWindow)/2;
      player.renderX += (window.innerWidth - Game.handler.widthOfDisplayWindow)/2;
    }
    if(player.renderX + player.width/2 > (window.innerWidth)/2) {
      var diffrenceBetweenRightBorderAndYCenterOfPlayer = (TileStatic.width * level.widthOfMap) - (player.width/2 + player.x);
      if(diffrenceBetweenRightBorderAndYCenterOfPlayer < Game.handler.widthOfDisplayWindow/2){
        var xChangeTemp = (window.innerWidth - Game.handler.widthOfDisplayWindow)/2 + (Game.handler.widthOfDisplayWindow - diffrenceBetweenRightBorderAndYCenterOfPlayer);
        level.moveX -= (player.x - player.width/2 - xChangeTemp);
        player.renderX -= (player.x - player.width/2 - xChangeTemp);
      }else {

        console.log("im in HEREEEE !!!");
        while(player.renderX + player.width/2 - 3 >= window.innerWidth/2 + 1){
          level.moveX -= 1;
          player.renderX -= 1;
        }
      }
  	}
  }


  setWidthAndHeightOfDisplayWindow(){
    if(window.innerWidth< 550){
      Game.handler.widthOfDisplayWindow = window.innerWidth;
    }else{
      Game.handler.widthOfDisplayWindow = 550;
    }

    if(window.innerHeight< 400){
      Game.handler.heightOfDisplayWindow = window.innerHeight;
    }else{
      Game.handler.heightOfDisplayWindow = 400;
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
