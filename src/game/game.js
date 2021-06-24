import Figure from '../board/figure/figure.js';

const whiteChips = [
    [1, 'a'], [1, 'b'], [1, 'c'],
    [2, 'a'], [2, 'b'], [2, 'c'],
    [3, 'a'], [3, 'b'], [3, 'c'],
];

const blackChips = [
    [6, 'f'], [6, 'g'], [6, 'h'],
    [7, 'f'], [7, 'g'], [7, 'h'],
    [8, 'f'], [8, 'g'], [8, 'h'],
];


export default class Game {

    constructor() {
        this.turns = 0;
        this.isWhiteTurn = true;
        let figures = document.querySelectorAll('.figure');
        figures.forEach(figure => {
            figure.remove()
        });

        this.spawnFigures();
        this.updateStatusBar(`Cейчас ход: БЕЛИХ`);
    };

    isValidMove(currentX, currentY, targetX, targetY) {
        let availableMoves = this.calculatePossible_moves(currentX, currentY);
        if (availableMoves.indexOf(targetX + targetY) >= 0) {
            return true
        } else {
            this.updateStatusBar("Вы не можете двигаться таким образом!");
            return false
        };
    };

    calculatePossible_moves(currentX, currentY) {
        let figures = document.querySelectorAll('.figure');
        let availableMoves = [];
        let fieldWithFigure = [];
        let calculatedFields = [];
        
        function haveFigureOnField(x, y) {
            let result = false;
            for (let figure of figures) {
                if (figure.dataset.positionX === x && figure.dataset.positionY === y) {
                    result = figure;
                };
            };
            return result;
        };

        function getCoordianatesOfNearbyFields(x, y) {
            let left = getNextFieldYCoordinates(y, '-');
            let right = getNextFieldYCoordinates(y, '+');
            let top = getNextFieldXCoordinates(x, '+');
            let bottom = getNextFieldXCoordinates(x, '-');

            return [[x, left], [x, right], [top, y], [bottom, y]];
        };

        function getNextFieldYCoordinates(y, operation) {
            let result,
                charY = y.charCodeAt(0);
            if (operation === '-') {
                if (y !== 'a') result = String.fromCharCode(charY - 1)
            } else if (operation === '+') {
                if (y !== 'h') result = String.fromCharCode(charY + 1)
            }
            return result || y;
        };

        function getNextFieldXCoordinates(x, operation) {
            let result,
                xInt = parseInt(x);
            if (operation === '-') {
                if (x !== '1') result = (xInt - 1).toString()
            } else if (operation === '+') {
                if (x !== '8') result = (xInt + 1).toString()
            }
            return result || x;
        }

        (function startingNearbyCoordinates() {
            let nearbyCoordinates = getCoordianatesOfNearbyFields(currentX, currentY);
            for (let coord of nearbyCoordinates) {
                if (!haveFigureOnField(coord[0], coord[1])) {
                    availableMoves.push(coord[0] + coord[1])
                }
            }
        })();

        function canYouJumpHere(x, y) {
            calculatedFields.push(x + y);
            let nearbyCoordinates = getCoordianatesOfNearbyFields(x, y);
            for (let coord of nearbyCoordinates) {
                if (haveFigureOnField(coord[0], coord[1])) {
                    fieldWithFigure.push(coord);
                }
            }
            for (let coord of fieldWithFigure) {
                let newX, newY, busyField;
                let figureX = coord[0];
                let figureY = coord[1];
                if (x === figureX) {
                    if (y > figureY) {
                        newY = getNextFieldYCoordinates(figureY, '-')
                    } else {
                        newY = getNextFieldYCoordinates(figureY, '+')
                    };
                    
                    busyField = haveFigureOnField(figureX, newY);
                    if (!busyField) {
                        availableMoves.push(figureX + newY);
                        if (calculatedFields.indexOf(figureX + newY) < 0) {
                            canYouJumpHere(x, newY);
                        };

                    };
                } else if (y === figureY) {
                    if (x > figureX) {
                        newX = getNextFieldXCoordinates(figureX, '-')
                    } else {
                        newX = getNextFieldXCoordinates(figureX, '+')
                    }
                    busyField = haveFigureOnField(newX, figureY);
                    if (!busyField) {
                        availableMoves.push(newX + figureY);
                        if (calculatedFields.indexOf(newX + figureY) < 0) {
                            canYouJumpHere(newX, figureY);
                        };
                    };
                };
            };
        };

        canYouJumpHere(currentX, currentY);
        return availableMoves;
    }

    updateStatusBar(msg) {
        let turnButton = document.querySelector('.turn');
        turnButton.innerText = msg;
    }
    turn() {
        function removeDnDfromAll() {
            let figuresToRemoveDrag = document.querySelectorAll(`.figure`);
            figuresToRemoveDrag.forEach(figure => {
                figure.classList.remove('figure_grabbable');
            });
        }
        function makeSpecificFiguresOfColorDraggable(self) {
            if (self.isWhiteTurn === true) {
                self.isWhiteTurn = false;
                color = 'black';
            } else {
                self.isWhiteTurn = true;
                color = 'white';
            };
            let figures = document.querySelectorAll(`.figure[data-color="${color}"]`);
            for (let figure of figures) {
                figure.classList.add('figure_grabbable')
            };
        };

        this.turns += 1;
        let color;
        removeDnDfromAll();
        makeSpecificFiguresOfColorDraggable(this);

        this.updateStatusBar(`Cейчас ход: ${color}`);


    }

    getIsWhiteTurn() {
        return this.isWhiteTurn;
    };

    spawnFigures() {
        let figure = new Figure();
        for (let w of whiteChips) {
            figure.render(w[0], w[1], false);
        };
        for (let b of blackChips) {
            figure.render(b[0], b[1], true);
        };
    };
}
window.Game = Game;
