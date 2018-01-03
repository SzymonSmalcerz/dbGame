class Enemy extends Mob{
  constructor(id,sprite,x,y){
    super(id,sprite,x,y);
  }
}


const hitSprite = new Image();
class Hit extends Enemy{
	constructor(id,x,y){
    if(!hitSprite.src)
      hitSprite.src = "dbgame/js/dragonBallGame/sprites/hitSprite.png";
    super(id,hitSprite,x,y);
  }
}

const darkKnightSprite = new Image();
class DarkKnight extends Enemy{
	constructor(id,x,y){
    if(!darkKnightSprite.src)
      darkKnightSprite.src = "dbgame/js/dragonBallGame/sprites/darkKnightSprite.png";
    super(id,darkKnightSprite,x,y);
  }
}


const hulkSprite = new Image();
class Hulk extends Enemy{
  constructor(id,x,y){
    if(!hulkSprite.src)
      hulkSprite.src = "dbgame/js/dragonBallGame/sprites/hulkSprite.png";
    super(id,hulkSprite,x,y);
  }
}


const dragonSprite = new Image();
class Dragon extends Enemy{
  constructor(id,x,y){
    if(!dragonSprite.src)
      dragonSprite.src = "dbgame/js/dragonBallGame/sprites/dragonSprite.png";
    super(id,dragonSprite,x,y);
  }
}

const minionSkeletonSprite = new Image();
class MinionSkeleton extends Enemy{
  constructor(id,x,y){
    if(!minionSkeletonSprite.src)
      minionSkeletonSprite.src = "dbgame/js/dragonBallGame/sprites/minionSkeletonSprite.png";
    super(id,minionSkeletonSprite,x,y);
  }
}


const yetiSprite = new Image();
class Yeti extends Enemy{
  constructor(id,x,y){
    if(!yetiSprite.src)
      yetiSprite.src = "dbgame/js/dragonBallGame/sprites/yetiSprite.png";
    super(id,yetiSprite,x,y);
  }
}
