import {Algorithm} from "../Algorithm.js";
import { directions, dx, dy } from "../directions.js";

class ModifiedPrims extends Algorithm {
  resetVariables() {
    this.visited = [];
    this.costs = [];
    for (let y = 0; y < this.height; y++) {
      this.visited[y] = [];
      this.costs[y] = [];
      for (let x = 0; x < this.width; x++) {
        //mark every cell as unvisited
        this.visited[y][x] = false;

        //give every cell a random cost (weight)
        this.costs[y][x] = this.random();
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
    //find index of cell with minimum cost
    let minCost = Infinity;
    let cellIndex = 0;
    this.activeCells.forEach((cell, index) => {
      if (this.costs[cell.y][cell.x] < minCost) {
        minCost = this.costs[cell.y][cell.x];
        cellIndex = index;
      }
    });

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

      this.activeCells.push({
        x: newCell.x,
        y: newCell.y,
      });
    } else {
      this.activeCells.splice(cellIndex, 1);
    }

    if (this.activeCells.length === 0) this.finishedGenerating = true;
  }
}

export default ModifiedPrims;
