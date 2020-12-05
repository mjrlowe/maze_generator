import { Maze } from "../mod.js";

// 20x20 maze using
const mazeSettings = {
  size: 20,
  algorithm: "growingtree",
  cellSelectionMethod: { newest: 1, random: 2, oldest: 7 },
};

//initialize the maze
const m = new Maze(mazeSettings);

//generate it
m.generate();

//print it to the console
m.printString();
