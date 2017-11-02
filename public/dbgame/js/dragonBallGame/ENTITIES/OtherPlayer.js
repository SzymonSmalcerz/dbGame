class OtherPlayer extends Mob{
  constructor(id){

    super(id,"dbgame/js/dragonBallGame/sprites/spriteGokuSupix.png",[[{x:11,y:11},{x:12,y:7},{x:4,y:2},{x:11,y:1}],[{x:10,y:1},{x:3,y:2}],
    [{x:1,y:11},{x:13,y:11},{x:9,y:11},{x:5,y:11}],[{x:0,y:11},{x:12,y:11},{x:8,y:11},{x:4,y:11}],
    [{x:9,y:3},{x:11,y:9},{x:2,y:4},{x:6,y:4},{x:10,y:8},{x:0,y:6},{x:4,y:6}],[{x:14,y:5},{x:3,y:6},{x:13,y:8},{x:14,y:5},{x:12,y:3},{x:1,y:4},{x:5,y:4}],
    [{x:13,y:9},{x:5,y:5},{x:2,y:6},{x:1,y:5}],[{x:12,y:9},{x:4,y:5},{x:1,y:6},{x:0,y:5}],
    [{x:1,y:0}]],100,100);

    //this.id = id;//TODO change IT !!!!!!!!

      this.up = [{x:11,y:11},{x:12,y:7},{x:4,y:2},{x:11,y:1}];
    	this.left = [{x:1,y:11},{x:13,y:11},{x:9,y:11},{x:5,y:11}];
    	this.right = [{x:0,y:11},{x:12,y:11},{x:8,y:11},{x:4,y:11}];
    	this.down = [{x:10,y:1},{x:3,y:2}];


    	this.up_fight = [{x:9,y:3},{x:11,y:9},{x:2,y:4},{x:6,y:4},{x:10,y:8},{x:0,y:6},{x:4,y:6}];
    	this.down_fight = [{x:14,y:5},{x:3,y:6},{x:13,y:8},{x:14,y:5},{x:12,y:3},{x:1,y:4},{x:5,y:4}];
    	this.left_fight = [{x:13,y:9},{x:5,y:5},{x:2,y:6},{x:1,y:5}];
    	this.right_fight = [{x:12,y:9},{x:4,y:5},{x:1,y:6},{x:0,y:5}];



    	this.idleDown = [{x:1,y:0}];
    	this.idleRight = [{x:1,y:2}];
    	this.idleLeft = [{x:2,y:2}];
    	this.idleUp = [{x:0,y:2}];

    	this.idle = this.idleDown;


  }

}
