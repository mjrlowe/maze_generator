import {Maze} from "https://deno.land/x/maze_generator/MazeClasses.js"

let mazeSettings = {
  width: 12,
  height: 12,
  algorithm: "Eller's"
}

//initialize the maze
let m = Maze.create(mazeSettings);

//generate it
m.generate();


console.log(JSON.stringify(m));