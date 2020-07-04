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

  const iconImageFolderURL = "https://deno.land/x/maze_generator@wip/images/button-icons";
  const cssFileURL = "https://deno.land/x/maze_generator@wip/widget-styles.css";

  function getButtonInnerHTML(buttonName){
    if(true){
      return `<img 
        class="maze-image ${buttonName}-image"
        src="${iconImageFolderURL}/${buttonName}.svg" 
        alt="${buttonName}"
      />`
    }else{
      return buttonName;
    }

  }

  let html =
  `
  <div class="maze-widget ${maze.algorithmId}" id="${widgetId}">
  <canvas width="220" height="220" style="width:${styleWidth}; height:${styleHeight}" class="maze-canvas" id="${canvasId}"></canvas>
  <div class="maze-widget-options">
    <button class="play-pause-button maze-button" onClick="document.getElementById('${widgetId}').playPauseMaze()">
      ${getButtonInnerHTML(paused ? "play" : "pause")}
    </button>
    <button class="step-button maze-button" onClick="document.getElementById('${widgetId}').stepMaze()">
      ${getButtonInnerHTML("step")}
    </button>
    <button class="finish-button maze-button" onClick="document.getElementById('${widgetId}').generateMaze()">
      ${getButtonInnerHTML("finish")}
    </button>
    <button class="restart-button maze-button" onClick="document.getElementById('${widgetId}').restartMaze()">
      ${getButtonInnerHTML("restart")}
    </button>
  </div>
</div>
  `;

  document.body.innerHTML += html;

  //add css (test)
  fetch(cssFileURL)
  .then(response => response.text())
  .then(data => {
    if(document.getElementById("maze-widget-css") !== undefined){
      let styleElement = document.createElement("style");
      styleElement.innerHTML = data;
      styleElement.id = "maze-widget-css";

      document.getElementsByTagName("head")[0].appendChild(styleElement);
    }
  })


  let widget = document.getElementById(widgetId);
  console.log(widget, document.getElementById(canvasId))
  let canvas = document.getElementById(canvasId);

  widget.playPauseMaze = () => {
    paused = !paused;
    widget.getElementsByClassName("play-pause-button")[0].innerHTML = getButtonInnerHTML(paused ? "play" : "pause");
  };

  widget.stepMaze = () => {
    console.log(canvas);
    maze.step();
    maze.display({ canvas });
    maze.display();
    paused = true;
    widget.getElementsByClassName("play-pause-button")[0].innerHTML = getButtonInnerHTML("play");
  };

  widget.generateMaze = () => {
    maze.generate();
    widget.getElementsByClassName("play-pause-button")[0].disabled = true;
    widget.getElementsByClassName("step-button")[0].disabled = true;
    widget.getElementsByClassName("finish-button")[0].disabled = true;
    maze.display({ canvas });
  };
  
  widget.restartMaze = () => {
    maze.reset();
    widget.getElementsByClassName("play-pause-button")[0].disabled = false;
    widget.getElementsByClassName("step-button")[0].disabled = false;
    widget.getElementsByClassName("finish-button")[0].disabled = false;
    maze.display({ canvas });
  };

  maze.display({ canvas });

  let updateCanvas = () => {
    setTimeout(() => {
      if(!paused){
        maze.step();
        maze.display({
          canvas
        });

        if(maze.finishedGenerating){
          widget.getElementsByClassName("play-pause-button")[0].disabled = true;
          widget.getElementsByClassName("step-button")[0].disabled = true;
          widget.getElementsByClassName("finish-button")[0].disabled = true;
        }
      }

      updateCanvas();
    }, 100);
  };

  updateCanvas();

  return maze;
}
