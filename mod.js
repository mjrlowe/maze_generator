import Maze from "./Maze.js";
import display from "./display.js";
import createWidget from "./createWidget.js";

Maze.createWidget = createWidget;

export { default as analyze } from "./analyze.js";
export { default as solve } from "./solve.js";

export {
  display,
  Maze,
};
