let canvas = document.querySelector('#canvas-game')

let ctx = canvas.getContext('2d')

const gridSize = 20

const canvasWidth = canvas.width
const canvasHeight = canvas.height

const cols = canvasWidth / gridSize
const rows = canvasHeight / gridSize

let snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }]

let direction = { x: 0, y: 0 }

let food = null
let speed = 200
let gameInterval = null

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
    }

    for (cell of snake) {
        if (cell.x === food.x && cell.y === food.y) {
            spawnFood()
            break
        }
    }
}

function gameOver() {
    clearInterval(gameInterval)
    alert('game over!')
    document.location.reload()
}

function update() {
    if (direction.x === 0 && direction.y === 0) return

    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
    }

    if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
        gameOver()
        return
    }

    for (i = 1; i < snake.length; i++) {
        if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
            gameOver()
            return
        }
    }

    snake.unshift(newHead)

    if (food && food.x === newHead.x && food.y === newHead.y) {
        spawnFood()
        if (speed > 50) {
            speed -= 5
            clearInterval(gameInterval)
            gameInterval = setInterval(gameLoop, speed)
        }
    } else {
        snake.pop()
    }
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    for (cell of snake) {
        ctx.fillStyle = '#0f0'
        ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize - 1, gridSize - 1)
    }

    if (food) {
        ctx.fillStyle = '#f00'
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1)
    }
}

function gameLoop() {
    update()
    draw()
}

document.addEventListener('keydown', e => {
    switch (e.code) {
        case "ArrowUp":
            if (direction.y === 1) break
            direction = { x: 0, y: -1 }
            break;
        case "ArrowDown":
            if (direction.y === -1) break
            direction = { x: 0, y: 1 }
            break;
        case "ArrowLeft":
            if (direction.x === 1) break
            direction = { x: -1, y: 0 }
            break;
        case "ArrowRight":
            if (direction.x === -1) break
            direction = { x: 1, y: 0 }
            break;
    }
})

spawnFood()
gameInterval = setInterval(gameLoop, speed)