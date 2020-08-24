import Maze from "../Maze.js";
import {
  dx,
  dy,
  opposite,
  directions
} from "../directions.js";

class Wilsons extends Maze {
  resetVariables() {
    this.unvisited = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.unvisited.push({
          x,
          y
        });
      }
    }

    this.currentCell = {
      x: this.start.x,
      y: this.start.y,
    };

    this.markAsVisited(currentCell);

    this.state = 0;
    this.remaining = this.width * this.height;
    this.visits = {};
  }

  takeStep() {

    let cell =
      this.unvisited[Math.floor(this.prng.random() * this.unvisited.length)];
    let path = [cell];
    while (cell.x !== this.currentCell.x && cell.y !== this.currentCell.y) {
      let validNeighbours = [];
      for (let direction of directions) {
        let neighbour = {
          x: cell.x + dx[direction],
          y: cell.y + dy[direction],
          direction
        }
        if(this.cellIsInMaze(neighbour)) validNeighbours.push(validNeighbours)
      }
      let newCell = validNeighbours[Math.floor(this.prng.random() * validNeighbours.length)];
      if()
    }

    if (this.unvisited.length === 0) this.finishedGenerating = true;
  }

  markAsVisited(newlyVisitedCell) {

    this.visited[newlyVisitedCell.y][newlyVisitedCell.x] = true;
    this.unvisited.forEach((
      cell,
      index
    ) => {
      if (cell.x === newlyVisitedCell && cell.y === newlyVisitedCell.y) {
        this.unvisited.splice(index, 1);
      }

    })
  }
}

export default Wilsons;