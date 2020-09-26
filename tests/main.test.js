import { assertEquals} from "https://deno.land/std@0.70.0/testing/asserts.ts";
import { runBenchmarks, bench } from "https://deno.land/std@0.70.0/testing/bench.ts";

import {Maze} from "../mod.js";

for(let algorithm in Maze.algorithms){
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