var Helper = {};


Helper.areTwoEntitiesInRange = function(entity1, entity2, speedOfEntity1){

  speedOfEntity1 = speedOfEntity1 || {x:0, y:0};

  var centerOfEntity1 = Helper.getCenterOfEntityCollision(entity1);
  var centerOfEntity2 = Helper.getCenterOfEntityCollision(entity2);

  //entity is moving so we must consider its speed
  centerOfEntity1.x += speedOfEntity1.x;
  centerOfEntity1.y += speedOfEntity1.y;

  if(
       Math.abs(centerOfEntity1.x - centerOfEntity2.x) <= (entity1.collisionWidth/2 + entity2.collisionWidth/2)
    && Math.abs(centerOfEntity1.y - centerOfEntity2.y) <= (entity1.collisionHeight/2 + entity2.collisionHeight/2)
  ){
    return true;
  }else{
    return false;
  }

};

Helper.getDistanceBetweenTwo2DPoints = function(point1, point2){

  return Math.sqrt(Math.pow((point1.x - point.x),2) + Math.pow(point1.y - point2.y));

};


Helper.getCenterOfEntityCollision = function(entity){
  return {
    x : entity.x + entity.width/2,
    y : entity.y + entity.height*0.9 - entity.collisionHeight/2
  }
}

Helper.getRightCornerOfEntityCollision = function(entity){
  return {
    x : entity.x + entity.width/2 + entity.collisionWidth/2,
    y : entity.y + entity.height*0.9
  }
}

module.exports = Helper;
