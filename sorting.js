let arrayToSort = [];
let w = 10;
let states = [];
let playbackSpeed = 100

function setup(){
    createCanvas(windowWidth -200, windowHeight -200);
    arrayToSort = new Array(floor(width/w));
    for(let i = 0; i < arrayToSort.length; i++){
        arrayToSort[i] = random(height)
        states[i] = -1;
    }
}

function run(){
    var algorithmSelectBox = document.getElementById("algorithm-selection");
    var selectedAlgorithm = algorithmSelectBox.options[algorithmSelectBox.selectedIndex].value;

    var speedSelectBox = document.getElementById("speed-selection");
    var selectedSpeed = parseInt(speedSelectBox.options[speedSelectBox.selectedIndex].value);

    switch(selectedSpeed){
        case 0: playbackSpeed = 0; break;
        case 1: playbackSpeed = 25; break;
        case 2: playbackSpeed = 50; break;
        case 3: playbackSpeed = 100; break;
        case 4: playbackSpeed = 200; break;
    }

    if (selectedAlgorithm == "BUBBLE SORT"){
        bubbleSort(arrayToSort)
    }
    else if (selectedAlgorithm == "QUICK SORT"){
        quickSort(arrayToSort, 0, arrayToSort.length - 1)
    }
}

function draw(){
    background(0, 0, 0);

    for(let i = 0; i < arrayToSort.length; i++){
        noStroke();
        fill(255);
        if(states[i] == 0){
            fill(255, 0, 0);
        } else if (states[i] == 1){
            fill(0, 255, 0)
        } else{
            fill(255)
        }
        rect(i * w, height - arrayToSort[i], w, arrayToSort[i]);
    }
}

async function bubbleSort(arrayToSort){ 
    for (let i = 0; i < (arrayToSort.length - 1); i++){
        for(let j=0; j < (arrayToSort.length - i - 1); j++){
            states[j] = 0;
            if(arrayToSort[j] > arrayToSort[j+1]){
                await swap(arrayToSort, j, j+1);
            }
            states[j] = -1;
        }
    }   
    console.log(arrayToSort)
}

async function swap(arr, a, b){
    await sleep(playbackSpeed)

    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

async function quickSort(arr, start, end){
    if(start >= end){
        return;
    }

    let index = await partition(arr, start, end);
    states[index] = -1;

    await Promise.all([quickSort(arr, start, index-1), quickSort(arr, index+1, end)]);
}

//Lomuto Partitioning
async function partition(arr, start, end){
    for(let i = start; i < end; i++){
        states[i] = 1;
    }

    let pivotValue = arr[end];
    let pivotIndex = start;
    states[pivotIndex] = 0;
    for(let i = start; i < end; i++){
        if(arr[i] < pivotValue){
            await swap(arr, i, pivotIndex);
            states[pivotIndex] = -1;
            pivotIndex++;
            states[pivotIndex] = 0;
        }
    }

    await swap(arr, pivotIndex, end);

    for(let i = start; i < end; i++){
        if(i != pivotIndex)
        states[i] = -1;
    }

    return pivotIndex;
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}


