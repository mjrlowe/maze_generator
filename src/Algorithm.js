import { directions, dx, dy, opposite } from "./directions.js";
import seedrandom from "./seedrandom.js";

//Private methods should be in Algorithm

class Algorithm {
  constructor(mazeSettings) {
    this.seed = String(mazeSettings.seed ?? Date.now());
    this.random = mazeSettings.prng ?? seedrandom(this.seed);
    this.width = mazeSettings.width ||
      mazeSettings.xSize || mazeSettings.size || mazeSettings.height ||
      mazeSettings.ySize || 30;
    this.height = mazeSettings.height ||
      mazeSettings.ySize || mazeSettings.size || this.width;
    this.finishedGenerating = false;
    this.seed = mazeSettings.seed ?? Math.floor(Math.random() * 10e8);

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

    this.selectNeighbor = mazeSettings.selectNeighbor
      ? ((neigbors) => mazeSettings.selectNeighbor(neigbors, this.random))
      : ((neighbors) =>
        neighbors[Math.floor(this.random() * (neighbors.length))]);

    this.cellSelectionMethod = mazeSettings.cellSelectionMethod ??
      { random: 1 };

    if (
      this.constructor.name === "Sidewinder" ||
      this.constructor.name === "BinaryTree" ||
      this.constructor.name === "Ellers"
    ) {
      this.start = { x: 0, y: 0 };
    } else {
      this.start = this.getXYPosition(mazeSettings.start ?? "random");
    }

    this.shuffle = (arr) => {
      const isView = ArrayBuffer && ArrayBuffer.isView &&
        ArrayBuffer.isView(arr);
      arr = isView ? arr : arr.slice();

      let rnd,
        tmp,
        idx = arr.length;
      while (idx > 1) {
        rnd = (this.random() * idx) | 0;

        tmp = arr[--idx];
        arr[idx] = arr[rnd];
        arr[rnd] = tmp;
      }

      return arr;
    };
  }

  reset() {
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
          x: Math.floor(this.random() * this.width),
          y: Math.floor(this.random() * this.height),
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

  getUnvisitedNeighbors() {
    return directions.map((direction) => ({
      x: this.currentCell.x + dx[direction],
      y: this.currentCell.y + dy[direction],
      direction,
    })).filter((neighbor) =>
      this.cellIsInMaze(neighbor) &&
      !this.visited[neighbor.y][neighbor.x]
    );
  }
}

export { Algorithm };
