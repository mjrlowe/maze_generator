import Algorithm from "../Algorithm.js";
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
    let passageDirection = this.random() < 0.5 ? "S" : "E";
    let neighbor1 = {
      x: this.currentCell.x + dx[passageDirection],
      y: this.currentCell.y + dy[passageDirection],
    };
    let neighbor2 = {
      x: this.currentCell.x + dx[opposite[passageDirection]],
      y: this.currentCell.y + dy[opposite[passageDirection]],
    };

    if (this.cellIsInMaze(neighbor1) || this.allowOutsideConnections) {
      this.removeWall({
        x: this.currentCell.x,
        y: this.currentCell.y,
      }, passageDirection);
    }
    if (this.cellIsInMaze(neighbor2) || this.allowOutsideConnections) {
      this.removeWall({
        x: this.currentCell.x,
        y: this.currentCell.y,
      }, opposite[passageDirection]);
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
