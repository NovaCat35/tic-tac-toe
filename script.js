const gameBoard = (() => {
	const row1 = [null, null, null];
	const row2 = [null, null, null];
	const row3 = [null, null, null];
	const board = [row1, row2, row3];

	const updateBoard = (target) => {
		board[target.dataset.row][target.dataset.column] = target.textContent;
	};
	return {
		updateBoard,
		board,
	};
})();

// Controls the logic of player clicks and outputs them into the gameBoard. Updates gameBoard with playerInput
const controller = () => {
	const _gameBoardSquares = document.querySelectorAll(".square").forEach((square) => square.addEventListener("click", _playerVSplayer));
	const { updateBoard, board } = gameBoard;

   function displayWinner(winner) {
      const displayWinner = document.querySelector('.winner-display > span');
      displayWinner.textContent = winner;
   }

   function checkWinner() {
      // Check rows
      for(let i = 0; i < 3; i++) {
         if(board[i][0] !== null && board[i][0] === board[i][1] && board[i][1] === board[i][2])
            return board[i][0];
      }
      // Check columns
      for(let j = 0; j < 3; j++) {
         if(board[0][j] !==null && board[0][j] === board[1][j] && board[1][j] == board[2][j]) 
            return board[0][j];
      }
      // Check diagonals
      if(board[0][0] !== null && board[0][0] === board[1][1] && board[1][1] === board[2][2])
         return board[0][0];
      if(board[0][2] !== null && board[0][2] === board[1][1] && board[1][1] === board[2][0])
         return board[2][0];

      return null; //return null if no winners
   }
   
	function _setPlayerInputX(event) {
		event.target.textContent = "X";
		updateBoard(event.target);
	}
	function _setPlayerInputY(event) {
		event.target.textContent = "O";
		updateBoard(event.target);
	}

   let playerActive = false;
	function _playerVSplayer(event) {
      // IF there's nothing in the board's square
		if (event.target.textContent.length === 0)
			if (playerActive) {
				_setPlayerInputX(event);
            playerActive = false;
			} else {
				_setPlayerInputY(event);
            playerActive = true;
			}
         console.log(board)
         if(checkWinner() !== null) {
            const winner = checkWinner()
            console.log(winner)
            displayWinner(winner);
         }
	}
};

controller();
