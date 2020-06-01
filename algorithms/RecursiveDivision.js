import Maze from "../Maze.js";

class RecursiveDivision extends Maze {
  resetVariables() {
    for (let y = 0; y < this.ySize; y++) {
      for (let x = 0; x < this.xSize; x++) {
        if (y < this.ySize - 1) this.removeWall({ x, y }, "S");
        if (x < this.xSize - 1) this.removeWall({ x, y }, "E");
      }
    }

    this.stack = [{
      x: 0,
      y: 0,
      width: this.xSize,
      height: this.ySize,
    }];
    this.CHOOSE_REGION = 0;
    this.MAKE_WALL = 1;
    this.MAKE_PASSAGE = 2;

    this.HORIZONTAL = 1;
    this.VERTICAL = 2;

    this.state = this.CHOOSE_REGION;
  }

  chooseOrientation(width, height) {
    if (width < height) {
      return this.HORIZONTAL;
    } else if (height < width) {
      return this.VERTICAL;
    } else if (this.prng.random() > 0.5) {
      return this.HORIZONTAL;
    } else {
      return this.VERTICAL;
    }
  }

  step() {
    switch (this.state) {
      case this.CHOOSE_REGION:
        this.chooseRegion();
        break;
      case this.MAKE_WALL:
        this.makeWall();
        break;
      case this.MAKE_PASSAGE:
        this.makePassage();
        break;
      default:
        console.error(
          "RECUSIVE DIVISION: Defaulting state, maze.state = ",
          this.state,
        );
    }

    return !this.finishedGenerating;
  }

  chooseRegion() {
    this.region = this.stack.pop();

    if (this.region) {
      this.state = this.MAKE_WALL;
      return true;
    } else {
      return false;
    }
  }

  makeWall() {
    this.horizontal =
      this.chooseOrientation(this.region.width, this.region.height) ===
        this.HORIZONTAL;

    // where will the wall be drawn?
    this.wallStartCell = {
      x: (this.region.x +
        (this.horizontal
          ? 0
          : Math.floor(this.prng.random() * (this.region.width - 2)))),
      y: (this.region.y +
        (this.horizontal
          ? Math.floor(this.prng.random() * (this.region.height - 2))
          : 0)),
    };

    // what direction will the wall be drawn?
    let dxt = this.horizontal ? 1 : 0;
    let dyt = this.horizontal ? 0 : 1;

    // how long will the wall be?
    let length = this.horizontal ? this.region.width : this.region.height;

    // what direction is perpendicular to the wall?
    this.dir = this.horizontal ? "S" : "E";

    let currentWallCell = {
      x: this.wallStartCell.x,
      y: this.wallStartCell.y,
    };

    while (length > 0) {
      this.addWall(currentWallCell, this.dir);

      currentWallCell.x += dxt;
      currentWallCell.y += dyt;
      length--;
    }

    this.state = this.MAKE_PASSAGE;
    
    return true;
  }

  makePassage() {
    // where will the passage through the wall exist?
    let passage = {
      x: (this.wallStartCell.x +
        (this.horizontal
          ? Math.floor(this.prng.random() * this.region.width)
          : 0)),
      y: (this.wallStartCell.y +
        (this.horizontal ? 0
        : Math.floor(this.prng.random() * this.region.height))),
    };

    this.removeWall(passage, this.dir);

    let width = this.horizontal
      ? this.region.width
      : this.wallStartCell.x - this.region.x + 1;
    let height = this.horizontal
      ? this.wallStartCell.y - this.region.y + 1
      : this.region.height;
    if (width >= 2 && height >= 2) {
      this.stack.push({
        x: this.region.x,
        y: this.region.y,
        width: width,
        height: height,
      });
    }

    let x = this.horizontal ? this.region.x : this.wallStartCell.x + 1;
    let y = this.horizontal ? this.wallStartCell.y + 1 : this.region.y;
    width = this.horizontal
      ? this.region.width
      : this.region.x + this.region.width - this.wallStartCell.x - 1;
    height = this.horizontal
      ? this.region.y + this.region.height - this.wallStartCell.y - 1
      : this.region.height;

    if (width >= 2 && height >= 2) {
      this.stack.push({ x, y, width, height });
    }

    this.state = this.CHOOSE_REGION;
    return true;
  }
}

export default RecursiveDivision;
