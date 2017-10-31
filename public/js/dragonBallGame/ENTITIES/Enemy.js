class Enemy extends Mob{

  constructor(id,spritePath,moveTable,x,y,width,height,collisionHeight,collisionWidth,manaRegeneration,healthRegeneration,health,damage,speed,mana,range){
    super(id,spritePath,moveTable,x,y,width,height,collisionHeight,collisionWidth,manaRegeneration,healthRegeneration,health,damage,speed,mana);
    this.range = range;
    this.handler = Game.handler;
  }

}


class Hit extends Enemy{ // TODO ;_;

	constructor(id,x,y){
    var id = id;
    var up = [{x:4,y:9},{x:8,y:9}];
    var left = [{x:6,y:9},{x:10,y:9}];
    var right = [{x:5,y:9},{x:9,y:9}];
    var down = [{x:3,y:9},{x:7,y:9}];


    var up_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}];
    var down_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}];
    var left_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}];
    var right_fight = [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}];

    var idle = [{x:13,y:8},{x:14,y:8},{x:0,y:9},{x:1,y:9}];


    super(id,"./js/dragonBallGame/sprites/hitSprite.png",[ up, down, left, right, up_fight, down_fight, left_fight, right_fight, idle],x,y);
    this.up = [{x:4,y:9},{x:8,y:9}];
  	this.left = [{x:6,y:9},{x:10,y:9}];
  	this.right = [{x:5,y:9},{x:9,y:9}];
  	this.down = [{x:3,y:9},{x:7,y:9}];


  	this.up_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}];
  	this.down_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}];
  	this.left_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}];
  	this.right_fight = [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}];

  	this.idle = [{x:13,y:8},{x:14,y:8},{x:0,y:9},{x:1,y:9}];
  }

}


class Hulk extends Enemy{
  constructor(id,x,y){
    var up = [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2}];
    var left = [{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3},{x:5,y:3}];
    var right = [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2}];
    var down = [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2}];


    var up_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}];
    var down_fight = [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}];
    var left_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}];
    var right_fight = [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}];

    var idle = [{x:3,y:0},{x:3,y:0},{x:3,y:0},{x:3,y:0},{x:4,y:0},{x:4,y:0}];

    super(id,"./js/dragonBallGame/sprites/hulkSprite.png",[ up, down, left, right, up_fight, down_fight, left_fight, right_fight, idle],x,y,100,100,25);

    this.up = [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2}];
  	this.left = [{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3},{x:5,y:3}];
  	this.right = [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2}];
  	this.down = [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2}];


  	this.up_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}];
  	this.down_fight = [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}];
  	this.left_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}];
  	this.right_fight = [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}];

  	this.idle = [{x:3,y:0},{x:3,y:0},{x:3,y:0},{x:3,y:0},{x:4,y:0},{x:4,y:0}];
  }
}


class Dragon extends Enemy{
  constructor(id,x,y){
    var up = [{x:0,y:3},{x:1,y:3},{x:2,y:3}];
  	var left = [{x:0,y:1},{x:1,y:1},{x:2,y:1}];
  	var right = [{x:0,y:2},{x:1,y:2},{x:2,y:2}];
  	var down = [{x:0,y:0},{x:1,y:0},{x:2,y:0}];


  	var up_fight = [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4},{x:5,y:4}];
  	var down_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5},{x:5,y:5}];
  	var left_fight = [{x:0,y:7},{x:1,y:7},{x:2,y:7},{x:3,y:7},{x:4,y:7},{x:5,y:7}];
  	var right_fight = [{x:0,y:6},{x:1,y:6},{x:2,y:6},{x:3,y:6},{x:4,y:6},{x:5,y:6}];

  	var idle = [{x:1,y:0}];

    super(id,"./js/dragonBallGame/sprites/dragonSprite.png",[ up, down, left, right, up_fight, down_fight, left_fight, right_fight, idle],x,y,50,50);

    this.up = [{x:0,y:3},{x:1,y:3},{x:2,y:3}];
  	this.left = [{x:0,y:1},{x:1,y:1},{x:2,y:1}];
  	this.right = [{x:0,y:2},{x:1,y:2},{x:2,y:2}];
  	this.down = [{x:0,y:0},{x:1,y:0},{x:2,y:0}];


  	this.up_fight = [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4},{x:5,y:4}];
  	this.down_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5},{x:5,y:5}];
  	this.left_fight = [{x:0,y:7},{x:1,y:7},{x:2,y:7},{x:3,y:7},{x:4,y:7},{x:5,y:7}];
  	this.right_fight = [{x:0,y:6},{x:1,y:6},{x:2,y:6},{x:3,y:6},{x:4,y:6},{x:5,y:6}];

  	this.idle = [{x:1,y:0}];
  }
}

class Yeti extends Enemy{
  constructor(id,x,y){
    var up = [{x:0,y:6},{x:1,y:6},{x:2,y:6},{x:3,y:6},{x:4,y:6}];
  	var left = [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2}];
  	var right = [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}];
  	var down = [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0}];


  	var up_fight = [{x:0,y:7},{x:1,y:7},{x:2,y:7},{x:3,y:7}];
  	var down_fight = [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1}];
  	var left_fight = [{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3}];
  	var right_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5}];

  	var idle = [{x:3,y:0},{x:4,y:0}]

    super(id,"./js/dragonBallGame/sprites/yetiSprite.png",[ up, down, left, right, up_fight, down_fight, left_fight, right_fight, idle],x,y,80,80);

    this.up = [{x:0,y:6},{x:1,y:6},{x:2,y:6},{x:3,y:6},{x:4,y:6}];
  	this.left = [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2}];
  	this.right = [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}];
  	this.down = [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0}];


  	this.up_fight = [{x:0,y:7},{x:1,y:7},{x:2,y:7},{x:3,y:7}];
  	this.down_fight = [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1}];
  	this.left_fight = [{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3}];
  	this.right_fight = [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5}];

  	this.idle = [{x:3,y:0},{x:4,y:0}];
  }
}
