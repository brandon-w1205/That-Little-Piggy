// selects canvas box
const canvas = document.querySelector('canvas');

// sets context for canvas
const ctx = canvas.getContext('2d');

// set the canvas's resolution to be the same as the window
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
canvas.setAttribute('width', getComputedStyle(canvas)['width'])

// adds a function that will drawboxes upon variable input
function drawBox(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height)
}

// adds character constructor to create a character's hitbox
class Box {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.alive = true;
    }

    render() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}



let piggy = new Box(100, 100, 100, 100, "blue");

let wolf = new Box(1616, 55, 114, 710, 'grey');

let wolfWall = new Box(1570, 0, 1, 770, 'white');

let ground = new Box(0, 715, 1720, 55, 'brown');




let fps = 24



let gravitySpeed = 4 * (60/fps)

function gravity() {
    if(piggy.y < 600 ) {
        piggy.y += gravitySpeed;
        // piggy.height += gravitySpeed;
    }
}



function rightJump() {

}

// elements on page render when clicking into the screen to play, will add a button to prompt player later
canvas.addEventListener('click', e => {
    console.log(e.offsetX, e.offsetY);
    console.log(piggy.y)
})


const gameRefreshInterval = setInterval(gameRefresh, 24)

let playerSpeed = 0;

function gameRefresh() {
    // clears the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // renders the items in game
    wolf.render();
    
    piggy.render();

    wolfWall.render();

    ground.render();

    gravity();

    piggy.x += playerSpeed;

}


document.onkeydown = keyDown;
document.onkeyup = keyUp;

function keyDown(e) {
    switch(e.key) {
        case('d'):
            playerSpeed = 3 * (60/fps); //* (60/fps)
            break;
        case('a'):
            playerSpeed = -3 * (60/fps); //* (60/fps)
            break;
    }

}

function keyUp(e) {
    switch(e.key) {
        case('d'):
            playerSpeed = 0;
            break;
        case('a'):
            playerSpeed = 0; //* (60/fps)
            break;
    }
}

