import ggit, { BlameLine } from "ggit";
import uniqueBy from "lodash/uniqBy";
import chalk from "chalk";
import Table from "cli-table3";
import { getMergeConflicts } from "./getMergeConflicts";

const originalConsoleLog = console.log;

const printLines = (blames: Array<BlameLine>, lineNumber: number) => {
  const strings: Array<string> = [];

  for (let i in blames) {
    strings.push(`${Number(lineNumber) + Number(i)}: ${blames[i].line.replace(/\t/g, " ")}`);
  }
  return strings.join("\n");
};

const printCommitDetails = (blames: Array<BlameLine>) => {
  const uniqueBlames = uniqueBy(blames, (blame: BlameLine) => blame.commit);
  return uniqueBlames
    .map(
      blame =>
        `${chalk.grey(blame.commit.slice(0, 7))} ${
          blame.author
        } ${chalk.yellow(blame.summary)}`
    )
    .join("\n");
};

export default async (path: string) => {
  console.log = () => {};
  const blameDeets = await ggit.blame(path);
  console.log = originalConsoleLog;

  console.log(chalk.inverse("Merge conflict details"));

  const mergeConflicts = getMergeConflicts(blameDeets);

  if (mergeConflicts.length === 0) {
    console.log("No merge conflicts found");
    return;
  }

  const screenWidth = process.stdout.columns;
  const columnWidth = Math.floor(screenWidth / 2) - 1;

  for (let i in mergeConflicts) {
    const table = new Table({
      colWidths: [columnWidth, columnWidth]
    });
    const { leftChunk, rightChunk } = mergeConflicts[i];
    table.push(
      [
        {
          colSpan: 2,
          content: chalk.redBright(`Conflict ${Number(i) + 1}`),
          hAlign: "center"
        }
      ],
      [
        chalk.yellow(leftChunk.branchName),
        chalk.yellow(rightChunk.branchName)
      ],
      [
        printCommitDetails(leftChunk.blames),
        printCommitDetails(rightChunk.blames)
      ],
      [
        printLines(leftChunk.blames, leftChunk.lineNumber),
        printLines(rightChunk.blames, leftChunk.lineNumber)
      ]
    );
    console.log(table.toString());
  }
};
