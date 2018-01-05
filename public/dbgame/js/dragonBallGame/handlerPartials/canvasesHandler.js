class CanvasesHandler{
  constructor(handler){
    this.handler = handler;
  }

  setCanvases(){

            //collision canvas
            this.handler.collisionCanvas = document.getElementById("ccoll");
            if(!this.handler.collisionCanvas){

          		this.handler.collisionCanvas = document.createElement("canvas");
              this.handler.collisionCanvas.setAttribute("id", "ccoll");
            }

            this.handler.collisionCtx = this.handler.collisionCanvas.getContext('2d');

            this.handler.collisionCanvas.width = window.innerWidth;
            this.handler.collisionCanvas.height = window.innerHeight;


        //main canvas
        this.handler.canvas = document.getElementById("cnorm");
        if(!this.handler.canvas){

      		this.handler.canvas = document.createElement("canvas");
          this.handler.canvas.setAttribute("id", "cnorm");
        }

        this.handler.ctx = this.handler.canvas.getContext('2d');
        this.handler.ctx.imageSmoothingEnabled = false;
        this.handler.ctx.oImageSmoothingEnabled = false;
        this.handler.ctx.webkitImageSmoothingEnabled = false;

        this.handler.canvas.width = window.innerWidth;
        this.handler.canvas.height = window.innerHeight;




        document.body.appendChild(this.handler.collisionCanvas);
        document.body.appendChild(this.handler.canvas);
        // document.body.appendChild(this.handler.collisionCanvas)

        this.setWidthAndHeightOfCanvases();
  }

  setWidthAndHeightOfCanvases(){
    this.handler.gameCanvasesWidth = window.innerWidth;
    this.handler.gameCanvasesHeight = window.innerHeight;
    this.handler.canvas.width = this.handler.gameCanvasesWidth;
    this.handler.canvas.height = this.handler.gameCanvasesHeight;
    this.handler.collisionCanvas.width = this.handler.gameCanvasesWidth;
    this.handler.collisionCanvas.height = this.handler.gameCanvasesHeight;
  }
}
