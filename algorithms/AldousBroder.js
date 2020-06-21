import Maze from "../Maze.js";
import {
  dx,
  dy,
} from "../directions.js";

class AldousBroder extends Maze {
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
      x: this.startGenerationFrom.x,
      y: this.startGenerationFrom.y,
    };
    this.visited[this.currentCell.y][this.currentCell.x] = true;
    this.totalVisted = 1;
  }

  //called every time the maze needs to be updated
  step() {
    let possibleDirections = [];
    if (this.currentCell.y !== 0) possibleDirections.push("N");
    if (this.currentCell.y !== this.height - 1) possibleDirections.push("S");
    if (this.currentCell.x !== this.width - 1) possibleDirections.push("E");
    if (this.currentCell.x !== 0) possibleDirections.push("W");

    let chosenDirection = possibleDirections[
      Math.floor(this.prng.random() * possibleDirections.length)
    ];
    let newCell = {
      x: this.currentCell.x + dx[chosenDirection],
      y: this.currentCell.y + dy[chosenDirection],
    };

    if (!this.visited[newCell.y][newCell.x]) {
      this.removeWall(this.currentCell, chosenDirection);
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

    return !this.finishedGenerating;
  }
}

export default AldousBroder;
