import Maze from "../Maze.js";

export default class TruePrims extends Maze {
  resetVariables() {
    this.IN = "W";
    this.FRONTIER = "E";
    this.START = 1;
    this.EXPAND = 2;
    this.DONE = 3;
    this.frontierCells = [];
    this.state = this.START;

    this.visited = [];
    for (let y = 0; y < this.height; y++) {
      this.visited[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.visited[y][x] = 0;
      }
    }
  }

  isOutside(cell) {
    return this.cellIsInMaze(cell) && !this.visited?.[cell.y]?.[cell.x];
  }

  isInside(cell) {
    return this.cellIsInMaze(cell) && maze.walls[cell.y][cell.x][this.IN];
  }
  isFrontier(cell) {
    return this.cellIsInMaze(cell) && maze.walls[cell.y][cell.x][this.FRONTIER];
  }

  addFrontier(cell) {
    if (this.isOutside(cell)) {
      this.frontierCells.push(cell);
      this.removeWall(cell, this.FRONTIER);
    }
  }

  markCell(cell) {
    this.visited[cell.y][cell.x]++;
    this.removeWall(cell, this.IN);
    this.addWall(cell, this.FRONTIER);

    let { x, y } = cell;

    this.addFrontier({ x: x - 1, y });
    this.addFrontier({ x: x + 1, y });
    this.addFrontier({ x, y: y - 1 });
    this.addFrontier({ x, y: y + 1 });
  }

  findNeighborsOf(cell) {
    let neighbors = [];

    if (this.isInside({ x: cell.x - 1, y: cell.y })) neighbors.push("W");
    if (this.isInside({ x: cell.x + 1, y: cell.y })) neighbors.push("E");
    if (this.isInside({ x: cell.x, y: cell.y - 1 })) neighbors.push("N");
    if (this.isInside({ x: cell.x, y: cell.y + 1 })) neighbors.push("S");

    return neighbors;
  }

  startStep() {
    this.markCell({
      x: Math.floor(this.prng.random() * this.width),
      y: Math.floor(this.prng.random() * this.height),
    });
    this.state = this.EXPAND;
  }

  expandStep() {
    let cell = this.frontierCells.splice(
      Math.floor(this.prng.random() * this.frontierCells),
      1,
    )[0];

    let cellNeighbors = this.findNeighborsOf(cell);
    let direction =
      cellNeighbors[Math.floor(this.prng.random() * cellNeighbors.length)];

    this.removeWall(cell, direction);
    this.markCell(cell);

    if (this.frontierCells.length === 0) this.finishedGenerating = true;
  }

  takeStep() {

    switch (this.state) {
      case this.START:
        this.startStep();
        break;
      case this.EXPAND:
        this.expandStep();
        break;
      default:
        console.error(`State ${this.state} is not valid.`);
    }

  }
}
