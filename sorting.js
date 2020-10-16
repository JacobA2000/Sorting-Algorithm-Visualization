
//GLOBAL VARIABLES
let arrayToSort = [];
let w = 10;
let states = [];
let playbackSpeed = 0;
let algorithmRunning = false;
let canvas = null;

//P5.js FUNCTIONS

/*
FUNCTION:       SETUP
PARAMETERS:     NONE

DESCRIPTION:    SETS UP THE CANVAS, CREATES AN ARRAY FULL OF RANDOM NUMBERS WITH IT'S LENGTH
                BASED ON SCREEN WIDTH, AND SETS THE STATE OF EACH ITEM IN THE ARRAY.          
*/
function setup(){
    canvas = createCanvas(windowWidth - 200, windowHeight - 200);
    canvas.parent("p5-canvas");
    arrayToSort = new Array(floor(width/w));
    for(let i = 0; i < arrayToSort.length; i++){
        arrayToSort[i] = random(height)
        states[i] = -1;
    }
}

/*
FUNCTION:       DRAW
PARAMETERS:     NONE
DESCRIPTION:    DRAWS THE GRAPH       
*/
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

//SORTING FUNCTIONS

/*
FUNCTION:       SWAP
PARAMETERS:     arr: The array to swap, a: The first value for the swap, 
                b: The second value for the swap.

DESCRIPTION:    SETS UP THE CANVAS, CREATES AN ARRAY FULL OF RANDOM NUMBERS WITH IT'S LENGTH
                BASED ON SCREEN WIDTH, AND SETS THE STATE OF EACH ITEM IN THE ARRAY.          
*/
async function swap(arr, a, b){
    await sleep(playbackSpeed)

    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

/*
FUNCTION:       BUBBLESORT
PARAMETERS:     arrayToSort: The array we wish to sort.

DESCRIPTION:    PERFORMS THE BUBBLESORT ALGORITHM TO SORT THE ARRAY IN ASCENDING ORDER.        
*/
async function bubbleSort(arrayToSort){ 
    algorithmRunning = true;
    for (let i = 0; i < (arrayToSort.length - 1); i++){
        for(let j=0; j < (arrayToSort.length - i - 1); j++){
            states[j] = 0;
            states[j+1] = 1
            if(arrayToSort[j] > arrayToSort[j+1]){
                await swap(arrayToSort, j, j+1);
            }
            states[j] = -1;
            states[j+1] = -1 
        }
    }
    algorithmRunning = false;
}

/*
FUNCTION:       QUICKSORT
PARAMETERS:     arr: The array to swap, start: The start of the partition, 
                end: The end of the partition

DESCRIPTION:    PERFORMS THE QUICKSORT ALGORITHM TO SORT IN ASCENDING 
                ORDER USING LOMUTO PARTITIONING 
*/
async function quickSort(arr, start, end){
    algorithmRunning = true;
    if(start >= end){
        return;
    }

    let index = await partition(arr, start, end);
    states[index] = -1;

    await Promise.all([quickSort(arr, start, index-1), quickSort(arr, index+1, end)]);
    algorithmRunning = false;
}

/*
FUNCTION:       PARTITION
PARAMETERS:     arr: The array to swap, start: The start of the partition, 
                end: The end of the partition

DESCRIPTION:    PARTITION FUNCTION USING LOMUTO PARTIONING TO SORT EACH PARTITION OF THE ARRAY
*/
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

/*
FUNCTION:       INSERTIONSORT
PARAMETERS:     arr: The array to sort. 

DESCRIPTION:    PERFORMS THE INSERTION SORT ALGORITHM TO SORT THE ARRAY IN ASCENDING ORDER
*/
async function insertionSort(arr){
    algorithmRunning = true;
    for(let i = 1; i < arr.length; i++){
        let current = arr[i];
        let j = i-1;

        while((j > -1) && (current < arr[j])){
            states[j] = 0
            states[j-1] = 1
            await sleep(playbackSpeed);
            arr[j+1] = arr[j];
            states[j] = -1
            states[j-1] = -1
            j--;
        }
        arr[j+1] = current
    }
    algorithmRunning = false;
}


/*
FUNCTION:       SELECTIONSORT
PARAMETERS:     arr: The array to sort. 

DESCRIPTION:    PERFORMS THE SELECTION SORT ALGORITHM TO SORT THE ARRAY IN ASCENDING ORDER
*/
async function selectionSort(arr){
    algorithmRunning = true;
    for(let i=0; i < arr.length; i++){
        let min = i;

        for(let j = i + 1; j < arr.length; j++){
            if(arr[min] > arr[j]){
                min = j;  
            }
        }

        states[i] = 1;
        states[min] = 0;

        if(min !== i){
            await swap(arr, i, min);
        }

        states[min] = -1;
        states[i] = -1;
    }
    algorithmRunning = false;
}

//HELPER FUNCTIONS

/*
FUNCTION:       RUN
PARAMETERS:     NONE

DESCRIPTION:    GETS THE SELECTED ALGORITHM AND SPEED, AND RUNS 
                THE SELECTED ALGORITHM AT THAT SPEED.       
*/
function run(){
    if(algorithmRunning == false){
        var algorithmSelectBox = document.getElementById("algorithm-selection");
        var selectedAlgorithm = parseInt(algorithmSelectBox.options[algorithmSelectBox.selectedIndex].value);

        var speedSelectBox = document.getElementById("speed-selection");
        var selectedSpeed = parseInt(speedSelectBox.options[speedSelectBox.selectedIndex].value);

        switch(selectedSpeed){
            case 0: playbackSpeed = 0; break;
            case 1: playbackSpeed = 5; break;
            case 2: playbackSpeed = 25; break;
            case 3: playbackSpeed = 50; break;
            case 4: playbackSpeed = 100; break;
            case 5: playbackSpeed = 200; break;
        }

        switch(selectedAlgorithm){
            case 0: bubbleSort(arrayToSort); break;
            case 1: quickSort(arrayToSort, 0, arrayToSort.length - 1); break;
            case 2: insertionSort(arrayToSort); break;
            case 3: selectionSort(arrayToSort); break;
        }
    }
    else{
        alert("Can't run more than one instance of an algorithm!")
    }
}

/*
FUNCTION:       RESET
PARAMETERS:     NONE
DESCRIPTION:    RESETS THE CANVAS BY REFRESHING THE PAGE     
*/
function reset(){
    location.reload();
}

/*
FUNCTION:       SLEEP
PARAMETERS:     ms: The time to sleep in milliseconds

DESCRIPTION:    SLEEPS EXECUTION WHEN CALLED
*/
function sleep(ms){
    if(playbackSpeed != 0){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

