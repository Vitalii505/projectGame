import Board from './board/board.js';
import Game from './game/game.js';

window.addEventListener('DOMContentLoaded', () => {
    let js_board = document.querySelector('.js-desc');
    let board = new Board(js_board);
    let gameStartButton = document.querySelector('.new_game');
    gameStartButton.addEventListener('click', (ev) => {
        window.game = new Game();
    })
});

