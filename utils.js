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
                <button class='backNext next' onclick='nextPhase()'>Next</button>
                <button class='controlButton' onclick='saveTrack()'>Save Track</button>
                <button class='controlButton' onclick='deleteTrack()'>Delete Track</button>
                <button class='controlButton' onclick='deleteLastPoint()'>Delete Point</button>
            `;
            break;
        case 2:
            rightPanel.innerHTML = `
            <button class='backNext back' onclick='backPhase()'>Prev</button>
            <button class='backNext next' onclick='nextPhase()'>Next</button>
            <button class='controlButton' onclick='saveTrack()'>save track</button>
            <button class='controlButton' onclick='deleteLastPoint()'>delete</button>
            `;
            break;
        case 3:
            //add show/hide track
            rightPanel.innerHTML = `   
            <button class='backNext back' onclick='backPhase()'>Prev</button>
            <button class='backNext next' onclick='nextPhase()'>Next</button>
            <button class='controlButton' onclick='savePhysics()'>Save Physics</button>
            <button class='controlButton' id='hide' onclick='makeInvincible();'>Invincible On</button>
            <br>
            <input min="5" max="15" value="8" step=".5" onkeydown="return false;" type="range" onchange='setMaxSpeed(this.value)' oninput="document.getElementById('maxSpeedOutput').value = 'Max Speed: ' + this.value" >
            <output id="maxSpeedOutput">Max Speed: 8</output>
            <input min="0" max="1" value=".5" step=".01" onkeydown="return false;" type="range" onchange='setTraction(this.value)' oninput="document.getElementById('tractionOutput').value = 'Traction: ' + this.value" >
            <output id="tractionOutput">Traction: .5</output>
            `;
            break;
        case 4:
            rightPanel.innerHTML = `
            <button class='backNext back' onclick='backPhase()'>Prev</button>
            <button class='controlButton' id='pause' onclick='pauseGame()'>Pause</button>
            <button class='controlButton' onclick='destroyBrain(); nextBatch();'>Reset Brain</button>
            <button class='controlButton' onclick='restartBacth();'>Restart Batch</button>
            <br>
            
            <input min="0" max="1000" value="100" step="10" onkeydown="return false;" type="range" onchange='setN(this.value)' oninput="document.getElementById('batchSizeOutput').value = 'Batch Size: ' + this.value" >
            <output  id="batchSizeOutput">Batch Size: 100</output>
            <input min="5" max="100" value="10" step="5" onkeydown="return false;" type="range" onchange='setSeconds(this.value)' oninput="document.getElementById('secondsOutput').value = 'Round Length: ' + this.value" >
            <output id="secondsOutput">Round Length: 10</output>
            <input min=".001" max=".3" value=".3" onkeydown="return false;" step=".005" type="range" onchange='setMutateValue(this.value)' oninput="document.getElementById('mutateOutput').value = 'Variance: ' + this.value" >
            <output id="mutateOutput">Variance: .3</output>
            `;
            // <label>Batch Size</label>
            // <input type='range' min="0" max="1000" step="100" value=100 onchange='setN(this.value)'>Batch Size</input>
            // <label>Round Length</label>
            // <input type='range' min="0" max="100" step="5" value=10 onchange='setSeconds(this.value)'></input>
            // <label>Mutation</label>
            // <input type='range' min="0" max="1" step=".05" value=.3 onchange='setMutateValue(this.value)'></input>

            setSeconds(10);
            begin();
            break;

    }
}