export default function display(maze, canvas) {
  let ctx = canvas.getContext("2d");


  if (typeof maze.colorScheme === "string") maze.colorScheme = maze.colorScheme.toLowerCase();
  if (typeof maze.coloringMode === "string") maze.coloringMode = maze.coloringMode.toLowerCase();
  if (typeof maze.displayMode === "string") maze.displayMode = maze.displayMode.toLowerCase();

  maze.strokeWeight = Math.min(maze.strokeWeight, 40);

  if (maze.displayMode === "thin walls") maze.displayMode = 0;
  if (maze.displayMode === "thick walls") maze.displayMode = 1;
  if (maze.displayMode === "line") maze.displayMode = 2;
  maze.displayMode = Number(maze.displayMode); //dat.gui stores 0 as a string so I need to convert it back to a number
  //ctx.push();

  //center the screen
  // ctx.translate(canvas.width / 2 - maze.xSize / 2 * maze.cellSize, canvas.height / 2 - maze.ySize / 2 * maze.cellSize);

  //clear the background
  ctx.fillStyle = maze.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (maze.displayMode === 0 || (maze.displayMode === 1 && maze.cellSize <= 3)) { //thin walls

    for (let y = 0; y < maze.ySize; y++) {
      for (let x = 0; x < maze.xSize; x++) {

        ctx.fillStyle = getCellColor({
          x,
          y
        });

        ctx.fillRect(x * maze.cellSize, y * maze.cellSize, maze.cellSize, maze.cellSize);
      }
    }

    ctx.strokeStyle = maze.wallColor;
    ctx.lineWidth = maze.strokeWeight;

    for (let y = 0; y < maze.ySize; y++) {
      for (let x = 0; x < maze.xSize; x++) {

        ctx.strokeStyle = maze.wallColor;


        if (maze.walls[y][x].W) {
          line(x * maze.cellSize, y * maze.cellSize, x * maze.cellSize, (y + 1) * maze.cellSize);
        }
        if (maze.walls[y][x].N) {
          line(x * maze.cellSize, y * maze.cellSize, (x + 1) * maze.cellSize, y * maze.cellSize);
        }
        if (maze.walls[y][x].E && x === maze.xSize - 1) {
          line((x + 1) * maze.cellSize, y * maze.cellSize, (x + 1) * maze.cellSize, (y + 1) * maze.cellSize);
        }
        if (maze.walls[y][x].S && y === maze.ySize - 1) {
          line(x * maze.cellSize, (y + 1) * maze.cellSize, (x + 1) * maze.cellSize, (y + 1) * maze.cellSize);
        }
      }
    }

  } else if (maze.displayMode === 1) { //thick walls

    let cellSize = maze.cellSize / 2;

    ctx.fillStyle = maze.wallColor;

    //ctx.push();
    ctx.translate(cellSize / 2, cellSize / 2);

    ctx.fillRect(-cellSize, -cellSize, cellSize * 2 * maze.xSize + cellSize, cellSize * 2 * maze.ySize + cellSize);
    ctx.fillStyle = maze.backgroundColor;

    for (let y = 0; y < maze.ySize; y++) {
      for (let x = 0; x < maze.xSize; x++) {

        ctx.fillStyle = getCellColor({
          x,
          y
        });

        ctx.fillRect(x * cellSize * 2, y * cellSize * 2, cellSize, cellSize);

        if (!maze.walls[y][x].W) {
          ctx.fillRect(x * cellSize * 2 - cellSize, y * cellSize * 2, cellSize, cellSize);
        }
        if (!maze.walls[y][x].N) {
          ctx.fillRect(x * cellSize * 2, y * cellSize * 2 - cellSize, cellSize, cellSize);
        }
        if (!maze.walls[y][x].E && x === maze.xSize - 1) {
          ctx.fillRect(x * cellSize * 2 + cellSize, y * cellSize * 2, cellSize, cellSize);
        }
        if (!maze.walls[y][x].S && y === maze.ySize - 1) {
          ctx.fillRect(x * cellSize * 2, y * cellSize * 2 + cellSize, cellSize, cellSize);
        }
      }
    }

    //ctx.pop();
    cellSize *= 2;
  } else { //display mode 2: line
    ctx.strokeStyle = maze.wallColor;
    ctx.lineWidth = maze.strokeWeight;

    //ctx.push();
    ctx.translate(maze.cellSize / 2, maze.cellSize / 2);

    for (let y = 0; y < maze.ySize; y++) {
      for (let x = 0; x < maze.xSize; x++) {


        if (!maze.walls[y][x].W) {
          line(x * maze.cellSize, y * maze.cellSize, (x - 0.5) * maze.cellSize, y * maze.cellSize);
        }
        if (!maze.walls[y][x].N) {
          line(x * maze.cellSize, y * maze.cellSize, x * maze.cellSize, (y - 0.5) * maze.cellSize);
        }
        if (!maze.walls[y][x].E) {
          line(x * maze.cellSize, y * maze.cellSize, (x + 0.5) * maze.cellSize, y * maze.cellSize);
        }
        if (!maze.walls[y][x].S) {
          line(x * maze.cellSize, y * maze.cellSize, x * maze.cellSize, (y + 0.5) * maze.cellSize);
        }
      }
    }

    //ctx.pop();
  }

  if (maze.showSolution) {
    ctx.strokeStyle = maze.solutionColor;
    ctx.lineWidth = maze.cellSize * 0.27
    if (ctx.lineWidth < 1) ctx.lineWidth = 1;
    if (ctx.lineWidth > 10) ctx.lineWidth = 10;
    //ctx.push();
    ctx.translate(maze.cellSize / 2, maze.cellSize / 2);
    for (let i = 0; i < maze.solution.length - 1; i++) {
      line(maze.solution[i].x * maze.cellSize, maze.solution[i].y * maze.cellSize, maze.solution[i + 1].x * maze.cellSize, maze.solution[i + 1].y * maze.cellSize);
    }
    //ctx.pop();
  }
  //ctx.pop();

  function isUnfinishedCell(cell) {
    if (maze.walls[cell.y][cell.x].N === false && cell.y > 0) return false;
    if (maze.walls[cell.y][cell.x].S === false && cell.y < maze.ySize - 1) return false;
    if (maze.walls[cell.y][cell.x].E === false && cell.x < maze.xSize - 1) return false;
    if (maze.walls[cell.y][cell.x].W === false && cell.x > 0) return false;
    return true;
  }

  function getCellColor(cell) {
    let fillColor = maze.backgroundColor;

    //highlight cells that haven't finished generating differently, depending on the display mode
    //an unfinished cell is one that has all it's walls around it
    //not used for display mode 2 (line) because it looks weird
    // if (isUnfinishedCell(cell)) {
    //   if (maze.displayMode === 0) {
    //     fillColor = ctx.lerpColor(ctx.color(maze.backgroundColor), ctx.color(maze.wallColor), 0.24);
    //   } else if (maze.displayMode === 1) {
    //     fillColor = ctx.lerpColor(ctx.color(maze.backgroundColor), ctx.color(maze.wallColor), 0.5);
    //   } else {
    //     fillColor = maze.backgroundColor;
    //   }

    // } else {

    //   if (maze.coloringMode === "distance" || maze.coloringMode === "color by distance") {
    //     fillColor = interpolate(maze.colorScheme, maze.distances[cell.y][cell.x] / maze.maxDistance);
    //   } else if (maze.coloringMode === "set" || maze.coloringMode === "color by set") {
    //     if (maze.algorithm === "kruskals") {
    //       fillColor = interpolate(maze.colorScheme, maze.disjointSubsetctx.findParent(maze.getCellIndex(cell)) / (maze.xSize * maze.ySize), 1);
    //     } else if (maze.algorithm === "ellers") {
    //       // fillColor = interpolate(maze.colorScheme, maze.rowState.setForCell[cell.x]/maze.xSize);
    //     }
    //   } else if (maze.coloringMode === "direction" || maze.coloringMode === "color by direction") {
    //     fillColor = 0
    //   }
    // }

    // if (maze.currentCell && cell.x === maze.currentCell.x && cell.y === maze.currentCell.y){
    //   fillColor = ctx.lerpColor(ctx.color("yellow"), ctx.color(fillColor), 0.2);
    // }
    // if(maze.startHuntingFrom && cell.x === maze.startHuntingFrom.x && cell.y === maze.startHuntingFrom.y){
    //   fillColor = ctx.lerpColor(ctx.color("red"), ctx.color(fillColor), 0.2);
    // }

    if (maze.algorithm === "wilson's" && cell.x === maze.x && cell.y === maze.y) fillColor = "red";

    return fillColor;

    function interpolate(colorScheme, k, repeats = 1) {
      k = k * repeats % 1;
      switch (colorScheme) {
        case "night train":
          return "blue";
        case "grayscale":
          return 255 - k * 247;
        case "rainbow":
        default:
          return d3ScaleChromatic.interpolateRainbow(k);

      }
    }
  }

  function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke(); 
  }
}