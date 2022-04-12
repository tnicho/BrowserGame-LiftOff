/*----- constants -----*/
const highScoreEl = document.getElementById("high-score");
const currentScoreEl = document.getElementById("current-score");
const resetButtonEl = document.getElementById("reset-button");
const playerMessageEl = document.getElementById("player-message");
const backBarVertEl = document.getElementById("vertical-back-bar");
const winnerBarVertEl = document.getElementById("vertical-winner-bar");
const sliderVertEl = document.getElementById("vertical-slider");
const backBarHorEl = document.getElementById("horizontal-back-bar");
const winnerBarHorLeftEl = document.getElementById("horizontal-left-winner-bar");
const winnerBarHorRightEl = document.getElementById("horizontal-right-winner-bar");
const sliderHorEl = document.getElementById("horizontal-slider");
const headerEl = document.getElementById("header");
const stickManEl = document.getElementById("image");

//------Array of Images------
let imgArray = [];

imgArray[0] = new Image();
imgArray[0].src = "img/1.png";
stickManEl.setAttribute("src", imgArray[0].src);
imgArray[1] = new Image();
imgArray[1].src = "img/2.png";
imgArray[2] = new Image();
imgArray[2].src = "img/3.png";
imgArray[3] = new Image();
imgArray[3].src = "img/4.png";
imgArray[4] = new Image();
imgArray[4].src = "img/5.png";
imgArray[5] = new Image();
imgArray[5].src = "img/6.png";
imgArray[6] = new Image();
imgArray[6].src = "img/7.png";
imgArray[7] = new Image();
imgArray[7].src = "img/8.png";
imgArray[8] = new Image();
imgArray[8].src = "img/9.png";
imgArray[9] = new Image();
imgArray[9].src = "img/10.png";
imgArray[10] = new Image();
imgArray[10].src = "img/11.png";
imgArray[11] = new Image();
imgArray[11].src = "img/12.png";
imgArray[12] = new Image();
imgArray[12].src = "img/13.png";

/*----- app's state (variables) -----*/
let moveGo = true;
let moveIntervalCaller;
let failure = false;
let stageCompleted = [];
let highScore;
let currentLevel;
let currentStage;
let weightLevels = []; //each knew level pushes a new weight onto the array
let vertBackBarPos = backBarVertEl.getBoundingClientRect();
let vertWinnerBarPos = winnerBarVertEl.getBoundingClientRect();
let vertSliderPos = sliderVertEl.getBoundingClientRect();
let horBackBarPos = backBarHorEl.getBoundingClientRect();
let horLeftWinnerBarPos = winnerBarHorLeftEl.getBoundingClientRect();
let horRightWinnerBarPos = winnerBarHorRightEl.getBoundingClientRect();
let horSliderPos = sliderHorEl.getBoundingClientRect();
let moveForward = true;
let started = -1; //variable to begin the game. -1 is not started and 1 is started

/*----- cached element references -----*/

/*----- event listeners -----*/
resetButtonEl.addEventListener("click", function () {
  stickManEl.setAttribute("src", imgArray[0].src);
  if (started === -1) {
    resetButtonEl.innerHTML = "RESET";
    started = started * -1;
    console.log("inGame");
    gameInit();
  } else reset();
});
reset();
//----------Animation Functions--------//
function moverUpDown() {
  vertSliderPos = sliderVertEl.getBoundingClientRect();
  vertBackBarPos = backBarVertEl.getBoundingClientRect();

  if (moveForward === true) {
    let moveSlider = vertSliderPos.top;
    if (vertSliderPos.top <= vertBackBarPos.top) {
      moveForward = false;
    } else {
      moveSlider = moveSlider - 6;
      sliderVertEl.style.top = moveSlider + "px";
    }
  } else {
    moveSlider = vertSliderPos.bottom;
    if (vertSliderPos.bottom >= vertBackBarPos.bottom) {
      moveForward = true;
    } else {
      moveSlider = moveSlider + 1;
      sliderVertEl.style.top = moveSlider + "px";
    }
  }
}

function moverUpOnly() {
  vertSliderPos = sliderVertEl.getBoundingClientRect();
  vertBackBarPos = backBarVertEl.getBoundingClientRect();

  if (moveForward === true) {
    let moveSlider = vertSliderPos.top;
    if (vertSliderPos.top <= vertBackBarPos.top) {
      moveForward = false;
    } else {
      moveSlider = moveSlider - 6;
      sliderVertEl.style.top = moveSlider + "px";
    }
  } else {
    failure = true;
    clearInterval(moveIntervalCaller);
    gameInit();
  }
}

function moverLeftRight() {
  horSliderPos = sliderHorEl.getBoundingClientRect();

  if (moveForward === true) {
    let moveSlider = horSliderPos.right;
    if (horSliderPos.right > horBackBarPos.right) {
      moveForward = false;
    } else {
      moveSlider = moveSlider - 1;
      sliderHorEl.style.left = moveSlider + "px";
    }
  } else {
    moveSlider = horSliderPos.left;
    if (horSliderPos.left < horBackBarPos.left) {
      moveForward = true;
    } else {
      moveSlider = moveSlider - 6;
      sliderHorEl.style.left = moveSlider + "px";
    }
  }
}
/*----- EventListener Functions -----*/
let upArrow = (event) => {
  if (event.code === "ArrowUp" && currentStage !== 5) {
    clearInterval(moveIntervalCaller);
    vertSliderPos = sliderVertEl.getBoundingClientRect();
    vertWinnerBarPos = winnerBarVertEl.getBoundingClientRect();
    if (
      vertWinnerBarPos.bottom > vertSliderPos.bottom &&
      vertSliderPos.top > vertWinnerBarPos.top
    ) {
      currentStage += 1;
      document.removeEventListener("keyup", upArrow);
      gameInit();
    } else {
      document.removeEventListener("keyup", upArrow);
      failure = true;
      gameInit();
    }
  } else if (event.code === "ArrowUp" && currentStage === 5) {
    stickManEl.setAttribute("src", imgArray[5].src);
    moveIntervalCaller = setInterval(moverUpOnly, 50);
    document.removeEventListener("keyup", upArrow);
    document.addEventListener("keyup", downArrow);
  }
};

let downArrow = (event) => {
  if (event.code === "ArrowDown" && currentStage !== 5) {
    currentStage += 1;
    document.removeEventListener("keyup", downArrow);
    gameInit();
  } else if (event.code === "ArrowDown" && currentStage === 5) {
    clearInterval(moveIntervalCaller);
    vertSliderPos = sliderVertEl.getBoundingClientRect();
    vertWinnerBarPos = winnerBarVertEl.getBoundingClientRect();
    if (
      vertWinnerBarPos.bottom > vertSliderPos.bottom &&
      vertSliderPos.top > vertWinnerBarPos.top
    ) {
      currentStage += 1;
      document.removeEventListener("keyup", downArrow);
      gameInit();
    } else {
      console.log("here");
      document.removeEventListener("keyup", downArrow);
      failure = true;
      gameInit();
    }
  }
};

let leftArrow = (event) => {
  if (event.code === "ArrowLeft") {
    clearInterval(moveIntervalCaller);
    horSliderPos = sliderHorEl.getBoundingClientRect();
    horLeftWinnerBarPos = winnerBarHorLeftEl.getBoundingClientRect();
    if (
      horLeftWinnerBarPos.left < horSliderPos.left &&
      horSliderPos.right < horLeftWinnerBarPos.right
    ) {
      currentStage += 1;
      document.removeEventListener("keyup", leftArrow);
      gameInit();
    } else {
      document.removeEventListener("keyup", leftArrow);
      failure = true;
      gameInit();
    }
  }
};

let rightArrow = (event) => {
  if (event.code === "ArrowRight") {
    clearInterval(moveIntervalCaller);
    horSliderPos = sliderHorEl.getBoundingClientRect();
    horRightWinnerBarPos = winnerBarHorRightEl.getBoundingClientRect();
    if (
      horRightWinnerBarPos.left < horSliderPos.left &&
      horSliderPos.right < horRightWinnerBarPos.right
    ) {
      currentStage += 1;
      document.removeEventListener("keyup", rightArrow);
      gameInit();
    } else {
      document.removeEventListener("keyup", rightArrow);
      failure = true;
      gameInit();
    }
  }
};
//----Init function-----

function gameInit() {
  if (started === 1) {
    moveIntervalCaller = null;
    vertBackBarPos = backBarVertEl.getBoundingClientRect();
    sliderVertEl.style.bottom = vertBackBarPos.bottom + "px";
    sliderVertEl.style.top = vertBackBarPos.bottom - 5 + "px";
    sliderVertEl.style.left = vertBackBarPos.left + "px";

    clearInterval(moveIntervalCaller);
    console.log("current stage is: " + currentStage);

    console.log("started is " + started);
    if (failure === false && currentStage === 1) {
      //Stage 1
      console.log("stage 1");
      stageOne();
    } else if (failure === false && currentStage === 2) {
      //stage 2
      console.log("current stage is: " + currentStage);
      stageTwo();
    } else if (failure === false && currentStage === 3) {
      //stage 3
      console.log("current stage is: " + currentStage);
      stageThree();
    } else if (failure === false && currentStage === 4) {
      //stage 4
      console.log("current stage is: " + currentStage);
      stageFour();
    } else if (failure === false && currentStage === 5) {
      //stage 5
      console.log("current stage is: " + currentStage);
      stageFive();
    } else if (failure === false && currentStage === 6) {
      //stage 6
      console.log("current stage is: " + currentStage);
      stageSix();
    } else if (failure === false && currentStage === 7) {
      //stage 7
      console.log("current stage is: " + currentStage);
      stageSeven();
    } else if (failure === false && currentStage === 8) {
      //stage 8
      console.log("current stage is: " + currentStage);
      stageEight();
    } else if (failure === false && currentStage === 9) {
      //stage 9
      console.log("current stage is: " + currentStage);
      stageNine();
    } else if (failure === false && currentStage === 10) {
      //stage 10
      console.log("current stage is: " + currentStage);
      stageTen();
    } else if (failure === false && currentStage === 11) {
      //stage 11
      console.log("current stage is: " + currentStage);
      stageEleven();
    } else if (failure === false && currentStage === 12) {
      //stage 12
      console.log("current stage is: " + currentStage);
      stageTwelve();
    } else {
      stageFailure();
    }
  }
}

function reset() {
  started = started * -1;
  resetButtonEl.innerHTML = "START";
  currentLevel = 0;
  currentStage = 1;
  failure = false;
  playerMessageEl.innerHTML = "Welcome! Press the START button to begin";
  currentScoreEl.innerHTML = currentLevel;
  stickManEl.setAttribute("src", imgArray[0].src); //Reset stick figures array with currentStage
}

function stageOne() {
  stickManEl.setAttribute("src", imgArray[0].src);
  playerMessageEl.innerHTML =
    "Press the UP arrow to stop the slider";
  moveIntervalCaller = setInterval(moverUpDown, 50);
  document.addEventListener("keyup", upArrow);
}
function stageTwo() {
  stickManEl.setAttribute("src", imgArray[1].src);
  playerMessageEl.innerHTML =
    "Press the UP arrow to stop the slider";
  moveIntervalCaller = setInterval(moverUpDown, 50);
  document.addEventListener("keyup", upArrow);
}
function stageThree() {
  stickManEl.setAttribute("src", imgArray[2].src);
  playerMessageEl.innerHTML =
    "Press the UP arrow to stop the slider";
  moveIntervalCaller = setInterval(moverUpDown, 50);
  document.addEventListener("keyup", upArrow);
}
function stageFour() {
  console.log("stageFour");
  stickManEl.setAttribute("src", imgArray[3].src);
  playerMessageEl.innerHTML =
    "Press the Down Arrow to lock it out";
  document.addEventListener("keyup", downArrow);
}
function stageFive() {
  console.log("stageFive");
  stickManEl.setAttribute("src", imgArray[4].src);
  playerMessageEl.innerHTML =
    "Press the Up Arrow to toss the weight, and the Down Arrow to catch it";
  document.addEventListener("keyup", upArrow);
}
function stageSix() {
  console.log("stageSix");
  stickManEl.setAttribute("src", imgArray[6].src);
  playerMessageEl.innerHTML =
  "Press the Left Arrow to lift it over your head";
  moveForward = false;
  moveIntervalCaller = setInterval(moverLeftRight, 50);
  document.addEventListener("keyup", leftArrow);
}
function stageSeven() {
  console.log("stageSeven");
  stickManEl.setAttribute("src", imgArray[7].src);
  playerMessageEl.innerHTML =
  "Press the Right Arrow to lift it over your head";
  moveForward = true;
  moveIntervalCaller = setInterval(moverLeftRight, 50);
  document.addEventListener("keyup", rightArrow);
}
function stageEight() {
  console.log("stageEight");
  stickManEl.setAttribute("src", imgArray[8].src);
  playerMessageEl.innerHTML =
  "Press the Left Arrow to lift it over your head";
  moveForward = false;
  moveIntervalCaller = setInterval(moverLeftRight, 50);
  document.addEventListener("keyup", leftArrow);
}
function stageNine() {
  console.log("stageNine");
  stickManEl.setAttribute("src", imgArray[9].src);
  playerMessageEl.innerHTML =
  "Press the Right Arrow to lift it over your head";
  moveForward = true;
  moveIntervalCaller = setInterval(moverLeftRight, 50);
  document.addEventListener("keyup", rightArrow);
}
function stageTen() {
  console.log("stageTen");
  stickManEl.setAttribute("src", imgArray[10].src);
  playerMessageEl.innerHTML =
    "Press the Down Arrow to lock it out";
  document.addEventListener("keyup", downArrow);
}
function stageEleven() {
  console.log("stageEleven");
  stickManEl.setAttribute("src", imgArray[11].src);
  playerMessageEl.innerHTML =
  "Congratulations! Let's try more weight";
  setTimeout(function () {
    currentStage = 1
    gameInit()
  }, 5000);
}

function stageFailure() {
  console.log("stageFailure");
  stickManEl.setAttribute("src", imgArray[12].src);
  setTimeout(function () {
    reset();
  }, 5000);
}
