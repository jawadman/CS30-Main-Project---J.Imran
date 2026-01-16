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

// Global Variables
let platforms = [];
let platformW; 
let platformH; 
let platformImg;

let cellSize;
let showGrid = false;

// Grid variables
let worldGrid = [];
const GRID_COLS = 20;
const GRID_ROWS = 15;

let endBG = false;
let mapCount = 0;

let bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12;

// Animation frame arrays
enemy1Frames = {
  idleFrames : [],
  walkFrames : [],
  attackFrames : [],
};
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

let playerSizeX;
let playerSizeY;

bossFrames = {
  idleFrames : [],
  attack1Frames : [],
  runFrames : [],
  runbackFrames : []
};

let bossSizeX;
let bossSizeY;

// Total frames for each animation
let totalRunFrames = 8;
let totalRunBackFrames = 8;
let totalIdleFrames = 8;
let totalRollFrames = 6;
let totalAttackFrames = 18;
let totalBlockFrames = 6;
let totalJumpFrames = 3;

let totalEnemy1RunFrames = 10;
let totalEnemy1AttackFrames = 20;

// Animation control variables
let frameIndex = {
  player: 0,
  boss: 0,
  enemy1: 0
};
let delayCounter = 0;
let frameDelay = 7;
let bg;

// Base animation state
let currentAnim ={
  player: "idle",
  boss: "idle",
  enemy1: "idle",  
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

// Enemy array
let enemies = []; 
// Chunk generation variables
let nextSpawnX = 0;

// Boss Arena control
let chunksGenerated = 0;
const MAX_CHUNKS = 10; 
let bossArenaStartX = 0; 
let arenaLocked = false; 

let initialY;

let bx = 0;
let by = 0;

// Jumping variables
let isJumping = false;
let yVelocity = 0;
let gravity;   
let jumpForce; 
let moveSpeed; 

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

// Preload assets and music
function preload() {
  bgMusic = loadSound("assets/music/desertmusic.mp3");

  bg1 = loadImage("assets/Free Pixel Art Forest/PNG/Background layers/Layer_1.png");
  bg2 = loadImage("assets/Free Pixel Art Forest/PNG/Background layers/Layer_2.png");
  bg3 = loadImage("assets/Free Pixel Art Forest/PNG/Background layers/Layer_3.png");
  bg4 = loadImage("assets/Free Pixel Art Forest/PNG/Background layers/Layer_4.png");
  bg5 = loadImage("assets/Free Pixel Art Forest/PNG/Background layers/Layer_5.png");
  bg6 = loadImage("assets/Free Pixel Art Forest/PNG/Background layers/Layer_6.png");
  bg7 = loadImage("assets/Free Pixel Art Forest/PNG/Background layers/Layer_7.png");
  bg8 = loadImage("assets/Free Pixel Art Forest/PNG/Background layers/Layer_8.png");
  bg9 = loadImage("assets/Free Pixel Art Forest/PNG/Background layers/Layer_9.png");
  bg10 = loadImage("assets/Free Pixel Art Forest/PNG/Background layers/Layer_10.png");
  bg11 = loadImage("assets/Free Pixel Art Forest/PNG/Background layers/Layer_11.png");
  bg12 = loadImage("assets/Free Pixel Art Forest/PNG/Background layers/Layer_12.png");
  platformImg = loadImage("assets/platform.png");

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

  for (let i = 1; i <= totalIdleFrames; i++) {
    enemy1Frames.idleFrames.push(loadImage(`assets/Enemy1Anims/Enemy1Idle/Enemy_1_Idle_ (${i}).png`));
  }
  for (let i = 1; i <= totalEnemy1AttackFrames; i++) {
    enemy1Frames.attackFrames.push(loadImage(`assets/Enemy1Anims/Enemy1Attack/Enemy_1_Attack_ (${i}).png`));
  }
  for (let i = 1; i <= totalEnemy1RunFrames; i++) {
    enemy1Frames.walkFrames.push(loadImage(`assets/Enemy1Anims/Enemy1Move/Enemy_1_Move_ (${i}).png`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  cellSize = height / GRID_ROWS;
  
  platformW = cellSize * 2;
  platformH = cellSize * 0.2;
  
  playerSizeX = cellSize * 2.5; 
  playerSizeY = cellSize * 3.5; 
  
  bossSizeX = cellSize * 5.5; 
  bossSizeY = cellSize * 4.5;

  initialY = height * 0.94; 

  gravity = cellSize * 0.02;
  jumpForce = -(cellSize * 0.4); 
  moveSpeed = cellSize * 0.08; 
  
  charPos.dx = 3 * cellSize; 
  charPos.dy = initialY - playerSizeY; 
  
  // Hide Boss Initially
  bossPos.dx = -99999; 
  bossPos.dy = (initialY - bossSizeY) + 60; 

  platforms = []; 
  enemies = [];   
  chunksGenerated = 0;
  arenaLocked = false;
  
  // Start generating off-screen
  nextSpawnX = width;
  generateNewChunk();
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
    // Game Over Logic
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

    // Background Scrolling
    let bgX = bx % width;
    let backgrounds = [bg12, bg11, bg10, bg9, bg8, bg7, bg6, bg5, bg4, bg3, bg2, bg1];
    
    for (let img of backgrounds) {
      image(img, bgX - width, by, width, height); 
      image(img, bgX, by, width, height);         
      image(img, bgX + width, by, width, height); 
    }
    
    drawPlats();
    
    timerPassed = int((millis()-timer) / 1000);
    fill("black");
    textSize(20);
    text("Time Wasted On these Plains: " + timerPassed , 200, 30);

    // Health Bars
    fill("green");
    rect(50, 50, playerHealth / maxHealth * 200, 20);
    stroke(0);
    noFill();
    rect(50, 50, 200, 20);

    if (chunksGenerated >= MAX_CHUNKS) {
      fill("red");
      textSize(20);
      text("BOSS", width - 150, 40);
      rect(width - 250, 50, bossHealth / maxHealth * 200, 20);
      stroke(0);
      noFill();
      rect(width - 250, 50, 200, 20);
    }

    movement();
    updateBossAttack();

    // Select animation frames
    let Frames = {
      player: "idle",
      boss: "idle",
      enemy1: "idle"
    };

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

    // Draw characters
    if (Frames.player.length > 0) {
      image(Frames.player[frameIndex.player], charPos.dx, charPos.dy, playerSizeX, playerSizeY);
    }
    
    if (chunksGenerated >= MAX_CHUNKS) {
      if (Frames.boss.length > 0) {
        image(Frames.boss[frameIndex.boss], bossPos.dx + bx, bossPos.dy, bossSizeX , bossSizeY);
      }
    }
    
    // Enemy Update Loop
    let playerCenterX = charPos.dx + (playerSizeX / 2);
    let playerCenterY = charPos.dy + (playerSizeY / 2);
    
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];

      if (e.health <= 0) {
        enemies.splice(i, 1);
        continue; 
      }

      let screenX = e.dx + bx; 

      let enemyWidth = bossSizeX - 130;
      let enemyHeight = bossSizeY - 130;
      let enemyCenterX = screenX + (enemyWidth / 2);
      let enemyCenterY = e.dy + (enemyHeight / 2);

      let distX = Math.abs(playerCenterX - enemyCenterX);
      let distY = Math.abs(playerCenterY - enemyCenterY);

      if (distX < 120 && distY < 150) {
        e.state = "attack";
        if (playerCenterX < enemyCenterX) {
          e.direction = -1; 
        } else {
          e.direction = 1;  
        }
        if (millis() - e.lastAttackTime > e.attackCooldown) {
          if (currentAnim.player !== "block") {
            playerHealth -= 5;
          }
          e.lastAttackTime = millis();
        }
      } 
      else {
        e.state = "walk";
        e.dx += e.speed * e.direction;
        if (e.dx > e.rightBoundary || e.dx < e.leftBoundary) {
          e.direction *= -1;
        }
      }

      if (screenX > -200 && screenX < width + 200) {
        fill("green");
        rect(screenX + 20, e.dy + 30, (e.health / e.maxHealth) * 50, 5);
        noFill();
        stroke(0);
        rect(screenX + 20, e.dy + 30, 50, 5);

        let currentEnemyFrames;
        if (e.state === "attack") {
          currentEnemyFrames = enemy1Frames.attackFrames;
        } else {
          currentEnemyFrames = enemy1Frames.walkFrames;
        }

        if (currentEnemyFrames.length > 0) {
          push();
          if (e.direction === -1) {
            translate(screenX + enemyWidth, e.dy); 
            scale(-1, 1);
            image(currentEnemyFrames[frameIndex.enemy1 % currentEnemyFrames.length], 0, 0, enemyWidth, enemyHeight);
          } 
          else {
            image(currentEnemyFrames[frameIndex.enemy1 % currentEnemyFrames.length], screenX, e.dy, enemyWidth, enemyHeight);
          }
          pop();
        }
      }
    }

    // Animation frame update
    delayCounter++;
    if (delayCounter >= frameDelay) {
      frameIndex.player = (frameIndex.player + 1) % Frames.player.length;
      frameIndex.boss = (frameIndex.boss + 1) % Frames.boss.length;
      frameIndex.enemy1 = (frameIndex.enemy1 + 1) % 1000; 
      delayCounter = 0;
    }

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

// Log loaded animations
function animLog() {
  Object.keys(playerFrames).forEach((animName) => {
    if (Array.isArray(playerFrames[animName])) {
      let frameCount = playerFrames[animName].length;
    }
  });

  Object.keys(bossFrames).forEach((animName) => {
    if (Array.isArray(bossFrames[animName])) {
      let frameCount = bossFrames[animName].length;
    }
  });
}

// Generate world chunks
function generateNewChunk() {
  
  if (chunksGenerated >= MAX_CHUNKS) {
      return; 
  }

  while (nextSpawnX < Math.abs(bx) + width + 500) {
    
    chunksGenerated++;
    
    // Boss arena generation
    if (chunksGenerated === MAX_CHUNKS) {
      let arenaWidth = width * 4; 
      
      bossArenaStartX = nextSpawnX;
      bossPos.dx = nextSpawnX + (arenaWidth / 2);
      nextSpawnX += arenaWidth + 2000; 
      return;
    }
    
    // Normal chunk generation
    let isGround = random() < 0.4; 
    let platWidthCols = floor(random(2, 6)); 
    let currentPlatW = platWidthCols * cellSize;
    
    if (!isGround) {
      let gridY = floor(random(9, 13)); 
      let platY = gridY * cellSize;

      platforms.push({
        x: nextSpawnX,
        y: platY,
        width: currentPlatW,
        height: platformH,
      });
      
      if (random() < 0.4) {
        spawnEnemy(nextSpawnX, platY, currentPlatW, true);
      }
    } 
    else {
      if (random() < 0.4) {
        spawnEnemy(nextSpawnX, initialY, currentPlatW, false);
      }
    }

    let gap = floor(random(1, 4)) * cellSize; 
    nextSpawnX += currentPlatW + gap;
  }
}

// Spawn enemies
function spawnEnemy(x, y, w, isFloating) {
  enemies.push({
    dx: x + (w / 2) - 50, 
    dy: y - 70, 
    direction: 1,
    speed: 2,
    leftBoundary: x,
    rightBoundary: x + w - 50,
    type: "enemy1",
    health: 100,
    maxHealth: 100,
    state: "walk", 
    lastAttackTime: 0,
    attackCooldown: 1000 
});
}

// Draw visible platforms
function drawPlats() {
  for (let plat of platforms) {
    let platScreenX = plat.x + bx;
    
    if (platScreenX + plat.width > 0 && platScreenX < width) {
      image(platformImg, platScreenX, plat.y, plat.width, plat.height);
    }
  }
}

// Platform collision logic
function checkPlatCollision() {
  let playerBottom = charPos.dy + playerSizeY;
  let playerLeft = charPos.dx + 50; 
  let playerRight = charPos.dx + 120; 

  let onPlatform = false;

  for (let plat of platforms) {
    let platScreenX = plat.x + bx;

    if (playerBottom === plat.y && 
        playerRight > platScreenX && 
        playerLeft < platScreenX + plat.width) {
      onPlatform = true;
      break;
    }
    
    if (playerBottom <= plat.y && 
        playerBottom + yVelocity >= plat.y &&
        playerRight > platScreenX && 
        playerLeft < platScreenX + plat.width) {

      charPos.dy = plat.y - playerSizeY;
      isJumping = false;
      yVelocity = 0;
      currentAnim.player = "idle";
      onPlatform = true;
      break;
    }
  }

  return onPlatform;
}

// Attack logic
function mouseClicked() {
  if (mouseX < charPos.dx + 100) { 
    setAnimation("player", "attackback");
  } 
  else {
    setAnimation("player", "attack");
  }

  // Damage Boss
  let bossScreenX = bossPos.dx + bx;
  let distanceX = Math.abs(charPos.dx - bossScreenX);
  
  if (distanceX <= 150) { 
    bossHealth -= 10;
    if (bossHealth < 0){ 
      bossHealth = 0;
    }
  }

  // Damage Enemies
  let playerCenterX = charPos.dx + (playerSizeX / 2);
  let playerCenterY = charPos.dy + (playerSizeY / 2);

  for (let e of enemies) {
    let enemyScreenX = e.dx + bx;
    let enemyWidth = bossSizeX - 130;
    let enemyHeight = bossSizeY - 130;
    let enemyCenterX = enemyScreenX + (enemyWidth / 2);
    let enemyCenterY = e.dy + (enemyHeight / 2);

    let distX = Math.abs(playerCenterX - enemyCenterX);
    let distY = Math.abs(playerCenterY - enemyCenterY); 

    if (distX <= 120 && distY <= 150) { 
      e.health -= 50; 
      console.log("HIT! Enemy Health is now: " + e.health);
    }
  }
}

// Movement controls
function keyTyped() {
  if (key === " ") {
    setAnimation("player", "roll");
  } 
  else if (key === "s") {
    setAnimation("player", "block");
  } 
  else if (key === "w" && !isJumping) {
    isJumping = true;
    yVelocity = jumpForce; 
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

function keyPressed() {
  if (game === "gameOver" && (key === 'r' || key === 'R')) {
    game = "start";
    playerHealth = 100;
    bossHealth = 100;
    
    charPos.dx = 3 * cellSize;
    charPos.dy = initialY - playerSizeY;
    
    bossPos.dx = -99999;
    bossPos.dy = (initialY - bossSizeY) + 60;
    
    currentAnim.player = "idle";
    currentAnim.boss = "idle";
    frameIndex.player = 0;
    frameIndex.boss = 0;
    lastBossAttack = 0;
    
    bx = 0;
    enemies = [];
    platforms = []; 
    chunksGenerated = 0;
    arenaLocked = false;
    
    nextSpawnX = width;
    generateNewChunk();
  }
}

// Movement and Boss AI
function movement() {
  
  if (keyIsDown(68)) { 
    
    let canMoveRight = true;
    
    if (chunksGenerated >= MAX_CHUNKS) {
      let arenaLimit = bossArenaStartX + (width * 3.8); 
        
      if (Math.abs(bx) > arenaLimit) {
        canMoveRight = false;
      }
    }

    if (canMoveRight) {
      setAnimation("player", "run");  
      bx -= moveSpeed; 
      
      if (chunksGenerated < MAX_CHUNKS) {
        generateNewChunk();
      }
      
      if (chunksGenerated >= MAX_CHUNKS) {
        if (Math.abs(bx) > bossArenaStartX - 100) {
          arenaLocked = true;
        }
      }
    } 
    else {
      if (currentAnim.player !== "idle"){ 
        setAnimation("player", "idle");
      }
    }
  }

  else if (keyIsDown(65)) { 

    if (arenaLocked) {
      let limit = -(bossArenaStartX - 100); 
      
      if (bx < limit) {
        setAnimation("player", "runback");
        bx += moveSpeed; 
      } else {
        if (currentAnim.player !== "idle") {
          setAnimation("player", "idle");
        }
      }
    } 
    else {
      if(bx <= 0){
        setAnimation("player", "runback");
        bx += moveSpeed; 
      }
    }
  }
  else {
    if (currentAnim.player === "run" || currentAnim.player === "runback") {
      currentAnim.player = "idle";
    }
  }

  // Jumping
  if (isJumping) {
    charPos.dy += yVelocity;
    yVelocity += gravity;

    let landed = checkPlatCollision();
    
    if (!landed && charPos.dy + playerSizeY >= initialY) {
      charPos.dy = initialY - playerSizeY;
      isJumping = false;
      currentAnim.player = "idle";
      landed = true;
    }

    if (!landed) {
      if (yVelocity < 0) {
        currentAnim.player = "jumpUp";
        frameIndex.player = 0;
      } 
      else {
        currentAnim.player = "jumpDown";
        frameIndex.player = 0;
      }
    }
  } 
  else {
    let onPlatform = checkPlatCollision();
    if (!onPlatform && charPos.dy + playerSizeY < initialY) {
      isJumping = true;
      yVelocity = 0;
    }
  }

  // Boss movement AI
  if (chunksGenerated >= MAX_CHUNKS) {
    const attackRangeX = 20;
    const attackRangeY = 75;
  
    let bossScreenX = bossPos.dx + bx; 
    let distanceBoss = charPos.dx - bossScreenX;
    let absoluteDistanceY = Math.abs(charPos.dy - bossPos.dy);
    let absoluteDistanceX = Math.abs(distanceBoss);

    if (bossScreenX > -200 && bossScreenX < width + 200) {
      if (absoluteDistanceX <= attackRangeX && absoluteDistanceY <= attackRangeY) {
        if (currentAnim.boss !== "idle" && currentAnim.boss !== "attack") {
          setAnimation("boss", "idle");
        }
      }
      else if (distanceBoss > 0) {
        bossPos.dx += 6; 
        setAnimation("boss", "run");
      } 
      else if (distanceBoss < 0) {
        bossPos.dx -= 6; 
        setAnimation("boss", "runback");
      }
      else {
        if (currentAnim.boss !== "idle") {
          setAnimation("boss", "idle");
        }
      }
    }
  }
}

// Boss attack logic
function updateBossAttack() {
  if (chunksGenerated < MAX_CHUNKS) return;

  let bossScreenX = bossPos.dx + bx; 
  let distanceX = Math.abs(charPos.dx - bossScreenX);
  let distanceY = Math.abs(charPos.dy - bossPos.dy);

  if (distanceX <= 20 && distanceY <= 100 && millis() - lastBossAttack > bossAttackCooldown) {
    playerHealth -= 0;
    if (playerHealth < 0){
      playerHealth = 0;
    }
    setAnimation("boss", "attack"); 
    lastBossAttack = millis();
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