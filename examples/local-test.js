import { Maze } from "../mod.js";

// 12x12 maze using Eller's algorithm
let mazeSettings = {
  width: 12,
  height: 12,
  algorithm: "ten print",
};

//initialize the maze
let m = Maze.create(mazeSettings);

//generate it
m.step();

//print it to the console
m.printString();
