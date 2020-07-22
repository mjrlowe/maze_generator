import Maze from "../Maze.js";
import { dx, dy, opposite, directions } from "../directions.js";

class Wilsons extends Maze {
  resetVariables() {
    this.visited = [];
    for (let y = 0; y < this.height; y++) {
      this.visited[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.visited[y][x] = 0;
      }
    }
    this.totalVisted = 0;

    this.currentCell = {
      x: this.start.x,
      y: this.start.y,
    };

    this.state = 0;
    this.remaining = this.width * this.height;
    this.visits = {};
  }

  isVisited(x, y) {
    return Boolean(this.visits[`${x}:${y}`]);
  }

  addVisit(x, y, dir = "S") {
    console.log("🎻", x, y, dir);
    this.visits[`${x}:${y}`] = dir;
    this.visited[y][x]++;
  }

  exitTaken(x, y) {
    return this.visits[`${x}:${y}`];
  }

  startStep() {
    this.remaining--;
    this.state = 1;
  }

  startWalkStep() {
    this.visits = {};
    let i = 0;
    while (i++ < 10000) {
      this.x = Math.floor(this.prng.random() * this.width);
      this.y = Math.floor(this.prng.random() * this.height);
      console.log("oo", this, this.x, this.y, JSON.stringify(this));
      if (!this.visited[this.y][this.x]) {
        this.state = 2;
        this.start = {
          x: this.x,
          y: this.y,
        };
        this.addVisit(this.x, this.y);
        break;
      }
    }

    console.log("i", i, this);
  }

  walkStep() {
    for (let direction of this.prng.shuffle(directions)) {
      let nx = this.x + dx[direction];
      let ny = this.y + dy[direction];

      if (this.cellIsInMaze({ x: nx, y: ny })) {
        console.log(67, nx, ny, JSON.stringify(this));

        let x = this.x;
        let y = this.y;
        this.x = nx;
        this.y = ny;

        if (this.isVisited(nx, ny)) {
          this.eraseLoopFrom(nx, ny);
        } else {
          this.addVisit(x, y, direction);
        }

        if (this.visited[ny][nx]) {
          this.x = this.start.x;
          this.y = this.start.y;
          this.state = 3;
        }

        break;
      }
    }
  }

  resetVisits() {
    for (let key in this.visits) {
      delete this.visits[key];
    }
  }

  runStep() {
    if (this.remaining > 0) {
      let dir = this.exitTaken(this.x, this.y);
      let nx = this.x + dx[dir];
      let ny = this.y + dy[dir];

      console.log("🏃‍♀️", nx, ny, dir, JSON.stringify(this));

      if (this.cellIsInMaze({ x: nx, y: ny }) && !this.visited[ny][nx]) {
        this.resetVisits();
        this.state = 1;
      }

      this.removeWall(this.x, this.y, dir);

      this.x = nx;
      this.y = ny;

      if (this.state === 1) {
        delete this.x;
        delete this.y;
      }

      this.remaining--;
    }

    return !this.finishedGenerating;
  }

  takeStep() {
    switch (this.state) {
      case 0:
        this.startStep();
        break;
      case 1:
        this.startWalkStep();
        break;
      case 2:
        this.walkStep();
        break;
      case 3:
        this.runStep();
        break;
      default:
        console.error(
          `Erm you shouldn't be seeing this, the state (${this.state}) is not valid. Defaulting to walk step`,
        );
        this.walkStep();
    }

    if (this.remaining === 0) this.finishedGenerating = true;
  }

  eraseLoopFrom(x, y) {
    let i = 0;
    while (i++ < 10000) {
      let dir = this.exitTaken(x, y);
      if (!dir) break;

      let nx = x + dx[dir];
      let ny = y + dy[dir];
      this.visited[y][x]--;

      let key = `${x}:${y}`;
      delete this.visits[key];

      x = nx;
      y = ny;
    }
  }
}

export default Wilsons;
