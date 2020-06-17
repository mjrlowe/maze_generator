import { Maze } from "../mod.js";
import printMaze from "../print.js"

// 12x12 maze using Eller's algorithm
let mazeSettings = {
  width: 12,
  height: 12,
  algorithm: "simplified prims",
};

//initialize the maze
let m = Maze.create(mazeSettings);

// console.log(m)
//generate it
m.generate();

m.printString();