const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const levelSelection = document.getElementById('level-selection');
const easyButton = document.getElementById('easy');
const hardButton = document.getElementById('hard');
const levelTitle = document.getElementById('level-title');

let playerX = window.innerWidth / 2 - 25; // Center the player
let bullets = [];
let enemies = [];
let gameOver = false;
let isSprinting = false;
let normalSpeed = 20; // Increased normal speed (2x faster)
let sprintSpeed = 40; // Increased sprint speed (2x faster)
let enemySpawnRate = 1000; // Default spawn rate
let enemySpeed = 4; // Default enemy speed (2x faster)
let bulletSpeed = 10; // Increased bullet speed (2x faster)

// Show level selection screen
levelSelection.style.display = 'block';
gameArea.style.display = 'none';

// Easy level
easyButton.addEventListener('click', () => {
  levelTitle.textContent = 'Easy Mode';
  startGame(1000, 2); // Faster spawn rate, faster enemies
});

// Hard level
hardButton.addEventListener('click', () => {
  levelTitle.textContent = 'Hard Mode';
  startGame(300, 8); // Much faster spawn rate, much faster enemies
});

// Start game with selected difficulty
function startGame(spawnRate, speed) {
  enemySpawnRate = spawnRate;
  enemySpeed = speed;
  levelSelection.style.display = 'none';
  gameArea.style.display = 'block';
  resetGame();
  setInterval(spawnEnemy, enemySpawnRate);
  update();
}

// Reset game state
function resetGame() {
  playerX = window.innerWidth / 2 - 25;
  player.style.left = `${playerX}px`;
  bullets.forEach(bullet => bullet.remove());
  enemies.forEach(enemy => enemy.remove());
  bullets = [];
  enemies = [];
  gameOver = false;
}

// Move player
document.addEventListener('keydown', (e) => {
  if (gameOver) return;

  // Enable sprint when Shift is pressed
  if (e.key === 'Shift') {
    isSprinting = true;
  }

  // Move left or right
  if (e.key === 'ArrowLeft' && playerX > 0) {
    playerX -= isSprinting ? sprintSpeed : normalSpeed;
  } else if (e.key === 'ArrowRight' && playerX < window.innerWidth - 50) {
    playerX += isSprinting ? sprintSpeed : normalSpeed;
  } else if (e.key === ' ' || e.key === 'z' || e.key === 'x') {
    // Shoot with spacebar, 'z', or 'x'
    shoot();
  }
  player.style.left = `${playerX}px`;
});

// Disable sprint when Shift is released
document.addEventListener('keyup', (e) => {
  if (e.key === 'Shift') {
    isSprinting = false;
  }
});

// Shoot bullets
function shoot() {
  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = `${playerX + 22.5}px`; // Center the bullet
  bullet.style.bottom = '70px';
  gameArea.appendChild(bullet);
  bullets.push(bullet);
}

// Spawn enemies
function spawnEnemy() {
  if (gameOver) return;
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = `${Math.random() * (window.innerWidth - 40)}px`; // Adjust for alien size
  enemy.style.top = '0';
  gameArea.appendChild(enemy);
  enemies.push(enemy);
}

// Update game state
function update() {
  if (gameOver) return;

  // Move bullets
  bullets.forEach((bullet, index) => {
    const bulletBottom = parseFloat(bullet.style.bottom);
    if (bulletBottom > window.innerHeight) {
      bullet.remove();
      bullets.splice(index, 1);
    } else {
      bullet.style.bottom = `${bulletBottom + bulletSpeed}px`; // Use bulletSpeed
    }
  });

  // Move enemies
  enemies.forEach((enemy, index) => {
    const enemyTop = parseFloat(enemy.style.top);
    if (enemyTop > window.innerHeight) {
      enemy.remove();
      enemies.splice(index, 1);
      gameOver = true;
      alert('Game Over!');
    } else {
      enemy.style.top = `${enemyTop + enemySpeed}px`;
    }
  });

  // Check for collisions
  bullets.forEach((bullet, bulletIndex) => {
    const bulletRect = bullet.getBoundingClientRect();
    enemies.forEach((enemy, enemyIndex) => {
      const enemyRect = enemy.getBoundingClientRect();
      if (
        bulletRect.left < enemyRect.right &&
        bulletRect.right > enemyRect.left &&
        bulletRect.top < enemyRect.bottom &&
        bulletRect.bottom > enemyRect.top
      ) {
        bullet.remove();
        enemy.remove();
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
      }
    });
  });

  requestAnimationFrame(update);
}