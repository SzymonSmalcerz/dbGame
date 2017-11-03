const spriteOtherPlayer = new Image();
class OtherPlayer extends Mob{
  constructor(id){
    spriteOtherPlayer.src = "dbgame/js/dragonBallGame/sprites/spriteGokuSupix.png";
    super(id,spriteOtherPlayer);
  }
}
