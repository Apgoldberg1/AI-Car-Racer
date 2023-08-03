function lerp(A,B,t){
    return A+(B-A)*t;
}

function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2){
    for(let i=0; i<poly1.length;i++){
        for(let j=0; j<poly2.length;j++){
            const touch =getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
                );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

function phaseToLayout(phase){
    let rightPanel = document.getElementById("verticalButtons");
    switch(phase){
        case 1:
            // rightPanel.innerHTML = "<button onclick='saveTrack()'>Save Track</button><button onclick='deleteTrack()'>Delete Track</button><button onclick='deleteLastPoint()'>Delete Point</button><button onclick='nextPhase()'>Next</button>";
            rightPanel.innerHTML = `
                <button onclick='saveTrack()'>Save Track</button>
                <button onclick='deleteTrack()'>Delete Track</button><button onclick='deleteLastPoint()'>Delete Point</button>
                <button onclick='nextPhase()'>Next</button>
            `;
            break;
        case 2:
            rightPanel.innerHTML = `
            <button onclick='backPhase()'>Back</button>
            <button onclick='saveTrack()'>save track</button>
            <button onclick='deleteLastPoint()'>delete</button>
            <button onclick='nextPhase()'>Next</button>
            `;
            break;
        case 3:
            //add show/hide track
            rightPanel.innerHTML = `   
            <button onclick='backPhase()'>Back</button>
            <button onclick='savePhysics()'>Save Physics</button>
            <button id='hide' onclick='makeInvincible();'>Invincible On</button>
            <input type='number' value=5 onchange='setMaxSpeed(this.value)'>Max Speed</input>
            <input type='number' value=.5 onchange='setTraction(this.value)'>Traction</input>
            <input type='number' value=.3 onchange='setMutateValue(this.value)'>Acceleratioin</input>
            <button onclick='nextPhase()'>Next</button>
            `;
            break;
        case 4:
            rightPanel.innerHTML = `
            <button onclick='backPhase()'>Back</button>
            <button id='pause' onclick='pauseGame()'>Pause</button>
            <button onclick='destroyBrain(); nextBatch();'>Reset Brain</button>
            <button onclick='restartBacth();'>Restart Batch</button>
            <input type='number' value=100 onchange='setN(this.value)'>Batch Size</input>
            <input type='number' value=10 onchange='setSeconds(this.value)'>Round Length</input>
            <input type='number' value=.3 onchange='setMutateValue(this.value)'>Mutation</input>
            `;
            setSeconds(10);
            begin();
            break;

    }
}