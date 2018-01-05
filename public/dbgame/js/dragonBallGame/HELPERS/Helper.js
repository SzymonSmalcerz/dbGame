var Helper = {};


Helper.areTwoEntitiesInRange = function(entity1, entity2, speedOfEntity1){

  if(entity1.flatRendering || entity2.flatRendering ||  entity2.dead || entity1.dead){

    return false;

  }

  speedOfEntity1 = speedOfEntity1 || {
    x : 0,
    y : 0
  };

  var centerOfEntity1 = Helper.getCenterOfEntityCollision(entity1);
  var centerOfEntity2 = Helper.getCenterOfEntityCollision(entity2);

  //entity is moving so we must consider its speed
  centerOfEntity1.renderX += speedOfEntity1.x;
  centerOfEntity1.renderY += speedOfEntity1.y;


  if(
       Math.abs(centerOfEntity1.renderX - centerOfEntity2.renderX) <= (entity1.collisionWidth/2 + entity2.collisionWidth/2)
    && Math.abs(centerOfEntity1.renderY - centerOfEntity2.renderY) <= (entity1.collisionHeight/2 + entity2.collisionHeight/2)
  ){
    return true;
  }else{
    return false;
  }

};


Helper.getDistanceBetweenTwo2DPoints = function(point1, point2){

  return Math.sqrt(Math.pow((point1.renderX - point.renderX),2) + (Math.pow(point1.renderY - point2.renderY),2));

};


Helper.getCenterOfEntityCollision = function(entity){
  return {
    renderX : entity.renderX + entity.width/2,
    renderY : entity.renderY + entity.height*0.9 - entity.collisionHeight/2
  }
}

Helper.getRightCornerOfEntityCollision = function(entity){
  return {
    renderX : entity.renderX + entity.width/2 + entity.collisionWidth/2,
    renderY : entity.renderY + entity.height*0.9
  }
}

Helper.getWidthAndHeightOfDisplayWindow = function(){
  var width;
  var height;

  if(window.innerWidth< 550){
    width = window.innerWidth;
  }else{
    width = 550;
  }

  if(window.innerHeight< 400){
    height = window.innerHeight;
  }else{
    height = 400;
  }

  return {
    width,
    height
  }
}
