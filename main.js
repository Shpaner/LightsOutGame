
// Ensure the DOM is loaded before attempting to mutate or add elements.
window.onload = function () {

  // Use a multidemnsional array to represent the x and y respectively 
  // where the value is a boolean to represent whether the light is on
  let boardContainer = [];
  let hints = [];
  let shouldShowHints = true;

  let xlength;
  let ylength;

  let movesCounter = 0;
  let boardCompleted = false;

  let boardDiv = document.getElementById("board");
  let restartButton = document.getElementById("restart");
  let newBoardButton = document.getElementById("newboard");
  let hintButton = document.getElementById("hint");
  let createGameForm = document.forms["createGameForm"];
  let movesPara = document.getElementById("moves");

  // Initally hide game option functionality 
  restartButton.style.display = 'none';
  newBoardButton.style.display = 'none';
  hintButton.style.display = 'none';

  // Once DOM items are loaded attach the event handlers
  createGameForm.onsubmit = e => newGame(e);
  restartButton.onclick = e => restartGame(e);
  newBoardButton.onclick = e => showGameForm(e);
  hintButton.onclick = e => showHints(e);



  /* --- Display functions --- */

  // Current issues here are the display functions are interacting with global variables which would ideally be 
  // managed by some global state using Redux or a similar approach instead of global variables.

  function newGame(e) {
    e.preventDefault();

    // Update x and y lengths
    xlength = createGameForm["width"].value;
    ylength = createGameForm["height"].value;

    createGame();

    createGameForm.style.display = 'none';
    movesPara.style.display = 'block'; 
    restartButton.style.display = 'inline';
    newBoardButton.style.display = 'inline';
    hintButton.style.display = 'inline';
  }

  function showGameForm(e) {
    e.preventDefault();

    while (boardDiv.hasChildNodes()) {
      boardDiv.removeChild(boardDiv.lastChild);
    }

    createGameForm.style.display = 'inline';
    movesPara.style.display = 'none';
    restartButton.style.display = 'none';
    newBoardButton.style.display = 'none';
    hintButton.style.display = 'none';
  }


  function restartGame(e) {
    e.preventDefault();

    createGame();
  }

  function createGame() {

    hints = [];

    // Update board container
    boardContainer = createBoard(xlength, ylength);

    // Reset counter
    movesCounter = 0;
    movesPara.innerHTML = `Moves: ${movesCounter}`;

    // Reset board completed
    boardCompleted = false;

    // Finally display the board
    displayBoard(boardContainer);
  }


  function userClick(x, y) {

    if (!boardCompleted) { 
    
      // find clicked spot
      tmp = 0;
      for (k = 0; k < ylength; k++) {
        for (l = 0; l < xlength; l++) {
          if (k === x && l === y) {
            k = ylength;
            break;
          }
          tmp += 1;
        }
      }

      for (i = 0; i < hints.length; i++) 
        if (hints[i] == tmp) {
          hints.splice(i, 1);
        }

      // Update attempts counter information
      movesCounter++;
      movesPara.innerHTML = `Moves: ${movesCounter}`;

      updateBoard(boardContainer, x, y);

      if (checkBoardCompleted(boardContainer)) {

        boardCompleted = true;
        let attemptText = movesCounter === 1 ? 'move' : 'moves';
        movesPara.innerHTML = `Congratulations! Completed in ${movesCounter} ${attemptText}. Restart or update the board size to continue.`;
      }

      displayBoard(boardContainer);
      shouldShowHints = true;
    }
  }


  function displayBoard(board) {

    while (boardDiv.hasChildNodes()) {
      boardDiv.removeChild(boardDiv.lastChild);
    }

    id_nr = 0
    for (i=0; i<ylength; i++) {

      let row = document.createElement('div');
      row.className = 'row';

      for (j=0; j<xlength; j++) {

        let boardItem = document.createElement('div');
        boardItem.className = board[i][j] ? 'boardItemLightOn' : 'boardItemLightOff';
        boardItem.onclick = userClick.bind(undefined, i, j);
        boardItem.id = id_nr;
        row.appendChild(boardItem);
        id_nr += 1;
      }

      boardDiv.appendChild(row);
    }
  }

  /* --- Application logic functions --- */

  function createBoard(boardWidth, boardHeight) {

    var newBoard = [];

    // create array of false
    for (y = 0; y < boardHeight; y++) {
      let xRow = [];
      for (x = 0; x < boardWidth; x++) {
        xRow.push(false);
      }
      newBoard.push(xRow);
    }

    // Ensure that at least one random light gets turned on
    let atLeastOneLightOn = true;

    var i = 0;

    for (y = 0; y < boardHeight; y++) {

      for (x = 0; x < boardWidth; x++) {

        // return true if light should be on
        let lightOn = Math.round(Math.random()) === 1 ? true : false;
        
        if (lightOn) {
          updateBoard(newBoard, y, x);
          hints.push(i)
        }
        
        // avoid possibility of having empty array
        if (!atLeastOneLightOn && lightOn) {
          atLeastOneLightOn = true;
        } 

        i += 1
      }
    }

    // If no lights on - let's try again with that random generator!
    if (!atLeastOneLightOn) { 
      createBoard(boardHeight, boardWidth) 
    } else {
      return newBoard;  
      }
  }

  function updateBoard(board, x, y) {

    board[x][y] = !board[x][y];

    // Update surrounding lights if they exist
    if (x > 0)                  { board[x-1][y] = !board[x-1][y]; }
    if (x < board.length-1)     { board[x+1][y] = !board[x+1][y]; }
    if (y > 0)                  { board[x][y-1] = !board[x][y-1]; }
    if (y < board[0].length-1)  { board[x][y+1] = !board[x][y+1]; }
  }

  function showHints(e) {
    e.preventDefault();

    let lightsOn = document.getElementsByClassName("boardItemLightOn");
    let lightsOff = document.getElementsByClassName("boardItemLightOff");

    if (shouldShowHints) {

      Array.from(lightsOn).forEach( item => {
        for (i = 0; i < hints.length; i++) 
          if (hints[i] == item.id) 
            item.style.backgroundColor = "#fffb2b";
      });

      Array.from(lightsOff).forEach( item => {
        for (i = 0; i < hints.length; i++) 
          if (hints[i] == item.id) 
            item.style.backgroundColor = "#fffb2b";
      });

    } else {
      Array.from(lightsOn).forEach( item => {
        for (i = 0; i < hints.length; i++) 
          if (hints[i] == item.id) 
            item.style.backgroundColor = "#74ff3b";
      });

      Array.from(lightsOff).forEach( item => {
        for (i = 0; i < hints.length; i++) 
          if (hints[i] == item.id) 
            item.style.backgroundColor = "#74ff3b";
      });
    }
    
    shouldShowHints = !shouldShowHints;
  }

  function checkBoardCompleted(board) {

    for (i=0; i<board.length; i++) {
      for (j=0; j<board[0].length; j++) {
        if (board[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
}