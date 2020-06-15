import { Maze } from "../mod.js";

// 12x12 maze using Eller's algorithm
let mazeSettings = {
  width: 12,
  height: 12,
  algorithm: "true prims",
};

//initialize the maze
let m = Maze.create(mazeSettings);

console.log(m)
//generate it
m.generate();

console.log(JSON.stringify(m));
