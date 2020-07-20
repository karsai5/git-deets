#!/usr/bin/env node
import fs from "fs";
import path from "path";
import printMergeConflicts from "./mergeConflicts";

import { program } from "commander";

program.requiredOption("-f, --file <path>", "path to file");

program.parse(process.argv);

const run = async () => {
  if (!fs.existsSync(program.file)) {
    console.log(
      `Could not find '${program.file}', check that file exists and try again`
    );
    return;
  }

  const filePath = path.resolve(program.file);
  printMergeConflicts(filePath);
};

run();
