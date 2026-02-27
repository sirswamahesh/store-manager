import fs from "fs";
import path from "path";

export const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
