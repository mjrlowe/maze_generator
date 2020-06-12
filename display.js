export default function display({
  maze,
  canvas = document.getElementsByTag("canvas")[0],
  displayMode = 1,
  cellSize = Math.min(canvas.width / maze.xSize, canvas.height / maze.ySize) *
  0.9,
  backgroundColor = "white",
  wallColor = "black",
  colorScheme = "rainbow",
  strokeWeight = 4,
  antiAliasing = false,
}) {

  maze.calculateDistances();
  let ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = antiAliasing;

  if (typeof colorScheme === "string") colorScheme = colorScheme.toLowerCase();
  if (typeof maze.coloringMode === "string") {
    maze.coloringMode = maze.coloringMode.toLowerCase();
  }
  if (typeof displayMode === "string") displayMode = displayMode.toLowerCase();

  strokeWeight = Math.min(strokeWeight, 40);

  if (displayMode === "thin walls") displayMode = 0;
  if (displayMode === "thick walls") displayMode = 1;
  if (displayMode === "line") displayMode = 2;
  displayMode = Number(displayMode); //dat.gui stores 0 as a string so I need to convert it back to a number

  //clear the background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //center the maze
  ctx.setTransform(
    1,
    0,
    0,
    1,
    canvas.width / 2 - maze.xSize / 2 * cellSize,
    canvas.height / 2 - maze.ySize / 2 * cellSize,
  );

  if (displayMode === 0 || (displayMode === 1 && cellSize <= 3)) { //thin walls
    for (let y = 0; y < maze.ySize; y++) {
      for (let x = 0; x < maze.xSize; x++) {
        ctx.fillStyle = getCellColor({
          x,
          y,
        });

        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    ctx.strokeStyle = wallColor;
    ctx.lineWidth = strokeWeight;

    for (let y = 0; y < maze.ySize; y++) {
      for (let x = 0; x < maze.xSize; x++) {
        ctx.strokeStyle = wallColor;

        if (maze.walls[y][x].W) {
          line(x * cellSize, y * cellSize, x * cellSize, (y + 1) * cellSize);
        }
        if (maze.walls[y][x].N) {
          line(x * cellSize, y * cellSize, (x + 1) * cellSize, y * cellSize);
        }
        if (maze.walls[y][x].E && x === maze.xSize - 1) {
          line(
            (x + 1) * cellSize,
            y * cellSize,
            (x + 1) * cellSize,
            (y + 1) * cellSize,
          );
        }
        if (maze.walls[y][x].S && y === maze.ySize - 1) {
          line(
            x * cellSize,
            (y + 1) * cellSize,
            (x + 1) * cellSize,
            (y + 1) * cellSize,
          );
        }
      }
    }
  } else if (displayMode === 1) { //thick walls
    cellSize /= 2;

    ctx.fillStyle = wallColor;

    ctx.translate(cellSize / 2, cellSize / 2);

    ctx.fillRect(
      -cellSize,
      -cellSize,
      cellSize * 2 * maze.xSize + cellSize,
      cellSize * 2 * maze.ySize + cellSize,
    );
    ctx.fillStyle = backgroundColor;

    for (let y = 0; y < maze.ySize; y++) {
      for (let x = 0; x < maze.xSize; x++) {
        ctx.fillStyle = getCellColor({
          x,
          y,
        });

        ctx.fillRect(x * cellSize * 2, y * cellSize * 2, cellSize, cellSize);

        if (!maze.walls[y][x].W) {
          ctx.fillRect(
            x * cellSize * 2 - cellSize,
            y * cellSize * 2,
            cellSize,
            cellSize,
          );
        }
        if (!maze.walls[y][x].N) {
          ctx.fillRect(
            x * cellSize * 2,
            y * cellSize * 2 - cellSize,
            cellSize,
            cellSize,
          );
        }
        if (!maze.walls[y][x].E && x === maze.xSize - 1) {
          ctx.fillRect(
            x * cellSize * 2 + cellSize,
            y * cellSize * 2,
            cellSize,
            cellSize,
          );
        }
        if (!maze.walls[y][x].S && y === maze.ySize - 1) {
          ctx.fillRect(
            x * cellSize * 2,
            y * cellSize * 2 + cellSize,
            cellSize,
            cellSize,
          );
        }
      }
    }

    cellSize *= 2;
  } else { //display mode 2: line
    ctx.strokeStyle = wallColor;
    ctx.lineWidth = strokeWeight;

    ctx.translate(cellSize / 2, cellSize / 2);

    for (let y = 0; y < maze.ySize; y++) {
      for (let x = 0; x < maze.xSize; x++) {
        if (!maze.walls[y][x].W) {
          line(x * cellSize, y * cellSize, (x - 0.5) * cellSize, y * cellSize);
        }
        if (!maze.walls[y][x].N) {
          line(x * cellSize, y * cellSize, x * cellSize, (y - 0.5) * cellSize);
        }
        if (!maze.walls[y][x].E) {
          line(x * cellSize, y * cellSize, (x + 0.5) * cellSize, y * cellSize);
        }
        if (!maze.walls[y][x].S) {
          line(x * cellSize, y * cellSize, x * cellSize, (y + 0.5) * cellSize);
        }
      }
    }
  }

  if (maze.showSolution) {
    ctx.strokeStyle = solutionColor;
    ctx.lineWidth = cellSize * 0.27;
    if (ctx.lineWidth < 1) ctx.lineWidth = 1;
    if (ctx.lineWidth > 10) ctx.lineWidth = 10;

    ctx.translate(cellSize / 2, cellSize / 2);
    for (let i = 0; i < maze.solution.length - 1; i++) {
      line(
        maze.solution[i].x * cellSize,
        maze.solution[i].y * cellSize,
        maze.solution[i + 1].x * cellSize,
        maze.solution[i + 1].y * cellSize,
      );
    }
  }

  function isUnfinishedCell(cell) {
    if (maze.walls[cell.y][cell.x].N === false && cell.y > 0) return false;
    if (
      maze.walls[cell.y][cell.x].S === false && cell.y < maze.ySize - 1
    ) {
      return false;
    }
    if (
      maze.walls[cell.y][cell.x].E === false && cell.x < maze.xSize - 1
    ) {
      return false;
    }
    if (maze.walls[cell.y][cell.x].W === false && cell.x > 0) return false;
    return true;
  }

  function getCellColor(cell) {
    let fillColor = backgroundColor;


    //highlight cells that haven't finished generating differently, depending on the display mode
    //an unfinished cell is one that has all it's walls around it
    //not used for display mode 2 (line) because it looks weird
    // if (isUnfinishedCell(cell)) {
    //   if (displayMode === 0) {
    //     fillColor = ctx.lerpColor(ctx.color(backgroundColor), ctx.color(wallColor), 0.24);
    //   } else if (displayMode === 1) {
    //     fillColor = ctx.lerpColor(ctx.color(backgroundColor), ctx.color(wallColor), 0.5);
    //   } else {
    //     fillColor = backgroundColor;
    //   }

    // } else {

    //   if (maze.coloringMode === "distance" || maze.coloringMode === "color by distance") {
    fillColor = interpolate(colorScheme, maze.distances[cell.y][cell.x] / maze.maxDistance);
    //   } else if (maze.coloringMode === "set" || maze.coloringMode === "color by set") {
    //     if (maze.algorithm === "kruskals") {
    //       fillColor = interpolate(colorScheme, maze.disjointSubsetctx.findParent(maze.getCellIndex(cell)) / (maze.xSize * maze.ySize), 1);
    //     } else if (maze.algorithm === "ellers") {
    //       // fillColor = interpolate(colorScheme, maze.rowState.setForCell[cell.x]/maze.xSize);
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

    if (
      maze.algorithmId === "wilsons" && cell.x === maze.x && cell.y === maze.y
    ) {
      fillColor = "red";
    }

    return fillColor;

    function interpolate(colorScheme, k = 0, repeats = 1) {
      k = k * repeats % 1;

      let interpolatedColor;

      if (Array.isArray(colorScheme)) {
        let i = k * (colorScheme.length - 1);
        let color1 = colorScheme[floor(i)];
        let color2 = colorScheme[floor(i) + 1];
        interpolatedColor = lerpBetween(color1, color2, i % 1);

      } else if (colorScheme === "grayscale" || colorScheme === "greyscale") {
        interpolatedColor = lerpBetween("#FFFFFF", "#000008", k);

      } else {
        interpolatedColor = {
          r: 255,
          g: 255,
          b: 255
        };
      }

      let colorString;
      if (typeof interpolatedColor === "object") {
        colorString = `rgb(${interpolatedColor.r}, ${interpolatedColor.g}, ${interpolatedColor.b})`;
      } else {
        colorString = interpolatedColor;
      }

      return colorString;

    }
  }

  function lerpBetween(color1, color2, k) {
    color1 = hexToRgb(color1);
    color2 = hexToRgb(color2);

    let newColor = {
      r: color1.r + (color2.r - color1.r) * k,
      g: color1.g + (color2.g - color1.g) * k,
      b: color1.b + (color2.b - color1.b) * k,
    }

    return newColor;
  }

  //https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}

function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
