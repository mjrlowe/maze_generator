/* TODO: 
* Test that braid method removes all walls
* Test that kruskals, true prims etc. produce minimum spanning trees
* Test that print method prints a string (or at least that the getString method returns a string)
* Test analyze stuff (once implemented)
*/

import {
  assert,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.75.0/testing/asserts.ts";
import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.75.0/testing/bench.ts";

import { Maze } from "../mod.js";

const algorithms = [
  "RecursiveBacktracker",
  "HuntAndKill",
  "Kruskals",
  "Ellers",
  "AldousBroder",
  "SimplifiedPrims",
  "RecursiveDivision",
  "ModifiedPrims",
  "Sidewinder",
  "BinaryTree",
  "TruePrims",
  "TenPrint",
  "Wilsons",
  "GrowingTree",
];

//benchmarks

for (let algorithm of algorithms) {
  bench({
    name: `Generating a 16x16 ${algorithm} maze`,
    runs: 100,
    func(b) {
      b.start();
      let m = new Maze({
        width: 16,
        height: 16,
        algorithm,
      });
      m.generate();
      b.stop();
      assertEquals(m.algorithm.width, 16);
    },
  });
}

bench({
  name: `Generating a random 16x16 maze`,
  runs: 300,
  func(b) {
    b.start();
    let m = new Maze({
      size: 16,
      algorithm: "random",
    });
    m.generate();
    b.stop();
  },
});

runBenchmarks();

//test seeds

Deno.test(
  `Checking that 2 random 10x10 prims mazes are different`,
  () => {
    const settings = {
      size: 10,
      algorithm: "prims",
    };
    let maze1 = new Maze(settings).generate();
    let maze2 = new Maze(settings).generate();
    assertNotEquals(maze1.algorithm.seed, maze2.algorithm.seed);
    assert(!checkWallsEqual(maze1, maze2));
  },
);

Deno.test(
  `Checking that 2 4x23 kruskals mazes with the same seed (number) are the same`,
  () => {
    const settings = {
      width: 4,
      height: 23,
      algorithm: "kruskals",
      seed: Math.floor(Math.random() * 100000),
    };
    let maze1 = new Maze(settings).generate();
    let maze2 = new Maze(settings).generate();
    assertEquals(maze1.algorithm.seed, maze2.algorithm.seed);
    assert(checkWallsEqual(maze1, maze2));
  },
);

Deno.test(
  `Checking that 2 4x23 kruskals mazes with the same seed (string) are the same`,
  () => {
    const settings = {
      width: 4,
      height: 23,
      algorithm: "kruskals",
      seed: String(Math.floor(Math.random() * 100000)),
    };
    let maze1 = new Maze(settings).generate();
    let maze2 = new Maze(settings).generate();
    assertEquals(maze1.algorithm.seed, maze2.algorithm.seed);
    assert(checkWallsEqual(maze1, maze2));
  },
);

function checkWallsEqual(maze1: Maze, maze2: Maze) {
  for (let y = 0; y < maze1.algorithm.height; y++) {
    for (let x = 0; x < maze1.algorithm.width; x++) {
      for (let direction of ["N", "S", "E", "W"]) {
        if (
          maze1.algorithm.walls[y][x][direction] !=
            maze2.algorithm.walls[y][x][direction]
        ) {
          return false;
        }
      }
    }
  }
  return true;
}
