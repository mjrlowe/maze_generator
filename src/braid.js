import { directions, dx, dy, fullNames, opposite } from "./directions.js";

export default function braid({
  maze,
}) {
  let deadEnds = [];
  maze.walls.forEach((row, y) => {
    row.forEach((cell, x) => {
      let connectedDirections = [];
      for (let direction in cell) {
        if (!cell[direction]) connectedDirections.push(direction);
      }
      if (connectedDirections.length === 1) {
        deadEnds.push({
          x,
          y,
          direction: opposite[connectedDirections[0]],
        });
      }
    });
  });

  deadEnds = maze.shuffle(deadEnds);

  for (let deadEnd of deadEnds) {
    let connections = 0;
    for (let direction in maze.walls[deadEnd.y][deadEnd.x]) {
      if (!maze.walls[deadEnd.y][deadEnd.x][direction]) connections++;
    }

    //if it still is a dead end
    if (connections <= 1) {
      let unconnectedNeighbors = [];
      for (let direction of directions) {
        let neighbor = {
          x: deadEnd.x + dx[direction],
          y: deadEnd.y + dy[direction],
        };
        if (
          direction != opposite[deadEnd.direction] &&
          maze.cellIsInMaze(neighbor)
        ) {
          unconnectedNeighbors.push({
            ...neighbor,
            direction,
          });
        }
      }

      let chosenNeighbor = unconnectedNeighbors[
        Math.floor(maze.random() * unconnectedNeighbors.length)
      ];
      maze.removeWall(deadEnd, chosenNeighbor.direction);
    }
  }
  return maze;
}
