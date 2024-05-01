const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 640;

// c.moveTo(0,0);
// c.lineTo(canvas.width,canvas.height);
// c.strokeStyle = "red";
// c.lineWidth = 10;
// c.stroke();

// c.beginPath();
// c.strokeStyle = "#ffffff";
// c.lineWidth = 20;
// c.moveTo(200 ,200);
// c.lineTo(100 ,200);
// c.arc(100 ,200 ,10 ,0 ,Math.PI * 2 , true);
// c.stroke();

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
            this.rotate(degree);
        }
        this.draw();
    }
    rotate(degree){

        const radians = degree * Math.PI / 180;

        this.position.start.x = 512 + 50*Math.cos(radians);
        this.position.start.y = 250 + 50*Math.sin(radians);
        this.position.end.x = 512 + 150*Math.cos(radians);
        this.position.end.y = 250 + 150*Math.sin(radians);
        console.log(degree);
    }
}

const needle = new Needle({
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
});

let rotateSpeed = 180;
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

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = "#101010";
    c.fillRect(0 ,0 , canvas.width, canvas.height);
    needle.update(circleDegree);
}

animate();

