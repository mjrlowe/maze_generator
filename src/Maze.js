import RecursiveBacktracker from "./algorithms/RecursiveBacktracker.js";
import Sidewinder from "./algorithms/Sidewinder.js";
import HuntAndKill from "./algorithms/HuntAndKill.js";
import Ellers from "./algorithms/Ellers.js";
import AldousBroder from "./algorithms/AldousBroder.js";
import RecursiveDivision from "./algorithms/RecursiveDivision.js";
import SimplifiedPrims from "./algorithms/SimplifiedPrims.js";
import ModifiedPrims from "./algorithms/ModifiedPrims.js";
import Kruskals from "./algorithms/Kruskals.js";
import BinaryTree from "./algorithms/BinaryTree.js";
import Wilsons from "./algorithms/Wilsons.js";
import TruePrims from "./algorithms/TruePrims.js";
import TenPrint from "./algorithms/10Print.js";

const algorithms = {
  RecursiveBacktracker,
  Sidewinder,
  HuntAndKill,
  Ellers,
  AldousBroder,
  RecursiveDivision,
  SimplifiedPrims,
  ModifiedPrims,
  Kruskals,
  BinaryTree,
  Wilsons,
  TruePrims,
  TenPrint,
};

import createWidget from "./createWidget.js";

import mazeString from "./print.js";
import display from "./display.js";
import calculateDistances from "./distances.js";
import solve from "./solve.js";
import braid from "./braid.js";
import analyze from "./analyze.js";

//Publicly exposed APIs should go in Maze

class Maze {
  constructor(settings) {
    const algorithmName = settings.algorithm
      ? settings.algorithm.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
      : "recursivebacktracker";

    switch (algorithmName) {
      case "10print":
      case "tenprint":
        this.algorithm = new TenPrint(settings);
        break;

      case "prim":
      case "prims":
      case "trueprim":
      case "trueprims":
        this.algorithm = new TruePrims(settings);
        break;

      case "random":
        this.algorithm = new algorithms[
          Object.keys(
            algorithms,
          )[Math.floor(Math.random() * Object.keys(algorithms).length)]
        ](settings);
        break;

      case "depthfirstsearch":
      case "dfs":
      case "randomizeddepthfirstsearch":
      case "randomiseddepthfirstsearch":
      case "rdfs":
      case "recursivebacktracker":
        this.algorithm = new RecursiveBacktracker(settings);
        break;

      case "kruskal":
      case "kruskals":
        this.algorithm = new Kruskals(settings);
        break;

      case "simplifiedprim":
      case "simplifiedprims":
        this.algorithm = new SimplifiedPrims(settings);
        break;

      case "modifiedprim":
      case "modifiedprims":
        this.algorithm = new ModifiedPrims(settings);
        break;

      case "aldousbroder":
        this.algorithm = new AldousBroder(settings);
        break;

      case "binary":
      case "binarytree":
        this.algorithm = new BinaryTree(settings);
        break;

      case "sidewinder":
        this.algorithm = new Sidewinder(settings);
        break;

      case "huntandkill":
        this.algorithm = new HuntAndKill(settings);
        break;

      case "eller":
      case "ellers":
        this.algorithm = new Ellers(settings);
        break;

      case "wilson":
      case "wilsons":
        this.algorithm = new Wilsons(settings);
        break;

      case "recursivedivision":
      case "division":
        this.algorithm = new RecursiveDivision(settings);
        break;

      default:
        throw "Invalid algorithm name";
    }

    this.reset();
  }

  reset() {
    this.algorithm.reset();
  }

  step() {
    if (this.algorithm.finishedGenerating) return false;
    this.algorithm.takeStep();
    return !this.algorithm.finishedGenerating;
  }

  generate() {
    let i = 0;
    while (!this.algorithm.finishedGenerating && ++i < 1000000) {
      this.step();
    }

    return this;
  }

  printString() {
    console.log(this.getString());
  }

  display(settings) {
    return display({ ...settings, maze: this });
  }

  braid(settings) {
    return braid({ maze: this });
  }

  getSolution(
    start = this.entrance,
    finish = this.exit,
  ) {
    return solve(this, start, finish);
  }

  getAnalysis() {
    return analyze(this);
  }

  getString() {
    return mazeString(this);
  }

  getDistances(distanceFrom) {
    return calculateDistances({ maze: this, distanceFrom });
  }
}

Maze.createWidget = createWidget;

// export default Maze;
export { algorithms, Maze };
