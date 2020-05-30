import { Maze } from "./MazeClasses.js";

let mazeSettings = {
  width: 10,
  height: 10,
  algorithm: "eLlEr's",
};

let m = Maze.create(mazeSettings);
m.generate();

// for(let i = 0; i < 40; i++){
//   m.step();
// }

console.log(JSON.stringify(m));
