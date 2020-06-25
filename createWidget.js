import Maze from "./Maze.js";

export default function createWidget(settings) {
  let widgetWidth = 1000, widgetHeight = 700;

  let maze = Maze.create(settings);

  let html =
  `
  <div class="maze-widget ${maze.algorithmId}" id="${maze.algorithmId}-widget">
  <canvas width="220" height="220" style="width:${widgetWidth ?? widgetSize ?? widgetHeight ?? "auto"}; height:${widgetHeight ?? widgetSize ?? widgetWidth ?? "auto"}" class="maze-canvas"></canvas>
  <div class="maze-widget-options">
    <button class="play-pause-button">pause/play</button>
    <button class="step-button">step</button>
    <button class="finish-button">finish</button>
    <button class="finish-button">restart</button>
  </div>
</div>
  `;

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
