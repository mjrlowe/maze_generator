import { Algorithm } from "../Algorithm.js";

class Ellers extends Algorithm {
  resetVariables() {
    this.cellSets = [];
    this.sets = {};
    for (let y = 0; y < this.height; y++) {
      this.cellSets[y] = [];
      for (let x = 0; x < this.width; x++) {
        const setId = y * this.width + x;
        this.cellSets[y][x] = setId;
        this.sets[setId] = [{ x, y }];
      }
    }

    this.HORIZONTAL = 0;
    this.VERTICAL = 1;

    this.initializeRow();
  }

  initializeRow() {
    this.currentCell.x = 0;
    this.mode = this.HORIZONTAL;
  }

  horizontalStep() {
    if (
      !(this.cellSets[this.currentCell.y][this.currentCell.x] ===
        this.cellSets[this.currentCell.y][this.currentCell.x + 1]) &&
      (this.currentCell.y === this.height - 1 || this.random() > 0.5)
    ) {
      this.merge(
        { x: this.currentCell.x, y: this.currentCell.y },
        { x: this.currentCell.x + 1, y: this.currentCell.y },
      );

      this.removeWall(this.currentCell, "E");
    }

    this.currentCell.x++;

    if (this.currentCell.x >= this.width - 1) {
      if (this.currentCell.y === this.height - 1) {
        this.finishedGenerating = true;
      } else {
        this.mode = this.VERTICAL;
        this.cellsToConnectVertically = this.computeVerticals();
      }
    }
  }

  computeVerticals() {
    let verticalConnections = [];
    for (let setId in this.sets) {
      const set = this.sets[setId];
      const candidates = this.shuffle(set).filter(({ y }) =>
        y === this.currentCell.y
      );
      if (candidates.length > 0) {
        let numberOfCellsToConnect =
          Math.floor(this.random() * (candidates.length - 1)) + 1;

        for (let i = 0; i < numberOfCellsToConnect; i++) {
          verticalConnections.push(candidates[i]);
        }
      }
    }

    return verticalConnections; //.sort();
  }

  verticalStep() {
    //no cells left to connect vertically
    if (this.cellsToConnectVertically.length === 0) {
      this.currentCell.y++;
      this.initializeRow();
    } else {
      this.currentCell.x = this.cellsToConnectVertically.pop().x;

      this.merge(
        this.currentCell,
        { x: this.currentCell.x, y: this.currentCell.y + 1 },
      );

      this.removeWall(this.currentCell, "S");
    }
  }

  takeStep() {
    if (this.mode === this.HORIZONTAL) {
      this.horizontalStep();
    } else {
      this.verticalStep();
    }
  }

  //merge the sets of two cells
  merge(sink, target) {
    let sinkSet = this.cellSets[sink.y][sink.x];
    let targetSet = this.cellSets[target.y][target.x];
    this.sets[sinkSet] = this.sets[sinkSet].concat(this.sets[targetSet]);
    for (let cell of this.sets[targetSet]) {
      this.cellSets[cell.y][cell.x] = sinkSet;
    }
    return delete this.sets[targetSet];
  }
}

export default Ellers;
