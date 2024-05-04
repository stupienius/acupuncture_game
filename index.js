const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 640;


let score = 0;
let goat = 3;
let level = -1;
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


let rotateSpeed = 22.5;
let circleDegree = 0;
function countDegree(){
    if(circleDegree < 359){
        circleDegree ++ ;
    }else{
        circleDegree = 0;
    }
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
    for(let i=0;i < score - 1;i++){
        if(needleDegree[i] >= needleDegree[score -1 ] - 3 && needleDegree[i] <= needleDegree[score - 1] + 3){
            endGame("fail");
            return;
        }
    }
    if(score === goat){
        levelControler();
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
    circle.innerHTML = goat - score;
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

function endGame(a){
    setTimeout(() => {
        alert(a);
        rotateNeedle = [];
        needleDegree = [];
        score = 0;
        level = -1;
        goat = 3;
    }, 100);
}




const maxLevel = 2;

const defaultScenc = [[0,90,180,270],
                    [120,240,0],
                    [5,25]];

const defaultScore = [4,3,2];

const defaultgoat = [8,12,10];

function levelControler(){
    level ++;
    if(level > maxLevel){
        endGame("pass");
        return;
    }
    score = defaultScore[level];
    for (let i=0;i<score;i++){
        needleDegree[i] = defaultScenc[level][i];
    }
    rotateNeedle = [];
    for(let i=0;i<score;i++){
        needleOnCircle();
    }
    goat = defaultgoat[level];
}


