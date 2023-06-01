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
	const displayWinner = document.querySelector(".winner-display");
	const { updateBoard, board } = gameBoard;
	let gameType = "";

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
		displayWinner.textContent = "";
      displayWinner.classList.remove("active");

		const squares = document.querySelectorAll(".square");
		squares.forEach((square) => {
			square.textContent = "";
			updateBoard(square);
		});
		if (gameType === "pvp") {
			_playerVSplayer();
		} else {
			_playerVSbot();
		}
	}

	function _displayWinner(winner) {
		displayWinner.textContent = `Player ${winner} wins!`;
		displayWinner.classList.add("active");
	}

	function _checkWinner() {
		// Check rows
		for (let i = 0; i < 3; i++) {
			if (board[i][0] !== "" && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0];
		}
		// Check columns
		for (let j = 0; j < 3; j++) {
			if (board[0][j] !== "" && board[0][j] === board[1][j] && board[1][j] == board[2][j]) return board[0][j];
		}
		// Check diagonals
		if (board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
		if (board[0][2] !== "" && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[2][0];

		return ""; //return '' if no winners
	}

	function _setPlayerInputX(event) {
		event.target.textContent = "X";
		updateBoard(event.target);
	}

	function _setPlayerInputY(event) {
		event.target.textContent = "O";
		updateBoard(event.target);
	}

	function botMove(squares) {
		// Get only the empty square slots
		let emptySquareList = Array.from(squares).filter((square) => square.textContent.length === 0);
		// choose index at random
		rndIndex = Math.floor(Math.random() * emptySquareList.length);
		emptySquareList[rndIndex].textContent = "O";
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

	// PVP: All squares on click will check current player's sign and display on game board
	function _playerVSplayer() {
		const player1 = player("X");
		const player2 = player("O");
		const squares = document.querySelectorAll(".square");

		const clickHandler = function (event) {
			let currentSquare = event.target.textContent.length;

			// ONLY input player's sign IF square slot is empty
			if (currentSquare === 0) {
				_uploadPlayerSign.call(null, event, player1, player2);
				// Check if we have a winner, IF YES then display result but remove further player inputs
				if (_checkWinner() !== "") {
					const winner = _checkWinner();
					_displayWinner(winner);
					squares.forEach((square) => square.removeEventListener("click", clickHandler));
				}
			}
		};

		squares.forEach((square) => square.addEventListener("click", clickHandler));
	}

	function _playerVSbot() {
		const player1 = player("X");
		const squares = document.querySelectorAll(".square");

		function checkBoardForWinner() {
			// Check if we have a winner, IF YES then display result but remove further player inputs
			if (_checkWinner() !== "") {
				const winner = _checkWinner();
				_displayWinner(winner);
				return true;
			}
		}

		const clickHandler = function (event) {
			let currentSquare = event.target.textContent.length;

			// square slot is empty
			if (currentSquare === 0) {
				_uploadPlayerSign.call(null, event, player1);
				if (checkBoardForWinner()) {
					squares.forEach((square) => square.removeEventListener("click", clickHandler));
				} else {
					setTimeout(() => {
						botMove(squares);
						if (checkBoardForWinner()) {
							squares.forEach((square) => square.removeEventListener("click", clickHandler));
						}
					}, 500);
				}
			}
		};

		squares.forEach((square) => square.addEventListener("click", clickHandler));
	}
};

controller();
