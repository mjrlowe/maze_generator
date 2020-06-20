import solve from "./solve.js";
import { opposite, directions, fullNames } from "./directions.js";

export default function analyze(maze) {
  let solution = maze.getSolution();
  let deadEnds = {
    total: 0,
    N: 0,
    S: 0,
    E: 0,
    W: 0,
  };

  let straightPassages = {
    total: 0,
    NS: 0,
    EW: 0,
  };

  let numberOfCellWalls = [0, 0, 0, 0, 0];

  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      let cell = maze.walls[y][x];
      let neighbors = [];
      if (!cell.N) neighbors.push("N");
      if (!cell.S) neighbors.push("S");
      if (!cell.E) neighbors.push("E");
      if (!cell.W) neighbors.push("W");

      if (neighbors.length === 1) {
        deadEnds.total++;
        deadEnds[opposite[neighbors[0]]]++;
      }

      if (neighbors.length === 2 && neighbors[0] === opposite[neighbors[1]]) {
        straightPassages.total++;
        if (neighbors[0] === "N" || neighbors[0] === "S") {
          straightPassages.NS++;
        } else {
          straightPassages.EW++;
        }
      }

      numberOfCellWalls[4 - neighbors.length]++;
    }
  }

  console.log(numberOfCellWalls.reduce((a, b) => Math.max(a, b)));

  let walls = {
    ...numberOfCellWalls,
    mean: numberOfCellWalls.slice(0).reduce((a, b, i) => a + b * i, 0) /
      (maze.width * maze.height),
    mode: numberOfCellWalls.indexOf(
      numberOfCellWalls.reduce((a, b, i) => Math.max(a, b)),
    ),
    //total doesn't count shared walls twice
    total: numberOfCellWalls.reduce((a, b) => a + b, 0) / 2 + maze.width +
      maze.height,
  };

  // let analysis = {
  //   solution: solution,
  //   deadEnds: deadEnds,
  //   straightPassages: straightPassages,
  //   totalCells: maze.width*maze.height,
  //   numberOfCellWalls: walls
  // };

  let analysis = [];

  let totalNumberOfCells = {
    label: "Total number of cells",
    value: maze.width * maze.height,
    string: String(maze.width * maze.height),
  };

  for (let dir of directions) {
    analysis.push({
      label: `Dead Ends ${fullNames[dir]}`,
      value: deadEnds[dir],
      string: `${deadEnds[dir]} (${
        percentage(deadEnds[dir], deadEnds.total)
      } of all dead ends)`,
    });
  }

  let solutionLength = {
    label: "Solution Length",
    value: solution.length,
    string: `${solution.length} cells (covers ${
      percentage(solution.length, totalNumberOfCells.value)
    } of the maze)`,
  };

  if (solutionLength.value) {
    analysis.push(solutionLength);
  }

  return analysis;
}

function percentage(value, total) {
  return `${round(value / total * 100, 1)}%`;
}

function round(number, dp) {
  let exponent = 10 ** dp;
  let roundedDown = Math.floor(number * exponent) / exponent;
  let roundedUp = Math.ceil(number * exponent) / exponent;
  return (number - roundedDown < roundedUp - number) ? roundedDown : roundedUp;
}
