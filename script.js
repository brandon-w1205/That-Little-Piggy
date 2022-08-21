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

let gravity = .09;

// adds character constructor to create a character's hitbox
class Box {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.alive = true;
        this.velocity = {
            x: 0,
            y: 0.5
        }
    }

    render() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.render()
        this.y += this.velocity.y;
        this.x += this.velocity.x;

        if(this.y + this.height + this.velocity.y <= 715) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }

        if(this.x <= 0) {
            this.velocity.x = 0;
        }
        
    }
}



let piggy = new Box(100, 100, 100, 100, "blue");

let wolf = new Box(1616, 55, 114, 710, 'grey');

let wolfWall = new Box(1570, 0, 1, 770, 'white');

let ground = new Box(0, 715, 1720, 55, 'brown');




let fps = 24







function rightJump() {

}

// elements on page render when clicking into the screen to play, will add a button to prompt player later
canvas.addEventListener('click', e => {
    console.log(e.offsetX, e.offsetY);
    console.log(piggy.y)
})










function gameRefresh() {
    // clears the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // renders the items in game
    wolf.render();
    
    // piggy.render();

    wolfWall.render();

    ground.render();

    piggy.update();

    if(keys.right.press) {
        piggy.velocity.x = 3;
    } else if (keys.left.press) {
        piggy.velocity.x = -3;
    } else {
        piggy.velocity.x = 0;
    }
    
}

let keys = {
    right: {
        press: false
    },
    left: {
        press: false
    }
}

addEventListener('keydown', (e) => {
    switch(e.key) {
        case('d'):
            keys.right.press = true;
            break;
        case('a'):
            keys.left.press = true;
            break;
        case(' '):
            piggy.velocity.y = -5;
            break;
    }
})

addEventListener('keyup', (e) => {
    switch(e.key) {
        case('d'):
            keys.right.press = false;
            break;
        case('a'):
            keys.left.press = false;
            break;
    }
})

const gameRefreshInterval = setInterval(gameRefresh, 1)



