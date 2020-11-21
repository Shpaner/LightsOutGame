
window.onload = function () {

  let boardContainer = [];
  let hints = [];
  let hintsAreOn = false;

  let boardWidth;  // board width
  let boardHeight;  // board height

  let movesCounter = 0;
  let boardCompleted = false;

  let boardDiv = document.getElementById("board");
  let restartButton = document.getElementById("restart");
  let newBoardButton = document.getElementById("newboard");
  let hintButton = document.getElementById("hint");
  let createGameForm = document.forms["createGameForm"];
  let movesPara = document.getElementById("moves");
  let header = document.getElementById('header4');

  // Initally hide game option functionality 
  restartButton.style.display = 'none';
  newBoardButton.style.display = 'none';
  hintButton.style.display = 'none';
  header.innerHTML = "by Tobiasz Witalis";

  // Once DOM items are loaded attach the event handlers
  createGameForm.onsubmit = e => newGame(e);
  restartButton.onclick = e => restartGame(e);
  newBoardButton.onclick = e => showGameForm(e);
  hintButton.onclick = e => showHints(e);

  function newGame(e) {
    e.preventDefault();

    // Update x and y lengths
    boardWidth = createGameForm["width"].value;
    boardHeight = createGameForm["height"].value;

    createGame();

    createGameForm.style.display = 'none';
    movesPara.style.display = 'block'; 
    restartButton.style.display = 'inline';
    newBoardButton.style.display = 'inline';
    hintButton.style.display = 'inline';
    header.innerHTML = "Leave only whites to win!";
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
    hintsAreOn = false;

    boardContainer = createBoard(boardWidth, boardHeight);

    movesCounter = 0;
    movesPara.innerHTML = `Moves: ${movesCounter}`;

    boardCompleted = false;

    displayBoard(boardContainer);
  }


  function userClick(y, x) {

    if (!boardCompleted) { 
    
      // find clicked spot
      tmp = 0;
      for (k = 0; k < boardHeight; k++) {
        for (l = 0; l < boardWidth; l++) {
          if (k === y && l === x) {
            k = boardHeight;
            break;
          }
          tmp += 1;
        }
      }

      let addHint = true;
      for (i = 0; i < hints.length; i++) {
        if (hints[i] == tmp) {
          hints.splice(i, 1);
          addHint = false;
          break;
        }
      }

      if (addHint) { hints.push(tmp); }

      // Update moves counter 
      movesCounter++;
      movesPara.innerHTML = `Moves: ${movesCounter}`;

      updateBoard(boardContainer, y, x);

      if (checkBoardCompleted(boardContainer)) {

        boardCompleted = true;
        let tmpText = movesCounter === 1 ? 'move' : 'moves';
        movesPara.innerHTML = `Congratulations! You've completed in ${movesCounter} ${tmpText}. Restart or update the board size to continue.`;
      }

      displayBoard(boardContainer);
      
      if (hintsAreOn)
        showHints();
    }
  }


  function displayBoard(board) {

    while (boardDiv.hasChildNodes()) {
      boardDiv.removeChild(boardDiv.lastChild);
    }

    id_nr = 0
    for (y = 0; y < boardHeight; y++) {

      let row = document.createElement('div');
      row.className = 'row';

      for (x = 0; x < boardWidth; x++) {

        let boardItem = document.createElement('div');
        boardItem.className = board[y][x] ? 'boardItemLightOn' : 'boardItemLightOff';
        boardItem.onclick = userClick.bind(undefined, y, x);
        boardItem.id = id_nr;
        row.appendChild(boardItem);
        id_nr += 1;
      }

      boardDiv.appendChild(row);
    }
  }

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

    let noLightsTurnedOn = true;

    let i = 0;

    for (y = 0; y < boardHeight; y++) {

      for (x = 0; x < boardWidth; x++) {

        // return true if light should be on
        let lightOn = Math.round(Math.random()) === 1 ? true : false;
        
        if (lightOn) {
          updateBoard(newBoard, y, x);
          hints.push(i)
        }
        
        // if at least one is turned on - continue
        if (noLightsTurnedOn && lightOn) {
          noLightsTurnedOn = false;
        } 

        i += 1
      }
    }

    // restart if no lights are turned on
    if (noLightsTurnedOn) { 
      createBoard(boardHeight, boardWidth) 
    } else {
      return newBoard;  
      }
  }

  function updateBoard(board, y, x) {

    board[y][x] = !board[y][x];

    // Change surrounding lights if they exist
    if (y > 0)                  { board[y-1][x] = !board[y-1][x]; }
    if (y < board.length-1)     { board[y+1][x] = !board[y+1][x]; }
    if (x > 0)                  { board[y][x-1] = !board[y][x-1]; }
    if (x < board[0].length-1)  { board[y][x+1] = !board[y][x+1]; }
  }

  function showHints(e) {
    e.preventDefault();

    let lightsOn = document.getElementsByClassName("boardItemLightOn");
    let lightsOff = document.getElementsByClassName("boardItemLightOff");

    // turn on hints
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
    
      hintsAreOn = true;
  }

  function checkBoardCompleted(board) {

    for (y = 0; y < board.length; y++) {
      for (x = 0; x < board[0].length; x++) {
        if (board[y][x]) {
          return false;
        }
      }
    }
    return true;
  }
}