import Maze from "../Maze.js";

class BinaryTree extends Maze {
  step() {
    let passageDirection = this.prng.random() < 0.5 ? "S" : "E";
    if (this.currentCell.x === this.xSize - 1) passageDirection = "S";
    if (this.currentCell.y === this.ySize - 1) passageDirection = "E";

    this.removeWall(this.currentCell, passageDirection);

    this.currentCell.x++;

    if (this.currentCell.x > this.xSize - 1) {
      this.currentCell.x = 0;
      this.currentCell.y++;
    }

    //finish without doing the corner cell as we can't branch east or south
    if (
      this.currentCell.x === this.xSize - 1 &&
      this.currentCell.y === this.ySize - 1
    ) {
      this.finishedGenerating = true;
    }

    return !this.finishedGenerating;
  }
}

export default BinaryTree;
