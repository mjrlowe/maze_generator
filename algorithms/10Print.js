import Maze from "../Maze.js";
import {
  opposite
} from "../directions.js";

class TenPrint extends Maze {
  resetVariables() {
    this.currentCell = {
      x: 0,
      y: 0
    }
  }

  takeStep() {
    let passageDirection = this.prng.random() < 0.5 ? "S" : "E";
    this.removeWall({
      x: this.currentCell.x,
      y: this.currentCell.y
    }, passageDirection);
    this.removeWall({
      x: this.currentCell.x,
      y: this.currentCell.y
    }, opposite[passageDirection]);
    this.currentCell.x += 2;
    if (this.currentCell.x >= this.width) {
      this.currentCell.y++;
      this.currentCell.x = y % 2;
      if (this.currentCell.y >= this.height) this.finishedGenerating = true;
    }

  }

}


export default TenPrint;