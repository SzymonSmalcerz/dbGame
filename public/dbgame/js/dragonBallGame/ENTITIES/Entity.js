class Entity{

  constructor(x,y){

    this.handler = Game.handler


    this.x = x;
    this.renderX = x;
    this.y = y;
    this.renderY = y;

    this.tickCounter = 0;


    //flat rendering -> it means that every entity that has set flatRendering will be rendered at the beginning
    this.flatRendering = false;
  }
}
