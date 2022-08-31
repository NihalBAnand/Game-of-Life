var cells = [];

const size = [window.innerWidth - window.innerWidth / 40, window.innerHeight - window.innerHeight / 40];

const cellSize = Math.floor(size[0] / 40);
const grid = [Math.floor(size[0] / cellSize), Math.floor(size[1] / cellSize)]

const spawnChance = 2; //Spawn chance of cell at a given place is 1 in <spawnChance>. By default, it is 1 in 2 (50%).

var running = false;
var interval = 0.5; //time between frames while running automatically in seconds

var viewRules = true;

function autoRun(){
    if (running) {
        updateCells();
    }
}

function setup() {
    createCanvas(size[0], size[1]);
    
    cells.length = grid[0];
    for (var i = 0; i < cells.length; i++){
        cells[i] = [];
        cells[i].length = grid[1];
    }

    for (var i = 0; i < grid[0]; i++){
        for (var j = 0; j < grid[1]; j++){
            cells[i][j] = {
                active: false,
                neighbors: 0
            };
        }
    }
}

function updateCells(){
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
                    else if ((i + k < grid[0]) && (j + l < grid[1]) && cells[i + k][j + l].active) {
                        neighbors++;
                        
                    }
                    else{
                        //console.log("DEATH! NEIGHBORS: " + neighbors);
                    }
                    
                    

                }
            }
            cells[i][j].neighbors = neighbors;
            
        }
    }
    for (var i = 0; i < grid[0]; i++){
        for (var j = 0; j < grid[1]; j++){
            if (cells[i][j].active){
                //Rule 1: Any live cell with two or three live neighbors survives.
                if (cells[i][j].neighbors == 2 || cells[i][j].neighbors == 3) {
                    cells[i][j].active = true;
                }
                //Rule 3 (technically out of order but to do it in order would cause redundant ifs): All other live cells die.
                else {
                    cells[i][j].active = false;
                    //console.log("DEATH! NEIGHBORS: " + cells[i][j].neighbors + " At cell " + i + ", " + j);
                }
            }
            else {
                //Rule 2: Any dead cell with 3 live neighbors becomes a live cell.
                if (cells[i][j].neighbors == 3) {
                    cells[i][j].active = true;
                }
            }
        }
    }
}

function mouseClicked(event){
    var cellToggled = [Math.floor(mouseX / cellSize), Math.floor(mouseY / cellSize)];

    //console.log(!cells[cellToggled[0]][cellToggled[1]].active);
    cells[cellToggled[0]][cellToggled[1]].active = !cells[cellToggled[0]][cellToggled[1]].active;
}

function keyPressed(){
    if (keyCode === RIGHT_ARROW || keyCode === 32) { //Step one "generation" with right arrow or space bar
        updateCells();
    }

    if (keyCode === RETURN) { //Randomize the grid with "RETURN" and watch the chaos, or edit it yourself
        for (var i = 0; i < grid[0]; i++){
            for (var j = 0; j < grid[1]; j++){
                var active = Math.round(random(0, (spawnChance - 1)));
    
                cells[i][j].active = (active == 1);
            }
        }
    }

    //Log number of neighbors to console
    if (keyCode === 78) { //The letter 'N' for 'Neighbors'
        var cellToggled = [Math.floor(mouseX / cellSize), Math.floor(mouseY / cellSize)];
        //check for neighbors
        cells[cellToggled[0]][cellToggled[1]].neighbors = 0;
        for (var k = (cellToggled[0] == 0) ? 0 : -1; k <= 1; k++) {
            
            for (var l = (cellToggled[1] == 0) ? 0 : -1; l <= 1; l++){
                
                //skip the cell we're on
                if (k == 0 && l == 0) {
                    
                    
                }
                //check each adjacent cell for live cells
                else if ((cellToggled[0] + k < grid[0]) && (cellToggled[1] + l < grid[1]) && cells[cellToggled[0] + k][cellToggled[1] + l].active) {
                    cells[cellToggled[0]][cellToggled[1]].neighbors++;
                    
                }
                else{
                    //console.log(j);
                    //console.log(l);
                }
                
                

            }
        }
        console.log(cells[cellToggled[0]][cellToggled[1]].neighbors);
    }

    //Deal with auto run
    if (keyCode === 82) { //The letter 'R' for 'Run'
        running = !running;
    }
    if (keyCode === UP_ARROW) { //Press the up arrow to speed up the auto run
        interval -= .05;
        console.log(interval);
    }
    if (keyCode === DOWN_ARROW) { //Press the up arrow to slow down the auto run
        interval += .05;
        console.log(interval);
    }

    //Toggle viewing rules
    if (keyCode === ESCAPE) {
        viewRules = !viewRules;
    }
}

function draw() {
    //draw black background
    background(0);
    
    //draw grid
    smooth();
    stroke(200, 200, 200) //light grey
    strokeWeight(.1);
    noFill(); // make it an empty box
    for (var i = 0; i < grid[0]; i++){
        for (var j = 0; j < grid[1]; j++){
            rect(i * cellSize, j * cellSize, cellSize, cellSize);
            
        }
    }

    //draw grid content
    stroke(0); //reset stroke color to black
    strokeWeight(1);
    fill(255, 204, 0); //yellow
    for (var i = 0; i < grid[0]; i++){
        for (var j = 0; j < grid[1]; j++){
            //draw currently active cells
            if (cells[i][j].active) {
                rect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }

    //draw numbers for cell identification
    textSize(cellSize / 3);
    fill(255, 255, 255); //white
    noSmooth();
    for (var i = 0; i < grid[0]; i++) {
        text(i + 1, cellSize * i + cellSize / 3, cellSize / 3);
    }
    for (var i = 1; i < grid[1]; i++) {
        text(i + 1, cellSize / 3, cellSize * i + cellSize / 2);
    }

    //Draw rules text if requested
    if (viewRules) {
        textSize(16);
        textAlign(CENTER, CENTER);
        fill(255, 255, 255);
        noSmooth();
        var rules = `
        Welcome to Conway's Game of Life! This cellular automata was originally developed by John Conway in 1970.\n
        The "Game" takes place over several generations, with the following rules being applied with each generation.\n
        Rule 1: Any live cell with fewer than two live neighbours dies, as if by underpopulation.\n
        Rule 2: Any live cell with two or three live neighbours lives on to the next generation.\n
        Rule 3: Any live cell with more than three live neighbours dies, as if by overpopulation.\n
        Rule 4: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.\n
        Click on a cell to toggle whether or not it is alive, and press 'R' to auto-run your setup.\n
        You can use to UP and DOWN ARROW KEYS to speed up / slow down the simulation as it runs.\n
        Alternatively, you can use SPACE or the LEFT ARROW KEY to move forward one generation.\n
        Press RETURN to generate a random grid and watch the simulation play out.\n
        See what interesting patterns you can make!\n
        Press ESCAPE to hide or view these rules.`;
        text(rules, width / 2, height / 2);
    }

    //run the auto function once every <interval> seconds
    if (Math.floor(frameCount % (interval * 30)) == 0) {
        
        autoRun();
    }
}