
export const getPath = (filePath: string): string => {
  const lastSlash = filePath.lastIndexOf("/");
  if (lastSlash === -1) {
    return "./";
  }
  return filePath.slice(0, lastSlash + 1);
};

