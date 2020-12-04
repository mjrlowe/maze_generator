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
    const cellIndex = Math.floor(this.random() * this.activeCells.length);
    this.currentCell = {
      x: this.activeCells[cellIndex].x,
      y: this.activeCells[cellIndex].y,
    };

    const unvisitedNeighbors = this.getUnvisitedNeighbors();
    if (unvisitedNeighbors.length > 0) {
      let newCell = this.selectNeighbor(unvisitedNeighbors);
      this.removeWall(this.currentCell, newCell.direction);
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
