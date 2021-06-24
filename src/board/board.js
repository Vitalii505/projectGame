export default class Board {

    constructor(node) {
        this.node = node;
        this.render();
    };

    render() {
        let table = this.renderTable();
        this.node.appendChild(table);
    };

    renderTable() {
        let cells = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        let rows = [8, 7, 6, 5, 4, 3, 2, 1];
        let table = document.createElement('table');
        table.className = 'desc';
        let even = true;

        let activateEven = () => {
            even ? even = false : even = true;
        }

        for (let r of rows) {
            let tr = document.createElement('tr');
            tr.dataset.row = r;
            for (let c of cells) {
                let td = document.createElement('td');
                td.classList.add('desc__cell');
                td.dataset.cell = c;
                even ? td.classList.add('white-field') : td.classList.add('black-field');
                if (r === 1) {
                    let lettersSpan = document.createElement('span');
                    lettersSpan.innerText = c;
                    lettersSpan.className = 'index index-bottom';
                    td.appendChild(lettersSpan);
                };
                if (c === 'a') {
                    let numbersSpan = document.createElement('span');
                    numbersSpan.innerText = r;
                    numbersSpan.className = 'index index-left';
                    td.appendChild(numbersSpan);
                };
                tr.appendChild(td);
                activateEven();
            };
            activateEven();
            table.appendChild(tr);
        };
        return table;
    };
}
