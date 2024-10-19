import crypto, { randomBytes } from "crypto";
import fs from "fs/promises";
import path from "path";
import { logActivity } from "./logg";
import { buffer } from "stream/consumers";

const algorithm = "aes-256-ctr";
const iv = randomBytes(16);

export async function encryptFile(
  filPath: string,
  password: string
): Promise<void> {
  try {
    logActivity(`memulai mengenkripsi file: ${filPath}`);
    const key = crypto.scryptSync(password, "salt", 32);
    const createChiper = crypto.createCipheriv(algorithm, key, iv);

    const fileData = await fs.readFile(filPath);
    const encryptData = Buffer.concat([
      createChiper.update(fileData),
      createChiper.final(),
    ]);

    const encryptFilePath = path.join(
      path.dirname(filPath),
      path.basename(filPath, path.extname(filPath)) + "_encrypted.txt"
    );

    await fs.writeFile(encryptFilePath, Buffer.concat([iv, encryptData]));
    logActivity(
      `Berhasil Mengenkripsi file ${filPath} menjadi ${encryptFilePath}`
    );

    console.log(
      `file '${filPath}' berhasil dienkripsimenjadi '${encryptFilePath}'`
    );
  } catch (error) {
    logActivity(`Error ketika melakukan enkripsi ${error}`);
  }
}

export async function decryptFile(
  filePath: string,
  password: string
): Promise<void> {
  try {
    logActivity(`Memulai mendekripsi file ${filePath}`);
    const key = crypto.scryptSync(password, "salt", 32);
    const fileData = await fs.readFile(filePath);

    const iv = fileData.slice(0, 16);
    const encryptData = fileData.slice(16);

    const dechiper = crypto.createDecipheriv(algorithm, key, iv);

    const decryptData = Buffer.concat([
      dechiper.update(encryptData),
      dechiper.final(),
    ]);
    const originalFilePath = path.join(
      path.dirname(filePath),
      path.basename(filePath, "_encrypted.txt") + "_decrypt.txt"
    );

    await fs.writeFile(originalFilePath, decryptData);
    logActivity(
      `Berhasil melakukan mendekripsi file ${filePath} menjad ${originalFilePath}`
    );

    console.log(
      `File '${filePath}' berhasil didekripsi menjadi '${originalFilePath}'`
    );
  } catch (error) {
    logActivity(`Error ketika mendekripsi file: ${error}`);
    console.error(`Error: ${error}`);
  }
}
