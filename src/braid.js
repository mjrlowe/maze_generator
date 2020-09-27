import {
  opposite,
  directions,
  fullNames,
  dx,
  dy
} from "./directions.js";

export default function braid({maze}) {

  let deadEnds = [];
  maze.walls.forEach((row, y) => {
    row.forEach((cell, x) => {
      let connectedDirections = [];
      for (let direction in cell) {
        if(!cell[direction]) connectedDirections.push(direction);
      }
      if (connectedDirections.length === 1) {
        deadEnds.push({
          x,
          y,
          direction: opposite[connectedDirections[0]]
        })
      }
    });
  });
  
  for (let deadEnd of deadEnds) {
    let unconnectedNeighbors = [];
    for (let direction of directions) {
      let neighbor = {
        x: deadEnd.x + dx[direction],
        y: deadEnd.y + dy[direction]
      }
      if (direction != opposite[deadEnd.direction] && maze.cellIsInMaze(neighbor)) {
        unconnectedNeighbors.push({...neighbor, direction});
      }
    }

    let chosenNeighbor = unconnectedNeighbors[Math.floor(maze.random()*unconnectedNeighbors.length)];
    maze.removeWall(deadEnd, chosenNeighbor.direction);
  }
}