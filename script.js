// --- THE BOARD ---

// start with boardSide by taking 36vw from css, then increase it exponentially with math.pow to make it a 36 * 36 board
const boardSide = 30;
const totalBoardSide = Math.pow(boardSide, 2);

// scores - food and distance starts with 0
let totalFoodAte = 0;
let totalDistanceTravelled = 0;

// linking the html with js by getting document from the gameContainer
const gameContainer = document.getElementById("gameContainer");

// creating innerHTML game board pixels and making it i++ until it reachers the size of totalBoardSide. This is where the snake will move around later on.

const createGameBoardPixels = () => {
  for (let i = 1; i <= totalBoardSide; ++i) {
    gameContainer.innerHTML = `${gameContainer.innerHTML} <div class="gameBoardPixel" id="pixel${i}"></div>`;
  }
};

const gameBoardPixels = document.getElementsByClassName("gameBoardPixel");

// --- THE FOOD ---

let currentFoodPostion = 0;

// After the snake eats the apple, it will reappear at different place
const createFood = () => {
    gameBoardPixels[currentFoodPostion].classList.remove("food"); // Remove previous food;
    // Creating new food
    currentFoodPostion = Math.random();
    currentFoodPostion = Math.floor(currentFoodPostion * totalBoardSide);
    gameBoardPixels[currentFoodPostion].classList.add("food");
  };

/// THE SNAKE:

// Direction codes (Keyboard key codes for arrow keys):
const kiri = 37;
const atas = 38;
const kanan = 39;
const bawah = 40;

// Set snake direction initially to right
let snakeCurrentDirection = kanan;

const changeDirection = newDirectionCode => {
  // Change the direction of the snake
  if (newDirectionCode == snakeCurrentDirection) return;

  if (newDirectionCode == kiri && snakeCurrentDirection != kanan) {
    snakeCurrentDirection = newDirectionCode;
  } else if (newDirectionCode == atas && snakeCurrentDirection != bawah) {
    snakeCurrentDirection = newDirectionCode;
  } else if (
    newDirectionCode == kanan &&
    snakeCurrentDirection != kiri
  ) {
    snakeCurrentDirection = newDirectionCode;
  } else if (newDirectionCode == bawah && snakeCurrentDirection != atas) {
    snakeCurrentDirection = newDirectionCode;
  }
};

// Let the starting position of the snake be at the middle of game board
let currentSnakeHeadPosition = totalBoardSide / 2;

// Initial snake length
let snakeLength = 1000;

// Move snake continously by calling this function repeatedly :
const moveSnake = () => {
  switch (snakeCurrentDirection) {
    case kiri:
      --currentSnakeHeadPosition;
      const goingLeft =
        currentSnakeHeadPosition % boardSide == boardSide - 1 ||
        currentSnakeHeadPosition < 0;
      if (goingLeft) {
        currentSnakeHeadPosition = currentSnakeHeadPosition + boardSide;
      }
      break;
    case atas:
      currentSnakeHeadPosition = currentSnakeHeadPosition - boardSide;
      const goingUp =
        currentSnakeHeadPosition < 0;
      if (goingUp) {
        currentSnakeHeadPosition =
          currentSnakeHeadPosition + totalBoardSide;
      }
      break;
    case kanan:
      ++currentSnakeHeadPosition;
      const goingRight =
        currentSnakeHeadPosition % boardSide == 0;
      if (goingRight) {
        currentSnakeHeadPosition = currentSnakeHeadPosition - boardSide;
      }
      break;
    case bawah:
      currentSnakeHeadPosition = currentSnakeHeadPosition + boardSide;
      const goingDown =
        currentSnakeHeadPosition > totalBoardSide - 1;
      if (goingDown) {
        currentSnakeHeadPosition =
          currentSnakeHeadPosition - totalBoardSide;
      }
      break;
    default:
      break;
  }

  let nextSnakeHeadPixel = gameBoardPixels[currentSnakeHeadPosition];

  // Kill snake if it bites itself:
  if (nextSnakeHeadPixel.classList.contains("snakeBodyPixel")) {
    // Stop moving the snake
    clearInterval(moveSnakeInterval);
    if (
      !alert(
        `You have ate ${totalFoodAte} food by travelling ${totalDistanceTravelled} blocks.`
      )
    )
      window.location.reload();
  }
          
  nextSnakeHeadPixel.classList.add("snakeBodyPixel");

  setTimeout(() => {
    nextSnakeHeadPixel.classList.remove("snakeBodyPixel");
  }, snakeLength);

  // Update total distance travelled
  totalDistanceTravelled++;
  // Update in UI:
  document.getElementById("blocksTravelled").innerHTML = totalDistanceTravelled;

  if (currentSnakeHeadPosition == currentFoodPostion) {
    // Update total food ate
    totalFoodAte++;
    // Update in UI:
    document.getElementById("pointsEarned").innerHTML = totalFoodAte;

    // Increase Snake length:
    snakeLength = snakeLength + 100;
    createFood();
  }
};

/// ==== Run the game ====

// Create game board pixels:
createGameBoardPixels();

// Create initial food:
createFood();

// Move snake:
var moveSnakeInterval = setInterval(moveSnake, 200);


// Call change direction function on keyboard key-down event:
addEventListener("keydown", e => changeDirection(e.keyCode));

// ON SCREEN CONTROLLERS:
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");

leftButton.onclick = () => changeDirection(kiri);
rightButton.onclick = () => changeDirection(kanan);
upButton.onclick = () => changeDirection(atas);
downButton.onclick = () => changeDirection(bawah);

