import simpleGit, { DefaultLogFields } from "simple-git";
import orderBy from "lodash/orderBy";
import groupBy from "lodash/groupBy";
import forEach from "lodash/forEach";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import chalk from "chalk";

dayjs.extend(relativeTime)

type AuthorDetail = {
  authorName: string;
  logs: Array<DefaultLogFields>;
};

type AuthorDetails = Array<AuthorDetail>;

export default async (repoPath: string, filePath: string, numOfDays: string) => {
  const git = simpleGit(repoPath);
  console.log(chalk.inverse(`Changes in the last ${numOfDays} days (by author)`));
  const logs = (await git.log({ file: filePath })).all;
  const dateFilter = dayjs().subtract(Number(numOfDays), "day");
  const topLogs = orderBy(
    logs.filter(log => dateFilter.isBefore(dayjs(log.date))),
    log => log.date,
    ["desc"]
  );

  let groupedByAuthor: AuthorDetails = [];

  forEach(
    groupBy(topLogs, log => log.author_name),
    (logs, authorName) => {
      groupedByAuthor.push({
        authorName,
        logs
      });
    }
  );

  groupedByAuthor = orderBy(
    groupedByAuthor,
    authorDetail => authorDetail.logs.length,
    ["desc"]
  );

  groupedByAuthor.forEach(authorDetail => {
    console.log(authorDetail.authorName);
    authorDetail.logs.forEach(log => {
      const date = dayjs(log.date).format("DD/MMM/YYYY hh:mma");
      const diff = dayjs(log.date).fromNow();
      console.log(`- ${chalk.blue(`${date} ${diff}`)} ${log.hash}`);
      console.log(`  ${chalk.yellow(log.message)}`);
    });
  });
};
