import { Algorithm } from "../Algorithm.js";
import { directions, dx, dy } from "../directions.js";

class GrowingTree extends Algorithm {
  resetVariables() {
    this.visited = [];
    for (let y = 0; y < this.height; y++) {
      this.visited[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.visited[y][x] = 0;
      }
    }
    this.totalVisted = 0;

    this.list = [];

    let startCell = { ...this.start };
    this.list.push(startCell);
    this.visited[startCell.y][startCell.x] = 1;
  }

  takeStep() {
    // Choose a cell
    // TODO: Function that receives a param to know which behavior
    // this.currentCell = this.list[this.list.length - 1];                             // Newest
    // this.currentCell = this.list[0];                                             // Oldest
    this.currentCell = this.list[Math.floor(this.random() * this.list.length)]; // Random

    let unvisitedNeighbors = [];

    for (let direction of directions) {
      let neighbor = {
        x: this.currentCell.x + dx[direction],
        y: this.currentCell.y + dy[direction],
        direction: direction
      };

      if (
        this.cellIsInMaze(neighbor) &&
        !this.visited[neighbor.y][neighbor.x]
      ) {
        unvisitedNeighbors.push(neighbor);
      }
    }

    if (unvisitedNeighbors.length > 0) {
      let newCell =
        unvisitedNeighbors[
          Math.floor(this.random() * unvisitedNeighbors.length)
        ];
      this.removeWall(this.currentCell, newCell.direction);
      this.visited[newCell.y][newCell.x]++;
      this.totalVisted++;

      this.list.push({
        x: newCell.x,
        y: newCell.y
      });
    } else {
      const index = this.list.findIndex(
        (cell) => cell.x === this.currentCell.x && cell.y == this.currentCell.y
      );
      this.list.splice(index, 1);
    }

    if (this.list.length === 0) {
      this.finishedGenerating = true;
    }
  }
}

export default GrowingTree;
