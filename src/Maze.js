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
  HuntAndKill,
  Kruskals,
  Ellers,
  AldousBroder,
  SimplifiedPrims,
  RecursiveDivision,
  ModifiedPrims,
  Sidewinder,
  BinaryTree,
  TruePrims,
  TenPrint,
  Wilsons,
};

class Maze {
  constructor(settings) {
    settings.algorithmId = settings.algorithm
      ? settings.algorithm.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
      : "recursivebacktracker";

    switch (settings.algorithmId) {
      case "10print":
      case "tenprint":
        return new algorithms.TenPrint(settings);

      case "prim":
      case "prims":
      case "trueprim":
      case "trueprims":
        return new algorithms.TruePrims(settings);

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
        return new algorithms.RecursiveBacktracker(settings);

      case "kruskal":
      case "kruskals":
        return new algorithms.Kruskals(settings);

      case "simplifiedprim":
      case "simplifiedprims":
        return new algorithms.SimplifiedPrims(settings);

      case "modifiedprim":
      case "modifiedprims":
        return new algorithms.ModifiedPrims(settings);

      case "aldousbroder":
        return new algorithms.AldousBroder(settings);

      case "binary":
      case "binarytree":
        return new algorithms.BinaryTree(settings);

      case "sidewinder":
        return new algorithms.Sidewinder(settings);

      case "huntandkill":
        return new algorithms.HuntAndKill(settings);

      case "eller":
      case "ellers":
        return new algorithms.Ellers(settings);

      case "wilson":
      case "wilsons":
        return new algorithms.Wilsons(settings);

      case "recursivedivision":
      case "division":
        return new algorithms.RecursiveDivision(settings);

      default:
        throw "Invalid algorithm";
    }
  }
}

export default Maze;
