import { Algorithm } from "../Algorithm.js";
import { directions, dx, dy } from "../directions.js";

class GrowingTree extends Algorithm {
  resetVariables(mazeSettings) {
    this.visited = [];
    for (let y = 0; y < this.height; y++) {
      this.visited[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.visited[y][x] = 0;
      }
    }
    this.totalVisted = 0;

    this.list = [];

    let startCell = { ...this.start };
    this.list.push(startCell);
    this.visited[startCell.y][startCell.x] = 1;
  }

  takeStep() {
    const selectedMethod = this.selectMethod(this.cellSelectionMethod);
    this.currentCell = this.list[this.selectCell(selectedMethod)];
    const unvisitedNeighbors = this.getUnvisitedNeighbors();

    if (unvisitedNeighbors.length > 0) {
      let newCell = this.selectNeighbor(unvisitedNeighbors);
      this.removeWall(this.currentCell, newCell.direction);
      this.visited[newCell.y][newCell.x]++;
      this.totalVisted++;

      this.list.push({
        x: newCell.x,
        y: newCell.y,
      });
    } else {
      const index = this.list.findIndex(
        (cell) => cell.x === this.currentCell.x && cell.y == this.currentCell.y,
      );
      this.list.splice(index, 1);
    }

    if (this.list.length === 0) {
      this.finishedGenerating = true;
    }
  }

  selectMethod(cellSelectionMethod) {
    if (typeof cellSelectionMethod === "string") return cellSelectionMethod;

    const selectionMethods = ["newest", "oldest", "middle", "random"];
    let selectedMethods = [];
    for (const key of Object.keys(cellSelectionMethod)) {
      if (selectionMethods.includes(key)) {
        selectedMethods.push({ method: key, weight: cellSelectionMethod[key] });
      }
    }

    if (selectedMethods.length == 0) throw "Invalid cell selection method";

    const sum = selectedMethods.reduce((a, b) => a + b.weight, 0);
    let acc = 0;

    selectedMethods = selectedMethods.map((method) => {
      return { ...method, weight: (acc += method.weight) };
    });

    const rand = this.random() * sum;
    const res = selectedMethods.find((method) => rand <= method.weight);

    return res.method;
  }

  selectCell(selectionMethod) {
    switch (selectionMethod) {
      case "newest":
        return this.list.length - 1;
      case "oldest":
        return 0;
      case "middle":
        return Math.floor(this.list.length / 2);
      case "random":
        return Math.floor(this.random() * this.list.length);
      default:
        throw "Invalid cell selection method";
    }
  }
}

export default GrowingTree;
