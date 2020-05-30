import DisjointSet from "../DisjointSet.js";
import Maze from "../Maze.js";
import {
  dx,
  dy,
} from "../directions.js";

class Kruskals extends Maze {
  resetVariables() {
    this.disjointSubsets = new DisjointSet(this.xSize * this.ySize);

    this.edges = [];

    let cell = {};
    for (cell.y = 0; cell.y < this.ySize; cell.y++) {
      for (cell.x = 0; cell.x < this.xSize; cell.x++) {
        if (cell.y > 0) {
          this.edges.push({
            ...cell,
            direction: "N",
          });
        }

        if (cell.x > 0) {
          this.edges.push({
            ...cell,
            direction: "W",
          });
        }
      }
    }
    this.edges = this.prng.shuffle(this.edges);
  }

  step() {
    let edge = this.edges.pop();
    let cell1 = {
      x: edge.x,
      y: edge.y,
    };
    let cell2 = {
      x: cell1.x + dx[edge.direction],
      y: cell1.y + dy[edge.direction],
    };

    let cell1Index = this.getCellIndex(cell1);
    let cell2Index = this.getCellIndex(cell2);

    //find the parent cell (what set does this cell belong to?)
    let parentCell1 = this.disjointSubsets.findParent(cell1Index);
    let parentCell2 = this.disjointSubsets.findParent(cell2Index);

    if (parentCell1 !== parentCell2) {
      //remove wall and join sets if they aren't in the same set already
      this.removeWall(cell1, edge.direction);
      this.disjointSubsets.union(cell1Index, cell2Index);
    }

    if (this.edges.length === 0) this.finishedGenerating = true;

    return !this.finishedGenerating;
  }

  getCellIndex(cell) {
    return cell.y * this.xSize + cell.x;
  }
}

export default Kruskals;
