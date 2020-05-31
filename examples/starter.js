import {Maze} from "https://deno.land/x/maze_generator/dep.js"
import solve from "https://deno.land/x/maze_generator/solve.js"



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

m.startXY = {x:0, y:0}
m.finishXY = {x: 11, y:11}

console.log(solve(m))