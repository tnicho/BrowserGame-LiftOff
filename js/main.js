/*----- constants -----*/
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
const horSlideBoxEl = document.getElementById('horizontal-slider-box');
const vertSlideBoxEl = document.getElementById('vertical-slider-box');
const countdownEl = document.getElementById('countdown');
const mobileLeftButtonEl = document.getElementById('left-button');
const mobileRightButtonEl = document.getElementById('right-button');
const mobileUpButtonEl = document.getElementById('up-button');
const mobileDownButtonEl = document.getElementById('down-button');
const vertWinBarStartHeight = 80;
const horWinBarStartWidth = 80;
const winBarIncrement = 5;
const moverStartSpeed = 50;
const moverIncrement = 5;
const countDownStartTime = 400;
const countdownIncrement = 20;
const counterStart = 5;

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
let counter;
let moveIntervalCaller;
let failure = false;
let stageCompleted = [];
let highLevel = 0;
let highWeight = 0;
let currentLevel;
let currentWeight = 45;
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
let started = 1; //variable to begin the game. -1 is not started and 1 is started

/*----- cached element references -----*/

/*----- event listeners -----*/
resetButtonEl.addEventListener("click", function () {
  stickManEl.setAttribute("src", imgArray[0].src)
  if (started === -1) {
    resetButtonEl.innerHTML = "RESET"
    started = started * -1
    console.log("inGame")
    gameInit()
  } else reset()
});
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


function countDown() {
    if (counter > 0){
      console.log('counter is' + counter)
      countdownEl.innerHTML = counter
      counter--
    } else {
      console.log('hello')
      failure = true;
      clearInterval(moveIntervalCaller);
      gameInit();
    }

}
/*----- EventListener Functions for Browser-----*/
let upArrow = (event) => {
  console.log("hi")
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
    moveIntervalCaller = setInterval(moverUpOnly, (moverStartSpeed-(moverIncrement*currentLevel)));
    document.removeEventListener("keyup", upArrow);
    document.addEventListener("keyup", downArrow);
  }
};

let downArrow = (event) => {
 
  if (event.code === "ArrowDown" && currentStage !== 5) {
    console.log('made it here')
    clearInterval(moveIntervalCaller);
    currentStage += 1;
    document.removeEventListener("keyup", downArrow);
    gameInit();
  } else if (event.code === "ArrowDown" && currentStage === 5) {
    vertSliderPos = sliderVertEl.getBoundingClientRect();
    vertWinnerBarPos = winnerBarVertEl.getBoundingClientRect();
    if (
      vertWinnerBarPos.bottom > vertSliderPos.bottom &&
      vertSliderPos.top > vertWinnerBarPos.top
    ) {
      clearInterval(moveIntervalCaller);
      document.removeEventListener("keyup", downArrow);
      currentStage += 1;
      gameInit();
    } else {
      clearInterval(moveIntervalCaller);
      document.removeEventListener("keyup", downArrow);
      console.log("here");
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

/*----- EventListener Functions for Mobile-----*/

let upButton = (event) => {
  console.log(event.code)
  if (currentStage !== 5) {
    clearInterval(moveIntervalCaller);
    vertSliderPos = sliderVertEl.getBoundingClientRect();
    vertWinnerBarPos = winnerBarVertEl.getBoundingClientRect();
    if (
      vertWinnerBarPos.bottom > vertSliderPos.bottom &&
      vertSliderPos.top > vertWinnerBarPos.top
    ) {
      currentStage += 1;
      mobileUpButtonEl.removeEventListener('click', upButton)
      gameInit();
    } else {
      mobileUpButtonEl.removeEventListener('click', upButton)
      failure = true;
      gameInit();
    }
  } else if (currentStage === 5) {
    stickManEl.setAttribute("src", imgArray[5].src);
    moveIntervalCaller = setInterval(moverUpOnly, (moverStartSpeed-(moverIncrement*currentLevel)));
    mobileUpButtonEl.removeEventListener('click', upButton)
    mobileDownButtonEl.addEventListener("click", downButton);
  }
};

let downButton = (event) => {
 
  if (currentStage !== 5) {
    clearInterval(moveIntervalCaller);
    currentStage += 1;
    mobileDownButtonEl.removeEventListener("click", downButton);
    gameInit();
  } else if (currentStage === 5) {
    vertSliderPos = sliderVertEl.getBoundingClientRect();
    vertWinnerBarPos = winnerBarVertEl.getBoundingClientRect();
    if (
      vertWinnerBarPos.bottom > vertSliderPos.bottom &&
      vertSliderPos.top > vertWinnerBarPos.top
    ) {
      clearInterval(moveIntervalCaller);
      mobileDownButtonEl.removeEventListener("click", downButton);
      currentStage += 1;
      gameInit();
    } else {
      clearInterval(moveIntervalCaller);
      mobileDownButtonEl.removeEventListener("click", downButton);
      failure = true;
      gameInit();
    }
  }
};

let leftButton = (event) => {
    clearInterval(moveIntervalCaller);
    horSliderPos = sliderHorEl.getBoundingClientRect();
    horLeftWinnerBarPos = winnerBarHorLeftEl.getBoundingClientRect();
    if (
      horLeftWinnerBarPos.left < horSliderPos.left &&
      horSliderPos.right < horLeftWinnerBarPos.right
    ) {
      currentStage += 1;
      mobileLeftButtonEl.removeEventListener("click", leftButton);
      gameInit();
    } else {
      mobileLeftButtonEl.removeEventListener("click", leftButton);
      failure = true;
      gameInit();
    }
};

let rightButton = (event) => {
    clearInterval(moveIntervalCaller);
    horSliderPos = sliderHorEl.getBoundingClientRect();
    horRightWinnerBarPos = winnerBarHorRightEl.getBoundingClientRect();
    if (
      horRightWinnerBarPos.left < horSliderPos.left &&
      horSliderPos.right < horRightWinnerBarPos.right
    ) {
      currentStage += 1;
      mobileRightButtonEl.removeEventListener("click", rightButton);
      gameInit();
    } else {
      mobileRightButtonEl.removeEventListener("click", rightButton);
      failure = true;
      gameInit();
    }
};

//----Init function-----

function gameInit() {
  countdownEl.style.visibility ='hidden'
  horSlideBoxEl.style.visibility = "hidden"
  vertSlideBoxEl.style.visibility = 'hidden'
  winnerBarHorLeftEl.style.visibility = 'hidden'
  winnerBarHorRightEl.style.visibility = 'hidden'
  if (started === 1) {
    currentWeight = (50 + (25*currentLevel)) + 'lbs';
    currentWeightEl.innerHTML = currentWeight
    counter = counterStart;
    countdownEl.innerHTML = counter;
    moveIntervalCaller = null;
    vertBackBarPos = backBarVertEl.getBoundingClientRect();
    sliderVertEl.style.bottom = vertBackBarPos.bottom + "px";
    sliderVertEl.style.top = vertBackBarPos.bottom - 5 + "px";
    sliderVertEl.style.left = vertBackBarPos.left + "px";
    winnerBarVertEl.style.height = (vertWinBarStartHeight - (winBarIncrement*currentLevel)) + 'px';
    winnerBarHorLeftEl.style.width = (horWinBarStartWidth - (winBarIncrement*currentLevel)) + 'px';
    winnerBarHorRightEl.style.width = (horWinBarStartWidth - (winBarIncrement*currentLevel)) + 'px';
    clearInterval(moveIntervalCaller);

    console.log("started is " + started);
    if (failure === false && currentStage === 1) {
      vertSlideBoxEl.style.visibility = 'visible'
      //Stage 1
      stageOne();
    } else if (failure === false && currentStage === 2) {
      vertSlideBoxEl.style.visibility = 'visible'
      //stage 2
      stageTwo();
    } else if (failure === false && currentStage === 3) {
      vertSlideBoxEl.style.visibility = 'visible'
      //stage 3
      stageThree();
    } else if (failure === false && currentStage === 4) {
      countdownEl.style.visibility = 'visible'
      //stage 4
      stageFour();
    } else if (failure === false && currentStage === 5) {
      vertSlideBoxEl.style.visibility = 'visible'
      //stage 5
      stageFive();
    } else if (failure === false && currentStage === 6) {
      horSlideBoxEl.style.visibility = 'visible'
      winnerBarHorLeftEl.style.visibility = 'visible'
      //stage 6
      stageSix();
    } else if (failure === false && currentStage === 7) {
      horSlideBoxEl.style.visibility = 'visible'
      winnerBarHorRightEl.style.visibility = 'visible'
      //stage 7
      stageSeven();
    } else if (failure === false && currentStage === 8) {
      horSlideBoxEl.style.visibility = 'visible'
      winnerBarHorLeftEl.style.visibility = 'visible'
      //stage 8
      stageEight();
    } else if (failure === false && currentStage === 9) {
      horSlideBoxEl.style.visibility = 'visible'
      winnerBarHorRightEl.style.visibility = 'visible'
      //stage 9
      stageNine();
    } else if (failure === false && currentStage === 10) {
      countdownEl.style.visibility = 'visible'
      //stage 10
      stageTen();
    } else if (failure === false && currentStage === 11) {
      
      //stage 11
      stageEleven();
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
  currentWeightEl.innerHTML = currentWeight;
  stickManEl.setAttribute("src", imgArray[0].src);
  clearInterval(moveIntervalCaller); //Reset stick figures array with currentStage
  gameInit()
  
}

function stageOne() {
  stickManEl.setAttribute("src", imgArray[0].src);
  playerMessageEl.innerHTML =
    "Press the UP arrow to stop the slider";
  moveIntervalCaller = setInterval(moverUpDown, (moverStartSpeed -(moverIncrement*currentLevel)));
  document.addEventListener("keyup", upArrow);
  mobileUpButtonEl.addEventListener('click', upButton)
}
function stageTwo() {
  stickManEl.setAttribute("src", imgArray[1].src);
  playerMessageEl.innerHTML =
    "Press the UP arrow to stop the slider";
  moveIntervalCaller = setInterval(moverUpDown, (moverStartSpeed-(moverIncrement*currentLevel)));
  document.addEventListener("keyup", upArrow);
  mobileUpButtonEl.addEventListener('click', upButton)
}
function stageThree() {
  stickManEl.setAttribute("src", imgArray[2].src);
  playerMessageEl.innerHTML =
    "Press the UP arrow to stop the slider";
  moveIntervalCaller = setInterval(moverUpDown, (moverStartSpeed-(moverIncrement*currentLevel)));
  document.addEventListener("keyup", upArrow);
  mobileUpButtonEl.addEventListener('click', upButton)
}
function stageFour() {
  stickManEl.setAttribute("src", imgArray[3].src);
  playerMessageEl.innerHTML =
    "Press the Down Arrow to lock it out";
  moveIntervalCaller = setInterval(countDown, (countDownStartTime - (countdownIncrement*currentLevel)));
  document.addEventListener("keyup", downArrow);
  mobileDownButtonEl.addEventListener('click', downButton)
}
function stageFive() {
  stickManEl.setAttribute("src", imgArray[4].src);
  playerMessageEl.innerHTML =
    "Press the Up Arrow to toss the weight, and the Down Arrow to catch it";
  document.addEventListener("keyup", upArrow);
  mobileUpButtonEl.addEventListener('click', upButton)
}
function stageSix() {
  stickManEl.setAttribute("src", imgArray[6].src);
  playerMessageEl.innerHTML =
  "Press the Left Arrow to lift it over your head";
  moveForward = false;
  moveIntervalCaller = setInterval(moverLeftRight, (moverStartSpeed-(moverIncrement*currentLevel)));
  document.addEventListener("keyup", leftArrow);
  mobileLeftButtonEl.addEventListener('click', leftButton);
}
function stageSeven() {
  stickManEl.setAttribute("src", imgArray[7].src);
  playerMessageEl.innerHTML =
  "Press the Right Arrow to lift it over your head";
  moveForward = true;
  moveIntervalCaller = setInterval(moverLeftRight, (moverStartSpeed-(moverIncrement*currentLevel)));
  document.addEventListener("keyup", rightArrow);
  mobileRightButtonEl.addEventListener('click', rightButton);
}
function stageEight() {
  stickManEl.setAttribute("src", imgArray[8].src);
  playerMessageEl.innerHTML =
  "Press the Left Arrow to lift it over your head";
  moveForward = false;
  moveIntervalCaller = setInterval(moverLeftRight, (moverStartSpeed-(moverIncrement*currentLevel)));
  document.addEventListener("keyup", leftArrow);
  mobileLeftButtonEl.addEventListener('click', leftButton);
}
function stageNine() {
  stickManEl.setAttribute("src", imgArray[9].src);
  playerMessageEl.innerHTML =
  "Press the Right Arrow to lift it over your head";
  moveForward = true;
  moveIntervalCaller = setInterval(moverLeftRight, (moverStartSpeed-(moverIncrement*currentLevel)));
  document.addEventListener("keyup", rightArrow);
  mobileRightButtonEl.addEventListener('click', rightButton);
}
function stageTen() {
  stickManEl.setAttribute("src", imgArray[10].src);
  playerMessageEl.innerHTML =
    "Press the Down Arrow to lock it out";
  //document.addEventListener("keyup", downArrow);
  moveIntervalCaller = setInterval(countDown, (countDownStartTime - (countdownIncrement*currentLevel)));
  document.addEventListener("keyup", downArrow);
  mobileDownButtonEl.addEventListener('click', downButton);
}
function stageEleven() {
  stickManEl.setAttribute("src", imgArray[11].src);
  playerMessageEl.innerHTML =
  "Congratulations! Let's add 25lbs and try again";
  setTimeout(function () {
    currentStage = 1
    currentLevel++
    gameInit()
  }, 4000);
}

function stageFailure() {
  console.log("stageFailure");
  playerMessageEl.innerHTML =
  "OOOOF! That looks like it hurt";
  stickManEl.setAttribute("src", imgArray[12].src);
  setTimeout(function () {
    if(currentLevel > highLevel){
      highLevel = currentLevel - 1
      highWeight = currentWeight
      highWeightEl.innerHTML = highWeight;
    }
    reset();
  }, 4000);
}
reset()