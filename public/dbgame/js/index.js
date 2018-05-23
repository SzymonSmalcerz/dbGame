var socket = socket || io();
console.log(playerID);
window.onload = function(){

  socket.on('connect', function () {
    console.log('Connected to server');
    socket.emit("getPlayerID",{
      id : playerID
    });
    socket.on("playerID",(playerData) => {
      Game.createMainCharacter(playerData);
      Game.handler.currentLevel = new Level(playerData.currentMapLevel);
      Game.init();
      socket.on("playerID", () => {
        console.log("DO NOTHING !!!!");
      })
    })
    socket.on("alreadyLoggedIn", (data) => {
      alert(data.msg);
    })
  });
};





const Game = {
  handler : {
		canvas : undefined,
		ctx : undefined,
		width : undefined,
		height : undefined,
		referencedWidth : undefined,
		currentLevel : undefined,
		camera : undefined,
		levels : [],
		scale : 1.0,
    players : {},
    enemies : {},
    skillTable : {},
    tiles : {},
    character : undefined,
    gameCanvasesWidth : window.innerWidth,
    gameCanvasesHeight : window.innerHeight,
    drawer : undefined,
    shortestPath : undefined,
    socketHandler : undefined,
    canvasesHandler : undefined,


		//technicals
    widthOfDisplayWindow : 0,
    heightOfDisplayWindow : 0,
		fps : 20,
		lastTime : 0,
		globalTickCounter : 0, //used only for animations for tiles (nor for mobs)
		menu : {}
	},


  init : function(){


    Game.handler.canvasesHandler = new CanvasesHandler(Game.handler);
    Game.handler.canvasesHandler.setCanvases();

    Game.handler.camera = new Camera();
    Game.handler.camera.setWidthAndHeightOfDisplayWindow();
    Game.handler.camera.handleMoveXandMoveY();

    Game.handler.menu.headImage = new Image();
		Game.handler.menu.headImage.src = "dbgame/js/dragonBallGame/sprites/gokuHead.png";
    Game.handler.menu.dragonBallImage = new Image();
    Game.handler.menu.dragonBallImage.src = "dbgame/js/dragonBallGame/sprites/dragonBall4Stars.png";
    Game.handler.menu.logo = new Image();
    Game.handler.menu.logo.src = "dbgame/js/dragonBallGame/sprites/logo.png";

    Game.handler.socketHandler = new SocketHandler(Game.handler);
    Game.handler.socketHandler.setSockets();

    Game.handleTilesLevelsAndOther();

    Game.handler.drawer = new Drawer(Game.handler.ctx, Game.handler);
    Game.handler.shortestPath = new ShortestPath(Game.handler.drawer,Game.handler.widthOfDisplayWindow,Game.handler.heightOfDisplayWindow);

    socket.emit("initialized", (this.handler.character.id));
    socket.on("permissionToLoop", function() {
      setTimeout(Game.mainLoop,500);
    });
  },
  mainLoop : function(time){
		requestAnimationFrame(Game.mainLoop);



		if(time - Game.handler.lastTime > 1000/Game.handler.fps){
      Game.handler.lastTime = time;
      Game.handler.currentLevel.tick();
      Game.handler.globalTickCounter += 1;
			Game.handler.drawer.drawMenu();
      Game.handler.drawer.drawItems();
		}
	},
  createMainCharacter : function(playerData) {
    this.handler.character = new MainCharacter(playerData);
  },



  handleTilesLevelsAndOther : function(){
    Game.handler.tiles.G = new Tile(0,0);
    Game.handler.tiles.D = new Tile(1,0);
    Game.handler.tiles.S = new Tile(5,0);
    Game.handler.tiles.L = new Tile(6,0);
    Game.handler.tiles.P = new Tile(7,0);
    Game.handler.tiles.WALL = new Tile(0,1);
    Game.handler.tiles.W = new AnimatedTile([{x:2,y:0},{x:3,y:0},{x:4,y:0}]);

  },

  // @TODO@@@@TODO@@@@ DELETE THIS TODO FUNCTIONS WHEN TODO DEPLOYING GAME TO  TODO FINAL PRODUCTION :) @@@TODO@@@@
  addEnemies : function (type,numberOfEnemies) {
    type = type || "hit",
    numberOfEnemies = numberOfEnemies || 20;
    socket.emit("addEnemies", {
      type,
      numberOfEnemies
    });
  }
  //@@@@@TODO@@@@@@@@@@TODO@@@@@@@@@TODO@@@@@@@TODO@@@@@TODO@@@@@@@TODO@@@@@@@@@@@TODO@@@@@@@@@@@TODO@@@@@@@TODO@@@@@@


}

window.addEventListener("click", function(event){
  var x = event.clientX;
  var y = event.clientY;

  Game.handler.shortestPath.calculateShortestPath(Game.handler.character, x, y, Game.handler.currentLevel.statics);

});


window.addEventListener("resize", function(){


  Game.handler.camera.setWidthAndHeightOfDisplayWindow();
  Game.handler.canvasesHandler.setWidthAndHeightOfCanvases();

  Game.handler.camera.handleMoveXandMoveY();
  Game.handler.shortestPath.onResize(Game.handler.widthOfDisplayWindow,Game.handler.heightOfDisplayWindow);
  Game.handler.currentLevel.onResize();


});
