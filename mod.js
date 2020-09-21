import Maze from "./src/Maze.js";

import createWidget from "./src/createWidget.js";

import Sidewinder from "./src/algorithms/Sidewinder.js";
import RecursiveBacktracker from "./src/algorithms/RecursiveBacktracker.js";
import HuntAndKill from "./src/algorithms/HuntAndKill.js";
import Ellers from "./src/algorithms/Ellers.js";
import AldousBroder from "./src/algorithms/AldousBroder.js";
import RecursiveDivision from "./src/algorithms/RecursiveDivision.js";
import SimplifiedPrims from "./src/algorithms/SimplifiedPrims.js";
import ModifiedPrims from "./src/algorithms/ModifiedPrims.js";
import Kruskals from "./src/algorithms/Kruskals.js";
import BinaryTree from "./src/algorithms/BinaryTree.js";
import Wilsons from "./src/algorithms/Wilsons.js";
import TruePrims from "./src/algorithms/TruePrims.js";
import TenPrint from "./src/algorithms/10Print.js";

Maze.createWidget = createWidget;

Maze.algorithms = {
  HuntAndKill,
  RecursiveBacktracker,
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

export { Maze };
