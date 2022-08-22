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

let gravity = .1;

// adds character constructor to create a character's hitbox
class Box {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    render() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    
}

class Player extends Box {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        this.alive = true;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.onPlatform = true;
    }

    update() {
        this.render()
        this.velocity.y != 0 ? this.onPlatform = false : this.onPlatform = true;
        this.y += this.velocity.y;
        this.x += this.velocity.x;

        if(this.y + this.height + this.velocity.y <= 715) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }

        if(this.y <= 0)
        {
            this.y = 0;
        }

        if(this.x <= 0) {
            this.velocity.x = 0;
        }
        
    }
}

class Platform extends Box {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        this.spot = {
            x: 0,
            y: 0
        }
    }

    move() {
        this.x -= 1;
    }
}

let piggy = new Player(100, 100, 100, 100, "blue");

let wolf = new Player (1616, 55, 114, 710, 'grey');

let wolfWall = new Box(1570, 0, 1, 770, 'white');

let ground = new Box(0, 715, 1720, 55, 'brown');

let platform1 = new Platform(1200, 481, 200, 20, 'pink');

let platform2 = new Platform(1571, 225, 200, 20, 'pink');


let fps = 24


function gameRefresh() {

    // clears the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)


    platform2.render()
    setTimeout(() => {
        
        platform2.x -= 3;
    }, 1000);

    // renders the items in game
    wolf.render();
    

    wolfWall.render();

    ground.render();

    piggy.update();

    platform1.render();
    // platform1.move();

   
    if(piggy.y + piggy.height <= platform1.y && piggy.y + piggy.height + piggy.velocity.y >= platform1.y && piggy.x + piggy.width > platform1.x && piggy.x + piggy.width < platform1.x + platform1.width) {
        piggy.velocity.y = 0;
    }

    if(keys.right.press && piggy.x < 1465) {
        piggy.velocity.x = 3;
    } else if (keys.left.press && piggy.x > 0) {
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
            if(piggy.onPlatform) {
                piggy.velocity.y = -9;
            }
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
        case(' '):
            piggy.velocity.y = 0;
            break;
    }
})

setInterval(gameRefresh, 1)


// elements on page render when clicking into the screen to play, will add a button to prompt player later
canvas.addEventListener('click', (e) => {
    
    console.log(e.offsetX, e.offsetY);
})


