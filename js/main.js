/*----- Cached Elements -----*/

const highWeightEl = document.getElementById("high-weight");
const currentWeightEl = document.getElementById("current-weight");
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
const horSlideBoxEl = document.getElementById("horizontal-slider-box");
const vertSlideBoxEl = document.getElementById("vertical-slider-box");
const countdownEl = document.getElementById("countdown");
const mobileLeftButtonEl = document.getElementById("left-button");
const mobileRightButtonEl = document.getElementById("right-button");
const mobileUpButtonEl = document.getElementById("up-button");
const mobileDownButtonEl = document.getElementById("down-button");

/*----- constants -----*/

const vertWinBarStartHeight = 80; //the starting height of the win bar for the vertical slider (dictates difficulty)
const horWinBarStartWidth = 80;   //the starting width of the win bar for the horizontal slider (dictates difficulty)
const winBarIncrement = 5;        //the pixels win bars will decrease at each progressive level
const moverStartSpeed = 50;       //initial movement of the sliders (in ms)
const moverIncrement = 5;         //speed at which the movement increase (in ms)
const countDownStartTime = 400;   //intial value for lock out timer (times five) (in ms)
const countdownIncrement = 20;    //decrease in time for each number in the lock out timer (in ms)
const counterStart = 5;           //number to begin count down in the lock out timer

/*------array of images for the stick figures------*/

let imgArray = [];
imgArray[0] = new Image();
imgArray[0].src = "img/1.png";
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
stickManEl.setAttribute("src", imgArray[0].src);    //set to image 0 at start up

/*----- app's state (variables) -----*/

let started = 1;        //variable to begin the game. -1 is not started and 1 is started
let moveForward = true; //variable to determine direction of movement of sliders
let counter;            //variable for lockout counter
let moveIntervalCaller; //variable used in setInverval function of animations
let failure = false;    //determines if a user ahs failed a task
let highLevel = 0;      //stores users highest level reached
let highWeight = 0;     //stores the weight value of that highest level reached
let currentLevel;       //stores current level
let currentWeight = 50; //stores current weight value of that level, default is 50lbs
let currentStage;       //stores the users current stage within each level
let vertBackBarPos = backBarVertEl.getBoundingClientRect();
let vertWinnerBarPos = winnerBarVertEl.getBoundingClientRect();
let vertSliderPos = sliderVertEl.getBoundingClientRect();
let horBackBarPos = backBarHorEl.getBoundingClientRect();
let horLeftWinnerBarPos = winnerBarHorLeftEl.getBoundingClientRect();
let horRightWinnerBarPos = winnerBarHorRightEl.getBoundingClientRect();
let horSliderPos = sliderHorEl.getBoundingClientRect();

/*----- event listeners -----*/

resetButtonEl.addEventListener("click", function () {
  stickManEl.setAttribute("src", imgArray[0].src)
  if (started === -1) {
    resetButtonEl.innerHTML = "RESET"
    started = started * -1
    gameInit()
  } else reset()
})

//----------animation functions--------//

function moverUpDown() {
  vertSliderPos = sliderVertEl.getBoundingClientRect();
  vertBackBarPos = backBarVertEl.getBoundingClientRect();
  if (moveForward === true) {
    let moveSlider = vertSliderPos.top;
    if (vertSliderPos.top <= vertBackBarPos.top) {
      moveForward = false;
    } else {
      moveSlider = moveSlider - 6
      sliderVertEl.style.top = moveSlider + "px"
    }
  } else {
    moveSlider = vertSliderPos.bottom
    if (vertSliderPos.bottom >= vertBackBarPos.bottom) {
      moveForward = true
    } else {
      moveSlider = moveSlider + 1
      sliderVertEl.style.top = moveSlider + "px"
    }
  }
}

function moverUpOnly() {
  vertSliderPos = sliderVertEl.getBoundingClientRect()
  vertBackBarPos = backBarVertEl.getBoundingClientRect()
  if (moveForward === true) {
    let moveSlider = vertSliderPos.top;
    if (vertSliderPos.top <= vertBackBarPos.top) {
      moveForward = false
    } else {
      moveSlider = moveSlider - 6
      sliderVertEl.style.top = moveSlider + "px"
    }
  } else {
    failure = true
    clearInterval(moveIntervalCaller)
    gameInit()
  }
}

function moverLeftRight() {
  horSliderPos = sliderHorEl.getBoundingClientRect()
  if (moveForward === true) {
    let moveSlider = horSliderPos.right;
    if (horSliderPos.right > horBackBarPos.right) {
      moveForward = false
    } else {
      moveSlider = moveSlider - 1
      sliderHorEl.style.left = moveSlider + "px"
    }
  } else {
    moveSlider = horSliderPos.left
    if (horSliderPos.left < horBackBarPos.left) {
      moveForward = true
    } else {
      moveSlider = moveSlider - 6
      sliderHorEl.style.left = moveSlider + "px"
    }
  }
}

function countDown() {
  if (counter > 0) {
    countdownEl.innerHTML = counter
    counter--
  } else {
    failure = true
    clearInterval(moveIntervalCaller)
    gameInit()
  }
}

/*----- eventlistener functions for browser-----*/

let upArrow = (event) => {
  mobileUpButtonEl.removeEventListener("click", upButton)
  if (event.code === "ArrowUp" && currentStage !== 5) {
    clearInterval(moveIntervalCaller)
    vertSliderPos = sliderVertEl.getBoundingClientRect()
    vertWinnerBarPos = winnerBarVertEl.getBoundingClientRect()
    if (
      vertWinnerBarPos.bottom > vertSliderPos.bottom &&
      vertSliderPos.top > vertWinnerBarPos.top
    ) {
      currentStage += 1
      document.removeEventListener("keyup", upArrow)
      gameInit()
    } else {
      document.removeEventListener("keyup", upArrow)
      failure = true
      gameInit()
    }
  } else if (event.code === "ArrowUp" && currentStage === 5) {
    stickManEl.setAttribute("src", imgArray[5].src)
    moveIntervalCaller = setInterval(moverUpOnly,moverStartSpeed - (moverIncrement * currentLevel))
    document.removeEventListener("keyup", upArrow)
    document.addEventListener("keyup", downArrow)
  }
}

let downArrow = (event) => {
  mobileDownButtonEl.removeEventListener("click", downButton)
  if (event.code === "ArrowDown" && currentStage !== 5) {
    clearInterval(moveIntervalCaller)
    currentStage += 1
    document.removeEventListener("keyup", downArrow)
    gameInit()
  } else if (event.code === "ArrowDown" && currentStage === 5) {
    vertSliderPos = sliderVertEl.getBoundingClientRect()
    vertWinnerBarPos = winnerBarVertEl.getBoundingClientRect()
    if (
      vertWinnerBarPos.bottom > vertSliderPos.bottom &&
      vertSliderPos.top > vertWinnerBarPos.top
    ) {
      clearInterval(moveIntervalCaller)
      document.removeEventListener("keyup", downArrow)
      currentStage += 1
      gameInit()
    } else {
      clearInterval(moveIntervalCaller)
      document.removeEventListener("keyup", downArrow)
      failure = true
      gameInit()
    }
  }
}

let leftArrow = (event) => {
  mobileLeftButtonEl.removeEventListener("click", leftButton)
  if (event.code === "ArrowLeft") {
    clearInterval(moveIntervalCaller)
    horSliderPos = sliderHorEl.getBoundingClientRect()
    horLeftWinnerBarPos = winnerBarHorLeftEl.getBoundingClientRect()
    if (
      horLeftWinnerBarPos.left < horSliderPos.left &&
      horSliderPos.right < horLeftWinnerBarPos.right
    ) {
      currentStage += 1
      document.removeEventListener("keyup", leftArrow)
      gameInit()
    } else {
      document.removeEventListener("keyup", leftArrow)
      failure = true
      gameInit()
    }
  }
}

let rightArrow = (event) => {
  mobileRightButtonEl.removeEventListener("click", rightButton)
  if (event.code === "ArrowRight") {
    clearInterval(moveIntervalCaller)
    horSliderPos = sliderHorEl.getBoundingClientRect()
    horRightWinnerBarPos = winnerBarHorRightEl.getBoundingClientRect()
    if (
      horRightWinnerBarPos.left < horSliderPos.left &&
      horSliderPos.right < horRightWinnerBarPos.right
    ) {
      currentStage += 1
      document.removeEventListener("keyup", rightArrow)
      gameInit()
    } else {
      document.removeEventListener("keyup", rightArrow)
      failure = true
      gameInit()
    }
  }
}

/*----- eventListener functions for mobile-----*/

let upButton = () => {
  document.removeEventListener("keyup", upArrow)
  if (currentStage !== 5) {
    clearInterval(moveIntervalCaller)
    vertSliderPos = sliderVertEl.getBoundingClientRect()
    vertWinnerBarPos = winnerBarVertEl.getBoundingClientRect()
    if (
      vertWinnerBarPos.bottom > vertSliderPos.bottom &&
      vertSliderPos.top > vertWinnerBarPos.top
    ) {
      currentStage += 1
      mobileUpButtonEl.removeEventListener("click", upButton)
      gameInit()
    } else {
      mobileUpButtonEl.removeEventListener("click", upButton)
      failure = true
      gameInit()
    }
  } else if (currentStage === 5) {
    stickManEl.setAttribute("src", imgArray[5].src)
    moveIntervalCaller = setInterval(moverUpOnly,moverStartSpeed - (moverIncrement * currentLevel))
    mobileUpButtonEl.removeEventListener("click", upButton)
    mobileDownButtonEl.addEventListener("click", downButton)
  }
}

let downButton = () => {
  document.removeEventListener("keyup", downArrow)
  if (currentStage !== 5) {
    clearInterval(moveIntervalCaller)
    currentStage += 1
    mobileDownButtonEl.removeEventListener("click", downButton)
    gameInit()
  } else if (currentStage === 5) {
    vertSliderPos = sliderVertEl.getBoundingClientRect()
    vertWinnerBarPos = winnerBarVertEl.getBoundingClientRect()
    if (
      vertWinnerBarPos.bottom > vertSliderPos.bottom &&
      vertSliderPos.top > vertWinnerBarPos.top
    ) {
      clearInterval(moveIntervalCaller)
      mobileDownButtonEl.removeEventListener("click", downButton)
      currentStage += 1
      gameInit()
    } else {
      clearInterval(moveIntervalCaller)
      mobileDownButtonEl.removeEventListener("click", downButton)
      failure = true
      gameInit()
    }
  }
}

let leftButton = () => {
  document.removeEventListener("keyup", leftArrow)
  clearInterval(moveIntervalCaller)
  horSliderPos = sliderHorEl.getBoundingClientRect()
  horLeftWinnerBarPos = winnerBarHorLeftEl.getBoundingClientRect()
  if (
    horLeftWinnerBarPos.left < horSliderPos.left &&
    horSliderPos.right < horLeftWinnerBarPos.right
  ) {
    currentStage += 1
    mobileLeftButtonEl.removeEventListener("click", leftButton)
    gameInit()
  } else {
    mobileLeftButtonEl.removeEventListener("click", leftButton)
    failure = true
    gameInit()
  }
}

let rightButton = () => {
  document.removeEventListener("keyup", rightArrow)
  clearInterval(moveIntervalCaller)
  horSliderPos = sliderHorEl.getBoundingClientRect()
  horRightWinnerBarPos = winnerBarHorRightEl.getBoundingClientRect()
  if (
    horRightWinnerBarPos.left < horSliderPos.left &&
    horSliderPos.right < horRightWinnerBarPos.right
  ) {
    currentStage += 1
    mobileRightButtonEl.removeEventListener("click", rightButton)
    gameInit()
  } else {
    mobileRightButtonEl.removeEventListener("click", rightButton)
    failure = true
    gameInit()
  }
}


/*------functions called in stage initialization------*/

function hideStage(){
  countdownEl.style.visibility = "hidden"
  horSlideBoxEl.style.visibility = "hidden"
  vertSlideBoxEl.style.visibility = "hidden"
  winnerBarHorLeftEl.style.visibility = "hidden"
  winnerBarHorRightEl.style.visibility = "hidden"
}

function getPos(){
  vertBackBarPos = backBarVertEl.getBoundingClientRect()
  sliderVertEl.style.bottom = vertBackBarPos.bottom + "px"
  sliderVertEl.style.top = vertBackBarPos.bottom - 5 + "px"
  sliderVertEl.style.left = vertBackBarPos.left + "px"
  winnerBarVertEl.style.height =
  vertWinBarStartHeight - winBarIncrement * currentLevel + "px"
  winnerBarHorLeftEl.style.width =
  horWinBarStartWidth - winBarIncrement * currentLevel + "px"
  winnerBarHorRightEl.style.width =
  horWinBarStartWidth - winBarIncrement * currentLevel + "px"
}

function displayWeight(){
  currentWeight = 50 + 25 * currentLevel + "lbs"
  currentWeightEl.innerHTML = currentWeight
}

function resetCounter(){
  counter = counterStart
  countdownEl.innerHTML = counter
}

/*----initialization function-----*/

function gameInit() {
  hideStage()
  if (started === 1) {
    displayWeight()
    resetCounter()
    moveIntervalCaller = null
    getPos()
    clearInterval(moveIntervalCaller)
    if (failure === false && currentStage === 1) {
      vertSlideBoxEl.style.visibility = "visible"
      //Stage 1
      stageOne()
    } else if (failure === false && currentStage === 2) {
      vertSlideBoxEl.style.visibility = "visible"
      //stage 2
      stageTwo()
    } else if (failure === false && currentStage === 3) {
      vertSlideBoxEl.style.visibility = "visible"
      //stage 3
      stageThree()
    } else if (failure === false && currentStage === 4) {
      countdownEl.style.visibility = "visible"
      //stage 4
      stageFour()
    } else if (failure === false && currentStage === 5) {
      vertSlideBoxEl.style.visibility = "visible"
      //stage 5
      stageFive()
    } else if (failure === false && currentStage === 6) {
      horSlideBoxEl.style.visibility = "visible"
      winnerBarHorLeftEl.style.visibility = "visible"
      //stage 6
      stageSix()
    } else if (failure === false && currentStage === 7) {
      horSlideBoxEl.style.visibility = "visible"
      winnerBarHorRightEl.style.visibility = "visible"
      //stage 7
      stageSeven()
    } else if (failure === false && currentStage === 8) {
      horSlideBoxEl.style.visibility = "visible"
      winnerBarHorLeftEl.style.visibility = "visible"
      //stage 8
      stageEight()
    } else if (failure === false && currentStage === 9) {
      horSlideBoxEl.style.visibility = "visible"
      winnerBarHorRightEl.style.visibility = "visible"
      //stage 9
      stageNine()
    } else if (failure === false && currentStage === 10) {
      countdownEl.style.visibility = "visible"
      //stage 10
      stageTen()
    } else if (failure === false && currentStage === 11) {
      //stage 11
      stageEleven()
    } else {
      stageFailure()
    }
  }
}

/*------reset function------*/

function reset() {
  started = started * -1
  resetButtonEl.innerHTML = "START"
  currentLevel = 0
  currentStage = 1
  currentWeight = 50
  failure = false
  playerMessageEl.innerHTML = "Press the START button to begin"
  currentWeightEl.innerHTML = currentWeight + 'lbs'
  stickManEl.setAttribute("src", imgArray[0].src)
  clearInterval(moveIntervalCaller)
  gameInit()
}

/*------stage functions------*/

function stageOne() {
  stickManEl.setAttribute("src", imgArray[0].src)
  playerMessageEl.innerHTML = "Press the UP arrow to stop the slider in the BLUE bar"
  moveIntervalCaller = setInterval(
    moverUpDown,
    moverStartSpeed - moverIncrement * currentLevel
  )
  document.addEventListener("keyup", upArrow)
  mobileUpButtonEl.addEventListener("click", upButton)
}

function stageTwo() {
  stickManEl.setAttribute("src", imgArray[1].src)
  playerMessageEl.innerHTML = "Press the UP arrow to stop the slider in the BLUE bar"
  moveIntervalCaller = setInterval(
    moverUpDown,
    moverStartSpeed - moverIncrement * currentLevel
  )
  document.addEventListener("keyup", upArrow)
  mobileUpButtonEl.addEventListener("click", upButton)
}

function stageThree() {
  stickManEl.setAttribute("src", imgArray[2].src)
  playerMessageEl.innerHTML = "Press the UP arrow to stop the slider in the BLUE bar"
  moveIntervalCaller = setInterval(
    moverUpDown,
    moverStartSpeed - moverIncrement * currentLevel
  )
  document.addEventListener("keyup", upArrow)
  mobileUpButtonEl.addEventListener("click", upButton)
}

function stageFour() {
  stickManEl.setAttribute("src", imgArray[3].src)
  playerMessageEl.innerHTML = "QUICK! Press the DOWN arrow to lock out the weight!"
  moveIntervalCaller = setInterval(
    countDown,
    countDownStartTime - countdownIncrement * currentLevel
  )
  document.addEventListener("keyup", downArrow)
  mobileDownButtonEl.addEventListener("click", downButton)
}

function stageFive() {
  stickManEl.setAttribute("src", imgArray[4].src)
  playerMessageEl.innerHTML =
    "Press the UP arrow to toss the wight (start the slider), and the DOWN arrow inside the BLUE bar to catch it"
  document.addEventListener("keyup", upArrow)
  mobileUpButtonEl.addEventListener("click", upButton)
}

function stageSix() {
  stickManEl.setAttribute("src", imgArray[6].src)
  playerMessageEl.innerHTML = "Press the LEFT arrow to stop the slider inside the PURPLE bar"
  moveForward = false
  moveIntervalCaller = setInterval(
    moverLeftRight,
    moverStartSpeed - moverIncrement * currentLevel
  )
  document.addEventListener("keyup", leftArrow)
  mobileLeftButtonEl.addEventListener("click", leftButton)
}

function stageSeven() {
  stickManEl.setAttribute("src", imgArray[7].src)
  playerMessageEl.innerHTML = "Press the RIGHT arrow to to stop the slider inside the PURPLE bar"
  moveForward = true
  moveIntervalCaller = setInterval(
    moverLeftRight,
    moverStartSpeed - moverIncrement * currentLevel
  )
  document.addEventListener("keyup", rightArrow)
  mobileRightButtonEl.addEventListener("click", rightButton)
}

function stageEight() {
  stickManEl.setAttribute("src", imgArray[8].src)
  playerMessageEl.innerHTML = "Press the LEFT arrow to to stop the slider inside the PURPLE bar"
  moveForward = false
  moveIntervalCaller = setInterval(
    moverLeftRight,
    moverStartSpeed - moverIncrement * currentLevel
  )
  document.addEventListener("keyup", leftArrow)
  mobileLeftButtonEl.addEventListener("click", leftButton)
}

function stageNine() {
  stickManEl.setAttribute("src", imgArray[9].src)
  playerMessageEl.innerHTML = "Press the RIGHT arrow to to stop the slider inside the PURPLE bar"
  moveForward = true
  moveIntervalCaller = setInterval(
    moverLeftRight,
    moverStartSpeed - moverIncrement * currentLevel
  )
  document.addEventListener("keyup", rightArrow)
  mobileRightButtonEl.addEventListener("click", rightButton)
}

function stageTen() {
  stickManEl.setAttribute("src", imgArray[10].src)
  playerMessageEl.innerHTML = "QUICK! Press the DOWN arrow to lock out the weight!"
  moveIntervalCaller = setInterval(
    countDown,
    countDownStartTime - countdownIncrement * currentLevel
  )
  document.addEventListener("keyup", downArrow)
  mobileDownButtonEl.addEventListener("click", downButton)
}

function stageEleven() {
  stickManEl.setAttribute("src", imgArray[11].src)
  playerMessageEl.innerHTML = "CONGRATULATIONS! Can you do 25lbs more?"
  setTimeout(function () {
    currentStage = 1
    currentLevel++
    gameInit()
  }, 4000)
}

function stageFailure() {
  playerMessageEl.innerHTML = "OOOOF! That...looks like it hurt"
  stickManEl.setAttribute("src", imgArray[12].src)
  setTimeout(function () {
    if (currentLevel > highLevel) {
      highLevel = currentLevel - 1
      highWeight = currentWeight
      highWeightEl.innerHTML = highWeight
    }
    reset()
  }, 4000)
}

/*-----beginning function call------*/


reset()

/*------Instructions Sheet------*/
const instructButtonEl = document.getElementById('instruct-button')
const instructionsBoxEl = document.getElementById('instructions-box')

let readyToPlay= () => {
  instructionsBoxEl.style.display = 'none'
}

instructButtonEl.addEventListener('click', readyToPlay)

