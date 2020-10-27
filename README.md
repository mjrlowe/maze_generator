# maze\_generator

**maze\_generator** is a Javascript module for easily generating mazes.

![rainbow maze on black background (image)](images/darkBackground-oneLine-recursiveBacktracker-20x20.png)

---

⚠️ This module is work-in-progress, so much of it is unstable.

Feedback is welcome. The best way to provide feedback is to open an issue.

---

This module is heavily influenced by [Jamis Buck's Coffeescript mazes](https://github.com/jamis/csmazes). It is structured a little differently though and is written entirely in Javascript rather than Coffeescript. It also functions as a module, rather than a library. I aim to eventually add all the functionality that Jamis's CS maze library has.

## Importing the module

### In the browser and in Deno

If you are inside a Javascript module file or a `type="module"` script tag, then add the following to the top of your code:

```javascript
import {Maze} from "https://x.nest.land/maze_generator@0.3.0/mod.js";
```

If not, you can use the dynamic `import()` function. For example:

```javascript
let Maze;
import("https://x.nest.land/maze_generator@0.3.0/mod.js")
  .then(module => {
    Maze = module.Maze;
  })
  .catch(error => {
    console.log(`Error loading maze_generator module: ${error}`)
  })
```

You can also import the module from `deno.land/x` if you prefer: `https://deno.land/x/maze_generator@v0.3.0/mod.js`.
(Note the `v` here, which is not present when importing from `nest.land`.)

### In Node

Run:

```shell
npm install @thewizardbear/maze_generator
```

And then import the maze_generator module in your code by adding the following to the top of every file that uses it:

```javascript
import {Maze} from "@thewizardbear/maze_generator";
```

Alternately, you can use `require`:

```javascript
let {Maze} = require("@thewizardbear/maze_generator")
```

Please note that Node version 14+ is required as `maze_generator` makes use of some ES2020 features such as the nullish coalescing operator (`??`).

## Example Usage

```javascript
import {Maze} from "https://x.nest.land/maze_generator@0.3.0/mod.js"

let mazeSettings = {
  width: 12,
  height: 12,
  algorithm: "recursive backtracker"
}

//initialize the maze
let m = new Maze(mazeSettings);

//generate it
m.generate();

//print the maze to the console
m.printString();
```

## Other examples

See the examples folder for more examples.

Also see [this](https://www.openprocessing.org/sketch/908761) OpenProcessing sketch.

## new Maze()

To create a new maze, use `new Maze()`. You can optionally pass in an object with the settings (see below).

### Maze settings object

These are all the properties of the object you can pass in when you write `new Maze(mazeSettings)`

| Property | Description | Valid Values | Default Value |
|-|-|-|-|
| width (or xSize) | The width of the maze. (How many columns there should be.) | A positive integer. | height or `30` |
| height (or ySize) | The height of the maze. (How many rows there should be.) | A positive integer. | width or `30` |
| algorithm | The algorithm to use. | Any one of the following: `"recursive backtracker"`, `"eller's"`, `"sidewinder"`, `"kruskal's"`, `"simplified prim's"`, `"modified prim's"`, `"true prim's"`, `"hunt and kill"`, `"binary tree"`, `"aldous broder"`, `"recursive division"`, `"wilson's"`, `"10 print"`, `"growing tree"`, `"random"` (random algorithm). This isn't case sensitive. Characters other than the letters a-z and digits 0-9 are ignored. | `"recursive backtracker"` (`"prim's"` defaults to `"true prim's"`) |
| behavior | Cell selection method for `"growing tree"` algorithm. | Any of the following: `"newest"` (Recursive Backtracker), `"oldest"`, `"middle"`, `"random"` (behave as Prim's) | `"newest"` |
| start | Where to start the maze generation from (if there is an option). | An object with both an `x` and `y` property (both integers) or a string referencing a certain point (`"random"` or a certain side or corner such as `"north east"`) | `"random"` for all algorithms except Eller's, binary tree and sidewinder, which are all `{x: 0, y: 0}`. |
| entrance | Where the solution should start from. | An object with both an `x` and `y` property (and an optional `direction` property: `"N"`, `"S"`, `"E"`, or `"W"`) or a string referencing a certain point (`"random"` or a certain side or corner such as `"north east"`) | `"top left"` |
| exit | Where the solution should end. | An object with both an `x` and `y` property (and an optional `direction` property: `"N"`, `"S"`, `"E"`, or `"W"`) or a string referencing a certain point (`"random"` or a certain side or corner such as `"north east"`) | `"bottom right"` |
| seed | The seed for the random number generator. Mazes with the same seed (and all the other settings that affect generation are the same) will always generate exactly the same. | A number or string | If no seed is given a unique one will be generated (using `Date.now()`). |
| prng | The pseudo-random number generator used during maze generation. This is useful if you want to use your own random number generator function. You can also set `prng` to `Math.random`. | A function that when given no arguments returns a number that is between 0 and 1 (including 0 but not including 1). | `seedrandom(seed)` (using David Bau's [seedrandom](https://github.com/davidbau/seedrandom) package) |

You can also use the `size` property instead of `width` and `height` to set both dimentions.

## .step()

Call `.step()` to advance the maze one step.

Returns true if the maze hasn't finished generating yet and false if there are no more steps left to take.
You can also check if a maze has finished generating with `.finishedGenerating`, which is a boolean value.

## .generate()

This method calls `.step()` repeatedly until the maze has finished generating (or it has given up).
Returns the finished maze

## .display()

This is the function which displays the maze.

_Note that this function (currently) only works in a html document with a canvas element._

It optionally takes in an object with the properties listed below.

| Property | Description | Valid Values | Default Value |
|-|-|-|-|
| canvas | The canvas to display the maze on. | A canvas element (e.g. `document. getElementsByTagName("canvas")[0]`). | The first canvas element in the html. |
| coloringMode | How the cells are colored. | `"normal"`: regular coloring, `"distance"`: each cell is colored by a distance from a point . More coloring modes coming soon hopefully. Anything other than the valid values specififed defaults to normal coloring. | `"normal"`  |
| colorScheme | The color scheme to use when `coloringMode` is not `"normal"`. | This can either be `"grayscale"`, `"rainbow"` or an array or hex codes. | `"rainbow"` |
| mainColor | This is the color of the walls (or line). | A hex value as a string | `"#000"` |
| backgroundColor | Background color and color of the space between walls (unless colorMode isn't `"normal"`) | A hex value as a string | `"#FFF"` |
| antiAliasing | Whether or not to apply anti-aliasing to the image drawn on the canvas (`imageSmoothingEnabled`). Setting it to false gives crisp edges but it can distort the output for small canvases where the cells do not line up with the canvas pixels well. | `true` or `false` | `false` |
| showSolution | Whether or not to show the solution when the maze is complete | `true` or `false` | `false` |
| solutionColor | The color of the solution if `showSolution` is `true` | A hex value as a string | `"#F00"` |
| lineThickness | The thickness of the lines drawn, as a proportion of the cell size | A number between 0 and 1 | `0.35` |
| removeWallsAtEntranceAndExit | Whether or not the walls should be removed at the entrance and exit of the maze. _Note that this doesn't change the maze, it just means these walls won't be displayed._ | `true` or `false` | `true` |
| lineCap | Changes the [`lineCap`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap) canvas context property. | `"butt"`, `"round"` or `"square"` | `"square"` |
| distanceFrom | Where the distance should be measured from if `displayMode` is set to `"distance"` | A valid cell position or `"solution"` | The start cell |
| asLine | Whether the maze should be displayed as a line or as walls. | `true` or `false` | `false` |

### .display() example usage

```javascript
let kruskalMaze = new Maze({
  width: 20,
  height: 20,
  seed: 100,
  algorithm: "Kruskal's"
}).generate();

kruskalMaze.display({
  canvas: document.getElementById("maze-canvas"), //Replace this with your canvas element you want to display the maze on.
  lineThickness: 0.5 //this sets the walls to be the same size as the paths
})
```

This will display a maze that looks like this:

![Kruskal's maze](images/Kruskals-20x20-100.png)

## .printString()

Prints out the maze as a string to the console.

### .printString() example usage

#### Basic code

```javascript
new Maze({
  width: 10,
  height: 10
}).generate().printString()
```

#### Example output

```
 ___________________
|__  _____|   |  __ |
|   | ______|___| __|
| |_|__ |   |_  |__ |
|  _____| |__ | | __|
| |  _____|  _| |_  |
|_  |___  __| |  _| |
| | |   |____ | |  _|
|  _| | |_   ___| | |
| | |_|_  |_|  ____ |
|_______|_____|_____|
```

## Maze.createWidget()

> `Maze.createWidget()` is work-in-progress and particuarly unstable.

Call `Maze.createWidget()` somewhere with access to the `document` API (the browser) and it should add a little interactive animated HTML widget to your page that looks something like this:

![maze widget example image](images/maze-widget-example.png)

It takes in three properties, all optional.

1. Maze settings object (see `new Maze()`)
2. Display settings object (see `.display()`)
3. Maze widget settings object (see below)

### Maze widget settings object

| Property | Description | Valid Values | Default Value |
|-|-|-|-|
| paused | Whether the generation should be animated when the maze starts. | `true` or `false` | `false` |
| imageButtons | Whether the buttons should be images (`true`) or text (`false`). This is still a bit dodgy at the moment. | `true` or `false` | `false` |
| containerElement | The element that the maze widget should be placed inside of | A HTML element | An element with the id or class `maze-widget-container`, or if none is found the body of the HTML document. |

### Example code

```html
<div id="prims-demo"></div>
<script>
  import("https://x.nest.land/maze_generator@0.3.0/mod.js")
    .then(({Maze}) => {
      const mazeSettings = {
        algorithm: "true prims"
      }

      const widgetSettings = {
        paused: true,
        containerElement: document.getElementById("prims-demo")
      }

      Maze.createWidget(mazeSettings, {}, widgetSettings)
    })
    .catch(error => {
      document.getElementById("prims-demo").innerHTML = `Error loading maze_generator module: ${error}`
    })
</script>
```

## .braid()

This method braids the maze, removing all dead ends. It returns the maze object so it can be chained.

Try:

```js

import {Maze} from "https://x.nest.land/maze_generator@0.3.0/mod.js";

let mz = new Maze({algorithm: "modified prims", size: "10"}).generate();

//outputs a modified prims maze
mz.printString();

mz.braid();

//outputs the same maze but with all the dead ends removed
mz.printString();
```

## .getSolution()

This is a method that returns the solution to the maze in the form of an array of cell positions.

You can optionally pass in a start and end point, but it will default to the top left and bottom right of the maze.

Try `console.log(new Maze().generate().getSolution())`.
