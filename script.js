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

let gravity = .12;

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
        this.inDash = false;
    }

    update() {
        this.render()
        this.velocity.y != 0 ? this.onPlatform = false : this.onPlatform = true;
        this.velocity.x < -3 ? this.inDash = true : this.inDash = false;
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

class Attack extends Box {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        this.inShoot = false;
    }

}

let piggy = new Player(100, 100, 100, 100, "pink");

let wolf = new Player (1616, 55, 114, 710, 'grey');

let wolfWall = new Box(1570, 0, 1, 770, 'white');

let ground = new Box(0, 715, 1720, 55, 'brown');

let platform1 = new Platform(1171, 481, 400, 20, 'blue');

let platform2 = new Platform(1571, 225, 400, 20, 'blue');

let knife = new Attack(1571, 630, 200, 20, 'darkgrey');

// let bullet = new Attack(piggy.x + piggy.width, piggy.y, 10, 10, 'red');

let fps = 24

let platformArr = [];
setInterval(() => {
    platformArr.push(new Platform(1571, 481, 400, 20, 'blue'))
}, 2000)
setInterval(() => {
    platformArr.push(new Platform(1571, 225, 400, 20, 'blue'))
}, 3500)

function playerMovement() {
    if(keys.right.press && piggy.x < 1465) {
        piggy.velocity.x = 4;
    } else if (keys.left.press && piggy.x > 0) {
        piggy.velocity.x = -4;
    } else {
        piggy.velocity.x = 0;
    }
}

let bullets = [];

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

    knife.render();
    setTimeout(() => {
        knife.x -=3;
    }, 100)

    //    
    for(let i = 0; i < platformArr.length; i++) {
        platformArr[i].render()
        platformArr[i].x -= 2.3;
        // platform1 collision detection (remember that the y + height gets added with the velocity which is why the second && statement is required)
        if(piggy.y + piggy.height <= platformArr[i].y && piggy.y + piggy.height + piggy.velocity.y >= platformArr[i].y && piggy.x + piggy.width > platformArr[i].x && piggy.x < platformArr[i].x + platformArr[i].width) {
            piggy.velocity.y = 0;
        }
    }

    playerMovement()

    if(keys.jChar.press) {
        bullets.push(new Attack(piggy.x + piggy.width, piggy.y, 10, 10, 'red'))
        
    }
    for(let i = 0; i < bullets.length; i++)  {
            bullets[i*50].x += 3;   
            bullets[i*50].render()
            
    }

    
    
    
}


let keys = {
    right: {
        press: false
    },
    left: {
        press: false
    },
    shift: {
        press: false
    },
    jChar: {
        press: false
    }
}

let bulletTimeout = setTimeout(() => {
    inShoot = false;
}, 0);

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
        case('j'):
            keys.jChar.press = true;
            // setInterval(() => {
            //     inShoot = false;
            // }, 3)
            
            // bullets.push(new Attack(piggy.x + piggy.width, piggy.y, 10, 10, 'red'));
            
            break;
        // case('c'):
        //     if(piggy.inDash) {
        //         null
        //     } else {
        //         setInterval(() => {
        //             keys.shift.press = true
        //         }, 5)
        //         if (keys.left.press && keys.shift.press && piggy.x > 0) {
        //             piggy.velocity.x = -12;
        //         }
        //     break;
        //     }
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
        case('j'):
            keys.jChar.press = false;
        // case('c'):
        //     keys.shift.press = false;
    }
})

setInterval(gameRefresh, 1)



// elements on page render when clicking into the screen to play, will add a button to prompt player later
canvas.addEventListener('click', (e) => {
    
    console.log(e.offsetX, e.offsetY);
})


