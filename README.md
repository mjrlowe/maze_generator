# maze\_generator (WIP)

**maze\_generator** is a module for easily generating mazes.

This is work-in-progress, and feedback is welcome.

Almost everything is subject to change so this is all very unstable.

This module is heavily influenced by [Jamis Buck's Coffeescript mazes](https://github.com/jamis/csmazes). It is structured a little differently though and is written entirely in Javascript rather than Coffeescript. It also functions as a module, as well as a library. I aim to eventually add all the functionality that Jamis's CS maze library has.

## Example Usage

```javascript

import {Maze} from "https://deno.land/x/maze_generator/mod.js"

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

## Other examples

See the examples folder for more examples.

Also see this OpenProcessing sketch: [https://openprocessing.org/sketch/908761](https://www.openprocessing.org/sketch/908761).

## Maze Settings (object)

| Property | Description | Valid Values | Default Value |
|-|-|-|-|
| width (or xSize) | The width of the maze. (How many columns there should be.) | Any integer greater than 0. Any number greater than 100 defaults to 100.  | `30` |
| height (or ySize) | The height of the maze. (How many rows there should be.) | Any integer greater than 0. Any number greater than 100 defaults to 100. | `30` |
| algorithm | The algorithm to use. | Any one of the following: `"recursive backtracker"`, `"ellers"`, `"sidewinder"`, `"kruskals"`. This isn't case sensitive. Characters other than a-z are ignored (so you can add apostrophes if you like). | `"recursive backtracker"` |
| seed | **Not currently working.** This is the seed for the random number generator. | Any number. | A random integer from 0 to 10^8. |
