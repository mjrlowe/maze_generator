import Algorithm from "../Algorithm.js";
import { dx, dy } from "../directions.js";

class Kruskals extends Algorithm {
  resetVariables() {
    this.disjointSubsets = new DisjointSet(this.width * this.height);

    this.edges = [];

    let cell = {};
    for (cell.y = 0; cell.y < this.height; cell.y++) {
      for (cell.x = 0; cell.x < this.width; cell.x++) {
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
    this.edges = this.shuffle(this.edges);
  }

  takeStep() {
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
  }

  getCellIndex(cell) {
    return cell.y * this.width + cell.x;
  }
}

export default Kruskals;

class DisjointSet {
  constructor(numberOfItems = 0) {
    //Array of items. Each item has an index which points to the parent set.
    this.sets = [];

    //record the size of the sets so we know which one should win (only at the parent index)
    this.setSizes = [];

    for (let i = 0; i < numberOfItems; i++) {
      this.sets[i] = i;
      this.setSizes[i] = 1;
    }
  }

  findParent(index) {
    let parentIndex = this.sets[index];

    //if the parent is itself, then it has no parent so it must be the parent of the set
    if (parentIndex === index) {
      return index;
    }

    //recusively find parent until it has no parent (parent is self)
    let rootParentIndex = this.findParent(parentIndex);

    //save it for later so we don't have to go searching that far up the tree again
    this.sets[index] = rootParentIndex;
    return rootParentIndex;
  }

  //join 2 sets together
  union(index1, index2) {
    let parent1 = this.findParent(index1);
    let parent2 = this.findParent(index2);

    //the bigger set should always win, so that we can avoid flickering when visualising the sets
    if (this.setSizes[parent1] >= this.setSizes[parent2]) {
      this.sets[parent2] = parent1;
      this.setSizes[parent1] += this.setSizes[parent2];
    } else {
      this.sets[parent1] = parent2;
      this.setSizes[parent2] += this.setSizes[parent1];
    }
  }
}
