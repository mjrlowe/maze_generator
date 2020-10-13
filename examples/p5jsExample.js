/*

p5.js example for usage of this module

See https://www.openprocessing.org/sketch/908761
*/

let iterationsPerFrame = 12;

let mazeSettings = {
  width: 30,
  height: 30,
  algorithm: "simplified prims",
};

let displaySettings = {
  backgroundColor: "#FFF",
  mainColor: "#000",
};

let Maze; //Maze class

let moduleLoaded = false;

let maze; //the maze we will generate and display

function preload() {
  import("https://x.nest.land/maze_generator@0.3.0/mod.js")
    .then((module) => {
      moduleLoaded = true;

      Maze = module.Maze;

      maze = Maze.create(mazeSettings);
      background(255);
    })
    .catch((error) => {
      background(253, 250, 246);
      textSize(9);
      textAlign(CENTER);
      text(`Importing of module failed: ${error}`, width / 2, height / 2);
      console.error(error);
    });
}

function setup() {
  createCanvas(windowWidth, windowHeight); //settings.width*16, settings.height*16);
  background(255);

  textSize(32);
  textAlign(CENTER);
  text("Loading...", width / 2, height / 2);
}

function draw() {
  if (!moduleLoaded) return;

  for (let i = 0; i < iterationsPerFrame && !maze.finishedGenerating; i++) {
    maze.step();
  }

  maze.display({
    canvas,
    ...displaySettings,
  });
}

function mousePressed() {
  maze = Maze.create({
    ...mazeSettings,
    start: getMouseCell(),
  });
}

function getMouseCell() {
  let smallerSide = min(width, height);
  let x = map(
    mouseX,
    width / 2 - smallerSide * 0.45,
    width / 2 + smallerSide * 0.45,
    0,
    mazeSettings.width,
  );
  let y = map(
    mouseY,
    height / 2 - smallerSide * 0.45,
    height / 2 + smallerSide * 0.45,
    0,
    mazeSettings.height,
  );
  x = constrain(Math.round(x), 0, mazeSettings.width - 1);
  y = constrain(Math.round(y), 0, mazeSettings.height - 1);

  return { x, y };
}
