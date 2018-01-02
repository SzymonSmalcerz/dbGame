
const Static = {
  getTreeData : function(x,y){
    return {

        type : "tree",
        x : x,
        y: y,
        collisionHeight : 64/8,//collision height
        collisionWidth : 128/3, //collision width
        width : 128, //width
        height : 128,//height
        xPosInSprite: 1,
        yPosInSprite : 0,
        widthInImage : 128,
        heightInImage : 128,

        typeOfSprite: "default"

    }
  },getTree2Data : function(x,y){
    return {

        type : "tree2",
        x : x,
        y: y,
        collisionHeight : 64/8,//collision height
        collisionWidth : 128/3, //collision width
        width : 128, //width
        height : 128,//height
        xPosInSprite: 2,
        yPosInSprite : 2,
        widthInImage : 128,
        heightInImage : 128,

        typeOfSprite : "default"

    }
  },getSkeleton1Data : function(x,y){
    return {

        type : "skeleton1",
        x : x,
        y: y,
        collisionHeight : 0,//collision height
        collisionWidth : 0, //collision width
        width : 32, //width
        height : 32,//height
        xPosInSprite: 0,
        yPosInSprite : 0,
        widthInImage : 32,
        heightInImage : 32,

        typeOfSprite : "32"

    }
  },getBigSkeleton1Data : function(x,y){
    return {

        type : "bigSkeleton1",
        x : x,
        y: y,
        collisionHeight : 0,//collision height
        collisionWidth : 0, //collision width
        width : 64, //width
        height : 64,//height
        xPosInSprite: 5,
        yPosInSprite : 4,
        widthInImage : 64,
        heightInImage : 64,

        typeOfSprite : "default"
    }
  },getCactus1Data : function(x,y){
    return {

        type : "cactus1",
        x : x,
        y: y,
        collisionHeight : 32/8,//collision height
        collisionWidth : 32/3, //collision width
        width : 32, //width
        height : 32,//height
        xPosInSprite: 3,
        yPosInSprite : 0,
        widthInImage : 32,
        heightInImage : 32,

        typeOfSprite : "32"

    }
  },getDessertPlant1Data : function(x,y){
    return {

        type : "dessertPlant1",
        x : x,
        y: y,
        collisionHeight : 32/8,//collision height
        collisionWidth : 32/3, //collision width
        width : 32, //width
        height : 32,//height
        xPosInSprite: 4,
        yPosInSprite : 0,
        widthInImage : 32,
        heightInImage : 32,

        typeOfSprite : "32"

    }
  },getDessertPlant2Data : function(x,y){
    return {

        type : "dessertPlant2",
        x : x,
        y: y,
        collisionHeight : 32/8,//collision height
        collisionWidth : 32/3, //collision width
        width : 32, //width
        height : 32,//height
        xPosInSprite: 5,
        yPosInSprite : 0,
        widthInImage : 32,
        heightInImage : 32,

        typeOfSprite : "32"

    }
  },getRock1Data : function(x,y){
    return {

        type : "rock1",
        x : x,
        y: y,
        collisionHeight : 32/8,//collision height
        collisionWidth : 32/3, //collision width
        width : 32, //width
        height : 32,//height
        xPosInSprite: 6,
        yPosInSprite : 0,
        widthInImage : 32,
        heightInImage : 32,

        typeOfSprite : "32"

    }
  },getDessertSignData : function(x,y){
    return {

        type : "dessertSign",
        x : x,
        y: y,
        collisionHeight : 32/8,//collision height
        collisionWidth : 32/3, //collision width
        width : 32, //width
        height : 32,//height
        xPosInSprite: 7,
        yPosInSprite : 0,
        widthInImage : 32,
        heightInImage : 32,

        typeOfSprite : "32"

    }
  },getSkeleton2Data : function(x,y){
    return {

        type : "skeleton2",
        x : x,
        y: y,
        collisionHeight : 0,//collision height
        collisionWidth : 0, //collision width
        width : 32, //width
        height : 32,//height
        xPosInSprite: 1,
        yPosInSprite : 0,
        widthInImage : 32,
        heightInImage : 32,

        typeOfSprite : "32"

    }
  },getSkeleton3Data : function(x,y){
    return {

        type : "skeleton3",
        x : x,
        y: y,
        collisionHeight : 0,//collision height
        collisionWidth : 0, //collision width
        width : 32, //width
        height : 32,//height
        xPosInSprite: 2,
        yPosInSprite : 0,
        widthInImage : 32,
        heightInImage : 32,

        typeOfSprite : "32"

    }
  },getHouse1Data : function(x,y){
    return {

        type : "house1",
        x : x,
        y: y,
        collisionHeight : 128/5,//collision height
        collisionWidth : 128/1.05, //collision width
        width : 128, //width
        height : 128, //height
        xPosInSprite: 0,
        yPosInSprite : 2,
        widthInImage : 128,
        heightInImage : 128,

        typeOfSprite : "default"

    }
  },getHouse2Data : function(x,y){
    return {

        type : "house2",
        x : x,
        y: y,
        collisionHeight : 210/5,//collision height
        collisionWidth : 128*0.87, //collision width
        width : 128, //width
        height : 210, //height
        xPosInSprite: 6,
        yPosInSprite : 0,
        widthInImage : 128,
        heightInImage : 210,

        typeOfSprite : "default"

    }
  }
}

module.exports = Static;
