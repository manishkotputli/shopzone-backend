const crypto = require("crypto");

const SECRET_KEY = crypto
  .createHash("sha256")
  .update(process.env.URL_SECRET || "shopzone_secret_key")
  .digest();

const IV_LENGTH = 16;

function encryptId(id) {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    SECRET_KEY,
    iv
  );

  let encrypted = cipher.update(String(id), "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

function decryptId(hash) {
  try {
    const parts = hash.split(":");

    if (parts.length !== 2) return null;

    const iv = Buffer.from(parts[0], "hex");

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      SECRET_KEY,
      iv
    );

    let decrypted = decipher.update(parts[1], "hex", "utf8");
    decrypted += decipher.final("utf8");

    return parseInt(decrypted);
  } catch (e) {
    return null;
  }
}

module.exports = {
  encryptId,
  decryptId,
};