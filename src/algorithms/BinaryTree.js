import {Algorithm} from "../Algorithm.js";

class BinaryTree extends Algorithm {
  takeStep() {
    let passageDirection = this.random() < 0.5 ? "S" : "E";
    if (this.currentCell.x === this.width - 1) passageDirection = "S";
    if (this.currentCell.y === this.height - 1) passageDirection = "E";

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
