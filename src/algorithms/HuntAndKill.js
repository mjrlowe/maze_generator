import { Algorithm } from "../Algorithm.js";
import { dx, dy } from "../directions.js";

class HuntAndKill extends Algorithm {
  resetVariables() {
    this.startHuntingFrom = {
      x: this.currentCell.x,
      y: this.currentCell.y,
    };

    this.hunting = false;

    this.visited = [];
    for (let y = 0; y < this.height; y++) {
      this.visited[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.visited[y][x] = false;
      }
    }
  }

  takeStep() {
    //random walk
    if (!this.hunting) {
      this.visited[this.currentCell.y][this.currentCell.x] = true;

      let unvisitedNeighbors = this.getUnvisitedNeighbors();

      if (unvisitedNeighbors.length > 0) {
        let newCell = this.selectNeighbor(unvisitedNeighbors);
        this.removeWall(this.currentCell, newCell.direction);
        this.currentCell = {
          x: newCell.x,
          y: newCell.y,
        };

        if (
          Math.max(this.currentCell.y - 1, 0) < this.startHuntingFrom.y ||
          (Math.max(this.currentCell.x - 1, 0) < this.startHuntingFrom.x &&
            Math.max(this.currentCell.y - 1, 0) === this.startHuntingFrom.y)
        ) {
          if (this.currentCell.y !== 0) {
            this.startHuntingFrom = {
              x: this.currentCell.x,
              y: this.currentCell.y - 1,
            };
          } else if (this.currentCell.x !== 0) {
            this.startHuntingFrom = {
              x: this.currentCell.x - 1,
              y: this.currentCell.y,
            };
          } else {
            this.startHuntingFrom = {
              x: this.currentCell.x,
              y: this.currentCell.y,
            };
          }
        }
      } else {
        this.hunting = true;
        this.currentCell = {
          x: this.startHuntingFrom.x,
          y: this.startHuntingFrom.y,
        };
      }
      // this.visited[this.currentCell.y][this.currentCell.x] = true;

      //hunt
    } else {
      if (!this.visited[this.currentCell.y][this.currentCell.x]) {
        let visitedDirections = [];
        for (let direction of ["N", "S", "E", "W"]) {
          let neighbour = {
            x: this.currentCell.x + dx[direction],
            y: this.currentCell.y + dy[direction],
          };
          if (
            this.cellIsInMaze(neighbour) &&
            this.visited[neighbour.y][neighbour.x]
          ) {
            visitedDirections.push(direction);
          }
        }
        if (visitedDirections.length > 0) {
          if (
            this.currentCell.y !== 0 &&
            !this.visited[this.currentCell.y - 1][this.currentCell.x]
          ) {
            this.startHuntingFrom = {
              x: this.currentCell.x,
              y: this.currentCell.y - 1,
            };
          } else {
            this.startHuntingFrom = {
              x: this.currentCell.x,
              y: this.currentCell.y,
            };
          }
          let chosenDirection = visitedDirections[
            Math.floor(this.random() * visitedDirections.length)
          ];
          //this.visited[this.currentCell.y][this.currentCell.x] = true;
          this.removeWall(this.currentCell, chosenDirection);
          //this.currentCell = neighbour;
          this.hunting = false;
        }
      }

      //move on to the next cell if we are still hunting
      if (this.hunting) {
        this.currentCell.x++;
        if (this.currentCell.x >= this.width) {
          this.currentCell.x = 0;
          this.currentCell.y++;
        }

        //finished with the maze
        if (this.currentCell.y >= this.height) {
          this.finishedGenerating = true;
          this.currentCell.y = 0;
        }
      }
    }
  }
}

export default HuntAndKill;
