import Maze from "./Maze.js";

export default function createWidget(settings) {
  let widgetWidth = 1000, widgetHeight = 700;

  let maze = Maze.create(settings);

  let mazeId = maze.algorithmId + "-" + maze.seed;
  let widgetId = mazeId + "-widget";
  let canvasId = mazeId + "-canvas";
  let styleWidth = widgetWidth ?? widgetSize ?? widgetHeight ?? "auto";
  let styleHeight = widgetHeight ?? widgetSize ?? widgetWidth ?? "auto";
  let paused = settings.paused ?? false;

  let html =
  `
  <div class="maze-widget ${maze.algorithmId}" id="${widgetId}" style="display: inline-block; text-align: center;">
  <canvas width="220" height="220" style="width:${styleWidth}; height:${styleHeight}" class="maze-canvas" id="${canvasId}"></canvas>
  <div class="maze-widget-options">
    <button class="play-pause-button" onClick="document.getElementById(${widgetId}).playPauseMaze()">pause/play</button>
    <button class="step-button" onClick="document.getElementById(${widgetId}).stepMaze()">step</button>
    <button class="finish-button" onClick="document.getElementById(${widgetId}).generateMaze()">finish</button>
    <button class="restart-button" onClick="document.getElementById(${widgetId}).restartMaze()">restart</button>
  </div>
</div>
  `;

  document.body.innerHTML += html;

  let widget = document.getElementById(widgetId);

  widget.playPauseMaze = () => {
    paused = !paused;
  };

  widget.stepMaze = () => {
    maze.step();
    paused = true;
  };

  widget.generateMaze = () => {
    maze.generate();
  };
  
  widget.restartMaze = () => {
    maze.reset();
  };

  let canvas = document.getElementById(canvasId);

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
