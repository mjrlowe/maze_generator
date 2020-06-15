export default function display({
  maze,
  canvas = document?.getElementsByTag("canvas")[0],
  displayMode = 1,
  cellSize = Math.min(canvas.width / maze.xSize, canvas.height / maze.ySize) *
    0.9,
  backgroundColor = "#FFF",
  wallColor = "#000",
  colorScheme = "rainbow",
  strokeWeight = 4,
  antiAliasing = false,
  coloringMode = "normal",
}) {

  if(!canvas){
    console.error("Tried to display maze without a canvas")
    return false;
  }

  maze.calculateDistances();
  let ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = antiAliasing;

  if (typeof colorScheme === "string") colorScheme = colorScheme.toLowerCase();
  if (typeof coloringMode === "string") {
    coloringMode = coloringMode.toLowerCase();
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
    if (isUnfinishedCell(cell)) {
      if (displayMode === 0) {
        fillColor = lerpBetween(backgroundColor, wallColor, 0.24);
      } else if (displayMode === 1) {
        fillColor = lerpBetween(backgroundColor, wallColor, 0.51);
      } else {
        fillColor = backgroundColor;
      }
    } else {
      if (coloringMode === "distance" || coloringMode === "color by distance") {
        fillColor = interpolate(
          colorScheme,
          maze.distances[cell.y][cell.x] / maze.maxDistance,
        );
      } else if (coloringMode === "set" || coloringMode === "color by set") {
        if (maze.algorithm === "kruskals") {
          fillColor = interpolate(
            colorScheme,
            maze.disjointSubsets.findParent(maze.getCellIndex(cell)) /
              (maze.xSize * maze.ySize),
            1,
          );
        } else if (maze.algorithm === "ellers") {
          fillColor = interpolate(
            colorScheme,
            maze.rowState.setForCell[cell.x] / maze.xSize,
          );
        }
      }
    }

    if (
      maze.currentCell && cell.x === maze.currentCell.x &&
      cell.y === maze.currentCell.y
    ) {
      fillColor = lerpBetween("#FFFF00", fillColor, 0.2);
    }
    if (
      maze.startHuntingFrom && cell.x === maze.startHuntingFrom.x &&
      cell.y === maze.startHuntingFrom.y
    ) {
      fillColor = lerpBetween("#F00", fillColor, 0.2);
    }

    if (
      maze.algorithmId === "wilsons" && cell.x === maze.x && cell.y === maze.y
    ) {
      fillColor = "#F00";
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
        interpolatedColor = "white";
      }

      return interpolatedColor;
    }
  }

  function lerpBetween(color1, color2, k) {
    color1 = typeof color1 === "string" ? hexToRgb(color1) : color1;
    color2 = typeof color2 === "string" ? hexToRgb(color2) : color2;

    return rgbToHex({
      r: color1.r + (color2.r - color1.r) * k,
      g: color1.g + (color2.g - color1.g) * k,
      b: color1.b + (color2.b - color1.b) * k,
    });
  }

  //adapted from https://stackoverflow.com/questions/5623838
  function hexToRgb(hex) {
    if (typeof hex === "object") return hex;

    //e.g. #15C22F
    let sixDigitHexRegexResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
      .exec(hex);

    //e.g. #1C3
    let threeDigitHexRegexResult = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i
      .exec(hex);

    return (
      sixDigitHexRegexResult
        ? {
          r: parseInt(sixDigitHexRegexResult[1], 16),
          g: parseInt(sixDigitHexRegexResult[2], 16),
          b: parseInt(sixDigitHexRegexResult[3], 16),
        }
        : threeDigitHexRegexResult
        ? {
          r: parseInt(
            threeDigitHexRegexResult[1] + threeDigitHexRegexResult[1],
            16,
          ),
          g: parseInt(
            threeDigitHexRegexResult[2] + threeDigitHexRegexResult[2],
            16,
          ),
          b: parseInt(
            threeDigitHexRegexResult[3] + threeDigitHexRegexResult[3],
            16,
          ),
        }
        : null
    );
  }

  function rgbToHex(rgbObject) {
    return "#" + componentToHex(rgbObject.r) + componentToHex(rgbObject.g) +
      componentToHex(rgbObject.b);
  }

  function componentToHex(c) {
    let hex = Math.round(c).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
