import Maze from "./Maze.js";

export default function createWidget(settings) {
  let width = 1000, height = 700;

  let maze = Maze.create(settings);

  let html =
    `<canvas id="${maze.algorithmId}-canvas" class="${maze.algorithmId} maze canvas" style="width:90%" width="${width}" height="${height}"></canvas>`;

  document.body.innerHTML += html;

  let canvas = document.getElementById(`${maze.algorithmId}-canvas`);

  maze.display({ canvas });

  let updateCanvas = () => {
    setTimeout(() => {
      maze.step();
      maze.display({ canvas });

      updateCanvas();
    }, 100);
  };

  updateCanvas();

  return maze;
}
