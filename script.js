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

canvas.addEventListener('click', e => {
    console.log(e.offsetX, e.offsetY);
    drawBox(e.offsetX, e.offsetY, 30, 30, 'blue');
})