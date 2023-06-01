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

const player = (sign) => {
	let playerActive = true;
	const playerSign = sign;

	return {
		playerActive,
		playerSign,
	};
};

const player1 = player("X");
const player2 = player("O");

// Controls the logic of player clicks and outputs them into the gameBoard. Updates gameBoard with playerInput
const controller = () => {
	// Checks which game option is selected
	const _gameOption = document.querySelector(".game-option");
	document.querySelector(".pvp").addEventListener("click", () => {
		_gameOption.classList.add("hidden");
		_playerVSplayer();
	});

	const { updateBoard, board } = gameBoard;

	function displayWinner(winner) {
		const displayWinner = document.querySelector(".winner-display");
		displayWinner.textContent = `Player ${winner} wins!`;
		displayWinner.classList.toggle("active");
	}

	function checkWinner() {
		// Check rows
		for (let i = 0; i < 3; i++) {
			if (board[i][0] !== null && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0];
		}
		// Check columns
		for (let j = 0; j < 3; j++) {
			if (board[0][j] !== null && board[0][j] === board[1][j] && board[1][j] == board[2][j]) return board[0][j];
		}
		// Check diagonals
		if (board[0][0] !== null && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
		if (board[0][2] !== null && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[2][0];

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

	// PVP: All squares on click will check current player's sign and display on game board
	function _playerVSplayer() {
		const squares = document.querySelectorAll(".square");
		squares.forEach((square) => square.addEventListener("click", uploadPlayerSign));

		function uploadPlayerSign(event) {
			let currentSquare = event.target.textContent.length;

			// square slot is empty
			if (currentSquare === 0) {
				if (player1.playerActive) {
					_setPlayerInputX(event);
					player1.playerActive = false;
					player2.playerActive = true;
				} else {
					_setPlayerInputY(event);
					player1.playerActive = true;
					player2.playerActive = false;
				}

				// Check if we have a winner, IF YES then display result but remove further player inputs
				if (checkWinner() !== null) {
					const winner = checkWinner();
					displayWinner(winner);
					squares.forEach((square) => square.removeEventListener("click", uploadPlayerSign));
				}
			}
		}
	}
};

controller();
