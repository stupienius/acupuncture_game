const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 640;



const needleHeadRadius = 10;
const needleLenght = 100;


let score = 0;
let goat = 3;
let level = -1;
const circle = document.querySelector(".circle");
let firePremission = true; 

const maxLevel = 4;

const defaultScenc = [[-1,90,180,270],
                    [119,240,0],
                    [4,25],
                    [23,5,352,31,268]];

const defaultScore = [3,3,2,5];

const defaultgoat = [7,12,20,10];



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


let rotateSpeed = 90;
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
