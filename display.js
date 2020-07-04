import {directions} from "./directions.js"

export default function display({
  maze,
  canvas = document.getElementsByTagName("canvas")[0],
  displayMode = 1,
  cellSize = Math.min(canvas.width / maze.width, canvas.height / maze.height) *
    0.9,
  backgroundColor = "#FFF",
  mainColor = "#000",
  colorScheme = "rainbow",
  strokeWeight = 4,
  antiAliasing = false,
  coloringMode = "normal",
  showSolution = false,
  solutionColor = "#F00",
  distanceFrom = maze.start,
  removeWallsAtEntranceAndExit = true
}) {
  if (!canvas) {
    console.error("Tried to display maze without a canvas");
    return false;
  }

  let {
    distances,
    maxDistance,
  } = maze.getDistances(distanceFrom);

  //remove the walls at the entrance and exit if it is set to that
  let entranceWallBefore;
  let exitWallBefore;
  if(removeWallsAtEntranceAndExit){
    //if the entrance wall is a valid direction
    if(directions.indexOf(maze.entrance.direction) !== -1){
      entranceWallBefore = maze.walls[maze.entrance.y][maze.entrance.x][maze.entrance.direction]
      maze.walls[maze.entrance.y][maze.entrance.x][maze.entrance.direction] = false;
    }

    //if the exit wall is a valid direction
    if(directions.indexOf(maze.exit.direction) !== -1){
      exitWallBefore = maze.walls[maze.exit.y][maze.exit.x][exit.direction]
      maze.walls[maze.exit.y][maze.exit.x][maze.exit.direction] = false;
    }
  }

  let ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = antiAliasing;

  if (typeof colorScheme === "string") {
    colorScheme = colorScheme.toLowerCase();

    switch (colorScheme) {
      case "rainbow":
        // deno-fmt-ignore
        colorScheme = ["#6d3fa9", "#7d3eaf", "#8d3db2", "#9e3cb3", "#ae3cb1", "#bf3cae", "#ce3da9", "#dc3fa1", "#e94298", "#f5468e", "#fe4b82", "#ff5176", "#ff5969", "#ff625d", "#ff6c51", "#ff7746", "#ff833d", "#fe8f35", "#f69c30", "#ecaa2e", "#e2b72e", "#d6c431", "#cbd037", "#c1db40", "#b7e64c", "#afef5a", "#9bf257", "#88f457", "#75f659", "#62f65f", "#52f566", "#43f370", "#36f07c", "#2bec88", "#23e695", "#1ddea3", "#1ad6b0", "#19ccbc", "#1ac1c7", "#1eb6d0", "#23aad8", "#2a9edd", "#3192e0", "#3a85e1", "#4379df", "#4c6edb", "#5463d5", "#5c59cc", "#634fc2", "#6947b6"];
        break;

      //grayscale

      default:
        colorScheme = ["#FFFFFF", "#000008"];
    }
  }

  if (typeof coloringMode === "string") {
    coloringMode = coloringMode.toLowerCase();
  }
  if (typeof displayMode === "string") displayMode = displayMode.toLowerCase();

  if (displayMode === "thin walls") displayMode = 0;
  if (displayMode === "thick walls") displayMode = 1;
  if (displayMode === "line") displayMode = 2;

  //slider element stores 0 as a string so we need to convert it back to a number
  displayMode = Number(displayMode);
  strokeWeight = Number(strokeWeight);

  //strokeWeight = Math.min(strokeWeight, 40);

  //clear the background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //center the maze
  ctx.setTransform(
    1,
    0,
    0,
    1,
    canvas.width / 2 - maze.width / 2 * cellSize,
    canvas.height / 2 - maze.height / 2 * cellSize,
  );

  if (displayMode === 0 || (displayMode === 1 && cellSize <= 3)) { //thin walls
    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        ctx.fillStyle = getCellColor({
          x,
          y,
        });

        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    ctx.strokeStyle = mainColor;
    ctx.lineWidth = strokeWeight;

    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        ctx.strokeStyle = mainColor;

        if (maze.walls[y][x].W) {
          line(x * cellSize, y * cellSize, x * cellSize, (y + 1) * cellSize);
        }
        if (maze.walls[y][x].N) {
          line(x * cellSize, y * cellSize, (x + 1) * cellSize, y * cellSize);
        }
        if (maze.walls[y][x].E && x === maze.width - 1) {
          line(
            (x + 1) * cellSize,
            y * cellSize,
            (x + 1) * cellSize,
            (y + 1) * cellSize,
          );
        }
        if (maze.walls[y][x].S && y === maze.height - 1) {
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

    ctx.fillStyle = mainColor;

    ctx.translate(cellSize / 2, cellSize / 2);

    ctx.fillRect(
      -cellSize,
      -cellSize,
      cellSize * 2 * maze.width + cellSize,
      cellSize * 2 * maze.height + cellSize,
    );
    ctx.fillStyle = backgroundColor;

    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
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
        if (!maze.walls[y][x].E && x === maze.width - 1) {
          ctx.fillRect(
            x * cellSize * 2 + cellSize,
            y * cellSize * 2,
            cellSize,
            cellSize,
          );
        }
        if (!maze.walls[y][x].S && y === maze.height - 1) {
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
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = strokeWeight;

    ctx.translate(cellSize / 2, cellSize / 2);

    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        ctx.strokeStyle = getCellColor({
          x,
          y,
        });

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

  if (showSolution) {
    ctx.setTransform(
      1,
      0,
      0,
      1,
      canvas.width / 2 - maze.width / 2 * cellSize,
      canvas.height / 2 - maze.height / 2 * cellSize,
    );

    let solution = maze.getSolution();
    ctx.strokeStyle = solutionColor;
    ctx.lineWidth = cellSize * 0.27;
    if (ctx.lineWidth < 1) ctx.lineWidth = 1;
    if (ctx.lineWidth > 10) ctx.lineWidth = 10;

    ctx.translate(cellSize / 2, cellSize / 2);
    for (let i = 0; i < solution.length - 1; i++) {
      line(
        solution[i].x * cellSize,
        solution[i].y * cellSize,
        solution[i + 1].x * cellSize,
        solution[i + 1].y * cellSize,
      );
    }
  }

  //put the walls at the entrance and exit back if they were there before
  if(removeWallsAtEntranceAndExit){
    //re-add the entrance wall if it was taken away to begin with
    if(directions.indexOf(maze.entrance.direction) !== -1){
      maze.walls[maze.entrance.y][maze.entrance.x][maze.entrance.direction] = entranceWallBefore;
    }

    //re-add the exit wall if it was taken away to begin with
    if(directions.indexOf(maze.exit.direction) !== -1){
      maze.walls[maze.exit.y][maze.exit.x][maze.exit.direction] = exitWallBefore;
    }
  }

  function isUnfinishedCell(cell) {
    if (maze.walls[cell.y][cell.x].N === false && cell.y > 0) return false;
    if (
      maze.walls[cell.y][cell.x].S === false && cell.y < maze.height - 1
    ) {
      return false;
    }
    if (
      maze.walls[cell.y][cell.x].E === false && cell.x < maze.width - 1
    ) {
      return false;
    }
    if (maze.walls[cell.y][cell.x].W === false && cell.x > 0) return false;
    return true;
  }

  function getCellColor(cell) {
    let fillColor = displayMode === 2 ? mainColor : backgroundColor;

    //highlight cells that haven't finished generating differently, depending on the display mode
    //an unfinished cell is one that has all it's walls around it
    //not used for display mode 2 (line) because it looks weird
    if (isUnfinishedCell(cell)) {
      if (displayMode === 0) {
        fillColor = lerpBetween(backgroundColor, mainColor, 0.24);
      } else if (displayMode === 1) {
        fillColor = lerpBetween(backgroundColor, mainColor, 0.51);
      } else {
        fillColor = backgroundColor;
      }
    } else {
      if (coloringMode === "distance" || coloringMode === "color by distance") {
        fillColor = interpolate(
          colorScheme,
          distances[cell.y][cell.x] / maxDistance,
        );
      } else if (coloringMode === "set" || coloringMode === "color by set") {
        if (maze.algorithm === "kruskals") {
          fillColor = interpolate(
            colorScheme,
            maze.disjointSubsets.findParent(maze.getCellIndex(cell)) /
              (maze.width * maze.height),
          );
        } else if (maze.algorithm === "ellers") {
          fillColor = interpolate(
            colorScheme,
            maze.rowState.setForCell[cell.x] / maze.width,
          );
        }
      }
    }

    return fillColor;

    function interpolate(colorScheme, k = 0, repeats = 1) {
      k = k === 1 ? 1 : k * repeats % 1;

      let i = k * (colorScheme.length - 1);
      let color1 = colorScheme[Math.floor(i)];
      let color2 = colorScheme[(Math.floor(i) + 1) % colorScheme.length];
      let interpolatedColor = lerpBetween(color1, color2, i % 1);

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
    if (strokeWeight !== 0) {
      ctx.beginPath();
      ctx.lineJoin = "round";
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
}
