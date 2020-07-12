import Maze from "../Maze.js";
import opposite from "../directions.js";

class TenPrint extends Maze {
  resetVariables() {
    this.currentCell = {
      x: 0,
      y: 0
    }
  }

  takeStep() {
    for (let y = 0; y < this.height; y++)
      for (let x = y % 2; x < this.width; x += 2) {
        let passageDirection = this.prng.random() < 0.5 ? "S" : "E";
        this.removeWall({
          x,
          y
        }, passageDirection);
        this.removeWall({
          x,
          y
        }, opposite[passageDirection]);
      }
  }

}


export default TenPrint;