import Maze from "./Maze.js";

import createWidget from "./createWidget.js";

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
import TruePrims from "./algorithms/TruePrims.js";
import TenPrint from "./algorithms/10Print.js";

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
};

export {  Maze };
