const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 640;



const needleHeadRadius = 8;
const needleLenght = 100;


let score = 0;
let goat = 3;
let level = -1;
const circle = document.querySelector(".circle");
let firePremission = true; 

const maxLevel = 15;

const defaultScenc = [
  [-1, 90, 180, 270],
  [45, 135, 225, 315],
  [4, 25, 75],
  [10, 50, 100, 200, 300, 350],
  [15, 30, 60, 120, 180, 240, 300],
  [5, 75, 150, 225, 285, 330],
  [0, 45, 90, 135, 180, 225, 270, 315],
  [20, 60, 100, 140, 180, 220, 260, 300, 340],
  [10, 30, 70, 110, 150, 210, 250, 290, 330],
  [5, 25, 50, 100, 150, 200, 250, 300, 350],
  [10, 40, 80, 120, 160, 200, 240, 280, 320, 360],
  [0, 30, 90, 150, 210, 270, 330],
  [10, 50, 90, 130, 170, 210, 250, 290, 330],
  [15, 60, 120, 180, 240, 300],
  [20, 80, 140, 200, 260, 320]
];

const defaultScore = [4, 3, 2, 5, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const defaultgoat = [7, 12, 20, 10, 15, 18, 25, 30, 35, 40, 45, 50, 55, 60, 65];


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
        c.arc(this.position.end.x ,this.position.end.y ,needleHeadRadius ,0 ,Math.PI * 2 , true);
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

        this.position.start.x = canvas.width/2  + 50*Math.cos(radians);
        this.position.start.y = canvas.height/2 - 70 + 50*Math.sin(radians);
        this.position.end.x = canvas.width/2 + 150*Math.cos(radians);
        this.position.end.y = canvas.height/2 - 70 + 150*Math.sin(radians);
    }
}


let rotateNeedle = [];
let needleDegree = [];
function needleOnCircle(){
    rotateNeedle.push(new Needle({
        position:{
            start:{
                x:canvas.width / 2,
                y:300
            },
            end:{
                x:canvas.width / 2,
                y:400 + needleLenght 
            }
        },
        isRotate: true
    }))
}
needleOnCircle();


let rotateSpeed = 85;
let circleDegree = 0;
function countDegree(){
    if(circleDegree < 359){
        circleDegree ++ ;
    }else{
        circleDegree = 0;
    }
}

setInterval(countDegree,1000/rotateSpeed);


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
    const a = needleLenght + needleHeadRadius + 50;
    const b = 2 * needleHeadRadius;
    const cos = (2*a*a - b*b)/(2*a*a);
    const collision = Math.acos(cos) * (180 / Math.PI);
    console.log("collision = " + collision);
    for(let i=0;i < score - 1;i++){
        if(needleDegree[i] > needleDegree[score -1 ] - collision && needleDegree[i] < needleDegree[score - 1] + collision){
            endGame("fail");
            return;
    }
    }
    if(score === goat){
        levelNavigation();
    }
}

function fireCoolDown(){
    firePremission = false;
    setTimeout(() => {
        firePremission = true;
    }, 10);
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
        chooselevel();
    }, 100);
}


function chooselevel(){
    const r = document.querySelector(".container");
    const a = document.querySelector('#selectBar');
    const d = document.querySelector("#chooselevel");

    firePremission = false;
    

    document.querySelector(".showlevel").style.display = "none";

    r.style.display = "none";
    d.style.display = "flex";
    

    a.innerHTML = "";

    for(let i=0;i<maxLevel;i++){
        const block = document.createElement('button');
        block.innerText = i+1;
        block.addEventListener('click', () => {
            level = i-1;
            console.log(`Level set to: ${level}`);
            levelControler();
            d.style.display = "none";
            r.style.display = "flex";
        });
        a.appendChild(block);
    }
    
}
chooselevel();


function levelNavigation(){

    if(level === maxLevel - 1){
        levelControler();
        return ;
    }
    const b = document.querySelector("#previous");
    document.querySelector("#levelnavigation").style.display = "flex";

    setTimeout(()=>{
        firePremission = false;
    },60);

    if(level != 0){
        b.style.display = "block";
        
    }else{
        b.style.display = "none";
    }
}

document.querySelector("#previous").addEventListener('click',() => {
    level -= 2;
    levelControler();
    document.querySelector("#levelnavigation").style.display = "none";
})
document.querySelector("#home").addEventListener('click', () => {
    chooselevel();
    document.querySelector("#levelnavigation").style.display = "none";
})
document.querySelector("#next").addEventListener('click',() => {
    levelControler();
    document.querySelector("#levelnavigation").style.display = "none";
})



function levelControler(){

    const a = document.querySelector(".showlevel");
   
    level ++;
    if(level === maxLevel){
        endGame("pass");
        return;
    }
    
    a.style.display = "block";
    a.innerHTML = "LEVEL " + (level+1);

    firePremission = true;

    score = defaultScore[level];
    for (let i=0;i<score;i++){
        needleDegree[i] = defaultScenc[level][i];
    }
    rotateNeedle = [];
    for(let i=0;i<score;i++){
        needleOnCircle();
    }
    goat = defaultgoat[level];
    console.log(level);
}
