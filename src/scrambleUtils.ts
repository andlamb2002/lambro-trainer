function moveToInt(move: string): number {
  if (move === "U") return 1;
  if (move === "U2") return 2;
  if (move === "U'") return 3;
  return 0;
}

function intToMove(i: number): string {
  if (i === 1) return "U";
  if (i === 2) return "U2";
  if (i === 3) return "U'";
  return "";
}

function mergeAdjacentUMoves(moves: string[]): string[] {
  const result: string[] = [];
  let i = 0;

  while (i < moves.length) {
    const move = moves[i];
    if (move.startsWith("U")) {
      let total = moveToInt(move);
      i++;
      while (i < moves.length && moves[i].startsWith("U")) {
        total = (total + moveToInt(moves[i])) % 4;
        i++;
      }
      if (total !== 0) result.push(intToMove(total));
    } else {
      result.push(move);
      i++;
    }
  }
  return result;
}

export function addRandomAUF(scramble: string): string {
  const aufs = ["", "U", "U2", "U'"];
  const prefix = aufs[Math.floor(Math.random() * aufs.length)];
  const suffix = aufs[Math.floor(Math.random() * aufs.length)];

  const moves = [prefix, ...scramble.split(" "), suffix].filter(Boolean);
  const merged = mergeAdjacentUMoves(moves);

  return merged.join(" ");
}