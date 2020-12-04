import { Algorithm } from "../Algorithm.js";
import { directions, dx, dy } from "../directions.js";

class AldousBroder extends Algorithm {
  //called when the maze is intitalized
  resetVariables() {
    this.visited = [];
    for (let y = 0; y < this.height; y++) {
      this.visited[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.visited[y][x] = false;
      }
    }

    this.currentCell = {
      x: this.start.x,
      y: this.start.y,
    };
    this.visited[this.currentCell.y][this.currentCell.x] = true;
    this.totalVisted = 1;
  }

  //called every time the maze needs to be updated
  takeStep() {
    let possibleConnections = directions.map((direction) => ({
      x: this.currentCell.x + dx[direction],
      y: this.currentCell.y + dy[direction],
      direction,
    })).filter((neighbor) => this.cellIsInMaze(neighbor));

    const newCell = this.selectNeighbor(possibleConnections);

    if (!this.visited[newCell.y][newCell.x]) {
      this.removeWall(this.currentCell, newCell.direction);
      this.visited[newCell.y][newCell.x] = true;
      this.totalVisted++;
    }

    this.currentCell = {
      x: newCell.x,
      y: newCell.y,
    };

    if (this.totalVisted >= this.width * this.height) {
      this.finishedGenerating = true;
    }
  }
}

export default AldousBroder;
