


ShortestPath = {};
ShortestPath.playerMovesStack = [];

ShortestPath.calculateShortestPath = function(sourceX, sourceY, destinationX, destinationY){



  sourceX = Math.round(sourceX);
  sourceY = Math.round(sourceY);

  var allEntities = Game.handler.currentLevel.statics;
  var player = Game.handler.character;
  var mockEntity = new Entity(player.x, player.y);


  mockEntity.renderX = sourceX;
  mockEntity.renderY = sourceY;
  mockEntity.width = player.width;
  mockEntity.height = player.height;
  mockEntity.collisionWidth = Math.abs(player.collisionWidth);
  mockEntity.collisionHeight = Math.abs(player.collisionHeight);

  var change = player.speed;
  var source ; //sourceNode
  var destinationNode;





  var width = Game.handler.widthOfDisplayWindow;
  var height = Game.handler.heightOfDisplayWindow;

  var leftBorderOfDisplayWindow = window.innerWidth/2 - width/2;
  var rightBorderOfDisplayWindow = window.innerWidth/2 + width/2;

  var topBorderOfDisplayWindow = window.innerHeight/2 - height/2;
  var bottomBorderOfDisplayWindow = window.innerHeight/2 + height/2;

  var openList = [];
  var closedList = [];

  var nodes = {};

  var leftBorder = ShortestPath.calculateBorder(leftBorderOfDisplayWindow - player.width,change, sourceX);
  var rightBorder = ShortestPath.calculateBorder(rightBorderOfDisplayWindow + player.width,change, sourceX);
  var topBorder = ShortestPath.calculateBorder(topBorderOfDisplayWindow - player.height,change, sourceY);
  var bottomBoreder = ShortestPath.calculateBorder(bottomBorderOfDisplayWindow + player.height,change, sourceY);



  for(var w=leftBorder; w<= rightBorder ; w+=change){
    for(var h=topBorder; h<=bottomBoreder; h+=change){
      nodes[w + " " + h] = {};
      nodes[w + " " + h].x = w;
      nodes[w + " " + h].y = h;
      nodes[w + " " + h].f = -1;
      nodes[w + " " + h].parent = null;
      nodes[w + " " + h].h = Math.abs(w-destinationX) + Math.abs(h-destinationY);
      if(w == sourceX && h == sourceY){
        source = nodes[w + " " + h];
        source.g = 0;
        source.f = source.h;
        // console.log("im here in setting source node!");
      }

      if(Math.abs(w - destinationX) <= player.speed/2 && Math.abs(h - destinationY) <= player.speed/2){
        destinationNode = nodes[w + " " + h];
        // console.log("im here in setting destination node!");
      }
    }
  }

  var canMove = true;

  mockEntity.renderX = destinationNode.x - player.width/2;
  mockEntity.renderY = destinationNode.y - player.height*0.9 + player.collisionHeight/2;



  allEntities.forEach(function(entity){
    if(entity === player){
      return;
    }
    if(Helper.areTwoEntitiesInRange(mockEntity,entity)){
      canMove = false;
    }
  });

  if(!canMove){
    return;
  }




  openList.push(source);


  while(openList.length > 0){

    var q = ShortestPath.findNodeWithLowestF(openList);

    openList = openList.filter(function(listItem){
      if(listItem !== q){
        return true;
      }

      return false;
    });





    for(var w=q.x-change;w<=q.x+change;w+=change) {
				for(var h=q.y-change;h<=q.y+change;h+=change) {





          if(w==(q.x+change) && (h==(q.y+change) || h==(q.y-change))) {
						continue;
					}
					if(w==(q.x-change) && (h==(q.y+change) || h==(q.y-change))) {
						continue;
					}

          if(w>=leftBorder && w<rightBorder && h>=topBorder && h<bottomBoreder && !(h==q.y && w==q.x)) {


            canMove = true;
            mockEntity.renderX = w - player.width/2;
            mockEntity.renderY = h - player.height*0.9 + player.collisionHeight/2;
            allEntities.forEach(function(entity){
              if(entity === player){
                return;
              }
              if(Helper.areTwoEntitiesInRange(mockEntity,entity)){
                canMove = false;
              }
            });

						// if(Game.handler.collisionCtx.getImageData(w - player.collisionWidth/2,h + player.collisionHeight/2,1,1).data[0] === 1
            // || Game.handler.collisionCtx.getImageData(w - player.collisionWidth/2,h - player.collisionHeight/2,1,1).data[0] === 1
            // || Game.handler.collisionCtx.getImageData(w + player.collisionWidth/2,h + player.collisionHeight/2,1,1).data[0] === 1
            // || Game.handler.collisionCtx.getImageData(w + player.collisionWidth/2,h - player.collisionHeight/2,1,1).data[0] === 1
            // ){
            if(!canMove){
            ///  console.log("wlasnie odrzucam bo mam collision");
						 continue;
						}

            var calculatedG = change + q.g;

            if(openList.includes(nodes[w + " " + h]) || closedList.includes(nodes[w + " " + h])) {
              if(!(nodes[w + " " + h].f >0 && nodes[w + " " + h].f < calculatedG + nodes[w + " " + h].h)) {

								nodes[w + " " + h].f = calculatedG + nodes[w + " " + h].h;
								nodes[w + " " + h].g = calculatedG;
								nodes[w + " " + h].parent = q;

							}

							continue;
            }
            nodes[w + " " + h].f = calculatedG + nodes[w + " " + h].h;
            nodes[w + " " + h].g = calculatedG;
            nodes[w + " " + h].parent = q;
							if(destinationNode === nodes[w + " " + h]) {

                var temp = destinationNode;
                ShortestPath.drawWay(temp,player);
                temp = destinationNode;
                ShortestPath.createWay(temp,player)

								return;
							}


							openList.push(nodes[w + " " + h]);
          }

          closedList.push(q);
        }
    }



  }
  //
  // console.log("couldnt find a way :C");
}

ShortestPath.calculateBorder = function(displayBorder,change, position){
  return  Math.abs(displayBorder) - (Math.abs(displayBorder)%change) + (position%change);
}


ShortestPath.drawWay = function(destinationNode,player){

  var colorRandRed = Math.round(Math.random() * 150) + 100;
  var colorGreenRed = Math.round(Math.random() * 150) + 100;
  var colorBlueRed = Math.round(Math.random() * 150) + 100;
  Game.handler.collisionCtx.fillStyle = "rgba("+colorRandRed+","+colorGreenRed+","+colorBlueRed+",0.5)";
  while(destinationNode != null){

    //Game.handler.collisionCtx.fillRect(0,0,Game.handler.canvas.width,Game.handler.canvas.height);
    Game.handler.collisionCtx.fillRect(destinationNode.x-player.collisionWidth/2,destinationNode.y-player.collisionHeight/2,player.collisionWidth,player.collisionHeight);
    destinationNode = destinationNode.parent;
    //console.log(destinationNode.x + " : " + destinationNode.y);
    //console.log( "PARENTY, X: " + destinationNode.x + " vs " + destinationNode.parent.parent.x + " : Y: " + destinationNode.y +" vs " +  destinationNode.parent.parent.y);
    // if(destinationNode.x == destinationNode.parent.parent.x && destinationNode.y == destinationNode.parent.parent.y){
    //   console.log("KURRRRRRRRWA");
    //   break;
    // }
  }
}

ShortestPath.createWay = function(destinationNode,player){

  ShortestPath.playerMovesStack = [];
  player.movesStack = [];
  while(true){

    if(!destinationNode.parent){
      break;
    }

    if(destinationNode.parent.x > destinationNode.x){
      ShortestPath.playerMovesStack.push("left")
      player.movesStack.push("left");
    }else if(destinationNode.parent.x < destinationNode.x){
      ShortestPath.playerMovesStack.push("right")
      player.movesStack.push("right");
    }else if(destinationNode.parent.y > destinationNode.y){
      ShortestPath.playerMovesStack.push("up")
      player.movesStack.push("up");
    }else{
      ShortestPath.playerMovesStack.push("down")
      player.movesStack.push("down");
    }

    destinationNode = destinationNode.parent;

  }
  var temp ="";
  while(ShortestPath.playerMovesStack.length > 0){
    temp += " " + ShortestPath.playerMovesStack.pop();
  }


  // console.log(temp);
}



ShortestPath.findNodeWithLowestF = function(openList){

  var wantedNode = openList[0];
  var lowestF = openList[0].f;

  openList.forEach(function(listItem){
    if(listItem.f < lowestF){
      wantedNode = listItem;
      lowestF = listItem.f;
    }
  });

  return wantedNode;

}
