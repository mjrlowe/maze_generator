import { Maze } from "https://x.nest.land/maze_generator@0.4.0/mod.js";

// 12x12 maze using Eller's algorithm
let mazeSettings = {
  width: 12,
  height: 12,
  algorithm: "eller's",
};

//initialize the maze
let m = new Maze(mazeSettings);

//generate it
m.generate();

//print it to the console
m.printString();
