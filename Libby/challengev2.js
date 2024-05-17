#!/usr/bin/env node
const fs = require("fs");
const numberOfCycles= 1000000000;

let dataFromFile = fs.readFileSync("./realData.txt").toString('utf-8');
let arrayOfDataFromFile = dataFromFile.split("\n");
let arrayOfArraysFromFile = [];
arrayOfDataFromFile.forEach(row => {
    arrayOfArraysFromFile.push(row.split(''));
});

const rowSize = arrayOfArraysFromFile[0].length;
const colSize = arrayOfArraysFromFile.length;

let finalArray = completeCycles(numberOfCycles);
console.log(calculateLoad(finalArray));

function completeCycles(numberOfCycles) {

    if( numberOfCycles === 0) {
        return tipPlatformNorth(arrayOfArraysFromFile);
    }

    let currentArray = arrayOfArraysFromFile;
    let cycleCounter = 0;
    do {
        currentArray = tipPlatformNorth(currentArray);
        /*currentArray = tipPlatformWest(currentArray);
        currentArray = tipPlatformSouth(currentArray);
        currentArray = tipPlatformEast(currentArray);*/
        cycleCounter++;
    }while ( cycleCounter < numberOfCycles );

    return currentArray;
}

function tipPlatformNorth(arrayToTip) {

    for(let i = 1; i < colSize; i++) {
        for(let j = 0; j < rowSize; j++) {
            checkCharAboveAndSwap(arrayToTip, i, j);
        }
    }

    return tipPlatformWest(arrayToTip);
}

function checkCharAboveAndSwap(arrayToTip, rowNum, colNum) {
    if (rowNum === 0) {
        return;
    }

    let currentChar = arrayToTip[rowNum][colNum];
    let charAbove = arrayToTip[rowNum - 1][colNum];

    if (currentChar === 'O' && charAbove === '.') {
        arrayToTip[rowNum - 1][colNum] = 'O';
        arrayToTip[rowNum][colNum] = '.';

        checkCharAboveAndSwap(arrayToTip, rowNum - 1, colNum);
    }
}

function tipPlatformWest(arrayToTip) {
    arrayToTip.forEach( row => {
        for(let i = 1; i < rowSize; i++) {
            checkPrevCharAndSwap(row, i);
        }
    });

    return tipPlatformSouth(arrayToTip);
}

function checkPrevCharAndSwap(row, i) {
    if (i === 0) {
        return;
    }

    let currentChar = row[i];
    let prevChar = row[i - 1];

    if (currentChar === 'O' && prevChar === '.') {
        row[i - 1] = currentChar;
        row[i] = prevChar;

        checkPrevCharAndSwap(row, i - 1);
    }
}

function tipPlatformSouth(arrayToTip) {

    for(let i = colSize - 2; i >= 0; i--) {
        for(let j = 0; j < rowSize; j++) {
            checkCharBelowAndSwap(arrayToTip, i, j);
        }
    }

    return tipPlatformEast(arrayToTip);
}

function checkCharBelowAndSwap(arrayToTip, rowNum, colNum) {
    if (rowNum === colSize - 1) {
        return;
    }

    let currentChar = arrayToTip[rowNum][colNum];
    let charBelow = arrayToTip[rowNum + 1][colNum];

    if (currentChar === 'O' && charBelow === '.') {
        arrayToTip[rowNum + 1][colNum] = 'O';
        arrayToTip[rowNum][colNum] = '.';

        checkCharBelowAndSwap(arrayToTip, rowNum + 1, colNum);
    }
}

function tipPlatformEast(arrayToTip) {

    arrayToTip.forEach( row => {
        for(let i = rowSize - 2; i >= 0; i--) {
            checkNextCharAndSwap(row, i);
        }
    });

    return arrayToTip;
}

function checkNextCharAndSwap(row, i) {
    if (i === rowSize - 1) {
        return;
    }

    let currentChar = row[i];
    let nextChar = row[i + 1];

    if (currentChar === 'O' && nextChar === '.') {
        row[i + 1] = currentChar;
        row[i] = nextChar;

        checkNextCharAndSwap(row, i + 1);
    }
}

function calculateLoad(arrayToCalculate) {
    let weightCounter = 0;

    for(let i = 0; i < rowSize; i++) {
        arrayToCalculate[i].forEach(char => {
            if(char === 'O') {
                weightCounter += (rowSize - i);
            }
        })
    }
    return weightCounter;
}


