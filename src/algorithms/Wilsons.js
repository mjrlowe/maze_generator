import Algorithm from "../Algorithm.js";
import { directions, dx, dy, opposite } from "../directions.js";

class Wilsons extends Algorithm {
  resetVariables() {
    this.unvisited = [];
    this.visited = [];
    for (let y = 0; y < this.height; y++) {
      this.visited[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.visited[y][x] = false;
        this.unvisited.push({
          x,
          y,
        });
      }
    }

    this.markAsVisited(this.currentCell);

    this.state = 0;
    this.remaining = this.width * this.height;
    this.visits = {};
  }

  takeStep() {
    //pick a random cell to start a new path
    this.currentCell =
      this.unvisited[Math.floor(this.random() * this.unvisited.length)];
    let path = [this.currentCell];

    while (!this.visited[this.currentCell.y][this.currentCell.x]) {
      let validNeighbours = [];
      for (let direction of directions) {
        let neighbour = {
          x: this.currentCell.x + dx[direction],
          y: this.currentCell.y + dy[direction],
          direction,
        };
        if (this.cellIsInMaze(neighbour)) validNeighbours.push(neighbour);
      }
      let newCell = validNeighbours[
        Math.floor(this.random() * validNeighbours.length)
      ];
      let cellVisited = false;
      let cellPreviousIndex = -1;
      path.forEach((pathCell, index) => {
        if (pathCell.x === newCell.x && pathCell.y === newCell.y) {
          cellVisited = true;
          cellPreviousIndex = index;
        }
      });

      if (!cellVisited) {
        path.push(newCell);
        this.currentCell = newCell;
      } else {
        this.currentCell = path[cellPreviousIndex];
        path = path.slice(0, cellPreviousIndex + 1);
      }
    }

    for (let cell of path) {
      this.removeWall({ x: cell.x, y: cell.y }, opposite[cell.direction]);
      this.markAsVisited(cell);
    }

    if (this.unvisited.length === 0) this.finishedGenerating = true;
  }

  markAsVisited(newlyVisitedCell) {
    this.visited[newlyVisitedCell.y][newlyVisitedCell.x] = true;
    this.unvisited.forEach((
      cell,
      index,
    ) => {
      if (cell.x === newlyVisitedCell.x && cell.y === newlyVisitedCell.y) {
        this.unvisited.splice(index, 1);
      }
    });
  }
}

export default Wilsons;
