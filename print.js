export default function mazeString(maze) {
  let str = "";

  maze.walls[0].forEach((cell, index) => {
    str += index === 0 ? " " : "_";
    str += cell.N ? "_" : " "
  });

  str += " "

  maze.walls.forEach((row, rowIndex) => {
    str += "\n"
    str += row[0].W ? "|" : " "
    row.forEach((cell, columnIndex) => {

      let eastWallBelow = maze.walls[rowIndex+1]?.[columnIndex].E ?? null;

      str += cell.S ? "_" : " "
      str += cell.E ? "|" : (eastWallBelow ? " " : "_");
    });
  });
  return str;

};