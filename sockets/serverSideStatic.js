
const Static = {
  getTreeData : function(x,y){
    return {

        type : "tree",
        x : x,
        y: y,
        collisionHeight : 64/8,//collision height
        collisionWidth : 128/3, //collision width
        width : 128, //width
        height : 128//height

    }
  },getSkeleton1Data : function(x,y){
    return {

        type : "skeleton1",
        x : x,
        y: y,
        collisionHeight : 0,//collision height
        collisionWidth : 0, //collision width
        width : 32, //width
        height : 32//height

    }
  },getBigSkeleton1Data : function(x,y){
    return {

        type : "bigSkeleton1",
        x : x,
        y: y,
        collisionHeight : 0,//collision height
        collisionWidth : 0, //collision width
        width : 64, //width
        height : 64//height

    }
  },getCactus1Data : function(x,y){
    return {

        type : "cactus1",
        x : x,
        y: y,
        collisionHeight : 32/8,//collision height
        collisionWidth : 32/3, //collision width
        width : 32, //width
        height : 32//height

    }
  },getDessertPlant1Data : function(x,y){
    return {

        type : "dessertPlant1",
        x : x,
        y: y,
        collisionHeight : 32/8,//collision height
        collisionWidth : 32/3, //collision width
        width : 32, //width
        height : 32//height

    }
  },getDessertPlant2Data : function(x,y){
    return {

        type : "dessertPlant2",
        x : x,
        y: y,
        collisionHeight : 32/8,//collision height
        collisionWidth : 32/3, //collision width
        width : 32, //width
        height : 32//height

    }
  },getRock1Data : function(x,y){
    return {

        type : "rock1",
        x : x,
        y: y,
        collisionHeight : 32/8,//collision height
        collisionWidth : 32/3, //collision width
        width : 32, //width
        height : 32//height

    }
  },getDessertSignData : function(x,y){
    return {

        type : "dessertSign",
        x : x,
        y: y,
        collisionHeight : 32/8,//collision height
        collisionWidth : 32/3, //collision width
        width : 32, //width
        height : 32//height

    }
  },getSkeleton2Data : function(x,y){
    return {

        type : "skeleton2",
        x : x,
        y: y,
        collisionHeight : 0,//collision height
        collisionWidth : 0, //collision width
        width : 32, //width
        height : 32//height

    }
  },getSkeleton3Data : function(x,y){
    return {

        type : "skeleton3",
        x : x,
        y: y,
        collisionHeight : 0,//collision height
        collisionWidth : 0, //collision width
        width : 32, //width
        height : 32//height

    }
  },getHouse1Data : function(x,y){
    return {

        type : "house1",
        x : x,
        y: y,
        collisionHeight : 128/5,//collision height
        collisionWidth : 128/1.05, //collision width
        width : 128, //width
        height : 128//height

    }
  },getHouse2Data : function(x,y){
    return {

        type : "house2",
        x : x,
        y: y,
        collisionHeight : 210/5,//collision height
        collisionWidth : 128*0.87, //collision width
        width : 128, //width
        height : 210//height

    }
  }
}

module.exports = Static;
