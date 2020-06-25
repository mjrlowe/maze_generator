import Maze from "./Maze.js";

export default function createWidget(settings) {
  let widgetWidth = 1000, widgetHeight = 700;

  let maze = Maze.create(settings);

  let mazeId = maze.algorithmId + "-" + maze.seed;
  let styleWidth = widgetWidth ?? widgetSize ?? widgetHeight ?? "auto";
  let styleHeight = widgetHeight ?? widgetSize ?? widgetWidth ?? "auto";

  let html =
  `
  <div class="maze-widget ${maze.algorithmId}" id="${mazeId}--widget">
  <canvas width="220" height="220" style="width:${styleWidth}; height:${styleHeight}" class="maze-canvas" id="${mazeId}-canvas"></canvas>
  <div class="maze-widget-options">
    <button class="play-pause-button">pause/play</button>
    <button class="step-button">step</button>
    <button class="finish-button">finish</button>
    <button class="finish-button">restart</button>
  </div>
</div>
  `;

  document.body.innerHTML += html;

  let canvas = document.getElementById(mazeId + "-canvas");

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
