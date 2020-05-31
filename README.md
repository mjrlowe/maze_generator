# maze\_generator

**maze\_generator** is a module for easily generating mazes.

This is all very much work-in-progress, however feedback is welcome.

Almost everything is subject to change so this is all very unstable

## Example Usage

```javascript

import {Maze} from "https://deno.land/x/maze_generator/MazeClasses.js"

let mazeSettings = {
  width: 12,
  height: 12,
  algorithm: "recursive backtracker"
}

//initialize the maze
let m = Maze.create(mazeSettings);

//generate it
m.generate();


console.log(JSON.stringify(m));

```

## Maze Settings (object)

| Property | Description | Valid Values | Default Value |
|-|-|-|-|
| width (or xSize) | The width of the maze. (How many columns there should be.) | Any integer greater than 0. Any number greater than 100 defaults to 100.  | `30` |
| height (or ySize) | The height of the maze. (How many rows there should be.) | Any integer greater than 0. Any number greater than 100 defaults to 100. | `30` |
| algorithm | The algorithm to use. | Any one of the following: `"recursive backtracker"`, `"ellers"`, `"sidewinder"`, `"kruskals"`. This isn't case sensitive. Characters other than a-z are ignored (so you can add apostrophes if you like). | `"recursive backtracker"` |
| seed | **Not currently working.** This is the seed for the random number generator. | Any number. | A random integer from 0 to 10^8. |
