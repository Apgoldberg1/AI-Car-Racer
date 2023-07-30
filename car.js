class Car{
    constructor(x,y,width,height,controlType, maxSpeed=3){
        this.origin={x:x,y:y};
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        if(controlType == "KEYS"){
            this.invincible=false;
        }

        this.velocity={x:0,y:0};
        this.speed=0;
        this.acceleration=acceleration;
        this.breakAccel=.1;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false;
        // this.driftVelocity={x:0,y:0};
        this.slideSpeed=3.5;
        this.slide=false;

        this.checkPointsCount = 0;
        this.checkPointsPassed = [];
        this.laps=0;

        this.controlType = controlType;
        this.useBrain=controlType=="AI";

        this.delayCounter = 0;

        if(controlType!="DUMMY"){
            this.sensor=new Sensor(this);
            this.brain=new NeuralNetwork(
                [this.sensor.rayCount+1,8,4]
            );
        }
        this.controls=new Controls(controlType);
        this.polygon=this.#createPolygon();
    }

    update(roadBorders, checkPointList){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            if(!this.controlType == "KEYS" || !this.invincible){
                this.damaged=this.#assessDamage(roadBorders);
            }
            let checkPoint=this.#assessCheckpoint(checkPointList);
            if (checkPoint!=-1 && !this.checkPointsPassed.includes(checkPoint)){
                this.checkPointsCount++;
                if(this.checkPointsCount >= checkPointList.length){
                    this.checkPointsCount=1;
                    this.laps++;
                    this.checkPointsPassed = [];
                }
                this.checkPointsPassed.push(checkPoint);
            }
        }
        else if(this.controlType == "KEYS"){
            this.delayCounter++;
            if(this.delayCounter==40){
                this.x = this.origin.x;
                this.y = this.origin.y;
                this.angle=0;
                this.speed=0;
                this.velocity.x=0
                this.velocity.y=0;
                this.delayCounter=0;
                this.damaged=false;
                this.delayCounter=0;
            }
 
        }
        if(this.sensor){
            this.sensor.update(roadBorders);
            var offsets=this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
            offsets.push(this.speed/this.maxSpeed);
            const outputs=NeuralNetwork.feedForward(offsets,this.brain);
            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
    }
    #assessDamage(roadBoarders){
        for(let i=0; i<roadBoarders.length;i++){
            if(polysIntersect(this.polygon,roadBoarders[i])){
                return true;
            }
        }
        return false;
    }
    #assessCheckpoint(checkpoints){
        for(let i=0; i<checkpoints.length;i++){
            if(polysIntersect(this.polygon,checkpoints[i])){
                return i;
            }
        }
        return -1;
    }

    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }
    // #move(){
    //     if(this.controls.forward){
    //         this.speed+=this.acceleration-this.speed/this.maxSpeed*(this.acceleration-.05);
    //     }
    //     if(this.controls.reverse){
    //         this.speed-=this.breakAccel;
    //     }

    //     if(this.speed>this.maxSpeed){
    //         this.speed=this.maxSpeed;
    //     }
    //     if(this.speed<-this.maxSpeed/2){
    //         this.speed=-this.maxSpeed/2;
    //     }

    //     if(this.speed>0){
    //         this.speed-=this.friction+this.speed/this.maxSpeed*.1;
    //     }
    //     if(this.speed<0){
    //         this.speed+=this.friction;
    //     }
    //     if(Math.abs(this.speed)<this.friction){
    //         this.speed=0;
    //     }

    //     if(this.speed!=0){
    //         const flip=this.speed>0?1:-1;
    //         if(this.controls.left){
    //             this.angle+=0.03*flip;
    //         }
    //         if(this.controls.right){
    //             this.angle-=0.03*flip;
    //         }
    //     }

    //     this.x-=Math.sin(this.angle)*this.speed;
    //     this.y-=Math.cos(this.angle)*this.speed;
    // }
    #move(){
        this.speed=Math.hypot(this.velocity.x, this.velocity.y);
        const windAccel = this.speed/this.maxSpeed*(.9*this.acceleration); //wind resistance, acceleration decreases to .1saccels
        if(this.controls.forward){
            this.velocity.x+=Math.sin(this.angle)*(this.acceleration);
            this.velocity.y+=Math.cos(this.angle)*(this.acceleration);
        }
        if(this.controls.reverse){
            this.velocity.x-=Math.sin(this.angle)*(this.breakAccel);
            this.velocity.y-=Math.cos(this.angle)*(this.breakAccel);
        }
        this.speed=Math.hypot(this.velocity.x, this.velocity.y);
        if(this.speed<this.friction){
            this.velocity.x=0;
            this.velocity.y=0;
        }
        if(this.speed!=0){
            // const flip=Math.abs(Math.abs(Math.atan2(this.velocity.y+.001, this.velocity.x))-this.angle)<Math.PI/2?1:-1;
            const flip=this.speed>0?1:-1;
            //const slide=this.speed*Math.sin(.03);
            if(this.controls.left){
                if(this.speed > this.slideSpeed){
                    this.slide = true;
                }
                this.angle+=0.03*flip;
            //     this.driftVelocity.x+=slide*Math.sin(this.angle)*flip*.01;
            //     this.driftVelocity.y+=slide*Math.cos(this.angle)*flip*.01;
            }
            if(this.controls.right){
                if(this.speed > this.slideSpeed){
                    this.slide = true;
                }
                this.angle-=0.03*flip;
                // this.driftVelocity.x+=slide*Math.sin(this.angle)*flip*.2;
                // this.driftVelocity.y+=slide*Math.cos(this.angle)*flip*.2;
                // const normVelo = {x:-this.velocity.y/this.speed,y:this.velocity.x/this.speed}
                // this.driftVelocity.x=lerp(this.driftVelocity.x,-normVelo.y*Math.hypot(this.driftVelocity.x, this.driftVelocity.y),.001);
                // this.driftVelocity.y=lerp(this.driftVelocity.y,normVelo.x*Math.hypot(this.driftVelocity.x, this.driftVelocity.y),.001);
            }
            // else {
            //     // console.log(this.driftVelocity.x);
            //     // console.log(this.driftVelocity.y);
            //     if(Math.hypot(this.driftVelocity.x, this.driftVelocity.y) < .0001){
            //         this.driftVelocity.x=0;
            //         this.driftVelocity.y=0;
            //     }
            //     else{
            //         this.driftVelocity.x=lerp(this.driftVelocity.x,0,.1);
            //         this.driftVelocity.y=lerp(this.driftVelocity.y,0,.1);
            //     }
             
            // }
        }
        if(!this.controls.left && !this.controls.right && this.speed < this.slideSpeed){
            this.slide=false;
        }
        this.speed=Math.hypot(this.velocity.x, this.velocity.y);

     
        if(this.speed>this.maxSpeed){
            const scalar = this.maxSpeed/this.speed;
            this.velocity.x*=scalar;
            this.velocity.y*=scalar;
        }
       
        else if(this.speed>0){
            this.velocity.x-=Math.abs(Math.sin(this.angle))*(this.friction+windAccel)*Math.sign(this.velocity.x);
            this.velocity.y-=Math.abs(Math.cos(this.angle))*(this.friction+windAccel)*Math.sign(this.velocity.y);
        }
        else if(this.speed<0){
            this.velocity.x+=(this.friction+windAccel)*Math.sign(this.velocity.x);
            this.velocity.y+=(this.friction+windAccel)*Math.sign(this.velocity.y);
        }
        this.speed=Math.hypot(this.velocity.x, this.velocity.y);
        // const interpolateVector = {x:this.speed*Math.sin(this.angle),y:this.speed*Math.cos(this.angle)};
        if(this.speed>this.slideSpeed){
            this.velocity.x = lerp(this.velocity.x, this.speed*Math.sin(this.angle), this.maxSpeed/(this.speed+.001)*.01);
            this.velocity.y = lerp(this.velocity.y, this.speed*Math.cos(this.angle), this.maxSpeed/(this.speed+.001)*.01);
        }
       
        if(Math.abs(Math.abs(this.velocity.x)-this.speed*Math.sin(this.angle))<.02 && Math.abs(Math.abs(this.velocity.y)-this.speed*Math.sin(this.angle))<.02){
            this.velocity.x=this.speed*Math.sin(this.angle);
            this.velocity.y=this.speed*Math.cos(this.angle);
        }

        this.x-=this.velocity.x;
        this.y-=this.velocity.y;
        this.speed=Math.hypot(this.velocity.x, this.velocity.y);
    }

    draw(ctx,color,drawSensor=false){
        let tempAlpha = ctx.globalAlpha;
        if(this.damaged){
            ctx.fillStyle="gray";
        }
        else if (this.controlType == "KEYS"){
            ctx.globalAlpha=1;
            ctx.fillStyle="red";
        }
        else {
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();
        ctx.globalAlpha=tempAlpha;
        if(this.sensor && drawSensor && this.controlType != "KEYS"){
            this.sensor.draw(ctx);
        }
    }
}