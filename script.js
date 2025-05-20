document.addEventListener('DOMContentLoaded', () => {
            const boardElement = document.getElementById('board');
            const statusElement = document.querySelector('.status');
            const resetButton = document.getElementById('resetBtn');
            const difficultySelect = document.getElementById('difficulty');
            
            let board = ['', '', '', '', '', '', '', '', ''];
            let currentPlayer = 'X'; // Human is X, AI is O
            let gameActive = true;
            let winningCells = [];
            
            // Initialize the board
            function initializeBoard() {
                boardElement.innerHTML = '';
                for (let i = 0; i < 9; i++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.index = i;
                    cell.addEventListener('click', handleCellClick);
                    boardElement.appendChild(cell);
                }
            }
            
            // Handle cell click
            function handleCellClick(e) {
                const index = parseInt(e.target.dataset.index);
                
                if (board[index] !== '' || !gameActive || currentPlayer !== 'X') {
                    return;
                }
                
                makeMove(index, 'X');
                
                if (gameActive) {
                    currentPlayer = 'O';
                    statusElement.textContent = "AI is thinking...";
                    
                    // Add slight delay for AI move to feel more natural
                    setTimeout(() => {
                        makeAIMove();
                    }, 500);
                }
            }
            
            // Make a move
            function makeMove(index, player) {
                board[index] = player;
                const cell = boardElement.children[index];
                cell.textContent = player;
                cell.classList.add(player.toLowerCase());
                
                checkGameResult();
            }
            
            // AI makes a move
            function makeAIMove() {
                const difficulty = difficultySelect.value;
                let move;
                
                if (difficulty === 'easy') {
                    move = getRandomMove();
                } else if (difficulty === 'medium') {
                    // 50% chance to make optimal move or random move
                    move = Math.random() > 0.5 ? findBestMove() : getRandomMove();
                } else {
                    // Hard - always optimal
                    move = findBestMove();
                }
                
                if (move !== null) {
                    makeMove(move, 'O');
                    currentPlayer = 'X';
                    statusElement.textContent = "Your turn (X)";
                }
            }
            
            // Get a random valid move
            function getRandomMove() {
                const availableMoves = board
                    .map((cell, index) => cell === '' ? index : null)
                    .filter(val => val !== null);
                
                return availableMoves.length > 0 
                    ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
                    : null;
            }
            
            // Find the best move using minimax algorithm
            function findBestMove() {
                let bestScore = -Infinity;
                let bestMove = null;
                
                for (let i = 0; i < 9; i++) {
                    if (board[i] === '') {
                        board[i] = 'O';
                        const score = minimax(board, 0, false);
                        board[i] = '';
                        
                        if (score > bestScore) {
                            bestScore = score;
                            bestMove = i;
                        }
                    }
                }
                
                return bestMove;
            }
            
            // Minimax algorithm
            function minimax(board, depth, isMaximizing) {
                const result = checkWinner();
                
                if (result !== null) {
                    if (result === 'X') return -10 + depth;
                    if (result === 'O') return 10 - depth;
                    return 0;
                }
                
                if (isMaximizing) {
                    let bestScore = -Infinity;
                    for (let i = 0; i < 9; i++) {
                        if (board[i] === '') {
                            board[i] = 'O';
                            const score = minimax(board, depth + 1, false);
                            board[i] = '';
                            bestScore = Math.max(score, bestScore);
                        }
                    }
                    return bestScore;
                } else {
                    let bestScore = Infinity;
                    for (let i = 0; i < 9; i++) {
                        if (board[i] === '') {
                            board[i] = 'X';
                            const score = minimax(board, depth + 1, true);
                            board[i] = '';
                            bestScore = Math.min(score, bestScore);
                        }
                    }
                    return bestScore;
                }
            }
            
            // Check for winner or draw
            function checkWinner() {
                const winPatterns = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                    [0, 4, 8], [2, 4, 6]             // diagonals
                ];
                
                for (const pattern of winPatterns) {
                    const [a, b, c] = pattern;
                    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                        winningCells = pattern;
                        return board[a];
                    }
                }
                
                if (!board.includes('')) {
                    return 'Draw';
                }
                
                return null;
            }
            
            // Check game result and update UI
            function checkGameResult() {
                const result = checkWinner();
                
                if (result) {
                    gameActive = false;
                    
                    if (result === 'Draw') {
                        statusElement.textContent = "Game ended in a draw!";
                    } else {
                        statusElement.textContent = `${result === 'X' ? 'You win!' : 'AI wins!'}`;
                        highlightWinningCells();
                    }
                }
            }
            
            // Highlight winning cells
            function highlightWinningCells() {
                winningCells.forEach(index => {
                    boardElement.children[index].classList.add('winning');
                });
            }
            
            // Reset the game
            function resetGame() {
                board = ['', '', '', '', '', '', '', '', ''];
                currentPlayer = 'X';
                gameActive = true;
                winningCells = [];
                
                statusElement.textContent = "Your turn (X)";
                initializeBoard();
            }
            
            // Event listeners
            resetButton.addEventListener('click', resetGame);
            
            // Initialize the game
            resetGame();
        });