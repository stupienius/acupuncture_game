const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 640;


let score = 0;
const circle = document.querySelector(".circle");
let firePremission = true; 

class Needle {
    constructor({position,isRotate}) {
        this.position = position;
        this.isRotate = isRotate;
    }

    draw(){
        c.beginPath();
        c.lineWidth = 2;
        c.moveTo(this.position.start.x ,this.position.start.y);
        c.lineTo(this.position.end.x ,this.position.end.y);
        c.strokeStyle = "gray";
        c.closePath();
        c.stroke();
        c.beginPath();
        c.arc(this.position.end.x ,this.position.end.y ,4 ,0 ,Math.PI * 2 , true);
        c.fillStyle = "gray";
        c.closePath();
        c.fill();
    }
    update(degree){
        if(this.isRotate){
            this.rotate(degree%360);
        }
        this.draw();
    }
    rotate(degree){

        const radians = degree * Math.PI / 180;

        this.position.start.x = 512 + 50*Math.cos(radians);
        this.position.start.y = 250 + 50*Math.sin(radians);
        this.position.end.x = 512 + 150*Math.cos(radians);
        this.position.end.y = 250 + 150*Math.sin(radians);
    }
}


let rotateNeedle = [];
let needleDegree = [];
function needleOnCircle(){
    rotateNeedle.push(new Needle({
        position:{
            start:{
                x:canvas.width / 2,
                y:298
            },
            end:{
                x:canvas.width / 2,
                y:398
            }
        },
        isRotate: true
    }))
}
needleOnCircle();
console.log(rotateNeedle[0]);


let rotateSpeed = 22.5;
let circleDegree = 0;
function countDegree(){
    if(circleDegree < 359){
        circleDegree ++ ;
    }else{
        circleDegree = 0;
    }
    console.log(circleDegree);
    setTimeout(() => {
        this.countDegree();
    }, 1000/rotateSpeed);
}
countDegree();


let mainNeedle = new Needle({
        position:{
            start:{
                x:canvas.width / 2 , 
                y:canvas.height - 110
            },
            end:{
                x:canvas.width / 2 , 
                y:canvas.height - 10
            }
        },
        isRotate: false
    })

function shoot(){
    while(mainNeedle.position.start.y >= 298){
        mainNeedle.position.start.y -= 0.5; 
        mainNeedle.position.end.y -= 0.5;
    }
    console.log( Math.abs(90 - circleDegree));
    if(circleDegree <= 90){
        needleDegree[score] = 90 - circleDegree;    
    }else{
        needleDegree[score] = 360 - circleDegree + 90;
    }
    mainNeedle.position.start.x = canvas.width / 2;
    mainNeedle.position.start.y = canvas.height - 110;
    mainNeedle.position.end.x = canvas.width / 2;
    mainNeedle.position.end.y = canvas.height - 10;
    needleOnCircle();
    score ++;
    for(let i=0;i < needleDegree.length - 1;i++){
        if(needleDegree[i] >= needleDegree[score -1 ] - 3 && needleDegree[i] <= needleDegree[score - 1] + 3){
            endGame();
            return;
        }
    }
}

function fireCoolDown(){
    firePremission = false;
    setTimeout(() => {
        firePremission = true;
    }, 50);
}



function animate(){
    window.requestAnimationFrame(animate);
    circle.innerHTML = score;
    c.fillStyle = "#222222";
    c.fillRect(0 ,0 , canvas.width, canvas.height);
    mainNeedle.update();
    for(let i=0;i<score;i++){
        rotateNeedle[i].update(circleDegree + needleDegree[i]);
    }
}

animate();

window.addEventListener("keydown",(event) => {
    if(event.key === " "){
        if(firePremission){
            shoot();
            fireCoolDown();
        }
    }
});

function endGame(){
    setTimeout(() => {
        alert("End Game");
        rotateNeedle = [];
        needleDegree = [];
        score = 0;
    }, 100);

    
}


