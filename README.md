# maze\_generator (WIP)

**maze\_generator** is a module for easily generating mazes.

---

⚠️ This is work-in-progress, and feedback is welcome.

Almost everything is subject to change so this is all very unstable.

---

This module is heavily influenced by [Jamis Buck's Coffeescript mazes](https://github.com/jamis/csmazes). It is structured a little differently though and is written entirely in Javascript rather than Coffeescript. It also functions as a module, rather than a library. I aim to eventually add all the functionality that Jamis's CS maze library has.

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

## Maze.create()

To create a new maze, use Maze.create(). You can optionally pass in an object with the settings (see below).

### Maze settings object

These are all the properties of the object you can pass in when you write `Maze.create(mazeSettings)`

| Property | Description | Valid Values | Default Value |
|-|-|-|-|
| width (or xSize) | The width of the maze. (How many columns there should be.) | Any integer greater than 0. Any number greater than 100 defaults to 100.  | `30` |
| height (or ySize) | The height of the maze. (How many rows there should be.) | Any integer greater than 0. Any number greater than 100 defaults to 100. | `30` |
| algorithm | The algorithm to use. | Any one of the following: `"recursive backtracker"`, `"eller's"`, `"sidewinder"`, `"kruskal's"`, `"simplified prim's"`, `"modified prim's"`, `"hunt and kill"`, `"binary tree"`, `"aldous broder"`, `"recursive division"`. This isn't case sensitive. Characters other than a-z are ignored. | `"recursive backtracker"` |

Algorithms coming soon:

* True Prim's
* Wilson's

## .step()

Call `.step()` to advance the maze one step.

Returns true if the maze hasn't finished generating yet and false if there are no more steps left to take.
You can also check if a maze has finished generating with `.finishedGenerating`, which is a boolean value.

## .generate()

This method calls `.step()` repeatedly until the maze has finished generating (or it has given up).
Returns the finished maze

## display() (very unstable)

This is the function which displays the maze.

It takes in an object with the properties listed below. All of them are optional except the `maze` property.

| Property | Description | Valid Values | Default Value |
|-|-|-|-|
| maze | The maze to display | A maze  | _required (no default)_ |
| canvas | The canvas to display the maze on. | A canvas element (e.g. `canvas: document.getElementsByTagName("canvas")[0]`). | The first canvas element |
