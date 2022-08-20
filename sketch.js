var cells = [];
var prevCells = [];
var cellLog = [];
var currentCells = 0;

const size = [400, 400];

const cellSize = 20;
const grid = [Math.floor(size[0] / cellSize), Math.floor(size[1] / cellSize)]

const spawnChance = 2; //Spawn chance of cell at a given place is 1 in <spawnChance>. By default, it is 1 in 2 (50%).

function setup() {
    createCanvas(size[0], size[1]);
    
    cells.length = grid[0];
    for (var i = 0; i < cells.length; i++){
        cells[i] = [];
        cells[i].length = grid[1];
    }

    for (var i = 0; i < grid[0]; i++){
        for (var j = 0; j < grid[1]; j++){
            var active = Math.round(random(0, (spawnChance - 1)));

            cells[i][j] = (active == 1);
        }
    }
    cellLog.push(cells);
}

function updateCells(){
    //copy cells to log so we can go back later
    prevCells = [];
    for (var i = 0; i < cells.length; i++){
        prevCells[i] = cells[i].slice();
    }
    cellLog.push(prevCells);
    currentCells++;

    //Update each cell's status according to the three rules
    for (var i = 0; i < grid[0]; i++){
        for (var j = 0; j < grid[1]; j++){
            //check for neighbors
            var neighbors = 0;
            for (var k = (i == 0) ? 0 : -1; k <= 1; k++) {
                
                for (var l = (j == 0) ? 0 : -1; l <= 1; l++){
                    
                    //skip the cell we're on
                    if (k == 0 && l == 0) {
                        
                        
                    }
                    //check each adjacent cell for live cells
                    else if ((i + k < grid[0]) && (j + l < grid[1]) && cells[i + k][j + l]) {
                        neighbors++;
                        
                    }
                    else{
                        //console.log(j);
                        //console.log(l);
                    }

                    

                }
            }
            
            if (cells[i][j]){
                //Rule 1: Any live cell with two or three live neighbors survives.
                if (neighbors == 2 || neighbors == 3) {
                    cells[i][j] = true;
                }
                //Rule 3 (technically out of order but to do it in order would cause redundant ifs): All other live cells die.
                else {
                    cells[i][j] = false;
                }
            }
            else {
                //Rule 2: Any dead cell with 3 live neighbors becomes a live cell.
                if (neighbors == 3) {
                    cells[i][j] = true;
                }
            }
        }
    }
}

function mouseClicked(event){
    updateCells();
    
}

function keyPressed(){
    //console.log(keyCode)
    if (currentCells > 0 && keyCode === LEFT_ARROW) {
        currentCells--;
        console.log(currentCells);
        for (var i = 0; i < cellLog[currentCells].length; i++){
            cells[i] = cellLog[currentCells][i].slice();
        }
        //console.table(cells);
    }
    if (keyCode === RIGHT_ARROW) {
        updateCells();
        
        console.log(currentCells);
    }
}

function draw() {
    background(0);
    
    fill(255, 204, 0);
    for (var i = 0; i < grid[0]; i++){
        for (var j = 0; j < grid[1]; j++){
            //draw currently active cells
            if (cells[i][j]) {
                rect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
}