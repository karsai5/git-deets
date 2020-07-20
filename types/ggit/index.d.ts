declare module "ggit" {
  export type BlameLine = {
    commit: string;
    author: string;
    committer: string;
    summary: string;
    filename: string;
    line: string;
  };

  const blame: (path: string) => Promise<Array<BlameLine>>;
}
