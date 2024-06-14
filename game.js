var buttonColours = ['red', 'blue', 'green', 'yellow'] // Array of possible button colors
var gamePattern = [] // Array to store the game's color pattern
var userClickedPattern = [] // Array to store the user's clicked color pattern
var started = false // Boolean to track if the game has started
var level = 0 // Variable to track the current level
var initialLives = 3 // Variable to track the player's lives
var lastClickTime = 0 // Variable to store the time of the last button click
var debounceDelay = 500 // Delay for the debounce logic (in milliseconds)
var acceptingInput = false // Boolean to track if the game is currently accepting input

/**
 * Resets the game to its initial state
 */
function startOver() {
  level = 0
  started = false
  gamePattern.length = 0
  userClickedPattern = []
  initialLives = 3
}

/**
 * Starts the game when a key is pressed
 */
$(document).keypress(function () {
  if (!started) {
    $('#level-title').text('Level ' + level)
    nextSequence()
    started = true
    $('.heart').removeClass('grayscale')
  }
})

/**
 * Handles button clicks, including the debounce logic
 */
$('.btn').click(function () {
  var currentTime = new Date().getTime()

  // Debounce logic: Ignore click if it happens too quickly after the last one
  if (!acceptingInput || currentTime - lastClickTime < debounceDelay) {
    return // Ignore the click
  }

  lastClickTime = currentTime // Update last click time
  var userChosenColour = $(this).attr('id')
  userClickedPattern.push(userChosenColour)

  playSound(userChosenColour)
  animatePress(userChosenColour)
  checkAnswer(userClickedPattern.length - 1)
})

/**
 * Generates the next sequence in the game
 */
function nextSequence() {
  level++
  $('#level-title').text('Level ' + level)

  var randomNumber = Math.floor(Math.random() * 4)
  var randomChosenColour = buttonColours[randomNumber]
  gamePattern.push(randomChosenColour)
  userClickedPattern = []

  $('#' + randomChosenColour)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100)
  playSound(randomChosenColour)
  setTimeout(() => {
    acceptingInput = true // Enable input after sequence is shown
  }, 1000) // Adjust the timeout to match the sequence display duration
}

/**
 * Plays a sound based on the name provided
 */
function playSound(name) {
  var audio = new Audio('resources/sounds/' + name + '.mp3')
  audio.play()
}

/**
 * Animates a button press
 */
function animatePress(currentColor) {
  $('#' + currentColor).addClass('pressed')
  setTimeout(function () {
    $('#' + currentColor).removeClass('pressed')
  }, 100)
}

/**
 * Checks the user's answer against the game's pattern
 */
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] !== userClickedPattern[currentLevel]) {
    console.log('Wrong color pressed')
    gameLoss()
  } else if (userClickedPattern.length === gamePattern.length) {
    console.log('Level completed')
    userClickedPattern = []
    setTimeout(nextSequence, 1000)
  }
}

/**
 * Handles the game loss logic
 */
function gameLoss() {
  $('.heart').removeClass('grayscale')

  if (initialLives > 0 && started === true) {
    $('body').addClass('life-minus')
    var audio = new Audio('resources/sounds/lifeBeep.mp3')
    audio.play()
    setTimeout(function () {
      $('body').removeClass('life-minus')
    }, 200)
    $('.life-' + initialLives).addClass('hidden')
    initialLives--
    userClickedPattern = []
  }

  if (initialLives === 0) {
    var audio = new Audio('resources/sounds/wrong.mp3')
    audio.play()
    $('body').removeClass('life-minus')
    $('body').addClass('game-over')
    setTimeout(function () {
      $('body').removeClass('game-over')
    }, 200)
    $('#level-title').text('Game Over, Press Any Key to Restart')
    $('.heart').removeClass('hidden').addClass('grayscale')
    startOver()
  }
}
