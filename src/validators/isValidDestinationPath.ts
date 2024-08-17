import fs from "fs";

export default (path: string) => {
    return path !== "" &&
    fs.existsSync(path) && fs.statSync(path).isDirectory();
  };
