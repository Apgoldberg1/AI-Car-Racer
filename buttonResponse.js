function pauseGame(){
    console.log("pause");
    pause=!pause;
    document.getElementById("pause").textContent = pause?"Play":"Pause";
}
function save(){
    const progressVal = bestCar.checkPointsCount+bestCar.laps*road.checkPointList.length/seconds;
    if(localStorage.getItem("progress")){
        var progressArray = JSON.parse(localStorage.getItem("progress"));
        progressArray.push(progressVal);
        localStorage.setItem("progress",JSON.stringify(progressArray));
    }
    else{
        localStorage.setItem("progress",JSON.stringify([progressVal]));
    }
    localStorage.setItem("oldBestBrain",(localStorage.getItem("bestBrain")));
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}
function destroyBrain(){
    localStorage.removeItem("bestBrain");
}
function submitTrack(){
    road.getTrack();
    road.roadEditor.checkPointModeChange(false);
    road.roadEditor.editModeChange(false);
}
function deleteTrack(){
    if(localStorage.getItem("trackInner")){
        localStorage.removeItem("trackInner");
    }
    if(localStorage.getItem("trackOuter")){
        localStorage.removeItem("trackOuter");
    }
    if(localStorage.getItem("checkPointList")){
        localStorage.removeItem("checkPointList");
    }
    location.reload();
}
function saveTrack(){
    localStorage.setItem("trackInner",JSON.stringify(road.roadEditor.points));
    localStorage.setItem("trackOuter",JSON.stringify(road.roadEditor.points2))
    localStorage.setItem("checkPointList",JSON.stringify(road.roadEditor.checkPointListEditor))
}
function checkPoint(onOff){
    road.roadEditor.checkPointModeChange(onOff);
}
function deleteLastPoint(){
    road.roadEditor.deleteLast();
}
function resetTrainCount(){
    localStorage.setItem("trainCount", JSON.stringify(0));
    localStorage.setItem("progress", JSON.stringify([]));
}
function nextPhase(){
    phase+=1;
    switch(phase){
        case 1:
            road.roadEditor.checkPointModeChange(false);
            road.roadEditor.editModeChange(true);
            phaseToLayout(phase);
            break;
        case 2:
            road.roadEditor.editModeChange(true);
            road.roadEditor.checkPointModeChange(true);
            phaseToLayout(phase);
            break;
        case 3:
            saveTrack();            
            submitTrack();
            nextPhase();
            break;
        case 4:
            begin();
            road.roadEditor.checkPointModeChange(false);
            road.roadEditor.editModeChange(false);
            phaseToLayout(phase);
            submitTrack();
            // pauseGame();
            break;
    }
}
function backPhase(){
    if(phase==4){
        phase-=1;
    }
    phase-=2;
    nextPhase();
}
function setN(value){
    N=value;
}
function setSeconds(value){
    seconds=value;
}
function setMutateValue(value){
    mutateValue=value;
}
function restartBacth(){
    begin();
}