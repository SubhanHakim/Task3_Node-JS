import { encryptFile, decryptFile } from "./encryptDecrypt";

async function index() {
  const [, , action, filePath, password] = process.argv;

  if (!action || !filePath || !password) {
    console.log(
      "Penggunaan: ts-node index.ts <encrypt|decrypt> <filePath> <password>"
    );
    process.exit(1);
  }

  if (action === "encryptFile") {
    await encryptFile(filePath, password);
  } else if (action === "decryptFile") {
    await decryptFile(filePath, password);
  } else {
    console.log('Aksi tidak dikenal. Gunakan "encryptFile" atau "decrypt".');
  }
}

index();
