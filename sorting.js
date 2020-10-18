
//GLOBAL VARIABLES
let arrayToSort = [];
let w = 10;
let states = [];
let playbackSpeed = 0;
let algorithmRunning = false;
let canvas = null;
let swaps = 0;
let timeToExecute = 0;
let totalDelay = 0;

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

    textSize(15);
    stroke(0, 0, 0)
    strokeWeight(2)
    textStyle(BOLD);
    text("Array Length: " + arrayToSort.length + "\nSwaps: " + swaps + "\nExecution Time: " + timeToExecute + "ms" + "\nTotal Delay: " + totalDelay + "ms", 20, 20);
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

    swaps++;
}

/*
FUNCTION:       BUBBLESORT
PARAMETERS:     arrayToSort: The array we wish to sort.

DESCRIPTION:    PERFORMS THE BUBBLESORT ALGORITHM TO SORT THE ARRAY IN ASCENDING ORDER.        
*/
async function bubbleSort(arrayToSort){ 
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
}

/*
FUNCTION:       QUICKSORT
PARAMETERS:     arr: The array to swap, start: The start of the partition, 
                end: The end of the partition

DESCRIPTION:    PERFORMS THE QUICKSORT ALGORITHM TO SORT IN ASCENDING 
                ORDER USING LOMUTO PARTITIONING 
*/
async function quickSort(arr, start, end){
    if(start >= end){
        return;
    }

    let index = await partition(arr, start, end);
    states[index] = -1;

    await Promise.all([quickSort(arr, start, index-1), quickSort(arr, index+1, end)]);

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
}

/*
FUNCTION:       INSERTIONSORT
PARAMETERS:     arr: The array to sort. 

DESCRIPTION:    PERFORMS THE INSERTION SORT ALGORITHM TO SORT THE ARRAY IN ASCENDING ORDER
*/
async function insertionSort(arr){
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
            swaps++;
        }
        arr[j+1] = current
    }
}


/*
FUNCTION:       SELECTIONSORT
PARAMETERS:     arr: The array to sort. 

DESCRIPTION:    PERFORMS THE SELECTION SORT ALGORITHM TO SORT THE ARRAY IN ASCENDING ORDER
*/
async function selectionSort(arr){
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
}

/*
FUNCTION:       MERGESORT
PARAMETERS:     arr: The array to sort, leftIndex: the leftmost item in the array, rightIndex: the rightmost item in the array. 

DESCRIPTION:    PERFORMS THE MERGE SORT ALGORITHM TO SORT THE ARRAY IN ASCENDING ORDER
*/
async function mergeSort(arr, leftIndex, rightIndex){
    length = rightIndex - leftIndex
    if (length < 2) {
        return arr;
    }
    var mid = leftIndex + Math.floor(length / 2);

    await mergeSort(arr, leftIndex, mid);
    await mergeSort(arr, mid, rightIndex);
    await merge(arr, leftIndex, mid, rightIndex);

    /*
    FUNCTION:       MERGES
    PARAMETERS:     arr: The array to sort, leftIndex: the leftmost item in the array, 
                    mid: the middle item in the array, rightIndex: the rightmost item in the array. 

    DESCRIPTION:    PERFORMS THE MERGE SORT ALGORITHM TO SORT THE ARRAY IN ASCENDING ORDER
    */
    async function merge(arr, leftIndex, mid, rightIndex) {
        var result = [];
        var l = leftIndex, r = mid;
        while (l < mid && r < rightIndex) {
            if (arr[l] < arr[r]) {
                states[l] = 0;
                await sleep(playbackSpeed);
                states[l] = -1;
                result.push(arr[l++]);
            } else {
                states[r] = 0;
                await sleep(playbackSpeed);
                states[r] = -1;
                result.push(arr[r++]);
            }
            swaps++;
        }

        result = result.concat(arr.slice(l, mid)).concat(arr.slice(r, rightIndex));
        for (let i = 0; i < rightIndex - leftIndex; i++) {
            states[leftIndex + i] = 1;
            await sleep(playbackSpeed);
            arr[leftIndex + i] = result[i]
            states[leftIndex + i] = -1;
        }
    }
}

//HELPER FUNCTIONS

/*
FUNCTION:       RUN
PARAMETERS:     NONE

DESCRIPTION:    GETS THE SELECTED ALGORITHM AND SPEED, AND RUNS 
                THE SELECTED ALGORITHM AT THAT SPEED.       
*/
async function run(){
    let algorithmStartTime = 0;
    let algorithmEndTime = 0;

    if(algorithmRunning == false){
        swaps = 0;
        totalDelay = 0;

        var algorithmSelectBox = document.getElementById("algorithm-selection");
        var selectedAlgorithm = parseInt(algorithmSelectBox.options[algorithmSelectBox.selectedIndex].value);

        var speedSelectBox = document.getElementById("speed-selection");
        var selectedSpeed = parseInt(speedSelectBox.options[speedSelectBox.selectedIndex].value);

        switch(selectedSpeed){
            case 0: playbackSpeed = 0; break;
            case 1: playbackSpeed = 1; break;
            case 2: playbackSpeed = 5; break;
            case 3: playbackSpeed = 25; break;
            case 4: playbackSpeed = 50; break;
            case 5: playbackSpeed = 100; break;
        }

        switch(selectedAlgorithm){
            case 0: algorithmStartTime = performance.now(); algorithmRunning = true; setSelectStatus(0); await bubbleSort(arrayToSort); setSelectStatus(1); algorithmRunning = false; algorithmEndTime = performance.now(); timeToExecute = (algorithmEndTime-algorithmStartTime); break;
            case 1: algorithmStartTime = performance.now(); algorithmRunning = true; setSelectStatus(0); await quickSort(arrayToSort, 0, arrayToSort.length - 1); setSelectStatus(1); algorithmRunning = false; algorithmEndTime = performance.now(); timeToExecute = (algorithmEndTime-algorithmStartTime); break;
            case 2: algorithmStartTime = performance.now(); algorithmRunning = true; setSelectStatus(0); await insertionSort(arrayToSort, 0, arrayToSort.length); setSelectStatus(1); algorithmRunning = false; algorithmEndTime = performance.now(); timeToExecute = (algorithmEndTime-algorithmStartTime); break;
            case 3: algorithmStartTime = performance.now(); algorithmRunning = true; setSelectStatus(0); await selectionSort(arrayToSort); setSelectStatus(1); algorithmRunning = false; algorithmEndTime = performance.now(); timeToExecute = (algorithmEndTime-algorithmStartTime); break;
            case 4: algorithmStartTime = performance.now(); algorithmRunning = true; setSelectStatus(0); await mergeSort(arrayToSort, 0, arrayToSort.length); setSelectStatus(1); algorithmRunning = false; algorithmRunning = false; algorithmEndTime = performance.now(); timeToExecute = (algorithmEndTime-algorithmStartTime); break;
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
        totalDelay += playbackSpeed;
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/*
FUNCTION:       SETSELECTSTATUS
PARAMETERS:     status: enabled/disaabled

DESCRIPTION:    ENABLES/DISABLES THE SELECTS
*/
function setSelectStatus(status){
    var algorithmSelectBox = document.getElementById("algorithm-selection");
    var speedSelectBox = document.getElementById("speed-selection");

    if(status == 1){ //ENABLED
        algorithmSelectBox.disabled = false;
        speedSelectBox.disabled = false;
    }
    else if(status == 0){ //DISABLED
        algorithmSelectBox.disabled = true;
        speedSelectBox.disabled = true;
    }
}
