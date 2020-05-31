import Maze from "./Maze.js";

import Sidewinder from "./algorithms/Sidewinder.js";
import RecursiveBacktracker from "./algorithms/RecursiveBacktracker.js";
import HuntAndKill from "./algorithms/HuntAndKill.js";
import Ellers from "./algorithms/Ellers.js";
import AldousBroder from "./algorithms/AldousBroder.js";
import RecursiveDivision from "./algorithms/RecursiveDivision.js";
import SimplifiedPrims from "./algorithms/SimplifiedPrims.js";
import ModifiedPrims from "./algorithms/ModifiedPrims.js";
import Kruskals from "./algorithms/Kruskals.js";
import BinaryTree from "./algorithms/BinaryTree.js";
import Wilsons from "./algorithms/Wilsons.js";

Maze.algorithms = {
  huntandkill: HuntAndKill,
  recursivebacktracker: RecursiveBacktracker,
  kruskals: Kruskals,
  ellers: Ellers,
  aldousbroder: AldousBroder,
  simplifiedprims: SimplifiedPrims,
  recursivedivision: RecursiveDivision,
  modifiedprims: ModifiedPrims,
  sidewinder: Sidewinder,
  binarytree: BinaryTree,
  wilsons: Wilsons,
};

export {default as analyze} from "./analyze.js";
export {default as solve} from "./solve.js";

export {
  Maze,
  Sidewinder,
  RecursiveBacktracker,
  HuntAndKill,
  Ellers,
  AldousBroder,
  RecursiveDivision,
  SimplifiedPrims,
  ModifiedPrims,
  Kruskals,
  BinaryTree,
  Wilsons,
};
