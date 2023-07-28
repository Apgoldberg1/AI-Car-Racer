function inputVisual(controlsArray){
    const inputCanvas=document.getElementById("inputCanvas");
    const inputCtx = inputCanvas.getContext("2d");

   boxColor({x:inputCanvas.width/2,y:50}, controlsArray.forward,inputCtx);
   boxColor({x:inputCanvas.width/2,y:inputCanvas.height-50}, controlsArray.reverse,inputCtx);
   boxColor({x:inputCanvas.width/4,y:inputCanvas.height/2}, controlsArray.left,inputCtx);
   boxColor({x:3*inputCanvas.width/4,y:inputCanvas.height/2}, controlsArray.right,inputCtx);

}
function boxColor(coordinate, on, inputCtx){
    const rectHeight=50;
    const rectWidth=50;
    inputCtx.beginPath();
    inputCtx.fillStyle = on?"blue":"white";
    inputCtx.lineWidth = 4;
    inputCtx.rect(coordinate.x-rectWidth/2,coordinate.y-rectHeight/2,rectWidth,rectHeight);
    inputCtx.fill();
    inputCtx.stroke();
}