import crypto, { randomBytes } from "crypto";
import fs from "fs/promises";
import path from "path";
import { logActivity } from "./logg";

const algorithm = "aes-256-cbc";
const iv = randomBytes(16);

export async function encryptFile(
  filePath: string,
  password: string
): Promise<void> {
  try {
    logActivity(`Memulai mengenkripsi file: ${filePath}`);
    const key = crypto.scryptSync(password, "salt", 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const fileData = await fs.readFile(filePath);
    const encryptedData = Buffer.concat([
      cipher.update(fileData),
      cipher.final(),
    ]);

    const encryptedFilePath = path.join(
      path.dirname(filePath),
      path.basename(filePath, path.extname(filePath)) + "_encrypted.txt"
    );

    await fs.writeFile(encryptedFilePath, Buffer.concat([iv, encryptedData]));
    logActivity(
      `Berhasil mengenkripsi file ${filePath} menjadi ${encryptedFilePath}`
    );

    console.log(
      `File '${filePath}' berhasil dienkripsi menjadi '${encryptedFilePath}'`
    );
  } catch (error) {
    logActivity(`Error ketika melakukan enkripsi: ${error}`);
  }
}

export async function decryptFile(
  filePath: string,
  password: string
): Promise<void> {
  try {
    logActivity(`Memulai mendekripsi file: ${filePath}`);
    const key = crypto.scryptSync(password, "salt", 32);
    const fileData = await fs.readFile(filePath);

    const iv = fileData.slice(0, 16);
    const encryptedData = fileData.slice(16);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decryptedData: Buffer;
    try {
      decryptedData = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
      ]);
    } catch (error) {
      logActivity(`Password yang dimasukan salah ${error}`);
      console.log("Password yang dimasukan salah");
      return;
    }

    const originalFilePath = path.join(
      path.dirname(filePath),
      path.basename(filePath, "_encrypted.txt") + "_decrypted.txt"
    );

    await fs.writeFile(originalFilePath, decryptedData);
    logActivity(
      `Berhasil mendekripsi file ${filePath} menjadi ${originalFilePath}`
    );

    console.log(
      `File '${filePath}' berhasil didekripsi menjadi '${originalFilePath}'`
    );
  } catch (error) {
    logActivity(`Error ketika mendekripsi file: ${error}`);
    console.error(`Error: ${error}`);
  }
}
