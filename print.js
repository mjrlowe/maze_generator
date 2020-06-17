export default function getMazeString() {

  let str = "";

  this.walls[0].forEach((cell, index) => {
    str += index === 0 ? " " : "_";
    str += cell.N ? "_" : " "
  });

  str += " "

  this.walls.forEach((row, rowIndex) => {
    str += "\n"
    str += row[0].W ? "|" : " "
    row.forEach((cell, columnIndex) => {

      let eastWallBelow = this.walls[rowIndex+1]?.[columnIndex].E ?? null;
      let southWallToRight = row[columnIndex+1]?.S ?? null;

      str += cell.S ? "_" : " "
      str += cell.E ? "|" : ((!eastWallBelow || (cell.S && southWallToRight)) ? "_" : " ");
    });
  });

  return str;

};