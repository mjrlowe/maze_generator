import { Algorithm } from "../Algorithm.js";
import { dx, dy } from "../directions.js";

class BinaryTree extends Algorithm {
  takeStep() {
    const validConnections = ["S", "E"].map((direction) => ({
      x: this.currentCell.x + dx[direction],
      y: this.currentCell.y + dy[direction],
      direction,
    })).filter((cell) => this.cellIsInMaze(cell));

    const passageDirection = this.selectNeighbor(validConnections).direction;

    this.removeWall(this.currentCell, passageDirection);

    this.currentCell.x++;

    if (this.currentCell.x > this.width - 1) {
      this.currentCell.x = 0;
      this.currentCell.y++;
    }

    //finish without doing the corner cell as we can't branch east or south
    if (
      this.currentCell.x === this.width - 1 &&
      this.currentCell.y === this.height - 1
    ) {
      this.finishedGenerating = true;
    }
  }
}

export default BinaryTree;
