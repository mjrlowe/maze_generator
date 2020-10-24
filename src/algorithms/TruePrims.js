import { Algorithm } from "../Algorithm.js";
import { directions, dx, dy, opposite } from "../directions.js";

class TruePrims extends Algorithm {
  resetVariables() {
    this.visited = [];
    this.costs = [];
    for (let y = 0; y < this.height; y++) {
      this.visited[y] = [];
      this.costs[y] = [];
      for (let x = 0; x < this.width; x++) {
        //mark every cell as unvisited
        this.visited[y][x] = false;

        this.costs[y][x] = {};
        for (let direction of directions) {
          let isBorderWall = !this.cellIsInMaze({
            x: x + dx[direction],
            y: y + dy[direction],
          });

          let passageCost = isBorderWall ? Infinity : this.random();

          if ((direction === "N" || direction === "W") && !isBorderWall) {
            passageCost ==
              this
                .costs[y + dy[direction]][x + dx[direction]][
                opposite[direction]
              ];
          }

          this.costs[y][x][direction] = passageCost;
        }
      }
    }
    this.totalVisted = 0;

    this.activePassages = [];

    let startCell = {
      x: this.start.x,
      y: this.start.y,
    };

    for (let direction of directions) {
      this.activePassages.push({ x: startCell.x, y: startCell.y, direction });
    }

    this.visited[startCell.y][startCell.x] = true;
  }

  takeStep() {
    //find index of cell with minimum cost
    let minCost = Infinity;
    let passageIndex = 0;
    this.activePassages.forEach((passage, index) => {
      if (this.costs[passage.y][passage.x][passage.direction] < minCost) {
        minCost = this.costs[passage.y][passage.x][passage.direction];
        passageIndex = index;
      }
    });

    let passage = this.activePassages[passageIndex];

    let newCell = {
      x: passage.x + dx[passage.direction],
      y: passage.y + dy[passage.direction],
    };

    if (this.cellIsInMaze(newCell) && !this.visited[newCell.y][newCell.x] > 0) {
      this.removeWall({ x: passage.x, y: passage.y }, passage.direction);
      this.visited[newCell.y][newCell.x] = true;
      this.totalVisted++;

      for (let direction of directions) {
        if (direction !== opposite[passage.direction]) {
          this.activePassages.push({ x: newCell.x, y: newCell.y, direction });
        }
      }
    } else {
      this.activePassages.splice(passageIndex, 1);
    }

    if (this.activePassages.length === 0 || minCost === Infinity) {
      this.finishedGenerating = true;
    }
  }
}

export default TruePrims;
