import ggit, { BlameLine } from "ggit";

import simpleGit, { DefaultLogFields } from "simple-git";
import uniqueBy from "lodash/uniqBy";
import chalk from "chalk";
import { getPath } from '../utils';

export const getCommitDetails = async (blames: Array<BlameLine>, filePath: string) => {
  console.log('path', filePath);
  const git = simpleGit(getPath(filePath));
  const logs = (await git.log({ file: filePath })).all;

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
