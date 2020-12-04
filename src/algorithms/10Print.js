import { Algorithm } from "../Algorithm.js";
import { dx, dy, opposite } from "../directions.js";

class TenPrint extends Algorithm {
  resetVariables() {
    this.currentCell = {
      x: 0,
      y: 0,
    };
    this.allowOutsideConnections = false;
  }

  takeStep() {
    const possibleConnections = ["S", "E"].map((direction) => ({
      x: this.currentCell.x + dx[direction],
      y: this.currentCell.y + dy[direction],
      direction,
    }));
    const neighbor1 = this.selectNeighbor(possibleConnections);
    let neighbor2 = {
      x: this.currentCell.x + dx[opposite[neighbor1.direction]],
      y: this.currentCell.y + dy[opposite[neighbor1.direction]],
      direction: opposite[neighbor1.direction],
    };

    if (this.cellIsInMaze(neighbor1) || this.allowOutsideConnections) {
      this.removeWall({
        x: this.currentCell.x,
        y: this.currentCell.y,
      }, neighbor1.direction);
    }
    if (this.cellIsInMaze(neighbor2) || this.allowOutsideConnections) {
      this.removeWall({
        x: this.currentCell.x,
        y: this.currentCell.y,
      }, neighbor2.direction);
    }

    this.currentCell.x += 2;
    if (this.currentCell.x >= this.width) {
      this.currentCell.y++;
      this.currentCell.x = this.currentCell.y % 2;
      if (this.currentCell.y >= this.height) this.finishedGenerating = true;
    }
  }
}

export default TenPrint;
