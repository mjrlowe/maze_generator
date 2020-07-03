import Maze from "./Maze.js";

export default function createWidget(settings) {
  let widgetWidth = 1000, widgetHeight = 700;

  let maze = Maze.create(settings);

  let mazeId = maze.algorithmId + "-" + maze.seed;
  let styleWidth = widgetWidth ?? widgetSize ?? widgetHeight ?? "auto";
  let styleHeight = widgetHeight ?? widgetSize ?? widgetWidth ?? "auto";
  let paused = settings.paused ?? false;

  let html =
  `
  <div class="maze-widget ${maze.algorithmId}" id="${mazeId}--widget" style="display: inline-block; text-align: center;">
  <canvas width="220" height="220" style="width:${styleWidth}; height:${styleHeight}" class="maze-canvas" id="${mazeId}-canvas"></canvas>
  <div class="maze-widget-options">
    <button class="play-pause-button" onClick="paused=!paused">pause/play</button>
    <button class="step-button" onClick="paused=true; maze.step()">step</button>
    <button class="finish-button" onClick="maze.generate()">finish</button>
    <button class="restart-button" onClick="maze.reset()">restart</button>
  </div>
</div>
  `;

  document.body.innerHTML += html;

  let canvas = document.getElementById(mazeId + "-canvas");

  maze.display({ canvas });

  let updateCanvas = () => {
    setTimeout(() => {
      if(!paused){
        maze.step();
        maze.display({
          canvas
        });
      }

      updateCanvas();
    }, 100);
  };

  updateCanvas();

  return maze;
}
