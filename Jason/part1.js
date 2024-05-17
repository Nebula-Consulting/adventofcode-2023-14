const fs = require("fs");
let input = fs.readFileSync("./data.txt").toString('utf-8');

const rows = input.split('\n').map(row => row.split(''));

function rotate(rows, direction) {
    const numRows = rows.length;
    const numCols = rows[0].length;

    const rotatedGrid = [];
    for (let i = 0; i < numCols; i++) {
        let newRow = [];
        for (let j = 0; j < numRows; j++) {
            newRow.push('.');
        }
        rotatedGrid.push(newRow);
    }

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (direction === 'right') {
                rotatedGrid[j][numRows - 1 - i] = rows[i][j];
            } else if (direction === 'left') {
                rotatedGrid[numCols - 1 - j][i] = rows[i][j];
            }
        }
    }

    return rotatedGrid;
}

function tilt(grid) {
    for (const row of grid) {
        for (let i = row.length - 1; i >= 0; i--) {
            if (row[i] === 'O') {
                let j = i + 1;
                while (j < row.length && row[j] === '.') {
                    row[j] = 'O';
                    row[j - 1] = '.';
                    j++;
                }
            }
        }
    }

    return grid;
}

function calculateLoad(grid) {
    let totalLoad = 0

    for (let i = 0; i < grid.length; i++) {
        let numberOfRocks = grid[i].filter(cell => cell === 'O').length;
        totalLoad += numberOfRocks * (grid.length - i)
    }

    return totalLoad;
}

function execute() {
    const rotatedRight = rotate(rows, 'right');
    const titled = tilt(rotatedRight);
    const originalRotation = rotate(titled, 'left');
    console.log(calculateLoad(originalRotation));
}

execute();