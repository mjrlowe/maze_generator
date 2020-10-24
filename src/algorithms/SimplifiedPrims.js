import { Algorithm } from "../Algorithm.js";
import { directions, dx, dy } from "../directions.js";

class SimplifiedPrims extends Algorithm {
  resetVariables() {
    this.visited = [];
    for (let y = 0; y < this.height; y++) {
      this.visited[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.visited[y][x] = false;
      }
    }
    this.totalVisted = 0;

    this.activeCells = [];

    let startCell = {
      x: this.start.x,
      y: this.start.y,
    };

    this.activeCells.push(startCell);
    this.visited[startCell.y][startCell.x] = true;
  }

  takeStep() {
    let cellIndex = Math.floor(this.random() * this.activeCells.length);
    let cell = this.activeCells[cellIndex];

    let unvisitedNeighbors = [];

    for (let direction of directions) {
      let neighbor = {
        x: cell.x + dx[direction],
        y: cell.y + dy[direction],
        direction: direction,
      };

      if (
        this.cellIsInMaze(neighbor) && !this.visited[neighbor.y][neighbor.x]
      ) {
        unvisitedNeighbors.push(neighbor);
      }
    }

    if (unvisitedNeighbors.length > 0) {
      let newCell = unvisitedNeighbors[
        Math.floor(this.random() * unvisitedNeighbors.length)
      ];
      this.removeWall(cell, newCell.direction);
      this.visited[newCell.y][newCell.x] = true;
      this.totalVisted++;

      this.activeCells.push(newCell);
    } else {
      this.activeCells.splice(cellIndex, 1);
    }

    if (this.activeCells.length === 0) this.finishedGenerating = true;
  }
}

export default SimplifiedPrims;
