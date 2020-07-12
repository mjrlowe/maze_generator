import Maze from "../Maze.js";
import { dx, dy, opposite, directions } from "../directions.js";

class Wilsons extends Maze {
  resetVariables() {
    this.unvisited = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.unvisited .push(`${x},${y}`);
      }
    }

    this.currentCell = {
      x: this.start.x,
      y: this.start.y,
    };
    this.unvisited.splice(this.unvisited.indexOf(`${currentCell.x},${currentCell.y}`), 1);

    this.state = 0;
    this.remaining = this.width * this.height;
    this.visits = {};
  }

  takeStep(){
    curre
    while(this.unvisited.length > 0){
      let cell = this.unvisited[Math.floor(this.prng.random()*this.unvisited.length)];
      let path = [cell];
      while(this.unvisited.indexOf(`${currentCell.x},${currentCell.y}`) !== -1){
      }
    }

    if(this.unvisited.length === 0 ) this.finishedGenerating = true;
  }
}

export default Wilsons;
