import * as fs from "fs/promises";
import path from "path";

const logDirr = path.join(__dirname, "../aktivitas");

async function logActivity(message: string): Promise<void> {
  try {
    const date = new Date();
    const timeStamp = `${date.getHours}_${date.getMinutes}_${date.getMonth}_${date.getDate}_${date.getFullYear}`;
    const logFilePath = path.join(logDirr, `${timeStamp}.log`);

    await fs.mkdir(logDirr, { recursive: true });
    await fs.appendFile(logFilePath, `${new Date().toString()} - ${message}\n`);
  } catch (error) {
    console.log("Error ketika mengenkripsi file:", error);
  }
}

export { logActivity };
