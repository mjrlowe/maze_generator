import { dx, dy } from "./directions.js";

export default function calculateDistances({ maze, distanceFrom }) {
  let Q = []; //queue

  let discovered = []; //keeps track of which points have been discovered so far so it doesn't loop back on itself
  let distances = [];
  for (let y = 0; y < maze.algorithm.height; y++) {
    discovered[y] = [];
    distances[y] = [];
    for (let x = 0; x < maze.algorithm.width; x++) {
      distances[y][x] = 0;
      discovered[y][x] = false;
    }
  }

  if (
    typeof distanceFrom === "string" &&
    distanceFrom.toLowerCase() === "solution"
  ) {
    let startPoints = maze.getSolution();
    for (let cell of startPoints) {
      discovered[cell.y][cell.x] = true;

      //enqueue
      Q.unshift(cell);
    }
  } else {
    let startPoint = maze.algorithm.getXYPosition(
      distanceFrom ?? maze.algorithm.start ?? "top left",
    );
    startPoint = maze.algorithm.cellIsInMaze(startPoint)
      ? startPoint
      : maze.algorithm.start;
    discovered[startPoint.y][startPoint.x] = true;

    //enqueue
    Q.unshift(startPoint);
  }

  //don't want it to be 0 otherwise we might be dividing by zero
  let maxDistance = 1;

  while (Q.length > 0) {
    //dequeue
    let v = Q.pop();

    for (let direction in maze.algorithm.walls[v.y][v.x]) {
      //there's not a wall here so we can go maze way
      if (!maze.algorithm.walls[v.y][v.x][direction]) {
        let x = v.x + dx[direction];
        let y = v.y + dy[direction];

        //valid cell to move to
        if (discovered[y] !== undefined && discovered[y][x] !== undefined) {
          //hasn't already been visited (discovered)
          if (!discovered[y][x]) {
            discovered[y][x] = true;
            distances[y][x] = distances[v.y][v.x] + 1;
            //enqueue
            Q.unshift({
              x: x,
              y: y,
              parent: v,
            });
          }
        }
      }
    }
    maxDistance = distances[v.y][v.x] + 1;
  }

  return { distances, maxDistance };
}
