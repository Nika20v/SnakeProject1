class SnakeGame {
    constructor() {
        this.boardSize = 10;
        this.board = [];
        this.snake = [];
        this.apple = { x: 0, y: 0 };
        this.direction = 'right';
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore') || 0;

        this.gameBoardElement = document.querySelector('.game-board');
        this.scoreElement = document.querySelector('.score');
        this.bestScoreElement = document.querySelector('.best-score');
        this.restartButton = document.querySelector('.restart-button');

        this.init();
    }

    init() {
        this.createBoard();
        this.createSnake();
        this.generateApple();
        this.render();
        this.startGame();
        this.restartButton.addEventListener('click', () => this.restart());
    }

    createBoard() {
        for (let y = 0; y < this.boardSize; y++) {
            for (let x = 0; x < this.boardSize; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;
                this.gameBoardElement.appendChild(cell);
                this.board.push(cell);
            }
        }
    }

    createSnake() {
        const startX = Math.floor(this.boardSize / 2);
        const startY = startX;

        for (let i = 0; i < 2; i++) {
            const x = startX - i;
            const y = startY;
            const cell = this.getCell(x, y);
            cell.classList.add('snake');
            this.snake.push(cell);
        }
    }

    generateApple() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.boardSize);
            y = Math.floor(Math.random() * this.boardSize);
        } while (this.isSnakeCell(x, y));

        this.apple.x = x;
        this.apple.y = y;
    }

    isSnakeCell(x, y) {
        return this.snake.some(cell => {
            const cellX = parseInt(cell.dataset.x);
            const cellY = parseInt(cell.dataset.y);
            return cellX === x && cellY === y;
        });
    }

    getCell(x, y) {
        return this.board.find(cell => {
            const cellX = parseInt(cell.dataset.x);
            const cellY = parseInt(cell.dataset.y);
            return cellX === x && cellY === y;
        });
    }

    moveSnake() {
        const head = this.snake[0];
        const headX = parseInt(head.dataset.x);
        const headY = parseInt(head.dataset.y);

        let newHeadX = headX;
        let newHeadY = headY;

        if (this.direction === 'up') {
            newHeadY--;
            if (newHeadY < 0) newHeadY = this.boardSize - 1;
        } else if (this.direction === 'down') {
            newHeadY++;
            if (newHeadY >= this.boardSize) newHeadY = 0;
        } else if (this.direction === 'left') {
            newHeadX--;
            if (newHeadX < 0) newHeadX = this.boardSize - 1;
        } else if (this.direction === 'right') {
            newHeadX++;
            if (newHeadX >= this.boardSize) newHeadX = 0;
        }

        const newHead = this.getCell(newHeadX, newHeadY);

        if (this.isSnakeCell(newHeadX, newHeadY)) {
            this.endGame();
            return;
        }

        this.snake.unshift(newHead);

        if (newHeadX === this.apple.x && newHeadY === this.apple.y) {
            newHead.classList.remove('apple');
            this.score++;
            this.scoreElement.textContent = `Score: ${this.score}`;
            this.generateApple();
        } else {
            const tail = this.snake.pop();
            tail.classList.remove('snake');
        }

        newHead.classList.add('snake');
    }

    changeDirection(direction) {
        if (
            (direction === 'up' && this.direction !== 'down') ||
            (direction === 'down' && this.direction !== 'up') ||
            (direction === 'left' && this.direction !== 'right') ||
            (direction === 'right' && this.direction !== 'left')
        ) {
            this.direction = direction;
        }
    }

    render() {
        this.board.forEach(cell => cell.className = 'cell');

        this.snake.forEach(cell => cell.classList.add('snake'));

        const appleCell = this.getCell(this.apple.x, this.apple.y);
        appleCell.classList.add('apple');

        this.bestScoreElement.textContent = `Best Score: ${this.bestScore}`;
    }

    startGame() {
        this.intervalId = setInterval(() => {
            this.moveSnake();
            this.render();
        }, 500);

        window.addEventListener('keydown', event => {
            if (event.key === 'ArrowUp') this.changeDirection('up');
            else if (event.key === 'ArrowDown') this.changeDirection('down');
            else if (event.key === 'ArrowLeft') this.changeDirection('left');
            else if (event.key === 'ArrowRight') this.changeDirection('right');
        });
    }

    endGame() {
        clearInterval(this.intervalId);
        this.restartButton.style.display = 'block';

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
    }

    restart() {
        this.snake.forEach(cell => cell.classList.remove('snake'));
        this.snake = [];
        this.direction = 'right';
        this.score = 0;
        this.scoreElement.textContent = `Score: ${this.score}`;
        this.restartButton.style.display = 'none';
        this.createSnake();
        this.generateApple();
        this.render();
        this.startGame();
    }
}

new SnakeGame();
