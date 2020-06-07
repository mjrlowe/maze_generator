/*

p5.js example for usage of this module

See https://www.openprocessing.org/sketch/908761
*/

let iterationsPerFrame = 12;

let mazeSettings = {
	xSize: 30,
	ySize: 30,
	algorithm: "simplified prims"
}

let displaySettings = {
	displayMode: 1,
	strokeWeight: 4,
	backgroundColor: "white",
	wallColor: "black"
};

let Maze; //Maze class
let display; //the function to display the maze on the canvas

let moduleLoaded = false;

let maze; //the maze we will generate and display

function preload() {
	import ("https://deno.land/x/maze_generator/mod.js")
	.then((module) => {
			moduleLoaded = true;
		
			Maze = module.Maze;
			display = module.display;

			maze = Maze.create(mazeSettings);
			background(255);
		})
		.catch(error => {
			background(253, 250, 246);
			textSize(9);
			textAlign(CENTER);
			text(`Importing of module failed: ${error}`, width / 2, height / 2);
			console.error(error);
		});
}

function setup() {
	createCanvas(windowWidth, windowHeight); //settings.xSize*16, settings.ySize*16);
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

	display({
		maze,
		canvas,
		...displaySettings
	});
}

function mousePressed() {
	maze = Maze.create({
		...mazeSettings,
		startGenerationFrom: getMouseCell()
	});
}

function getMouseCell() {
	let smallerSide = min(width, height);
	let x = map(mouseX, width / 2 - smallerSide * 0.45, width / 2 + smallerSide * 0.45, 0, mazeSettings.xSize);
	let y = map(mouseY, height / 2 - smallerSide * 0.45, height / 2 + smallerSide * 0.45, 0, mazeSettings.ySize);
	x = constrain(Math.round(x), 0, mazeSettings.xSize - 1);
	y = constrain(Math.round(y), 0, mazeSettings.ySize - 1);

	return {x, y};
}