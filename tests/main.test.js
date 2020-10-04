import {
  assertEquals,
  assertNotEquals,
  assert
} from "https://deno.land/std@0.70.0/testing/asserts.ts";
import {
  runBenchmarks,
  bench
} from "https://deno.land/std@0.70.0/testing/bench.ts";

import {
  Maze
} from "../mod.js";

//benchmarks

for (let algorithm in Maze.algorithms) {
  bench({
    name: `Generating a 16x16 ${algorithm} maze`,
    runs: 100,
    func(b) {
      b.start();
      let m = Maze.create({
        width: 16,
        height: 16,
        algorithm,
      });
      m.generate();
      b.stop();
      assertEquals(m.width, 16)
    },
  });
}

bench({
  name: `Generating a random 16x16 maze`,
  runs: 300,
  func(b) {
    b.start();
    let m = Maze.create({
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
      algorithm: "prims"
    }
    let maze1 = Maze.create(settings).generate();
    let maze2 = Maze.create(settings).generate();
    assertNotEquals(maze1.seed, maze2.seed);
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
      seed: Math.floor(Math.random()*100000)
    }
    let maze1 = Maze.create(settings).generate();
    let maze2 = Maze.create(settings).generate();
    assertEquals(maze1.seed, maze2.seed);
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
      seed: String(Math.floor(Math.random()*100000))
    }
    let maze1 = Maze.create(settings).generate();
    let maze2 = Maze.create(settings).generate();
    assertEquals(maze1.seed, maze2.seed);
    assert(checkWallsEqual(maze1, maze2));
  },
);


function checkWallsEqual(maze1, maze2) {
  
  for (let y = 0; y < maze1.height; y++) {
    for (let x = 0; x < maze1.width; x++) {
      for (let direction of ["N", "S", "E", "W"]) {
        if (maze1.walls[y][x][direction] != maze2.walls[y][x][direction]) return false;
      }
    }
  }
  return true;
}