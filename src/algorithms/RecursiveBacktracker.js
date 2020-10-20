import Algorithm from "../Algorithm.js";
import { directions, dx, dy } from "../directions.js";

class RecursiveBacktracker extends Algorithm {
  resetVariables() {
    this.visited = [];
    for (let y = 0; y < this.height; y++) {
      this.visited[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.visited[y][x] = 0;
      }
    }
    this.totalVisted = 0;

    this.stack = [];

    let startCell = { ...this.start };
    this.stack.push(startCell);
    this.visited[startCell.y][startCell.x] = 1;
    this.currentCell = startCell;
  }

  takeStep() {
    let unvisitedNeighbors = [];

    for (let direction of directions) {
      let neighbor = {
        x: this.currentCell.x + dx[direction],
        y: this.currentCell.y + dy[direction],
        direction: direction,
      };

      if (
        this.cellIsInMaze(neighbor) && !this.visited[neighbor.y][neighbor.x]
      ) {
        unvisitedNeighbors.push(neighbor);
      }
    }

    if (unvisitedNeighbors.length > 0 && this.random() < 0.99) {
      let newCell = unvisitedNeighbors[
        Math.floor(this.random() * unvisitedNeighbors.length)
      ];
      this.removeWall(this.currentCell, newCell.direction);
      this.visited[newCell.y][newCell.x]++;
      this.totalVisted++;

      this.stack.push({
        x: newCell.x,
        y: newCell.y,
      });

      this.currentCell = newCell;
    } else {
      this.currentCell = this.stack.pop();
    }

    if (this.stack.length === 0) {
      this.finishedGenerating = true;
    }
  }
}

export default RecursiveBacktracker;
