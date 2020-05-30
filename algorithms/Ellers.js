import Maze from "../Maze.js";

class Eller extends Maze {
  resetVariables() {
    this.rowState = new State(this.xSize).populate();

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
      !(this.rowState.cells[this.currentCell.x] ===
        this.rowState.cells[this.currentCell.x + 1]) &&
      (this.currentCell.y === this.xSize - 1 || this.prng.random() > 0.5)
    ) {
      this.rowState.merge(this.currentCell.x, this.currentCell.x + 1);

      this.removeWall(this.currentCell, "E");
    }

    this.currentCell.x++;

    if (this.currentCell.x >= this.xSize - 1) {
      if (this.currentCell.y === this.ySize - 1) {
        this.finishedGenerating = true;
      } else {
        this.mode = this.VERTICAL;
        this.nextState = this.rowState.next();
        this.verticals = this.computeVerticals();
      }
    }
  }

  computeVerticals() {
    let verticalConnections = [];
    for (let setId in this.rowState.sets) {
      let set = this.rowState.sets[setId];
      set = this.prng.shuffle(set);

      let numberOfCellsToConnect =
        Math.floor(this.prng.random() * (set.length - 1)) + 1;

      for (let i = 0; i < numberOfCellsToConnect; i++) {
        verticalConnections.push(set[i]);
      }
    }

    return verticalConnections.sort();
  }

  verticalStep() {
    //no cells left to connect vertically
    if (this.verticals.length === 0) {
      this.rowState = this.nextState.populate();
      this.currentCell.y++;
      this.initializeRow();
    } else {
      this.currentCell.x = this.verticals.pop();

      this.nextState.add(
        this.currentCell.x,
        this.rowState.cells[this.currentCell.x],
      );

      this.removeWall(this.currentCell, "S");
    }
  }

  step() {
    if (this.mode === this.HORIZONTAL) {
      this.horizontalStep();
    } else {
      this.verticalStep();
    }

    return !this.finishedGenerating;
  }
}

class State {
  constructor(width, counter) {
    this.width = width;
    this.counter = counter ?? 0;
    this.sets = {};
    this.cells = [];
  }

  next() {
    return new State(this.width, this.counter);
  }

  populate() {
    let cell = 0;
    while (cell < this.width) {
      if (!this.cells[cell]) {
        let set = ++this.counter;
        if (!this.sets[set]) this.sets[set] = [];
        this.sets[set].push(cell);
        this.cells[cell] = set;
      }
      cell++;
    }

    return this;
  }

  merge(sink, target) {
    let sinkSet = this.cells[sink];
    let targetSet = this.cells[target];

    this.sets[sinkSet] = this.sets[sinkSet].concat(this.sets[targetSet]);
    for (let cell of this.sets[targetSet]) {
      this.cells[cell] = sinkSet;
    }
    return delete this.sets[targetSet];
  }

  //add cell to set
  add(cell, set) {
    this.cells[cell] = set;
    if (!this.sets[set]) this.sets[set] = [];
    this.sets[set].push(cell);
  }
}

export default Eller;
