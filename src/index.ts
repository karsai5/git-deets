#!/usr/bin/env node
import fs from "fs";
import path from "path";
import getFileAuthorStats from "./getFileAuthorStats";
import getFileHistory from "./getFileHistory";
import printMergeConflicts from "./mergeConflicts";

import { program } from "commander";

program
  .requiredOption("-f, --file <path>", "path to file")
  .option("-d, --days <days>", "number of days of history to show", "14")
  .option("-m, --merge", "show merge conflict details");

program.parse(process.argv);

const getPath = (filePath: string): string => {
  const lastSlash = filePath.lastIndexOf("/");
  if (lastSlash === -1) {
    return "./";
  }
  return filePath.slice(0, lastSlash + 1);
};

const run = async () => {
  if (!fs.existsSync(program.file)) {
    console.log(
      `Could not find '${program.file}', check that file exists and try again`
    );
    return;
  }
  const repoPath = path.resolve(getPath(program.file));
  const filePath = path.resolve(program.file);
  if (program.merge) {
    printMergeConflicts(filePath);
  } else {
    await getFileAuthorStats(filePath);
    console.log("");
    await getFileHistory(repoPath, filePath, program.days);
  }
};

run();
