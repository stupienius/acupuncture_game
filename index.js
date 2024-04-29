const canva = document.querySelector("canvas");
const c = canva.getContext("2d");

class Needle {
    constructor({position}) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.width = 2;
        this.height = 300;
    }

    draw(){
        c.fillStyle = "gray";
        c.fillRect(this.position.x ,this.position.y ,this.width ,this.height);
    }
    update(){
        this.draw;
    }
}