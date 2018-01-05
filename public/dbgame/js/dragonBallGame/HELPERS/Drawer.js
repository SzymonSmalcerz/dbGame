class Drawer{

  constructor(ctx,handler){
    this.handler = handler;
    this.itemsToDraw = [];
    this.ctx = ctx;
  }

  drawItems(){

    if(this.itemsToDraw.length <= 0){
      return;
    }

    this.itemsToDraw = this.itemsToDraw.filter(function(item){
      if(item.timePassed){
        return false;
      }

      item.draw();
      return true;
    })

  }

  addItemToDraw(path,renderX, renderY, howLongImageMustLast, widthInImage, heightInImage,xPosInImage, yPosInImage, widthOnTheScreem, heightOnTheScreen){

    widthOnTheScreem = widthOnTheScreem || widthInImage;
    heightOnTheScreen = heightOnTheScreen || heightInImage;
    xPosInImage = xPosInImage || 0;
    yPosInImage = yPosInImage || 0;

    this.itemsToDraw.push(new ItemToDraw(this.ctx,path,renderX, renderY, howLongImageMustLast, widthInImage, heightInImage,xPosInImage, yPosInImage, widthOnTheScreem, heightOnTheScreen));

  }


  drawMenu(){

			var player = this.handler.character;
      var headAndBarsXOffset = window.innerWidth/2 - this.handler.widthOfDisplayWindow/2 - 48;
      var barsLength = this.handler.widthOfDisplayWindow/4;

      //draw image
      var tempMultiplier = this.handler.widthOfDisplayWindow/640;
      this.handler.ctx.drawImage(this.handler.menu.logo,0,0,640,128,(window.innerWidth - this.handler.widthOfDisplayWindow)/2 + 32 * (1 - tempMultiplier),64 * (1 - tempMultiplier) ,640 * tempMultiplier ,128 * tempMultiplier );

			this.handler.ctx.drawImage(this.handler.menu.headImage,0,0,256,256,headAndBarsXOffset,window.innerHeight - 120 ,128 ,128 );
      if(barsLength > 120)
        this.handler.ctx.drawImage(this.handler.menu.dragonBallImage,0,0,256,256,window.innerWidth/2 - 64 + 16,window.innerHeight - 112 ,128 ,128 );


      headAndBarsXOffset += 128;


      if(barsLength < 0){
        barsLength = 15;
      }
      //draw player health

			this.handler.ctx.fillStyle = "rgb(90,0,0)";
			this.handler.ctx.fillRect(headAndBarsXOffset  ,window.innerHeight - 64 , barsLength,	Math.min(10,Math.max(Math.floor(player.height/2),7)));
			this.handler.ctx.fillStyle = "rgb(255,0,0)";
			this.handler.ctx.fillRect(headAndBarsXOffset  ,window.innerHeight - 64 , barsLength * player.health/player.maxHealth,	Math.min(8,Math.max(Math.floor(player.height/2),5)));


      //draw player mana
      this.handler.ctx.fillStyle = "rgb(0,0,20)";
			this.handler.ctx.fillRect(headAndBarsXOffset  ,window.innerHeight - 48 , barsLength,	Math.min(10,Math.max(Math.floor(player.height/2),4)));
			var manaColor = 150;
			if( player.isRegeneratingMana){
				manaColor = Math.floor(Math.random()*(255-225) + 225);
			}
			this.handler.ctx.fillStyle = "rgb(0," + (manaColor - 150) + "," + manaColor + ")";
			this.handler.ctx.fillRect(headAndBarsXOffset  ,window.innerHeight - 48 , barsLength * player.mana/player.maxMana,	Math.min(8,Math.max(Math.floor(player.height/3),3)));

      //draw player experience
			this.handler.ctx.fillStyle = "rgb(125,125,50)";
			this.handler.ctx.fillRect(headAndBarsXOffset  ,window.innerHeight - 80 , barsLength,	Math.min(10,Math.max(Math.floor(player.height/2),7)));
			this.handler.ctx.fillStyle = "rgb(250,250,100)";
			this.handler.ctx.fillRect(headAndBarsXOffset  ,window.innerHeight - 80 , barsLength * (player.experience/player.requiredExperience),	Math.min(8,Math.max(Math.floor(player.height/2),5)));

      if(barsLength > 100){
        //fonts etc TODO !!!! zrob to duuzo ladniej ! za duzo liczenia w tym momencie :C
        this.handler.ctx.font = Math.min(10,Math.max(Math.floor(player.height/2),7)) + "px Arial";
        this.handler.ctx.fillStyle = "rgb(0,0,0)";


        headAndBarsXOffset+=10;
        this.handler.ctx.fillText("exp : " + player.experience + "/" + player.requiredExperience,headAndBarsXOffset,window.innerHeight - 80 + Math.min(7,Math.max(Math.floor(player.height/2),5)) );

        this.handler.ctx.fillText("hp  : " + Math.floor(player.health) + "/" + player.maxHealth,headAndBarsXOffset,window.innerHeight - 64 + Math.min(7,Math.max(Math.floor(player.height/2),5)) );

        this.handler.ctx.fillText("mana: " + Math.floor(player.mana) + "/" + player.maxMana,headAndBarsXOffset,window.innerHeight - 48 + Math.min(7,Math.max(Math.floor(player.height/2),5)) );


        this.handler.ctx.font = "20px Arial";
        this.handler.ctx.fillText("lv: " + player.level,headAndBarsXOffset,window.innerHeight - 100 + Math.min(7,Math.max(Math.floor(player.height/2),5)) );

      }

  }

}



class ItemToDraw{
  constructor(ctx,path,renderX, renderY, howLongImageMustLast, widthInImage, heightInImage,xPosInImage, yPosInImage, widthOnTheScreem, heightOnTheScreen){

    this.ctx = ctx;

    this.image = new Image();
    this.image.src = path;

    this.renderX = renderX;
    this.renderY = renderY;

    this.widthInImage = widthInImage;
    this.heightInImage = heightInImage;
    this.xPosInImage = xPosInImage;
    this.yPosInImage = yPosInImage;
    this.widthOnTheScreem = widthOnTheScreem;
    this.heightOnTheScreen = heightOnTheScreen;

    this.lastUntil = new Date().getTime() + howLongImageMustLast;
  }

  draw(){
    this.ctx.drawImage(this.image,this.xPosInImage*this.widthInImage,this.yPosInImage*this.heightInImage,
                             this.widthInImage,this.heightInImage,
                             this.renderX,this.renderY,
                             this.widthOnTheScreem,this.heightOnTheScreen);

    if(new Date().getTime() > this.lastUntil){
      this.timePassed = true;
    }

  }
}
