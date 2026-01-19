// 2D Arrays Assignment
// Character Fighter Game
// Jawad Imran
// 12/11/25

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

// Background variables
let bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12;
let bgLevel2, bgLevel3; 

// Level Control
let currentLevel = 1;
const TOTAL_LEVELS = 3;

// Story Messages
let storyMessages = [
  "THE FOREST\n\nKemal, the Assassin of the East infiltrates the duchy of the Luthania.\nHis mission is to rescue his brother who was take prisoner.\n\n(Press Space to Begin)", 
    
  "CASTLE LUTHANIA\n\nAfter defeating the dark guardian dark wizard of the deep forests, Kemal sneaks into the Castle.\n\n(Press Space to Continue)", 
    
  "HIDDEN DUNGEONS\n\nDefeating the unholy knight, Kemal ventures into the hidden dungeons.\nWhat awaits him in the morbid abyss, only fate knows.\n\n(Press Space to Continue)"
];
let currentStoryIndex = 0; 

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

let totalRunFrames = 8;
let totalRunBackFrames = 8;
let totalIdleFrames = 8;
let totalRollFrames = 6;
let totalAttackFrames = 18;
let totalBlockFrames = 6;
let totalJumpFrames = 3;

let totalEnemy1RunFrames = 10;
let totalEnemy1AttackFrames = 20;

let frameIndex = {
  player: 0,
  boss: 0,
  enemy1: 0
};
let delayCounter = 0;
let frameDelay = 7;
let bg;

let currentAnim ={
  player: "idle",
  boss: "idle",
  enemy1: "idle",  
};

charPos = {
  dx: 0,
  dy: 0,
};
bossPos = {
  dx: 0,
  dy: 0
};

let enemies = []; 
let nextSpawnX = 0;

let chunksGenerated = 0;
const MAX_CHUNKS = 10; 
let bossArenaStartX = 0; 
let arenaLocked = false; 

let initialY;

let bx = 0;
let by = 0;

let isJumping = false;
let yVelocity = 0;
let gravity;   
let jumpForce; 
let moveSpeed; 

let game = "start";

let timer = 0;
let timerPassed = 0;

let playerHealth = 100;
let bossHealth = 100;
let maxHealth = 100; 
let bossAttackCooldown = 800; 
let lastBossAttack = 0;

// Sound Variables
let menuMusic, level1Music, level2Music, level3Music;
let jumpSFX, playerAtkSFX, playerHurtSFX, enemyHurtSFX, bossAtkSFX, menuSpaceSFX, fallSFX;

function setAnimation(character, animName) {
  if (currentAnim[character] !== animName) {
    currentAnim[character] = animName;
    frameIndex[character] = 0;
  }
}

function preload() {
  // Load music/SFX
  menuMusic     = loadSound("assets/SFX&Music/Menu Music.mp3");
  level1Music   = loadSound("assets/SFX&Music/Level1Bg.mp3");
  level2Music   = loadSound("assets/SFX&Music/Level2Bg.mp3");
  level3Music   = loadSound("assets/SFX&Music/Level3Bg.mp3");

  jumpSFX       = loadSound("assets/SFX&Music/Jump_SFX.mp3");
  playerAtkSFX  = loadSound("assets/SFX&Music/PlayerATK_SFX.mp3");
  playerHurtSFX = loadSound("assets/SFX&Music/PlayerHurt_SFX.mp3");
  enemyHurtSFX  = loadSound("assets/SFX&Music/Enemy1hurt.mp3");
  bossAtkSFX    = loadSound("assets/SFX&Music/Boss1ATK_SFX.mp3");
  menuSpaceSFX  = loadSound("assets/SFX&Music/MenuSpace_SFX.mp3");
  fallSFX       = loadSound("assets/SFX&Music/FallSFX.mp3");

  // Load background images
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
  
  bgLevel2 = loadImage("assets/level_2.png"); 
  bgLevel3 = loadImage("assets/level_3.png"); 

  platformImg = loadImage("assets/platform.png");

  // Load character animation frames
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
// Setup
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
  
  currentLevel = 1;
  resetLevel();
}

// Background Music Management
function manageMusic() {
  let targetMusic;

  if (game === "start" || game === "story" || game === "gameOver") {
    targetMusic = menuMusic;
  } 
  else {
    if (currentLevel === 1) {
      targetMusic = level1Music;
    }
    else if (currentLevel === 2) {
      targetMusic = level2Music;
    }
    else {
      targetMusic = level3Music;
    }
  }

  let allTracks = [menuMusic, level1Music, level2Music, level3Music];
  for (let track of allTracks) {
    if (track !== targetMusic && track.isPlaying()) {
      track.stop();
    }
  }
    
  if (targetMusic && !targetMusic.isPlaying()) {
    targetMusic.setVolume(0.5);
    targetMusic.loop();
  }
}

function draw() {
  // Manage Music every frame
  manageMusic();

  if (game === "start") {
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
  
  else if (game === "story") {
    background("black");
    fill("white");
    textAlign(CENTER, CENTER);
    textSize(32);
      
    if (currentStoryIndex < storyMessages.length) {
      text(storyMessages[currentStoryIndex], width/2, height/2);
    }
  }
  
  else {
    // Game Over / Win Logic
    if (playerHealth <= 0) {
      game = "gameOver";
    }
    else if (bossHealth <= 0) {
      if (currentLevel < TOTAL_LEVELS) {
        game = "story";
        currentLevel++;
        currentStoryIndex = currentLevel - 1; 
      }
      else {
        game = "gameOver"; 
      }
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
      else {
        text("YOU WIN", width / 2, height / 2 - 40);
        text("The World Is Saved", width / 2, height / 2 + 20);
      }

      textSize(24);
      fill("white");
      text("Press R to Restart Game", width / 2, height / 2 + 100);
      return; 
    }

    // Background Scrolling
    let bgX = bx % width;
    
    if (currentLevel === 1) {
      let backgrounds = [bg12, bg11, bg10, bg9, bg8, bg7, bg6, bg5, bg4, bg3, bg2, bg1];
      for (let img of backgrounds) {
        image(img, bgX - width, by, width, height); 
        image(img, bgX, by, width, height);         
        image(img, bgX + width, by, width, height); 
      }
    }
    else {
      let currentBgImg;
      if (currentLevel === 2) {
        currentBgImg = bgLevel2;
      } 
      else {
        currentBgImg = bgLevel3;
      }
      image(currentBgImg, bgX - width, by, width, height); 
      image(currentBgImg, bgX, by, width, height);         
      image(currentBgImg, bgX + width, by, width, height); 
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

    let Frames = {
      player: "idle",
      boss: "idle",
      enemy1: "idle"
    };

    // Set current frames based on animation state
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

    if (Frames.player.length > 0) {
      image(Frames.player[frameIndex.player], charPos.dx, charPos.dy, playerSizeX, playerSizeY);
    }
    
    if (chunksGenerated >= MAX_CHUNKS) {
      if (Frames.boss.length > 0) {
        image(Frames.boss[frameIndex.boss], bossPos.dx + bx, bossPos.dy, bossSizeX , bossSizeY);
      }
    }
    
    // Enemy Update Loop
    let playerCenterX = charPos.dx + playerSizeX / 2;
    let playerCenterY = charPos.dy + playerSizeY / 2;
    
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
        
      if (e.health <= 0) {
        enemies.splice(i, 1);
        continue; 
      }

      let screenX = e.dx + bx; 
      let enemyWidth = bossSizeX - 130;
      let enemyHeight = bossSizeY - 130;
      let enemyCenterX = screenX + enemyWidth / 2;
      let enemyCenterY = e.dy + enemyHeight / 2;

      let distX = Math.abs(playerCenterX - enemyCenterX);
      let distY = Math.abs(playerCenterY - enemyCenterY);
        
      if (distX < 120 && distY < 150) {
        e.state = "attack";
        if (playerCenterX < enemyCenterX) {
          e.direction = -1; 
        }
        else {
          e.direction = 1;  
        }
        if (millis() - e.lastAttackTime > e.attackCooldown) {
          if (currentAnim.player !== "block") {
            playerHealth -= 5;
            playerHurtSFX.play();
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
        rect(screenX + 20, e.dy + 30, e.health / e.maxHealth * 50, 5);
        noFill();
        stroke(0);
        rect(screenX + 20, e.dy + 30, 50, 5);

        let currentEnemyFrames;
        if (e.state === "attack") {
          currentEnemyFrames = enemy1Frames.attackFrames;
        }
        else {
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
// Animation Log for Debugging
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
// Chunk Generation
function generateNewChunk() {
  if (chunksGenerated >= MAX_CHUNKS) {
    return; 
  }

  while (nextSpawnX < Math.abs(bx) + width + 500) {
    chunksGenerated++;
    
    if (chunksGenerated === MAX_CHUNKS) {
      let arenaWidth = width * 4; 
      bossArenaStartX = nextSpawnX;
      bossPos.dx = nextSpawnX + arenaWidth / 2;
      nextSpawnX += arenaWidth + 2000; 
      return;
    }
    
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
// Spawn enemy function
function spawnEnemy(x, y, w, isFloating) {
  enemies.push({
    dx: x + w / 2 - 50, 
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
// draw platforms
function drawPlats() {
  for (let plat of platforms) {
    let platScreenX = plat.x + bx;
    if (platScreenX + plat.width > 0 && platScreenX < width) {
      image(platformImg, platScreenX, plat.y, plat.width, plat.height);
    }
  }
}
// Check for platform collisions
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
      
      if (yVelocity > 0) {
        fallSFX.play();
      }
      break;
    }
  }

  return onPlatform;
}

function mouseClicked() {
  if (mouseX < charPos.dx + 100) { 
    setAnimation("player", "attackback");
  } 
  else {
    setAnimation("player", "attack");
  }
  
  playerAtkSFX.play();

  // Damage Boss
  let bossScreenX = bossPos.dx + bx;
  let distanceX = Math.abs(charPos.dx - bossScreenX);
  
  if (distanceX <= 150) { 
    bossHealth -= 10;
    enemyHurtSFX.play();
    if (bossHealth < 0){ 
      bossHealth = 0;
    }
  }

  // Damage Enemies
  let playerCenterX = charPos.dx + playerSizeX / 2;
  let playerCenterY = charPos.dy + playerSizeY / 2;

  for (let e of enemies) {
    let enemyScreenX = e.dx + bx;
    let enemyWidth = bossSizeX - 130;
    let enemyHeight = bossSizeY - 130;
    let enemyCenterX = enemyScreenX + enemyWidth / 2;
    let enemyCenterY = e.dy + enemyHeight / 2;

    let distX = Math.abs(playerCenterX - enemyCenterX);
    let distY = Math.abs(playerCenterY - enemyCenterY); 

    if (distX <= 120 && distY <= 150) { 
      e.health -= 50; 
      enemyHurtSFX.play();
      console.log("HIT! Enemy Health is now: " + e.health);
    }
  }
}

function keyTyped() {
  // Story Mode Input
  if (game === "story" && key === ' ') {
    if (currentStoryIndex > 0) {
      resetLevel();
    }
    menuSpaceSFX.play();
    game = "play";
  }
  
  // Start Screen Input
  else if (game === "start") {
    game = "story";
    currentStoryIndex = 0;
    menuSpaceSFX.play();
    animLog();
  }
  
  // Game Input
  else if (game !== "gameOver" && game !== "story") {
    if (key === " ") {
      setAnimation("player", "roll");
    } 
    else if (key === "s") {
      setAnimation("player", "block");
    } 
    else if (key === "w" && !isJumping) {
      isJumping = true;
      yVelocity = jumpForce; 
      jumpSFX.play();
    }
    else if (key === 'g' || key === 'G') {
      showGrid = !showGrid;
    }
  }
}

function keyPressed() {
  if (game === "gameOver" && (key === 'r' || key === 'R')) {
    game = "start";
    currentLevel = 1; 
    resetLevel();
  }
}
// Reset Level
function resetLevel() {
  playerHealth = 100;
  bossHealth = 100;
    
  charPos.dx = 3 * cellSize;
  charPos.dy = initialY - playerSizeY;
    
  bossPos.dx = -99999;
  bossPos.dy = initialY - bossSizeY + 60;
    
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
// Movement Function
function movement() {
  
  if (keyIsDown(68)) { 
    let canMoveRight = true;
    
    if (chunksGenerated >= MAX_CHUNKS) {
      let arenaLimit = bossArenaStartX + width * 3.8; 
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
      if (currentAnim.player !== "idle") {
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
      }
      else {
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
// Jumping and Falling Mechanics
  if (isJumping) {
    charPos.dy += yVelocity;
    yVelocity += gravity;

    let landed = checkPlatCollision();
    
    if (!landed && charPos.dy + playerSizeY >= initialY) {
      charPos.dy = initialY - playerSizeY;
      isJumping = false;
      currentAnim.player = "idle";
      landed = true;
      fallSFX.play();
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
// Boss Attack Logic
function updateBossAttack() {
  if (chunksGenerated < MAX_CHUNKS) {
    return;
  }

  let bossScreenX = bossPos.dx + bx; 
  let distanceX = Math.abs(charPos.dx - bossScreenX);
  let distanceY = Math.abs(charPos.dy - bossPos.dy);

  if (distanceX <= 20 && distanceY <= 100 && millis() - lastBossAttack > bossAttackCooldown) {
    playerHealth -= 7;
    if (playerHealth < 0){
      playerHealth = 0;
    }
    setAnimation("boss", "attack"); 
    bossAtkSFX.play();
    lastBossAttack = millis();
  }
}

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