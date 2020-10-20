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

import createWidget from "./createWidget.js";

class Maze {
  constructor(settings) {
    settings.algorithmId = settings.algorithm
      ? settings.algorithm.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
      : "recursivebacktracker";

    switch (settings.algorithmId) {
      case "10print":
      case "tenprint":
        return new TenPrint(settings);

      case "prim":
      case "prims":
      case "trueprim":
      case "trueprims":
        return new TruePrims(settings);

      case "random":
        return new algorithms[
          Object.keys(
            algorithms,
          )[Math.floor(Math.random() * Object.keys(algorithms).length)]
        ](settings);

      case "depthfirstsearch":
      case "dfs":
      case "randomizeddepthfirstsearch":
      case "randomiseddepthfirstsearch":
      case "rdfs":
      case "recursivebacktracker":
        return new RecursiveBacktracker(settings);

      case "kruskal":
      case "kruskals":
        return new Kruskals(settings);

      case "simplifiedprim":
      case "simplifiedprims":
        return new SimplifiedPrims(settings);

      case "modifiedprim":
      case "modifiedprims":
        return new ModifiedPrims(settings);

      case "aldousbroder":
        return new AldousBroder(settings);

      case "binary":
      case "binarytree":
        return new BinaryTree(settings);

      case "sidewinder":
        return new Sidewinder(settings);

      case "huntandkill":
        return new HuntAndKill(settings);

      case "eller":
      case "ellers":
        return new Ellers(settings);

      case "wilson":
      case "wilsons":
        return new Wilsons(settings);

      case "recursivedivision":
      case "division":
        return new RecursiveDivision(settings);

      default:
        throw "Invalid algorithm";
    }
  }
}

Maze.createWidget = createWidget;

export default Maze;
