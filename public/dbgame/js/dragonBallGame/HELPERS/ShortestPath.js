
class ShortestPath{

  constructor(drawer,widthOfDisplayWindow,heightOfDisplayWindow){
    this.drawer = drawer;
    this.widthOfDisplayWindow = widthOfDisplayWindow;
    this.heightOfDisplayWindow = heightOfDisplayWindow;
  }


  calculateShortestPath(mainEntity, destinationX, destinationY, entitesToAvoid){



    var sourceX = Math.round(mainEntity.renderX + mainEntity.width/2);
    var sourceY = Math.round(mainEntity.renderY + mainEntity.height*0.9 - mainEntity.collisionHeight/2);

    var allEntities = entitesToAvoid;
    var mockEntity = new Entity(mainEntity.x, mainEntity.y);


    mockEntity.renderX = sourceX;
    mockEntity.renderY = sourceY;
    mockEntity.width = mainEntity.width;
    mockEntity.height = mainEntity.height;
    mockEntity.collisionWidth = Math.abs(mainEntity.collisionWidth);
    mockEntity.collisionHeight = Math.abs(mainEntity.collisionHeight);

    var change = mainEntity.speed;
    var source ; //sourceNode
    var destinationNode;





    var width = this.widthOfDisplayWindow;
    var height = this.heightOfDisplayWindow;
    var leftBorderOfDisplayWindow = window.innerWidth/2 - width/2;
    var rightBorderOfDisplayWindow = window.innerWidth/2 + width/2;

    var topBorderOfDisplayWindow = window.innerHeight/2 - height/2;
    var bottomBorderOfDisplayWindow = window.innerHeight/2 + height/2;

    var openList = [];
    var closedList = [];

    var nodes = {};

    var leftBorder = this.calculateBorder(leftBorderOfDisplayWindow - mainEntity.width,change, sourceX);
    var rightBorder = this.calculateBorder(rightBorderOfDisplayWindow + mainEntity.width,change, sourceX);
    var topBorder = this.calculateBorder(topBorderOfDisplayWindow - mainEntity.height,change, sourceY);
    var bottomBoreder = this.calculateBorder(bottomBorderOfDisplayWindow + mainEntity.height,change, sourceY);



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

        if(Math.abs(w - destinationX) <= mainEntity.speed/2 && Math.abs(h - destinationY) <= mainEntity.speed/2){
          destinationNode = nodes[w + " " + h];
          // console.log("im here in setting destination node!");
        }
      }
    }

    var canMove = true;

    mockEntity.renderX = destinationNode.x - mainEntity.width/2;
    mockEntity.renderY = destinationNode.y - mainEntity.height*0.9 + mainEntity.collisionHeight/2;



    allEntities.forEach(function(entity){
      if(entity === mainEntity){
        return;
      }
      if(Helper.areTwoEntitiesInRange(mockEntity,entity)){
        canMove = false;
      }
    });

    // dbgame/js/dragonBallGame/sprites/crossMove.png"

    if(!canMove){
      this.drawer.addItemToDraw("dbgame/js/dragonBallGame/sprites/crossMove.png",mockEntity.renderX, mockEntity.renderY, 500, 32, 32, 1, 0);
      return;
    }else{
      this.drawer.addItemToDraw("dbgame/js/dragonBallGame/sprites/crossMove.png",mockEntity.renderX, mockEntity.renderY, 500, 32, 32, 0, 0);
    }




    openList.push(source);


    while(openList.length > 0){

      var q = this.findNodeWithLowestF(openList);

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
              mockEntity.renderX = w - mainEntity.width/2;
              mockEntity.renderY = h - mainEntity.height*0.9 + mainEntity.collisionHeight/2;
              allEntities.forEach(function(entity){
                if(entity === mainEntity){
                  return;
                }
                if(Helper.areTwoEntitiesInRange(mockEntity,entity)){
                  canMove = false;
                }
              });

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
                  this.drawWay(temp,mainEntity);
                  //temp = destinationNode;
                  this.createWay(temp,mainEntity)

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

  findNodeWithLowestF(openList){

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

  calculateBorder(displayBorder,change, position){
    return  Math.abs(displayBorder) - (Math.abs(displayBorder)%change) + (position%change);
  }

  drawWay(destinationNode,mainEntity){

    var colorRandRed = Math.round(Math.random() * 150) + 100;
    var colorGreenRed = Math.round(Math.random() * 150) + 100;
    var colorBlueRed = Math.round(Math.random() * 150) + 100;
    Game.handler.collisionCtx.fillStyle = "rgba("+colorRandRed+","+colorGreenRed+","+colorBlueRed+",0.5)";
    while(destinationNode != null){

      Game.handler.collisionCtx.fillRect(destinationNode.x-mainEntity.collisionWidth/2,destinationNode.y-mainEntity.collisionHeight/2,mainEntity.collisionWidth,mainEntity.collisionHeight);
      destinationNode = destinationNode.parent;

    }
  }

  createWay(destinationNode,mainEntity){


    mainEntity.movesStack = [];
    while(true){

      if(!destinationNode.parent){
        break;
      }

      if(destinationNode.parent.x > destinationNode.x){
        mainEntity.movesStack.push("left");
      }else if(destinationNode.parent.x < destinationNode.x){
        mainEntity.movesStack.push("right");
      }else if(destinationNode.parent.y > destinationNode.y){
        mainEntity.movesStack.push("up");
      }else{
        mainEntity.movesStack.push("down");
      }

      destinationNode = destinationNode.parent;

    }
  }

  onResize(widthOfDisplayWindow,heightOfDisplayWindow){
    this.widthOfDisplayWindow = widthOfDisplayWindow;
    this.heightOfDisplayWindow = heightOfDisplayWindow;
  }
}
