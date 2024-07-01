"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.symmetricDecrypt = exports.symmetricEncrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ALGORITHM = "aes256";
const INPUT_ENCODING = "utf8";
const OUTPUT_ENCODING = "hex";
const IV_LENGTH = 16;
/**
 *
 * @param text Value to be encrypted
 * @param key Key used to encrypt value must be 32 bytes for AES256 encryption algorithm
 *
 * @returns Encrypted value using key
 */
const symmetricEncrypt = function (text, key) {
    console.log(text, key);
    const _key = Buffer.from(key, "latin1");
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, _key, iv);
    let ciphered = cipher.update(text, INPUT_ENCODING, OUTPUT_ENCODING);
    ciphered += cipher.final(OUTPUT_ENCODING);
    const ciphertext = `${iv.toString(OUTPUT_ENCODING)}:${ciphered}`;
    return ciphertext;
};
exports.symmetricEncrypt = symmetricEncrypt;
/**
 *
 * @param text Value to decrypt
 * @param key Key used to decrypt value must be 32 bytes for AES256 encryption algorithm
 */
const symmetricDecrypt = function (text, key) {
    const _key = Buffer.from(key, "latin1");
    const components = text.split(":");
    const iv_from_ciphertext = Buffer.from(components.shift() || "", OUTPUT_ENCODING);
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, _key, iv_from_ciphertext);
    let deciphered = decipher.update(components.join(":"), OUTPUT_ENCODING, INPUT_ENCODING);
    deciphered += decipher.final(INPUT_ENCODING);
    return deciphered;
};
exports.symmetricDecrypt = symmetricDecrypt;
