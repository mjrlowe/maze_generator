import { Algorithm } from "../Algorithm.js";

class Sidewinder extends Algorithm {
  resetVariables() {
    this.currentCell = {
      x: this.start.x,
      y: this.start.y,
    };

    this.runSet = [];
  }

  takeStep() {
    let carveEast = this.random() < 0.5;

    if (this.currentCell.y === 0) carveEast = true;
    if (this.currentCell.x === this.width - 1) carveEast = false;

    this.runSet.push({
      x: this.currentCell.x,
      y: this.currentCell.y,
    });

    //north east corner can't carve north or east
    if (!(this.currentCell.x === this.width - 1 && this.currentCell.y === 0)) {
      if (carveEast) {
        this.removeWall(this.currentCell, "E");

        //carve north
      } else {
        let cell = this.runSet[Math.floor(this.random() * this.runSet.length)];
        this.removeWall(cell, "N");
        this.runSet = [];
      }
    }

    this.currentCell.x++;

    if (this.currentCell.x >= this.width) {
      this.currentCell.x = 0;
      this.currentCell.y++;
      this.runSet = [];
    }

    if (this.currentCell.y >= this.height) {
      this.finishedGenerating = true;
    }
  }
}

export default Sidewinder;
