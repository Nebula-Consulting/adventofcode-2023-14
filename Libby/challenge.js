#!/usr/bin/env node
const fs = require("fs");

let dataFromFile = fs.readFileSync("./realData.txt").toString('utf-8');
let arrayOfDataFromFile = dataFromFile.split("\n");

let finalArray = transformAndTip(arrayOfDataFromFile);
console.log(calculateLoad(finalArray));

function transformAndTip(arrayToProcess) {
    let transformedArray = transformArray90AntiClockwise(arrayToProcess);
    return tipPlatform(transformedArray);
}


function transformArray90AntiClockwise(arrayOfDataFromFile) {
    let turnedArray = [];

    for (let i = 0; i < arrayOfDataFromFile[0].length; i++) {
        let newRow = [];
        arrayOfDataFromFile.forEach(row => {
            newRow.push(row.charAt(i));
        });
        turnedArray.unshift(newRow);
    }
    return turnedArray;
}

function tipPlatform(transformedArray) {
    transformedArray.forEach( row => {
        for(let i = 1; i < row.length; i++) {
            checkPrevCharAndSwap(row, i);
        }
    });

    return transformedArray;
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

function calculateLoad(arrayToCalculate) {
    let rowSize = arrayToCalculate.length;
    let weightCounter = 0;

    arrayToCalculate.forEach(row => {
        for (let i = 0; i < row.length; i++) {
            if(row[i] === 'O') {
                weightCounter += (rowSize - i);
            }
        }
    });

    return weightCounter;
}


