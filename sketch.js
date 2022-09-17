// STACK

let blockHeight = 10;
let blockSpeed = 2;

const stack = {
  blocks: [],

  // Draw each block in the stack
  drawStack() {
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].drawBlock();
    }
  },

  // Create a new block
  addBlock() {
    // Move each block down
    moveStack(stack, blockHeight);

    // Set width of previous block and determine properties of new block
    let w;
    let x;
    let curr;
    let prev;

    if (this.blocks.length > 1) {
      curr = this.blocks[this.blocks.length - 1];
      prev = this.blocks[this.blocks.length - 2];

      // Check for overlap on the left
      if (curr.x < prev.x) {
        curr.width -= (prev.x - curr.x);
        curr.x = prev.x;
      }
      // Check for overlap on the right
      else if (curr.x > prev.x) {
        curr.width = (prev.x + prev.width) - (curr.x);
      }
      w = curr.width;
      x = 2;
    } else {
      w = 150;
      x = width / 2 - w / 2;
    }
    // End the game if there is no overlap or add a point
    if (w <= 0) {
      curr.width = 0;
      gameActive = false;
    } else {
      score++;

      // Determine color of the block
      if (this.blocks.length > 0) {
        setColor()
      }

      // Create a new block
      let block = new Block(x, w, [blockColor[0], blockColor[1], blockColor[2]]);
      this.blocks.push(block);
    }
  }
}

// Function to move stack up or down
function moveStack(stack, height) {
  for (let i = 0; i < stack.blocks.length; i++) {
    stack.blocks[i].y += height;
  }
}

// Function to change color of blocks
let colorChange = 85;
let colorIndex = 1;
let blockColor = [255, 0, 0];

function setColor() {
  blockColor[colorIndex] += colorChange;
  // Move down an index if the color value reaches the max or the min
  if (blockColor[colorIndex] == 255 || blockColor[colorIndex] == 0) {
    colorIndex -= 1;
    if (colorIndex < 0) {
      colorIndex = 2;
    }
    // Alternate between increasing and decreasing the color value
    colorChange *= -1;
  }
}


// BLOCKS

class Block {
  constructor(x, w, c) {
    this.x = x;
    this.y = height / 2;
    this.color = c;
    this.speed = blockSpeed;
    this.width = w;
    this.height = blockHeight;
  }

  drawBlock() {
    noStroke();
    fill(this.color);
    rect(this.x, this.y, this.width, this.height)
  }

  moveBlock() {
    // Change directions if the block reaches the edge
    if (this.x + this.width >= width) {
      this.speed *= -1;
    }
    else if (this.x <= 0) {
      this.speed *= -1;
    }

    this.x += this.speed;
  }
}

// Place the block when spacebar is pressed
function keyPressed() {
  if (keyCode == 32) {
    if (gameActive) {
      stack.addBlock();
    }
  }
}


// SCORE AND GAMESTATE

let score = -2;
let highscore = 0;

function setHighScore() {
  if (score > highscore) {
    highscore = score;
  }
}

function showScore() {
  // Score
  fill(255);
  textAlign(LEFT);
  textSize(25);
  text(score, 10, 25);

  // Highscore
  textAlign(RIGHT);
  text("HI " + highscore, 390, 25);
}

let gameActive = true;
let gameStarted = false;

// Starting the game
function startScreen() {
  fill(255);
  textAlign(CENTER);
  textSize(25);
  text('Press Enter to Start', width / 2, height / 3);
}

function start() {
  if (keyIsDown(ENTER)) {
    gameStarted = true;
  }
}

// Ending the game
function endScreen() {
  fill(255);
  textAlign(CENTER);
  textSize(25);
  text('Game Over', width / 2, height / 3);

  textSize(15);
  text('Press Arrows to View Stack', width / 2, height / 3 + 25);
  text('Press Enter to Restart', width / 2, height / 3 + 40);
}

function viewStack() {
  if (keyIsDown(DOWN_ARROW)) {
    moveStack(stack, -blockHeight / 2);
  }
  else if (keyIsDown(UP_ARROW)) {
    moveStack(stack, blockHeight / 2);
  }
}

function test() {
  if (keyIsDown(LEFT_ARROW)) {
    console.log(blockHeight);
  }
}

// Restarting the game
function restartGame() {
  // Empty the stack and add new starting blocks
  stack.blocks = [];
  stack.addBlock();
  stack.addBlock();

  // Reset the score
  score = 0;
}

function restart() {
  if (keyIsDown(ENTER)) {
    gameActive = true;
    restartGame();
  }
}


// SETUP AND RUN PROGRAM

let backgroundColor = 20;

function setup() {
  createCanvas(400, 400);

  // Add the starting blocks
  stack.addBlock();
  stack.addBlock();
}

function draw() {
  background(backgroundColor);

  // Starting the game
  if (!gameStarted) {
    startScreen();
    start();
  }

  // Restarting the game
  if (!gameActive) {
    restart();
  }

  // Show the score
  setHighScore();
  showScore();

  // Draw the blocks
  if (gameActive && gameStarted) {
    stack.blocks[stack.blocks.length - 1].moveBlock();
  }
  stack.drawStack();

  // End screen
  if (!gameActive) {
    endScreen();
    viewStack();
  }
}