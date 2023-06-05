const gameBoard = (() => {
	const row1 = ["", "", ""];
	const row2 = ["", "", ""];
	const row3 = ["", "", ""];
	const board = [row1, row2, row3];

	const updateBoard = (target) => {
		board[target.dataset.row][target.dataset.column] = target.textContent;
	};
	return {
		updateBoard,
		board,
	};
})();

const player = (sign) => {
	let playerActive = true;
	const playerSign = sign;

	return {
		playerActive,
		playerSign,
	};
};

// Controls the logic of player clicks and outputs them into the gameBoard. Updates gameBoard with playerInput
const controller = () => {
	// --- EVENT LISTENERS --- //
	const _gameOption = document.querySelector(".game-option");
	const displayResult = document.querySelector(".result-display");
	const { updateBoard, board } = gameBoard;
	let gameType = "";
   let clickHandler;

	// OPTION: PVP
	document.querySelector(".pvp").addEventListener("click", () => {
		gameType = "pvp";
		_gameOption.classList.add("hidden");
		_playerVSplayer();
	});
	// OPTION: BOT
	document.querySelector(".bot").addEventListener("click", () => {
		gameType = "bot";
		_gameOption.classList.add("hidden");
		_playerVSbot();
	});
	// RESET BTN
	const _resetBtn = document.querySelector(".reset-btn");
	_resetBtn.addEventListener("click", _resetGame);

	function _resetGame() {
		// displayResult.classList.remove("active");
		// displayResult.classList.remove("tie");
      // displayResult.classList.remove("win");
		const squares = document.querySelectorAll(".square");

		squares.forEach((square) => {
			square.textContent = "";
			square.classList.remove("active");
			square.classList.remove("tie");
			square.classList.remove("win");   
         square.removeEventListener("click", clickHandler);
			updateBoard(square);
		});

		if (gameType === "pvp") {
			_playerVSplayer();
		} else {
			_playerVSbot();
		}
	}

	// The winners are the 3 winning squares
	function _displayWinner(winner, square1, square2, square3) {
		const squareSlot1 = document.querySelector(`[data-row="${square1[0]}"][data-column="${square1[1]}"]`);
		const squareSlot2 = document.querySelector(`[data-row="${square2[0]}"][data-column="${square2[1]}"]`);
		const squareSlot3 = document.querySelector(`[data-row="${square3[0]}"][data-column="${square3[1]}"]`);

		displayResult.textContent = `Player ${winner} wins the round!`;
		displayResult.classList.add("win");
		squareSlot1.classList.add("win");
		squareSlot2.classList.add("win");
		squareSlot3.classList.add("win");
	}

	function _displayTie(squares) {
		displayResult.textContent = "It's a TIE!";
		displayResult.classList.add("tie");
		squares.forEach((square) => square.classList.add("tie"));
	}

	function _displayTurn(player) {
		if (player === "Your") {
			displayResult.textContent = `Your Turn`;
		} else {
			displayResult.textContent = `${player}'s Turn`;
		}
	}

	function _checkWinner() {
		// Check rows
		for (let i = 0; i < 3; i++) {
			if (board[i][0] !== "" && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return { winner: board[i][0], square1: [i, 0], square2: [i, 1], square3: [i, 2] };
		}
		// Check columns
		for (let j = 0; j < 3; j++) {
			if (board[0][j] !== "" && board[0][j] === board[1][j] && board[1][j] == board[2][j]) return { winner: board[0][j], square1: [0, j], square2: [1, j], square3: [2, j] };
		}
		// Check diagonals
		if (board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return { winner: board[0][0], square1: [0, 0], square2: [1, 1], square3: [2, 2] };
		if (board[0][2] !== "" && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return { winner: board[2][0], square1: [0, 2], square2: [1, 1], square3: [2, 0] };

		return ""; //return '' if no winners
	}

	function _setPlayerInputX(event) {
		event.target.textContent = "X";
      event.target.classList.add('active');
		updateBoard(event.target);
	}

	function _setPlayerInputY(event) {
		event.target.textContent = "O";
      event.target.classList.add('active');
		updateBoard(event.target);
	}

	function botMove(squares) {
		// Get only the empty square slots
		let emptySquareList = Array.from(squares).filter((square) => square.textContent.length === 0);
		// choose index at random
		rndIndex = Math.floor(Math.random() * emptySquareList.length);
		emptySquareList[rndIndex].textContent = "O";
      emptySquareList[rndIndex].classList.add('active');
		updateBoard(emptySquareList[rndIndex]);
	}

	function _uploadPlayerSign(event, player1, player2 = false) {
		if (player1.playerActive) {
			_setPlayerInputX(event);
			// IF there's player2, we are not playing against a bot so we have to switch back and forth for player input
			if (player2 !== false) {
				player1.playerActive = false;
			}
		} else {
			_setPlayerInputY(event);
			player1.playerActive = true;
		}
	}

	function _checkFullSquare(squares) {
		const emptySquaresAvailable = Array.from(squares).filter((square) => square.textContent.length === 0).length;
		// Board is filled (all squares filled)
		if (emptySquaresAvailable === 0) {
			return true;
		}
		return false;
	}

	function _updateScore(winner) {
		const scoreboardX = document.querySelector(".scoreboard-x > .score");
		const scoreboardO = document.querySelector(".scoreboard-o > .score");
		if (winner === "X") {
			scoreboardX.textContent = Number(scoreboardX.textContent) + 1;
		} else {
			scoreboardO.textContent = Number(scoreboardO.textContent) + 1;
		}
	}

	function _setName(p1, p2) {
		const setName1 = document.querySelector(".scoreboard-x > .name");
		const setName2 = document.querySelector(".scoreboard-o > .name");
		if (p2 !== "bot") {
			setName1.textContent = `PLAYER ${p1}`;
			setName2.textContent = `PLAYER ${p2}`;
		} else {
			setName1.textContent = `PLAYER`;
			setName2.textContent = `BOT`;
		}
	}

	function _playerVSplayer() {
		const player1 = player("X");
		const player2 = player("O");
		const squares = document.querySelectorAll(".square");
		let p1Turn = true;

		_setName(player1.playerSign, player2.playerSign);
		_displayTurn(player1.playerSign);

		function announceTurn() {
			// Display current player's turn
			if (p1Turn) {
				_displayTurn(player2.playerSign);
				p1Turn = false;
			} else {
				_displayTurn(player1.playerSign);
				p1Turn = true;
			}
		}

		clickHandler = function (event) {
			let currentSquare = event.target.textContent.length;
			// ONLY input player's sign IF square slot is empty
			if (currentSquare === 0) {
            announceTurn();
				_uploadPlayerSign.call(null, event, player1, player2);
				// Check if we have a winner, IF YES then display result but remove further player inputs
				if (_checkWinner() !== "") {
					const { winner, square1, square2, square3 } = _checkWinner();
					_displayWinner(winner, square1, square2, square3);
					_updateScore(winner);
               //stop all user input once winner is reach
					squares.forEach((square) => square.removeEventListener("click", clickHandler)); 
               setTimeout(() => _resetGame(), 2000);
				} else {
					if (_checkFullSquare(squares)) {
						_displayTie(squares);
                  setTimeout(() => _resetGame(), 2000);
					}
				}
			}
		};

		squares.forEach((square) => square.addEventListener("click", clickHandler));
	}

	function _playerVSbot() {
		const player1 = player("X");
		const squares = document.querySelectorAll(".square");
		let p1Turn = true;
		let allowClick = true;
		_setName(player1.playerSign, "bot");
		_displayTurn("Your");

		function checkBoardForWinner() {
			// Check if we have a winner, IF YES then display result but remove further player inputs
			if (_checkWinner() !== "") {
				const { winner, square1, square2, square3 } = _checkWinner();
				_displayWinner(winner, square1, square2, square3);
				_updateScore(winner);
            //stop all user input once winner is reach
            squares.forEach((square) => square.removeEventListener("click", clickHandler));
				return true;
			}
		}

		function announceTurn() {
			// Display current player's turn
			if (p1Turn) {
				_displayTurn(`Bot`);
				p1Turn = false;
			} else {
				_displayTurn("Your");
				p1Turn = true;
			}
		}

		clickHandler = function (event) {
			// Ignore the click if allowClick is false
			if (!allowClick) {
				return;
			}
			let currentSquare = event.target.textContent.length;

			// Square slot is empty
			if (currentSquare === 0) {
				allowClick = false; // Pause the event listener so we wait for bot's move
            announceTurn();
				_uploadPlayerSign.call(null, event, player1);
				if (checkBoardForWinner()) {
               setTimeout(() => _resetGame(), 2000); 
				} else if (_checkFullSquare(squares)) {
					_displayTie(squares);
               setTimeout(() => _resetGame(), 2000);
				} else {
					setTimeout(() => {
						botMove(squares); // Bot's makes turn
						_displayTurn("Your"); 
						if (checkBoardForWinner()) {
                     setTimeout(() => _resetGame(), 2000);
						} else {
							if (_checkFullSquare(squares)) {
								_displayTie(squares);
                        setTimeout(() => _resetGame(), 2000);
							}
						}
						allowClick = true; // Resume the event listener
					}, 400);
				}
			}
		};

		squares.forEach((square) => square.addEventListener("click", clickHandler));
	}
};

controller();
