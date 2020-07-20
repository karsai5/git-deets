import ggit, { BlameLine } from "ggit";
import groupBy from "lodash/groupBy";
import forEach from "lodash/forEach";
import orderBy from "lodash/orderBy";
import chalk from 'chalk';

type AuthorDetail = {
  author: string;
  commits: Array<BlameLine>;
};

type AuthorDetails = Array<AuthorDetail>;

const orderByNumberOfCommits = (authorDetails: AuthorDetails) =>
  orderBy(authorDetails, authorCommits => authorCommits.commits.length, [
    "desc"
  ]);

const getPercentage = (a: number, b: number) =>
  `${((a / b) * 100).toFixed(2)}%`;

const printTopAuthorStats = (
  authorDetails: AuthorDetails,
  totalLines: number,
  num: number
) =>
  authorDetails.slice(0, num).map(authorCommits => {
    const numCommits = authorCommits.commits.length;
    const percentage = getPercentage(numCommits, totalLines);
    const lines = chalk.blue(numCommits + ' lines');
    console.log(
      `${authorCommits.author} ${lines} ${chalk.yellow(percentage)}`
    );
  });

const originalConsoleLog = console.log;

export default async (path: string) => {
  console.log = () => {};
  const blameDeets = await ggit.blame(path);
  console.log = originalConsoleLog;

  console.log(chalk.inverse('Top authors of file'))

  const totalLines = blameDeets.length;

  let authorDetails: AuthorDetails = [];
  forEach(
    groupBy(blameDeets, lineDetails => lineDetails.author),

    (commits, author) => {
      authorDetails.push({
        author,
        commits
      });
    }
  );

  authorDetails = orderByNumberOfCommits(authorDetails);
  printTopAuthorStats(authorDetails, totalLines, 5);
};
