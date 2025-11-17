// 2D Arrays Assignment
// Character Fighter Game
// Jawad Imran
// 12/11/25

// GOAL: use code from previous assignments to create platforms using 2D arrays.
// The player can move, jump, attack, block, and roll. The enemy chases the player and attacks when close enough.
// The game ends when either the player or the enemy runs out of health.
// Controls: A and D to move left and right, W to jump, S to block, click to attack, space to roll

// For my extra for experts, I added an animation log that outputs the names and frame counts of all loaded animations to the console when the game starts. I used the
// Objects.keys() method to iterate through the animation frame arrays stored in objects for both the player and the boss
// also utilizing the forEach() method to loop through each animation name and log the frame count.

// In terms of the basic requirements, for the assignment, I have used 2D arrays to create platforms in the world.

//Global Variables
let platforms = [];
let platformW = 200;
let platformH = 20;
let platformImg;

let cellSize = 40;
let showGrid = false;

// 2D Array for grid alignment
let worldGrid = [];
const GRID_COLS = 20;
const GRID_ROWS = 15;

// Arrays to hold animation frames
playerFrames = {
  idleFrames : [],
  rollFrames : [],
  attackFrames : [],
  attackbackFrames : [],
  blockFrames : [],
  runFrames : [],
  runbackFrames : [],
  jumpUpFrames : [],
  jumpDownFrames : []
};

bossFrames = {
  idleFrames : [],
  attack1Frames : [],
  runFrames : [],
  runbackFrames : []
};

// Total frames for each animation
let totalRunFrames = 8;
let totalRunBackFrames = 8;
let totalIdleFrames = 8;
let totalRollFrames = 6;
let totalAttackFrames = 18;
let totalBlockFrames = 6;
let totalJumpFrames = 3;

// Animation control variables
let frameIndex = {
  player: 0,
  boss: 0
};
let delayCounter = 0;
let frameDelay = 7;
let bg;

// Base animation state
let currentAnim ={
  player: "idle",
  boss: "idle",  
};

// Object Positions
charPos = {
  dx: 0,
  dy: 0,
};
bossPos = {
  dx: 0,
  dy: 0
};
let initialY;

// Jumping variables
let isJumping = false;
let yVelocity = 0;
let gravity = 1;

// Game state variable
let game = "start";

let timer = 0;
let timerPassed = 0;

let playerHealth = 100;
let bossHealth = 100;
let maxHealth = 100; 
let bossAttackCooldown = 800; 
let lastBossAttack = 0;

let bgMusic;

// Function to change animation state
function setAnimation(character, animName) {
  if (currentAnim[character] !== animName) {
    currentAnim[character] = animName;
    frameIndex[character] = 0;
  }
}

// Preload function to load images into the empty arrays, and load music
function preload() {
  bgMusic = loadSound("assets/music/desertmusic.mp3");

  for (let i = 1; i <= totalIdleFrames; i++) {
    playerFrames.idleFrames.push(loadImage(`assets/playerAnims/idle_${i}.png`));
  }

  for (let i = 1; i <= totalRollFrames; i++) {
    playerFrames.rollFrames.push(loadImage(`assets/playerAnims/roll_${i}.png`));
  }

  for (let i = 1; i <= totalAttackFrames; i++) {
    playerFrames.attackFrames.push(loadImage(`assets/playerAnims/2_atk_${i}.png`));
  }

  for (let i = 1; i <= totalAttackFrames; i++) {
    playerFrames.attackbackFrames.push(loadImage(`assets/playerAnims/2_atkback_${i}.png`));
  }

  for (let i = 1; i <= totalBlockFrames; i++) {
    playerFrames.blockFrames.push(loadImage(`assets/playerAnims/defend_${i}.png`));
  }

  for (let i = 1; i <= totalRunFrames; i++) {
    playerFrames.runFrames.push(loadImage(`assets/playerAnims/run_${i}.png`));
  }

  for (let i = 1; i <= totalRunBackFrames; i++) {
    playerFrames.runbackFrames.push(loadImage(`assets/playerAnims/run_back_ ${i}.png`));
  }

  for (let i = 1; i <= totalJumpFrames; i++) {
    playerFrames.jumpUpFrames.push(loadImage(`assets/playerAnims/j_up_${i}.png`));
  }

  for (let i = 1; i <= totalJumpFrames; i++) {
    playerFrames.jumpDownFrames.push(loadImage(`assets/playerAnims/j_down_${i}.png`));
  }
  
  for (let i = 1; i <= totalIdleFrames; i++) {
    bossFrames.idleFrames.push(loadImage(`assets/bossAnims/boss_idle_${i}.png`));
  }

  for (let i = 1; i <= totalIdleFrames; i++) {
    bossFrames.runFrames.push(loadImage(`assets/bossAnims/run_${i}.png`));
  }
  
  for (let i = 1; i <= totalIdleFrames; i++) {
    bossFrames.attack1Frames.push(loadImage(`assets/bossAnims/boss_atk1_${i}.png`));
  }
  
  for (let i = 1; i <= totalIdleFrames; i++) {
    bossFrames.runbackFrames.push(loadImage(`assets/bossAnims/run_back_${i}.png`));
  }

  bg = loadImage("assets/Desert_bg.jpg");
  platformImg = loadImage("assets/platform.png");
}

function setup() {
  createCanvas(1200, 700);
  initialY = height / 2 - 110;
  
  // Set positions aligned to grid
  charPos.dx = 3 * cellSize; // Grid position (3,0)
  charPos.dy = initialY;
  
  bossPos.dx = 15 * cellSize; // Grid position (15,0)
  bossPos.dy = initialY + 30;
  
  generatePlats();
}

function draw() {
  // Start Screen
  if (game === "start") {
    if (!bgMusic.isPlaying()) {
      bgMusic.loop();
      bgMusic.setVolume(0.5);
    } 
    timer = millis();
    background("black");
    textSize(36);
    textAlign(CENTER, CENTER);
    fill("red");
    textLeading(100); 

    textAlign(CENTER, CENTER);
    fill("red");

    textSize(48);
    text("A Terrible Simulator For An Assassin", width / 2, height / 2 - 80);
    textSize(20);
    text("Press Any Key To Start", width / 2, height / 2 - 10);
    
    fill("white");
    textSize(30);
    text("W to Jump, A to Move Left, D to Move Right", width / 2, height / 2 + 80); 
    text("Click to Attack, S to Block, Space to Roll", width / 2, height / 2 + 120);
  }
  // Main Game
  else{
    if (playerHealth <= 0 || bossHealth <= 0) {
      game = "gameOver";
    }
    if (game === "gameOver") {
      background("black");
      fill("red");
      textSize(48);
      textAlign(CENTER, CENTER);

      if (playerHealth <= 0) {
        text("GAME OVER", width / 2, height / 2 - 40);
        text("You Died!", width / 2, height / 2 + 20);
      } 
      else if (bossHealth <= 0) {
        text("YOU WIN", width / 2, height / 2 - 40);
        text("The Wizard Has Been Slain", width / 2, height / 2 + 20);
      }

      textSize(24);
      fill("white");
      text("Press R to Restart", width / 2, height / 2 + 100);
      return; 
    }

    // Background and Platforms
    image(bg, 0, 0, width, height);
    drawPlats();
    
    timerPassed = int((millis()-timer) / 1000);
    fill("black");
    textSize(20);
    text("Time Wasted On these Plains: " + timerPassed , 200, 30);

    // Player Health Bar
    fill("green");
    rect(50, 50, (playerHealth / maxHealth) * 200, 20);
    stroke(0);
    noFill();
    rect(50, 50, 200, 20);

    // Boss Health Bar
    fill("green");
    rect(950, 50, (bossHealth / maxHealth) * 200, 20);
    stroke(0);
    noFill();
    rect(950, 50, 200, 20);

    movement();
    updateBossAttack();

    // Determine which frames to play depending on the current animation
    let Frames = {
      player: "idle",
      boss: "idle"
    };

    // Frames for boss animations
    if (currentAnim.boss === "idle") {
      Frames.boss = bossFrames.idleFrames;
    }
    else if (currentAnim.boss === "attack") {
      Frames.boss = bossFrames.attack1Frames;
    }
    else if (currentAnim.boss === "run") {
      Frames.boss = bossFrames.runFrames;
    }
    else if (currentAnim.boss === "runback") {
      Frames.boss = bossFrames.runbackFrames;
    }

    // Frames for player animations
    if (currentAnim.player === "idle") {
      Frames.player = playerFrames.idleFrames;
    } 
    else if (currentAnim.player === "roll") {
      Frames.player = playerFrames.rollFrames;
    } 
    else if (currentAnim.player === "attack") {
      Frames.player = playerFrames.attackFrames;
    } 
    else if (currentAnim.player === "attackback") {
      Frames.player = playerFrames.attackbackFrames;
    }
    else if (currentAnim.player === "block") {
      Frames.player = playerFrames.blockFrames;
    } 
    else if (currentAnim.player === "run") {
      Frames.player = playerFrames.runFrames;
    } 
    else if (currentAnim.player === "runback") {
      Frames.player = playerFrames.runbackFrames;
    } 
    else if (currentAnim.player === "jumpUp") {
      Frames.player = playerFrames.jumpUpFrames;
    } 
    else if (currentAnim.player === "jumpDown") {
      Frames.player = playerFrames.jumpDownFrames;
    }

    // Draws the current frame
    if (Frames.player.length > 0) {
      image(Frames.player[frameIndex.player], charPos.dx, charPos.dy, 200, 300);
    }
    if (Frames.boss.length > 0) {
      image(Frames.boss[frameIndex.boss], bossPos.dx, bossPos.dy, 500 , 400);
    }

    // Update the frame index based on animation delay
    delayCounter++;
    if (delayCounter >= frameDelay) {
      frameIndex.player = (frameIndex.player + 1) % Frames.player.length;
      frameIndex.boss = (frameIndex.boss + 1) % Frames.boss.length;
      delayCounter = 0;
    }

    // Reset to idle after animations that dont loop finish
    if (frameIndex.player === Frames.player.length-1 && currentAnim.player !== "idle" && currentAnim.player !== "run" && currentAnim.player !== "runback") {
      currentAnim.player = "idle";
      frameIndex.player = 0;
    }
    if (frameIndex.boss === Frames.boss.length-1 && currentAnim.boss !== "idle" && currentAnim.boss !== "run" && currentAnim.boss !== "runback") {
      currentAnim.boss = "idle";
      frameIndex.boss = 0;
    }
  }
  
  if (showGrid) {
    drawGrid();
  }
}

// Logs loaded animations and their frame counts
function animLog() {
  console.log("------Animations loaded------");

  console.log("Player Frames: ");
  Object.keys(playerFrames).forEach((animName) => {
    if (Array.isArray(playerFrames[animName])) {
      let frameCount = playerFrames[animName].length;
      console.log(animName + ": " + frameCount + " frames");
    }
    else {
      console.log(animName + ": Not an array");
    }
  });

  console.log("Boss Frames: ");
  Object.keys(bossFrames).forEach((animName) => {
    if (Array.isArray(bossFrames[animName])) {
      let frameCount = bossFrames[animName].length;
      console.log(animName + ": " + frameCount + " frames");
    }
    else {
      console.log(animName + ": Not an array");
    }
  });
}
// Platform Generation
function generatePlats() {
  platforms = [];
  worldGrid = [];
  
  // Initialize 2D array
  for (let y = 0; y < GRID_ROWS; y++) {
    worldGrid[y] = [];
    for (let x = 0; x < GRID_COLS; x++) {
      worldGrid[y][x] = 0; // 0 = empty, 1 = platform
    }
  }

  // Create platforms at specific grid positions
  let platformPositions = [
    {x: 14, y: 10}, {x: 5, y: 5}, {x: 19, y: 7}
  ];

  for (let pos of platformPositions) {
    if (pos.x < GRID_COLS && pos.y < GRID_ROWS) {
      worldGrid[pos.y][pos.x] = 1;
      platforms.push({
        x: pos.x * cellSize,
        y: pos.y * cellSize,
        width: platformW,
        height: platformH,
        gridX: pos.x,
        gridY: pos.y
      });
    }
  }
}

// Draws a grid outline
function drawGrid() {
  noFill();
  stroke("blue");
  strokeWeight(1);

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      rect(x, y, cellSize, cellSize);
    }
  }
}

// Draws platform asset based on 2D array
function drawPlats() {
  for (let plat of platforms) {
    image(platformImg, plat.x, plat.y, plat.width, plat.height);
  }
}

// Check for platform collisions
function checkPlatCollision() {
  let playerBottom = charPos.dy + 300;
  let playerLeft = charPos.dx + 100;
  let playerRight = charPos.dx + 100;

  let onPlatform = false;

  for (let plat of platforms) {
    // Check if player is currently standing on this platform
    if (playerBottom === plat.y && 
        playerRight > plat.x && 
        playerLeft < plat.x + plat.width) {
      onPlatform = true;
      break;
    }
    
    // Check if player is landing on this platform from above
    if (playerBottom <= plat.y && 
        playerBottom + yVelocity >= plat.y &&
        playerRight > plat.x && 
        playerLeft < plat.x + plat.width) {

      charPos.dy = plat.y - 300;
      isJumping = false;
      yVelocity = 0;
      currentAnim.player = "idle";
      onPlatform = true;
      break;
    }
  }

  return onPlatform;
}

function keyTyped() {
  // Change animation based on key pressed
  if (key === " ") {
    setAnimation("player", "roll");
  } 
  else if (key === "s") {
    setAnimation("player", "block");
  } 
  else if (key === "w" && !isJumping) {
    isJumping = true;
    yVelocity = -20; 
  }
  else if (key === 'g' || key === 'G') {
    showGrid = !showGrid;
  }
  if (game === "start") {
    game = "play";

    animLog();
    if (bgMusic && !bgMusic.isPlaying()) {
      bgMusic.loop();
      bgMusic.setVolume(0.5);
    }
  }
}

// R key to restart after game ends
function keyPressed() {
  if (game === "gameOver" && (key === 'r' || key === 'R')) {
    game = "start";
    playerHealth = 100;
    bossHealth = 100;
    charPos.dx = 3 * cellSize;
    charPos.dy = initialY;
    bossPos.dx = 15 * cellSize;
    bossPos.dy = initialY + 30;
    currentAnim.player = "idle";
    currentAnim.boss = "idle";
    frameIndex.player = 0;
    frameIndex.boss = 0;
    lastBossAttack = 0;
  }
}

// Right click to attack
function mouseClicked() {
  // Determine attack direction
  if (mouseX < charPos.dx + 100) { 
    setAnimation("player", "attackback");
  } else {
    setAnimation("player", "attack");
  }

  // Apply damage if boss within 20px
  let distanceX = Math.abs(charPos.dx - bossPos.dx);
  if (distanceX <= 20) {
    bossHealth -= 10;
    if (bossHealth < 0){ 
      bossHealth = 0;
    }
  }
}

// Moevement functions 
function movement() {
  const moveSpeed = 5;
  
  
  if (keyIsDown(68)) {
    setAnimation("player", "run");
    
    if (charPos.dx < width - 250) {
      charPos.dx += moveSpeed;
    }
  }

  else if (keyIsDown(65)) {
    setAnimation("player", "runback");
    
    if (charPos.dx > 0) {
      charPos.dx -= moveSpeed;
    }
  }
  else {
    if (currentAnim.player === "run" || currentAnim.player === "runback") {
      currentAnim.player = "idle";
    }
  }

  // Jumping Mechanic
  if (isJumping) {
    charPos.dy += yVelocity;
    yVelocity += gravity;

    let landed = checkPlatCollision();
    if (!landed && charPos.dy >= initialY) {
      charPos.dy = initialY;
      isJumping = false;
      currentAnim.player = "idle";
      landed = true;
    }

    if (!landed) {
      if (yVelocity < 0) {
        currentAnim.player = "jumpUp";
        frameIndex.player = 0;
      } else {
        currentAnim.player = "jumpDown";
        frameIndex.player = 0;
      }
    }
  } 
  else {
    let onPlatform = checkPlatCollision();
    if (!onPlatform && charPos.dy < initialY) {
      isJumping = true;
      yVelocity = 0;
    }
  }

  // Boss AI
  const attackRangeX = 20;
  const attackRangeY = 75;
  
  let distanceX = charPos.dx - bossPos.dx;
  let absoluteDistanceY = Math.abs(charPos.dy - bossPos.dy);
  let absoluteDistanceX = Math.abs(distanceX);

  if (absoluteDistanceX <= attackRangeX && absoluteDistanceY <= attackRangeY) {
    if (currentAnim.boss !== "idle" && currentAnim.boss !== "attack") {
      setAnimation("boss", "idle");
    }
  }
  else if (distanceX > 0) {
    bossPos.dx += 2;
    setAnimation("boss", "run");
  } 
    
  else if (distanceX < 0) {
    bossPos.dx -= 2;
    setAnimation("boss", "runback");
  }

  else {
    if (currentAnim.boss !== "idle") {
      setAnimation("boss", "idle");
    }
  }
}

function updateBossAttack() {
  let distanceX = Math.abs(charPos.dx - bossPos.dx);
  let distanceY = Math.abs(charPos.dy - bossPos.dy);

  if (distanceX <= 20 && distanceY <= 100 && millis() - lastBossAttack > bossAttackCooldown) {
    playerHealth -= 10;
    if (playerHealth < 0){
      playerHealth = 0;
    }
    setAnimation("boss", "attack"); 
    lastBossAttack = millis();
  }
}