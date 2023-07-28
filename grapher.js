function graphProgress(){
    const graphCanvas=document.getElementById("graphCanvas");
    const graphCtx = graphCanvas.getContext("2d");

    graphCtx.beginPath();
    const progressArray = JSON.parse(localStorage.progress);
    const minVal = Math.min(...progressArray);
    const yRange = Math.max(...progressArray)-Math.min(...progressArray);
    const multiplier = graphCanvas.height / yRange;
    const xIncrement = .9*graphCanvas.width / progressArray.length;
    let i = 0;
    progressArray.forEach((prog)=>{
        graphCtx.beginPath();
        graphCtx.strokeStyle = "blue";
        graphCtx.lineWidth = 4;
        i+=1;
        graphCtx.arc(xIncrement*i,graphCanvas.height-multiplier*(prog-minVal),2,0,Math.PI*2,true);
        graphCtx.fillStyle = "blue";
        graphCtx.fill();
        graphCtx.stroke();
    });

}