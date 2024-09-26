/**
 * Singleton Class ensures only one instance of the game engine can exist.
 */
class GameEngine {
    /**
     * Constructor for the GameEngine Singleton class.
     * If an instance already exists, it returns that instance.
     * Otherwise, it creates a new instance.
     * 
     * @param {Number} canvasH - The height of the game canvas.
     * @param {Number} canvasW - The width of the game canvas.
     * @returns {GameEngine} The single instance of the GameEngine class.
     */
    constructor(canvasH, canvasW) {
        if (GameEngine.instance) {
            return GameEngine.instance;  // Return the existing instance if it exists
        }
        GameEngine.instance = this;

        this.Start();
        this.gameOver = false;
        return this;
    }

    /**
     * Adds a game object to the game engine.
     * 
     * @param {GameObject} gameObject - The game object to add.
     */
    AddGameObject(gameObject) {
        this.gameObjectList.push(gameObject);
    }

    /**
     * Removes a game object from the game engine.
     * 
     * @param {GameObject} gameObject - The game object to remove.
     */
    RemoveGameObject(gameObject) {
        const index = this.gameObjectList.indexOf(gameObject);
        if (index !== -1) {
            this.gameObjectList.splice(index, 1);
        }
    }

    /**
     * Starts the game engine and P5 canvas.
     */
    Start() {
        createCanvas(WIDTH, HEIGHT); //P5 Canvas
        this.gameObjectList = [];  // List to store all game objects
    }

    /**
     * Renders all game objects in the game engine.
     */
    RenderAll() {
        background(0);
        fill(255);
        //print("Frame______________________________________")
        this.gameObjectList.forEach(gameObject => {
            gameObject.Render();
            //print(gameObject.name + " rendering...")
        });
    }

    /**
     * Updates all game objects in the game engine.
     * 
     * @param {Number} dt - Delta time used for updating object states.
     */
    UpdateAll(dt) {
        this.gameObjectList.forEach(gameObject => {
            gameObject.Update(dt);
        });
    }

    /**
     * Check collisions between all game objects.
     */
    CheckCollitionAll() {

        for (let index = 0; index < this.gameObjectList.length; index++) {
            if (this.gameObjectList[index].colliderShape != null) {
                for (let j = 0; j < this.gameObjectList.length; j++) {
                    if(this.gameObjectList[j].colliderShape!=null){
                        if (this.gameObjectList[index] != this.gameObjectList[j]) {
                       
                        this.gameObjectList[index].CheckCollition(this.gameObjectList[j])
                        }
                    }
                }
            }
            const element = this.gameObjectList[index];

        }
    }
}


const ColliderShape = {
    NULL: null,
    DOT: 'dot',
    CIRCLE: 'circle',
    SQUARE: 'square'
};


/**
 * Base class for all game objects.
 * Defines default methods for Update, Render, and Collide.
 * This is an abstract Class, you should not instance this directly
 */
class GameObject {
    /**
     * Constructor for the GameObject class.
     * Adds the game object to the GameEngine instance.
     */
    constructor() {
        this.name = "GameObject not implemented";  // Default name for the game object
        this.colliderShape = null;
        GameEngine.instance.AddGameObject(this);  // Automatically add this object to the game engine
    }

    /**
     * Updates the game object's state.
     * 
     * @param {Number} dt - Delta time used for updating object states.
     */
    Update(dt) {
        console.log(this.name + " : Update() is not yet defined");  // Default placeholder message
    }

    /**
     * Renders the game object on the screen.
     */
    Render() {
        console.log(this.name + " : Render() is not yet defined");  // Default placeholder message
    }

    /**
     * Handles collision with another game object.
     * 
     * @param {GameObject} other - The other game object this object collides with.
     */
    CheckCollition(other) {
        console.log(this.name + " : Collide() is not yet defined");  // Default placeholder message
    }
}
