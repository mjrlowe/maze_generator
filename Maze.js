import {
  dx,
  dy,
  opposite,
} from "./directions.js";

import * as algorithms from "./algorithms.js";

import mazeString from "./print.js";
import display from "./display.js";
import calculateDistances from "./distances.js";
import solve from "./solve.js";
import analyze from "./analyze.js";

class Maze {
  constructor(mazeSettings) {
    this.prng = mazeSettings.prng ?? Math;
    this.width = mazeSettings.width ||
      mazeSettings.xSize || mazeSettings.size || mazeSettings.height ||
      mazeSettings.ySize || 30;
    this.height = mazeSettings.height ||
      mazeSettings.ySize || mazeSettings.size || this.width;
    this.finishedGenerating = false;
    this.seed = mazeSettings.seed ?? Math.floor(Math.random() * 10e8);
    this.algorithm = mazeSettings.algorithm;
    this.algorithmId = mazeSettings.algorithmId;

    this.entrance = this.getXYPosition(mazeSettings.entrance ?? "top left");

    this.exit = this.getXYPosition(mazeSettings.exit ?? "bottom right");

    this.entrance.direction = this.entrance.direction ??
      (this.entrance.x <= 0
        ? "W"
        : this.entrance.x >= this.width - 1
        ? "E"
        : this.entrance.y <= 0
        ? "N"
        : this.entrance.y >= this.width - 1
        ? "S"
        : " ");
    this.exit.direction = this.exit.direction ??
      (this.exit.x <= 0
        ? "W"
        : this.exit.x >= this.width - 1
        ? "E"
        : this.exit.y <= 0
        ? "N"
        : this.exit.y >= this.width - 1
        ? "S"
        : " ");

    if (
      this.algorithmId === "sidewinder" ||
      this.algorithmId === "binarytree" ||
      this.algorithmId === "ellers"
    ) {
      this.start = { x: 0, y: 0 };
    } else {
      this.start = this.getXYPosition(mazeSettings.start ?? "random");
    }

    this.prng.shuffle = (arr) => {
      const isView = ArrayBuffer && ArrayBuffer.isView &&
        ArrayBuffer.isView(arr);
      arr = isView ? arr : arr.slice();

      let rnd,
        tmp,
        idx = arr.length;
      while (idx > 1) {
        rnd = (this.prng.random() * idx) | 0;

        tmp = arr[--idx];
        arr[idx] = arr[rnd];
        arr[rnd] = tmp;
      }

      return arr;
    };

    this.reset();
  }

  static create(settings = {}) {
    settings.algorithmId = settings.algorithm
      ? settings.algorithm.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
      : "recursivebacktracker";

    switch (settings.algorithmId) {
      case "10print":
      case "tenprint":
        return new algorithms.TenPrint(settings);

      case "prim":
      case "prims":
      case "trueprim":
      case "trueprims":
        return new algorithms.TruePrims(settings);

      // case "random":
      //   return new algorithms[
      //     Object.keys(
      //       algorithms,
      //     )[Math.floor(Math.random() * Object.keys(algorithms).length)]
      //   ](settings);

      case "depthfirstsearch":
      case "dfs":
      case "randomizeddepthfirstsearch":
      case "randomiseddepthfirstsearch":
      case "rdfs":
      case "recursivebacktracker":
        return new algorithms.RecursiveBacktracker(settings);

      case "kruskal":
      case "kruskals":
        return new algorithms.Kruskals(settings);

      case "simplifiedprim":
      case "simplifiedprims":
        return new algorithms.SimplifiedPrims(settings);

      case "modifiedprim":
      case "modifiedprims":
        return new algorithms.ModifiedPrims(settings);

      case "aldousbroder":
        return new algorithms.AldousBroder(settings);

      case "binary":
      case "binarytree":
        return new algorithms.BinaryTree(settings);

      case "sidewinder":
        return new algorithms.Sidewinder(settings);

      case "huntandkill":
        return new algorithms.HuntAndKill(settings);

      case "eller":
      case "ellers":
        return new algorithms.Ellers(settings);

      default:
        throw "Invalid algorithm";
    }
  }

  reset() {
    //random seed would go here

    this.currentCell = { ...this.start };

    this.finishedGenerating = false;

    this.solution = [];

    this.walls = [];
    for (let y = 0; y < this.height; y++) {
      this.walls[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.walls[y][x] = {
          N: true,
          S: true,
          E: true,
          W: true,
        };
      }
    }

    if (this.resetVariables) this.resetVariables();
  }

  step() {
    if (this.finishedGenerating) return false;
    this.takeStep();
    return !this.finishedGenerating;
  }

  generate() {
    let timerName = `Generating ${this.algorithm ?? ""} maze in`;
    // console.time(timerName);

    let i = 0;
    while (!this.finishedGenerating && ++i < 1000000) {
      this.step();
    }

    // console.timeEnd(timerName);
    // if (this.finishedGenerating) {
    //   console.log(`%cMaze completed in ${i} steps`);
    // } else {
    //   console.log(`%cMaze not completed, gave up after ${i} steps`);
    // }

    return this;
  }

  //carve
  removeWall(cell, direction) {
    if (this.cellIsInMaze(cell)) {
      this.walls[cell.y][cell.x][direction] = false;
      let cell2 = {
        x: cell.x + dx[direction],
        y: cell.y + dy[direction],
      };

      if (this.cellIsInMaze(cell2)) {
        this.walls[cell2.y][cell2.x][opposite[direction]] = false;

        return true;
      }
    }
    return false;
  }

  //uncarve
  addWall(cell, direction) {
    if (this.cellIsInMaze(cell)) {
      this.walls[cell.y][cell.x][direction] = true;
      let cell2 = {
        x: cell.x + dx[direction],
        y: cell.y + dy[direction],
      };

      if (this.cellIsInMaze(cell2)) {
        this.walls[cell2.y][cell2.x][opposite[direction]] = true;
        return true;
      }
    }
    return false;
  }

  cellIsInMaze(cell) {
    let validX = cell.x >= 0 && cell.x < this.width;
    let validY = cell.y >= 0 && cell.y < this.height;
    return validX && validY;
  }

  //convert a string into an x-y position, as well as the location of any outer walls relative to the cell
  getXYPosition(position) {
    if (typeof position === "object") {
      return {
        ...position,
      };
    }

    let XYPosition = {};
    position = position.toLowerCase();

    switch (position) {
      case "top left":
      case "north west":
        XYPosition = {
          x: 0,
          y: 0,
        };
        break;
      case "bottom left":
      case "south west":
        XYPosition = {
          x: 0,
          y: this.height - 1,
        };
        break;
      case "top right":
      case "north east":
        XYPosition = {
          x: this.width - 1,
          y: 0,
        };
        break;
      case "bottom right":
      case "south east":
        XYPosition = {
          x: this.width - 1,
          y: this.height - 1,
        };
        break;
      case "center":
      case "middle":
        XYPosition = {
          x: Math.floor(this.width / 2),
          y: Math.floor(this.height / 2),
        };
        break;
      case "top":
      case "north":
      case "top middle":
      case "north middle":
        XYPosition = {
          x: Math.floor(this.width / 2),
          y: 0,
        };
        break;
      case "bottom":
      case "south":
      case "bottom middle":
      case "south middle":
        XYPosition = {
          x: Math.floor(this.width / 2),
          y: this.height - 1,
        };
        break;
      case "right":
      case "east":
      case "right middle":
      case "east middle":
        XYPosition = {
          x: this.width - 1,
          y: Math.floor(this.height / 2),
        };
        break;
      case "left":
      case "west":
      case "left middle":
      case "west middle":
        XYPosition = {
          x: 0,
          y: Math.floor(this.width / 2),
        };
        break;
      case "random":
        XYPosition = {
          x: Math.floor(this.prng.random() * this.width),
          y: Math.floor(this.prng.random() * this.height),
        };
        break;
      default:
        console.warn(
          "Invalid position name. Defaulting to (0,0) (top left corner)",
        );
        XYPosition = {
          x: 0,
          y: 0,
        };
        break;
    }

    let possibleDirections = [];
    if (XYPosition.y <= 0) possibleDirections.push("N");
    if (XYPosition.y >= this.height - 1) possibleDirections.push("S");
    if (XYPosition.x >= this.width - 1) possibleDirections.push("E");
    if (XYPosition.x <= 0) possibleDirections.push("W");

    XYPosition.direction = possibleDirections[0];
    return XYPosition;
  }

  printString() {
    console.log(this.getString());
  }

  display(settings) {
    return display({ ...settings, maze: this });
  }

  getSolution(
    start = this.entrance,
    finish = this.exit,
  ) {
    return solve(this, start, finish);
  }

  getAnalysis() {
    return analyze(this);
  }
}

Maze.prototype.getString = mazeString;
Maze.prototype.getDistances = calculateDistances;

export default Maze;
