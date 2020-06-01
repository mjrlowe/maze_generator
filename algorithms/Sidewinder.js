import Maze from "../Maze.js";

class Sidewinder extends Maze {
  resetVariables() {
    this.currentCell = {
      x: this.startCell.x,
      y: this.startCell.y,
    };

    this.runSet = [];
  }

  step() {
    let carveEast = this.prng.random() < 0.5;

    if (this.currentCell.y === 0) carveEast = true;
    if (this.currentCell.x === this.xSize - 1) carveEast = false;

    this.runSet.push({
      x: this.currentCell.x,
      y: this.currentCell.y,
    });

    //north east corner can't carve north or east
    if (!(this.currentCell.x === this.xSize - 1 && this.currentCell.y === 0)) {
      if (carveEast) {
        this.removeWall(this.currentCell, "E");

        //carve north
      } else {
        let cell =
          this.runSet[Math.floor(this.prng.random() * this.runSet.length)];
        this.removeWall(cell, "N");
        this.runSet = [];
      }
    }

    this.currentCell.x++;

    if (this.currentCell.x >= this.xSize) {
      this.currentCell.x = 0;
      this.currentCell.y++;
      this.runSet = [];
    }

    if (this.currentCell.y >= this.ySize) {
      this.finishedGenerating = true;
    }

    return !this.finishedGenerating;
  }
}

export default Sidewinder;
