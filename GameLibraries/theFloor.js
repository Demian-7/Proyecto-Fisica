class TheFloor extends GameObject{
    constructor(){
        super();
        this.name = "the floor";
        this.colliderShape=ColliderShape.SQUARE;
        this.w = WIDTH;
        this.h = 10;
        this.pos = createVector(0, HEIGHT-10);
    }

    Render() {
        fill(255, 255, 255);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }
    Update(dt) {

    }
    Collide(other) {
        // Collision logic here
        
        
    }
    CheckCollition(other) {
        //console.log(this.name + " : Collide() is not yet defined");  // Default placeholder message
    }
}