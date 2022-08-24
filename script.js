// selects canvas box
const canvas = document.querySelector('canvas');

// sets context for canvas
const ctx = canvas.getContext('2d');

// set the canvas's resolution to be the same as the window
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
canvas.setAttribute('width', getComputedStyle(canvas)['width'])

// taken from Game Tutorial video


var imagePigLeft = new Image();
imagePigLeft.src = '../img/Angry Pig Idle Spritesheet.png'
console.log(imagePigLeft.src)

var imagePigRight = new Image();
imagePigRight.src = '../img/Angry Pig Idle Spritesheet Right.png'

imagePigRight.width = imagePigRight.width*2;
imagePigRight.height = imagePigRight.height*2;

// From Franks Laboratory Sprite Animation
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

let gravity = .15;

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
        this.iKillFrames = false;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.onPlatform = true;
        this.inDash = false;
        this.frameX = 0;
        this.facingRight = true;
        this.facingLeft = false;
    }

    update() {
        this.render()
        if(this.frameX > 4) {
            this.frameX = 0
        }
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
}

class Attack extends Box {
    constructor(x, y, width, height, color, attackPoints) {
        super(x, y, width, height, color)
        this.attackPoints = attackPoints
    }
}

class Wolf extends Box {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        this.health = 100;
        this.iFrames = false;
    }
}

class Health extends Box {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
    }

    hit() {
        if(piggy.health === 3) {
            heart1.color = 'red';
        } else {
            heart1.color = 'darkgrey'
        }
        if(piggy.health === 2 || piggy.health === 3) {
            heart2.color = 'red';
        } else {
            heart2.color = 'darkgrey'
        }
        if(piggy.health === 1 || piggy.health === 2 || piggy.health === 3) {
            heart3.color = 'red';
        } else {
            heart3.color = 'darkgrey'
        }
    }
}



let piggy = new Player(100, 614, 100, 100, "pink");
let wolf = new Wolf (1616, 55, 114, 710, 'grey');
let wolfWall = new Box(1570, 0, 1, 770, 'white');
let ground = new Box(0, 715, 1720, 55, 'brown');
let heart1 = new Health(5, 5, 50, 50, 'red');
let heart2 = new Health(60, 5, 50, 50, 'red');
let heart3 = new Health(115, 5, 50, 50, 'red');

let platformArr = [];
let bullets = [];
let knivesArr = [];
let forksArr = [];
let armsArr = [];
let explosionArr = [];
let gameState = false;


// testing init function
function init() {
    platformArr = [];
    bullets = [];
    knivesArr = [];
    forksArr = [];
    armsArr = [];
    explosionArr = [];
    piggy = new Player(100, 614, 100, 100, "pink");
    wolf = new Wolf (1616, 55, 114, 710, 'grey');
    wolfWall = new Box(1570, 0, 1, 770, 'white');
    ground = new Box(0, 715, 1720, 55, 'brown');
    heart1 = new Health(5, 5, 50, 50, 'red');
    heart2 = new Health(60, 5, 50, 50, 'red');
    heart3 = new Health(115, 5, 50, 50, 'red');
}

// Add dash mechanic for left side
function playerMovement() {

    if(keys.right.press && keys.kChar.press && piggy.x < 1465 && piggy.inDash == false) {
        piggy.velocity.x = 50;
        if(piggy.velocity.x > 4) {
            
            // Sets dash ending time
            setTimeout(() => {
                piggy.inDash = true;
            }, 40)

            // Sets time where you cannot dash again
            setTimeout(() => {
                piggy.inDash = false;
            }, 1000)
        }
    } else if(keys.left.press && keys.kChar.press && piggy.x > 0 && piggy.inDash == false) {
        piggy.velocity.x = -50;
       
        if(piggy.velocity.x < -4) {
            
            setTimeout(() => {
                piggy.inDash = true;
            }, 40)

            setTimeout(() => {
                piggy.inDash = false;
            }, 1000)
        }
    } else if(keys.right.press && piggy.x < 1465) {
        piggy.velocity.x = 4;
        // Change with walking right animation
        // drawSprite(imagePigRight, 0, 0, 32, 32, piggy.x-20, piggy.y-60, piggy.width+60, piggy.height+60)
        console.log(piggy.velocity.x)
    } else if (keys.left.press && piggy.x > 0) {
        piggy.velocity.x = -4;
        // Change with walking left animation
        // drawSprite(imagePigLeft, 0, 0, 32, 32, piggy.x-20, piggy.y-60, piggy.width+60, piggy.height+60)
    } else {
        piggy.velocity.x = 0;
    }
}



function spawnEnemies() {
    
    // Platform Intervals
    setInterval(() => {
        platformArr.push(new Platform(1571, 481, 400, 20, 'blue'))
    }, 2000)
    setInterval(() => {
        platformArr.push(new Platform(1571, 225, 400, 20, 'blue'))
    }, 3500)

    

    // Knife Intervals
    setInterval(() => {
        // knives low
        knivesArr.push(new Attack(1571, 630, 200, 20, 'darkgrey', 1))
    }, 3000) // Math.floor(Math.random() * (6000-2000) + 2000))

    setInterval(() => {
        // knives mid
        knivesArr.push(new Attack(1571, 400, 200, 20, 'darkgrey', 1))
    }, 4000)

    setInterval(() => {
        // knives top
        knivesArr.push(new Attack(1571, 150, 200, 20, 'darkgrey', 1))
    }, 5000)


    // Fork Intervals
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
    }, 3500)


    // Wolf Arms Intervals
    setInterval(() => {
        // bottom arm
        armsArr.push(new Attack(1571, 550, 1300, 136, 'grey', 1));
    }, 8654)

    setInterval(() => {
        // middle arm
        armsArr.push(new Attack(1571, 300, 1300, 136, 'grey', 1));
    }, 11846)

    setInterval(() => {
        // top arm
        armsArr.push(new Attack(1571, 40, 1300, 136, 'grey', 1));
    }, 13392)


    // Explosion Interval
    setInterval(() => {
        explosionArr.push(new Attack(0, -20, 1571, 20, 'orange', 5));
    }, 5000)
}






function detectHit(attack, entity) {
    const right = entity.x + entity.width - entity.velocity.x >= attack.x
    const left = entity.x - entity.velocity.x <= attack.x + attack.width
    const top = entity.y + entity.height - entity.velocity.y >= attack.y
    const bottom = entity.y - entity.velocity.y <= attack.y + attack.height
    return (right && left && top && bottom)
}

function wolfHitDetect(attack, entity) {
    return entity.x >= attack.x && entity.x <= attack.x + attack.width
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
    },
    kChar: {
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
        case('k'):
            keys.kChar.press = true;
            break;
        case(' '):
            if(piggy.onPlatform) {
                piggy.velocity.y = -9;
            }
            break;
        case('s'):
            if(piggy.onPlatform && piggy.y + piggy.height < 715)
            piggy.velocity.y = 1;
            break;
        case('j'):
            keys.jChar.press = true;
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
        case('j'):
            keys.jChar.press = false;
            break;
        case('k'):
            keys.kChar.press = false;
            break;
    }
})

let loser = document.querySelector(".Loss");
let winner = document.querySelector(".Won");
let readMe = document.querySelector(".readMe");

let beginning = document.querySelector(".Prompt");

beginning.style.display = 'grid';

let instructions = document.querySelector("#instructions");

// Saving for animation frames later
// setInterval(() => {
//     piggy.frameX++
// }, 200)

function gameLoop() {
    if(gameState) {
        requestAnimationFrame(gameLoop)
        // clears the canvas
        
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        
        // renders the items in game
        wolf.render();
        
        wolfWall.render();

        ground.render();

        heart1.render();
        heart1.hit()
        heart2.render();
        heart2.hit();
        
        heart3.render();
        heart3.hit();

        
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
            if(piggy.y + piggy.velocity.y > platformArr[j].y + platformArr[j].height && piggy.x + piggy.width - piggy.velocity.x < platformArr[j].x + platformArr[j].width && piggy.x - piggy.velocity.x > platformArr[j].x) {
                piggy.iKillFrames = true;
            }
            
        }
       
        
        

        if(wolf.health >= 51) {
            for(let k = 0; k < knivesArr.length; k++) {
                knivesArr[k].render()
                knivesArr[k].x -= 3;
                if(detectHit(knivesArr[k], piggy) === true && piggy.iFrames == false) {
                    piggy.health -= knivesArr[k].attackPoints
                    piggy.iFrames = true;
                    piggy.color = 'rgb(0, 0, 0, 0)';
                    imagePigRight.style.opacity = '0'
                    setTimeout (() => {
                        piggy.iFrames = false;
                        piggy.color = 'pink';
                    }, 3000)
                    console.log(piggy.health)
                }
            }
        }

        if(wolf.health <= 75 && wolf.health >= 51) {
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
                    }, 3000)
                    console.log(piggy.health)
                }
            }
        }


        

        if(wolf.health <= 50) {
            for(let m = 0; m < armsArr.length; m++) {
                    armsArr[m].render();
                    armsArr[m].x -= 6;
                if(detectHit(armsArr[m], piggy) === true && piggy.iFrames == false) {
                    piggy.health -= armsArr[m].attackPoints;
                    piggy.iFrames = true;
                    piggy.color = 'white';
                    setTimeout(() => {
                        piggy.iFrames = false;
                        piggy.color = 'pink';
                    }, 3000)
                }
            }
        }

        if(wolf.health <= 25) {
            for(let n = 0; n < explosionArr.length; n++) {
                    explosionArr[n].render();
                    explosionArr[n].y += 2;
                if(detectHit(explosionArr[n], piggy) === true && piggy.iKillFrames == false) {
                    piggy.health -= explosionArr[n].attackPoints;
                }
            }
        }

        piggy.iKillFrames = false;
        

        if(piggy.health <= -1) {
            gameHeader.innerText = 'You Lose';
            loser.style.display = 'grid';
            gameState = false;
        }

        
        if(wolf.health == 0) {
            gameHeader.innerText = 'You Win!';
            winner.style.display = 'grid';
            gameState = false;
        }
    }
    
}



spawnEnemies()




canvas.addEventListener('click', (e) => {
    console.log(e.offsetX, e.offsetY)
    
})


playAgain.addEventListener('click', () => {
    if(gameState == false) {
        init()
        gameState = true;
        gameLoop()
        loser.style.display = 'none'
        winner.style.display = 'none'
        beginning.style.display = 'none'
        readMe.style.display = 'none'
        console.log(gameLoop)
    }
})


instructions.addEventListener('click', () => {
    if(gameState == false) {
        readMe.style.display = 'grid'
    }
    
})
