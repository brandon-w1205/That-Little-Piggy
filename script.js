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
class Character {
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

let piggy = new Character(100, 100, 100, 100, "blue");











// elements on page render when clicking into the screen to play, will add a button to prompt player later
canvas.addEventListener('click', e => {
    piggy.render()
})







