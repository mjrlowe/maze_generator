import { Algorithm } from "../Algorithm.js";
import { dx, dy } from "../directions.js";

class Sidewinder extends Algorithm {
  resetVariables() {
    this.currentCell = {
      x: this.start.x,
      y: this.start.y,
    };

    this.runSet = [];
  }

  takeStep() {
    this.runSet.push({
      x: this.currentCell.x,
      y: this.currentCell.y,
    });

    const possibleCarveDirections = [];
    if (this.currentCell.x !== this.width - 1) {
      possibleCarveDirections.push("E");
    }
    if (this.currentCell.y !== 0) possibleCarveDirections.push("N");

    if (possibleCarveDirections.length > 0) {
      const carveDirection = this.selectNeighbor(
        possibleCarveDirections.map((direction) => ({
          x: this.currentCell.x + dx[direction],
          y: this.currentCell.y + dy[direction],
          direction,
        })),
      ).direction;

      if (carveDirection === "N") {
        let cell = this.runSet[Math.floor(this.random() * this.runSet.length)];
        this.removeWall(cell, "N");
        this.runSet = [];
      } else {
        this.removeWall(this.currentCell, "E");
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
