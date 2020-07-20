import { BlameLine } from "ggit";
type MergeConflicts = Array<MergeConflict>;

type MergeConflict = {
  leftChunk: {
    lineNumber: number;
    blames: Array<BlameLine>;
    branchName: string;
  };
  rightChunk: {
    lineNumber: number;
    blames: Array<BlameLine>;
    branchName: string;
  };
};

const getBranchName = (line: string, token: string) => {
  return line.slice(line.indexOf(token) + token.length).trim();
};

export const getMergeConflicts = (blameDeets: Array<BlameLine>): MergeConflicts => {
  const mergeConflicts: MergeConflicts = [];
  const LEFT_START = "<<<<<<<";
  const CONFLICT_MIDDLE = "=======";
  const RIGHT_END = ">>>>>>>";

  let leftStart = undefined;
  let conflictMiddle = undefined;
  let rightEnd = undefined;

  for (let i in blameDeets) {
    const line = blameDeets[i].line;
    if (line.includes(LEFT_START)) {
      leftStart = Number(i);
    } else if (line.includes(CONFLICT_MIDDLE)) {
      conflictMiddle = Number(i);
    } else if (line.includes(RIGHT_END)) {
      rightEnd = Number(i);
    }
    if (leftStart && conflictMiddle && rightEnd) {
      mergeConflicts.push({
        leftChunk: {
          lineNumber: leftStart + 1,
          blames: blameDeets.slice(leftStart + 1, conflictMiddle),
          branchName: getBranchName(blameDeets[leftStart].line, LEFT_START)
        },
        rightChunk: {
          lineNumber: conflictMiddle + 1,
          blames: blameDeets.slice(conflictMiddle + 1, rightEnd),
          branchName: getBranchName(blameDeets[rightEnd].line, RIGHT_END)
        }
      });
      leftStart = undefined;
      conflictMiddle = undefined;
      rightEnd = undefined;
    }
  }
  return mergeConflicts;
};
