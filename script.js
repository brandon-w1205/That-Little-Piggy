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
        this.health = 3;
        this.iFrames = false;
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
    constructor(x, y, width, height, color, attackPoints) {
        super(x, y, width, height, color)
        this.attackPoints = attackPoints
    }

    // render() {
    //     ctx.fillStyle = this.color;
    //     ctx.fillRect(this.x, this.y, this.width, this.height);
    //     this.attackPoints = 1;
    // }
}

class Wolf extends Box {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        this.health = 100;
        this.iFrames = false;
    }
}

let piggy = new Player(100, 100, 100, 100, "pink");

let wolf = new Wolf (1616, 55, 114, 710, 'grey');

let wolfWall = new Box(1570, 0, 1, 770, 'white');

let ground = new Box(0, 715, 1720, 55, 'brown');

let platform1 = new Platform(1171, 481, 400, 20, 'blue');

let platform2 = new Platform(1571, 225, 400, 20, 'blue');

// let knives = new Attack(1571, 630, 200, 20, 'darkgrey', 1);

function playerMovement() {
    if(keys.right.press && piggy.x < 1465) {
        piggy.velocity.x = 4;
    } else if (keys.left.press && piggy.x > 0) {
        piggy.velocity.x = -4;
    } else {
        piggy.velocity.x = 0;
    }
}




let platformArr = [];
setInterval(() => {
    platformArr.push(new Platform(1571, 481, 400, 20, 'blue'))
}, 2000)
setInterval(() => {
    platformArr.push(new Platform(1571, 225, 400, 20, 'blue'))
}, 3500)


let bullets = [];


let knivesArr = [];
setInterval(() => {
    // knives low
    knivesArr.push(new Attack(1571, 630, 200, 20, 'darkgrey', 1))
}, 3000)

setInterval(() => {
    // knives mid
    knivesArr.push(new Attack(1571, 400, 200, 20, 'darkgrey', 1))
}, 4000)

setInterval(() => {
    // knives top
    knivesArr.push(new Attack(1571, 150, 200, 20, 'darkgrey', 1))
}, 5000)



let forksArr = [];

setInterval(() => {
    // forks
    forksArr.push(new Attack(80, -100, 20, 100, 'darkgrey', 1))
}, 2500)

setInterval(() => {
    // forks
    forksArr.push(new Attack(373, -100, 20, 100, 'darkgrey', 1))
}, 3000)

setInterval(() => {
    // forks
    forksArr.push(new Attack(745, -100, 20, 100, 'darkgrey', 1))
}, 5500)

setInterval(() => {
    // forks
    forksArr.push(new Attack(1118, -100, 20, 100, 'darkgrey', 1))
}, 5000)

setInterval(() => {
    // forks
    forksArr.push(new Attack(1491, -100, 20, 100, 'darkgrey', 1))
}, 2000)






function detectHit(attack, entity) {
    const right = entity.x + entity.width >= attack.x
    const left = entity.x <= attack.x + attack.width
    const top = entity.y + entity.height >= attack.y
    const bottom = entity.y <= attack.y + attack.height
    return (right && left && top && bottom)
}

function wolfHitDetect(attack, entity) {
    return entity.x >= attack.x && entity.x <= attack.x + attack.width
}

let refresh = setInterval(gameRefresh, 1)

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

    playerMovement()

    if(keys.jChar.press) {
        bullets.push(new Attack(piggy.x + piggy.width, piggy.y, 10, 10, 'red', 1))
    }

    for(let i = 0; i < bullets.length; i += 50)  {
        bullets[i].render();
        bullets[i].x += 3; 
        
        if(wolfHitDetect(bullets[i], wolf) === true && wolf.iFrames == false) {
            wolf.health -= bullets[i].attackPoints
            wolf.iFrames = true;
            setTimeout (() => {
                wolf.iFrames = false;
            }, 200)
            console.log(wolf.health)
        }
    }


    

    for(let j = 0; j < platformArr.length; j++) {
        platformArr[j].render();
        platformArr[j].x -= 2.3;
        // platform1 collision detection (remember that the y + height gets added with the velocity which is why the second && statement is required)
        if(piggy.y + piggy.height <= platformArr[j].y && piggy.y + piggy.height + piggy.velocity.y >= platformArr[j].y && piggy.x + piggy.width > platformArr[j].x && piggy.x < platformArr[j].x + platformArr[j].width) {
            piggy.velocity.y = 0;
        }
    }

    

    if(wolf.health >= 76) {
        for(let k = 0; k < knivesArr.length; k++) {
            knivesArr[k].render()
            knivesArr[k].x -= 2;
            if(detectHit(knivesArr[k], piggy) === true && piggy.iFrames == false) {
                piggy.health -= knivesArr[k].attackPoints
                piggy.iFrames = true;
                piggy.color = 'white';
                setTimeout (() => {
                    piggy.iFrames = false;
                    piggy.color = 'pink';
                }, 4000)
                console.log(piggy.health)
            }
        }
    }

    for(let l = 0; l < forksArr.length; l++) {
        forksArr[l].render();
        forksArr[l].y += 2;
        if(detectHit(forksArr[l], piggy) === true && piggy.iFrames == false) {
            piggy.health -= forksArr[l].attackPoints;
            piggy.iFrames = true;
            piggy.color = 'white';
            setTimeout(() => {
                piggy.iFrames = false;
                piggy.color = 'pink';
            }, 4000)
            console.log(piggy.health)
        }
    }

    
    if(piggy.health == 0) {
        clearInterval(refresh, 0);
    }

    
    if(wolf.health == 0){
        clearInterval(refresh, 0);
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





// elements on page render when clicking into the screen to play, will add a button to prompt player later
canvas.addEventListener('click', (e) => {
    
    console.log(e.offsetX, e.offsetY);
})


