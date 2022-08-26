// Gravity and velocity calculations inspired from Chris Courses Youtube channel at https://www.youtube.com/watch?v=4q2vvZn5aoo
// Character sprite and frame animation calculations inspired from Frank's Laboratory Youtube channel at https://www.youtube.com/watch?v=EYf_JwzwTlQ


// selects canvas box
const canvas = document.querySelector('canvas');

// query selectors for html properties
const loser = document.querySelector(".Loss");
const winner = document.querySelector(".Won");
const readMe = document.querySelector(".readMe");
const beginning = document.querySelector(".Prompt");
const instructions = document.querySelector("#instructions");
const disclaimer = document.querySelector(".disclaimer");

// Sets Read Me and Prompt to be displayed on page load
readMe.style.display = 'grid';
beginning.style.display = 'grid';
disclaimer.style.display = 'grid';

// sets context for canvas
const ctx = canvas.getContext('2d');

// set the canvas's resolution to be the same as the window
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
canvas.setAttribute('width', getComputedStyle(canvas)['width'])

// defining images
const imagePigLeft = new Image();
imagePigLeft.src = './img/Angry Pig Idle Spritesheet.png'

const imagePigRight = new Image();
imagePigRight.src = './img/Angry Pig Idle Spritesheet Right.png'

const pigWalkingLeft = new Image();
pigWalkingLeft.src = './img/Angry Pig Walking Spritesheet.png'

const pigWalkingRight = new Image();
pigWalkingRight.src = './img/Angry Pig Walking Spritesheet Right.png'

const fireballRight = new Image();
fireballRight.src = './img/fireballMoving.png'

const wolfImage = new Image();
wolfImage.src = './img/Werewolf.png'

const backgroundImage = new Image();
backgroundImage.src = './img/Background.png'

const platform1Image = new Image();
platform1Image.src = './img/Platform1.png'

const knifeImage = new Image();
knifeImage.src = './img/knife.png'

const forkImage = new Image();
forkImage.src = './img/fork.png'

const wolfLegImage = new Image();
wolfLegImage.src = './img/wolfLeg.png'

const fire1Image = new Image();
fire1Image.src = './img/fire1.png'

// Defines gravity weight factor
const gravity = .15;

// Box class for creating the basis of platforms and entities
class Box {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    // Drawing function
    render() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


// Player class that extends Box to add health, invincibility frames, instant kill frames, and sprite animation booleans
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
        // start of frame selection
        this.frameX = 0;
        this.facingRight = true;
        this.facingLeft = false;
    }

    // Drawing function with movement functionality
    update() {
        this.render()

        // sets limiting frame for looping walking animation
        if(this.frameX > 4) {
            this.frameX = 0
        }

        // boolean for determining if the character is on a platform to limit their jumps
        this.velocity.y != 0 ? this.onPlatform = false : this.onPlatform = true;

        // adds a velocity/speed factor onto the x and y coordinates
        this.y += this.velocity.y;
        this.x += this.velocity.x;

        // adds the gravity weight when player is in the area and prevents player from floating
        if(this.y + this.height + this.velocity.y <= 715) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }

        // sets boundary for the player's movement on the screen
        if(this.y <= 0)
        {
            this.y = 0;
        }
        if(this.x <= 0) {
            this.velocity.x = 0;
        }
        
    }
}

// class created for Platforms to help differentiate classes
class Platform extends Box {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
    }
}

// class created for attacks to add healthpoints and differentiate
class Attack extends Box {
    constructor(x, y, width, height, color, attackPoints) {
        super(x, y, width, height, color)
        this.attackPoints = attackPoints
    }
}

// class created to give the wolf health, invincibility frames, and animation frames
class Wolf extends Box {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        this.health = 100;
        this.iFrames = false;
        this.frameX = 0;
    }
}

// class created to give the health a function
class Health extends Box {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
    }

    // hit indication for Player
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

// Initial naming of variables from classes
let piggy = new Player(100, 614, 100, 100, "rgb(0, 0, 0, 0)");
let wolf = new Wolf (1616, 55, 114, 710, 'rgb(0, 0, 0, 0)');
let wolfWall = new Box(1570, 0, 1, 770, 'rgb(0, 0, 0, 0)');
let ground = new Box(0, 715, 1720, 55, 'brown');
let heart1 = new Health(5, 5, 50, 50, 'red');
let heart2 = new Health(60, 5, 50, 50, 'red');
let heart3 = new Health(115, 5, 50, 50, 'red');

let platformArr = [];
let bulletsRight = [];
let bulletsLeft = [];
let knivesArr = [];
let forksArr = [];
let armsArr = [];
let explosionArr = [];
let gameState = false;

// testing init function
function init() {
    platformArr = [];
    bulletsRight = [];
    bulletsLeft = [];
    knivesArr = [];
    forksArr = [];
    armsArr = [];
    explosionArr = [];
    piggy = new Player(100, 614, 100, 100, "rgb(0, 0, 0, 0)");
    wolf = new Wolf (1616, 55, 114, 710, 'rgb(0, 0, 0, 0)');
    wolfWall = new Box(1570, 0, 1, 770, 'rgb(0, 0, 0, 0)');
    ground = new Box(0, 715, 1720, 55, 'brown');
    heart1 = new Health(5, 5, 50, 50, 'red');
    heart2 = new Health(60, 5, 50, 50, 'red');
    heart3 = new Health(115, 5, 50, 50, 'red');
}

// Add dash mechanic for left side
function playerMovement() {

    // Key if statements to change velocity and direction
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
        // ctx.drawImage(pigWalkingRight, piggy.frameX*32, 0, 32, 32, piggy.x-20, piggy.y-60, piggy.width+60, piggy.height+60)
        // piggy.facingLeft = false;
        // piggy.facingRight = false;
    } else if (keys.left.press && piggy.x > 0) {
        piggy.velocity.x = -4;
        // Change with walking left animation
        // ctx.drawImage(pigWalkingLeft, piggy.frameX*32, 0, 32, 32, piggy.x-20, piggy.y-60, piggy.width+60, piggy.height+60)
        // piggy.facingRight = false;
        // piggy.facingLeft = false;
    } else {
        piggy.velocity.x = 0;
    }
}

// Spawning platforms and enemy attack function
function spawnEnemies() {
    
    // Platform Intervals
    setInterval(() => {
        platformArr.push(new Platform(1571, 481, 400, 20, 'blue'))
    }, 2500)
    setInterval(() => {
        platformArr.push(new Platform(1571, 225, 400, 20, 'blue'))
    }, 4000)

    

    // Knife Intervals
    setInterval(() => {
        // knives low
        knivesArr.push(new Attack(1571, 630, 200, 20, 'rgb(0, 0, 0, 0)', 1))
    }, 3000) 

    setInterval(() => {
        // knives mid
        knivesArr.push(new Attack(1571, 400, 200, 20, 'rgb(0, 0, 0, 0)', 1))
    }, 4000)

    setInterval(() => {
        // knives top
        knivesArr.push(new Attack(1571, 150, 200, 20, 'rgb(0, 0, 0, 0)', 1))
    }, 5000)


    // Fork Intervals
    setInterval(() => {
        forksArr.push(new Attack(80, -100, 20, 100, 'rgb(0, 0, 0, 0)', 1))
    }, 2500)

    setInterval(() => {
        forksArr.push(new Attack(373, -100, 20, 100, 'rgb(0, 0, 0, 0)', 1))
    }, 3000)

    setInterval(() => {
        forksArr.push(new Attack(745, -100, 20, 100, 'rgb(0, 0, 0, 0)', 1))
    }, 4000)

    setInterval(() => {
        forksArr.push(new Attack(1118, -100, 20, 100, 'rgb(0, 0, 0, 0)', 1))
    }, 5000)

    setInterval(() => {
        forksArr.push(new Attack(1491, -100, 20, 100, 'rgb(0, 0, 0, 0)', 1))
    }, 3500)


    // Wolf Arms Intervals
    setInterval(() => {
        // bottom arm
        armsArr.push(new Attack(1571, 600, 1000, 100, 'rgb(0, 0, 0, 0)', 1));
    }, 6000)

    setInterval(() => {
        // middle arm
        armsArr.push(new Attack(1571, 350, 1000, 100, 'rgb(0, 0, 0, 0)', 1));
    }, 8500)

    // Explosion Interval
    setInterval(() => {
        explosionArr.push(new Attack(0, -20, 1571, 20, 'rgb(0, 0, 0, 0)', 5));
    }, 5000)
}

// Four direction hit detection function for enemy attacks
function detectHit(attack, entity) {
    const right = entity.x + entity.width - entity.velocity.x >= attack.x
    const left = entity.x - entity.velocity.x <= attack.x + attack.width
    const top = entity.y + entity.height - entity.velocity.y >= attack.y
    const bottom = entity.y - entity.velocity.y <= attack.y + attack.height
    return (right && left && top && bottom)
}

// Hit detection for hitting the wolf
function wolfHitDetect(attack, entity) {
    return entity.x >= attack.x && entity.x <= attack.x + attack.width
}

// Key press false initialization
const keys = {
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

// add event listener to check if a button has been pressed
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

// add event listener to determine what happens on release of a button
addEventListener('keyup', (e) => {
    switch(e.key) {
        case('d'):
            keys.right.press = false;
            piggy.facingRight = true;
            break;
        case('a'):
            keys.left.press = false;
            piggy.facingLeft = true;
            piggy.facingRight = false;
            break;
        case('j'):
            keys.jChar.press = false;
            break;
        case('k'):
            keys.kChar.press = false;
            break;
    }
})

// Intervals for animation frames
setInterval(() => {
    piggy.frameX++
}, 100)

setInterval(() => {
    wolf.frameX++
}, 900)

// Animating function
function gameLoop() {
    if(gameState) {
        requestAnimationFrame(gameLoop)
        
        // clears the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // draws the background
        ctx.drawImage(backgroundImage, 0, 0)
        
        // renders the wolf
        wolf.render();

        // loops the animation for the wolf
        if(wolf.frameX > 2) {
            wolf.frameX = 0;
        }
        
        // Draws the image for the wolf
        ctx.drawImage(wolfImage, wolf.frameX*400, 0, 400, 230, wolf.x-700, wolf.y-800, wolf.width+ 1900, wolf.height+ 900)

        // Creates a wall that the player cannot pass
        wolfWall.render();

        // Creates the ground and draws image for the ground
        ground.render();
        ctx.drawImage(platform1Image, 0, 0, 1613, 618, ground.x, ground.y-14, ground.width+10, ground.height+14)

        // Sets the lives and hit detection for them
        heart1.render();
        heart1.hit()
        heart2.render();
        heart2.hit();
        heart3.render();
        heart3.hit();

        // Creates Miss Piggy
        piggy.update();

        // Draws left or right facing image for Miss Piggy 
        if(piggy.facingRight) {
            ctx.drawImage(imagePigRight, 0, 0, 32, 32, piggy.x-20, piggy.y-60, piggy.width+60, piggy.height+60)
        } else if (piggy.facingLeft) {
            ctx.drawImage(imagePigLeft, 0, 0, 32, 32, piggy.x-20, piggy.y-60, piggy.width+60, piggy.height+60)
        }
        
        // Calls player movement function
        playerMovement()

        // Continues walking animation even if player is at the wall and prevents double framing
        if(keys.right.press) {
            ctx.drawImage(pigWalkingRight, piggy.frameX*32, 0, 32, 32, piggy.x-20, piggy.y-60, piggy.width+60, piggy.height+60)
            piggy.facingLeft = false;
            piggy.facingRight = false;
        }
        if(keys.left.press) {
            ctx.drawImage(pigWalkingLeft, piggy.frameX*32, 0, 32, 32, piggy.x-20, piggy.y-60, piggy.width+60, piggy.height+60)
            piggy.facingLeft = false;
            piggy.facingRight = false;
        }
        // pushes either left or right bullets into array when j has been pressed
        if(keys.jChar.press) {
            if(piggy.facingRight || keys.right.press){
                bulletsRight.push(new Attack(piggy.x + piggy.width, piggy.y + 40, 20, 20, 'rgb(0, 0, 0, 0)', 1))
            }
            if(piggy.facingLeft || keys.left.press) {
                bulletsLeft.push(new Attack(piggy.x, piggy.y + 40, 20, 20, 'rgb(0, 0, 0, 0)', 1))
            }
            
        }

        // For loop to push right bullets out and contains wolf hit detection
        for(let i = 0; i < bulletsRight.length; i += 50)  {
                bulletsRight[i].render();
                bulletsRight[i].x += 3;
                ctx.drawImage(fireballRight, 0, 0, 320, 320, bulletsRight[i].x-5, bulletsRight[i].y-30, bulletsRight[i].width+50, bulletsRight[i].height+50)
            if(wolfHitDetect(bulletsRight[i], wolf) === true && wolf.iFrames == false) {
                wolf.health -= bulletsRight[i].attackPoints
                wolf.iFrames = true;
                setTimeout (() => {
                    wolf.iFrames = false;
                }, 200)
            }
        }

        // For loop to push left bullets out
        for(let i = 0; i < bulletsLeft.length; i += 50)  {
            bulletsLeft[i].render();
            bulletsLeft[i].x -= 4;
            ctx.drawImage(fireballRight, 0, 0, 320, 320, bulletsLeft[i].x-5, bulletsLeft[i].y-30, bulletsLeft[i].width+50, bulletsLeft[i].height+50)
        }

        // For loop to push platforms out, determines if player is on a platform if their velocity is 0, and determines if they are under a platform for instant kill attack
        for(let j = 0; j < platformArr.length; j++) {
            platformArr[j].render();
            platformArr[j].x -= 2.5;
            ctx.drawImage(platform1Image, 0, 0, 1613, 618, platformArr[j].x+2, platformArr[j].y-13, platformArr[j].width+3, platformArr[j].height+50)
            // platform1 collision detection (remember that the y + height gets added with the velocity which is why the second && statement is required)
            if(piggy.y + piggy.height <= platformArr[j].y && piggy.y + piggy.height + piggy.velocity.y >= platformArr[j].y && piggy.x + piggy.width > platformArr[j].x && piggy.x < platformArr[j].x + platformArr[j].width) {
                piggy.velocity.y = 0;
            }
            if(piggy.y + piggy.velocity.y > platformArr[j].y + platformArr[j].height && piggy.x + piggy.width - piggy.velocity.x < platformArr[j].x + platformArr[j].width + 20 && piggy.x - piggy.velocity.x > platformArr[j].x - 20 ) {
                piggy.iKillFrames = true;
            }
            
        }
       
        // For loop to push wolf knife attack towards player and hit detection
        if(wolf.health >= 51) {
            for(let k = 0; k < knivesArr.length; k++) {
                knivesArr[k].render()
                knivesArr[k].x -= 4;
                ctx.drawImage(knifeImage, 0, 0, 666, 375, knivesArr[k].x, knivesArr[k].y-34, knivesArr[k].width+7, knivesArr[k].height+80)
                if(detectHit(knivesArr[k], piggy) === true && piggy.iFrames == false) {
                    piggy.health -= knivesArr[k].attackPoints
                    piggy.iFrames = true;
                    setTimeout (() => {
                        piggy.iFrames = false;
                    }, 3000)
                }
            }
        }

        // Refreshes forks array to not have forks all come out at once upon phase activation
        if(wolf.health >= 76 && wolf.health <= 78) {
            forksArr = []
        }

        // For loop to push wolf fork attacks towards player and hit detection
        if(wolf.health <= 75 && wolf.health >= 51) {
            for(let l = 0; l < forksArr.length; l++) {
                forksArr[l].render();
                forksArr[l].y += 2;
                ctx.drawImage(forkImage, 0, 0, 188, 614, forksArr[l].x-5, forksArr[l].y-10, forksArr[l].width+15, forksArr[l].height+15)
                if(detectHit(forksArr[l], piggy) === true && piggy.iFrames == false) {
                    piggy.health -= forksArr[l].attackPoints;
                    piggy.iFrames = true;
                    setTimeout(() => {
                        piggy.iFrames = false;
                    }, 3000)
                }
            }
        }

        // Refreshes arms array to prevent wolf arms from coming out all at once
        if(wolf.health >= 51 && wolf.health <= 52) {
            armsArr = []
        }
        
        // For loop to push wolf arm attacks towards player and hit detection
        if(wolf.health <= 50) {
            for(let m = 0; m < armsArr.length; m++) {
                    armsArr[m].render();
                    armsArr[m].x -= 7;
                    ctx.drawImage(wolfLegImage, 0, 0, 232, 220, armsArr[m].x-50, armsArr[m].y-190, armsArr[m].width+60, armsArr[m].height+350)
                if(detectHit(armsArr[m], piggy) === true && piggy.iFrames == false) {
                    piggy.health -= armsArr[m].attackPoints;
                    piggy.iFrames = true;
                    setTimeout(() => {
                        piggy.iFrames = false;
                    }, 3000)
                }
            }
        }

        // Begins final phase of explosion attack
        if(wolf.health <= 25) {
            for(let n = 0; n < explosionArr.length; n++) {
                    explosionArr[n].render();
                    explosionArr[n].y += 2;
                    ctx.drawImage(fire1Image, 0, 0, 54, 18, explosionArr[n].x, explosionArr[n].y-15, explosionArr[n].width+100, explosionArr[n].height+15)
                if(detectHit(explosionArr[n], piggy) === true && piggy.iKillFrames == false) {
                    piggy.health -= explosionArr[n].attackPoints;
                }
            }
        }

        // Repeatedly sets Miss Piggy's instant kill frames to false to prevent instant death after an explosion passes
        piggy.iKillFrames = false;
        
        // Losing conditions
        if(piggy.health <= -1) {
            loser.style.display = 'grid';
            gameState = false;
        }

        // Win conditions
        if(wolf.health == 0) {
            winner.style.display = 'grid';
            gameState = false;
        }
    }
    
}

// Calls function to begin platform and attack intervals
spawnEnemies()

canvas.addEventListener('click', (e) => {
    console.log(e.offsetX, e.offsetY)
})

// Activates a play again button to reinitialize settings upon clicking
playAgain.addEventListener('click', () => {
    if(gameState == false) {
        init()
        gameState = true;
        gameLoop()
        loser.style.display = 'none'
        winner.style.display = 'none'
        beginning.style.display = 'none'
        readMe.style.display = 'none'
        disclaimer.style.display = 'none'
    }
})

// Activates instructions manual upon clicking the Instructions button
instructions.addEventListener('click', () => {
    if(gameState == false) {
        readMe.style.display = 'grid'
    }
})
