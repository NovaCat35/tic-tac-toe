const gameBoard = (() => {
	const row1 = [null, null, null];
	const row2 = [null, null, null];
	const row3 = [null, null, null];
	return {
		board: [row1, row2, row3],
	};
})();

// Takes in user inputs and outputs them into the gameBoard
const controller = () => {
	const _gameBoardSquares = document.querySelectorAll(".square");
   _gameBoardSquares.forEach((square) => square.addEventListener('click', _playerVSplayer));
   let playerActive = false;

   function _setPlayerInputX(event) {
      event.target.textContent = 'X';
      playerActive = false;
   }
   function _setPlayerInputY(event) {
      event.target.textContent = 'Y';
      playerActive = true;
   }

	function _playerVSplayer(event) {
      if(event.target.textContent.length === 0)
         if(playerActive) 
            _setPlayerInputX(event);
         else {
            _setPlayerInputY(event);
         }
		// board.forEach((row) => {
		// 	row.forEach((column) => {
		// 		const div = document.createElement("div");
		// 		div.classList.add("square");
		// 		div.textContent = column;
      //       div.addEventListener('click', _setPlayerInput)
		// 		_gameBoardElement.appendChild(div);
		// 	});
		// });
	}
};

controller();
