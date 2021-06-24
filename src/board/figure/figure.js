export default class Figure {
    constructor(node) {
        this.node = node;
    }
    render(x, y, figureBlack) {
        let img = document.createElement('img');
        img.classList.add('figure');
        if (figureBlack) {
            img.src = 'images/black-checker.png';
            img.dataset.color = 'black';
        } else {
            img.src = 'images/white-checker.png';
            img.dataset.color = 'white';
            img.classList.add('figure_grabbable')
        }
        img.dataset.positionX = x;
        img.dataset.positionY = y;
        let spawnTo = document.querySelector(`.desc tr[data-row="${x}"] > td[data-cell="${y}"]`);
        img.id = x + y;
        spawnTo.appendChild(img);
        
        // img.addEventListener("mousedown", (event) => {
        //     if (event.target.hasAttribute("draggable")) {
        //         event.target.addEventListener("dragstart", dragStart);
        //     }
        // })
        img.addEventListener('dragstart', dragStart, false);
        img.addEventListener('draggable', imgDrop, false);

        let td = document.querySelectorAll('.desc__cell');

        for (let t of td) {
            t.addEventListener('dragover', dragOver, false);
            t.addEventListener('dragleave', dragLeave, false);
            t.addEventListener('drop', dragDrop, false);
        }
    }
}

function dragStart(ev) {
    ev.preventDefault();
    let color = this.dataset.color;
    let isWhiteTurn = game.getIsWhiteTurn();
    if (color === 'white' && isWhiteTurn === true || color === 'black' && isWhiteTurn === false) {
        this.style.opacity = '0.4';
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData("text/plain", ev.target.getAttribute('id'));
        return true;
    } else {
        return false;
    }

}

function dragOver(ev) {
    ev.preventDefault();
    if (ev.target.tagName === 'TD') {

        if (!ev.target.querySelector('img')) {
            ev.target.classList.add('hovered');
            ev.preventDefault();
        }

    }
}

function dragLeave(ev) {
    ev.preventDefault();
    if (ev.target.tagName === 'TD') {
        ev.target.classList.remove('hovered');
    }
}


function dragDrop(ev) {
    ev.preventDefault();
    if (this.childElementCount !== 1) {
        let data = ev.dataTransfer.getData("text");
        let figure = document.getElementById(data);
        // console.log(figure)
        let targetX = this.parentNode.dataset.row;
        let targetY = this.dataset.cell;
        let currentX = figure.dataset.positionX;
        let currentY = figure.dataset.positionY;

        if (window.game.isValidMove(currentX, currentY, targetX, targetY)) {
            ev.target.appendChild(figure);
            window.game.turn();
            figure.dataset.positionX = targetX;
            figure.dataset.positionY = targetY;
        }
    }
    ev.target.classList.remove('hovered');
    ev.stopPropagation();
    return false;
}

function imgDrop(ev) {
    this.style.opacity = '1';
}
