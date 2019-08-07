// Imports
import * as util from "util";
import bigInt from "big-integer";
import { lcm, xgcd } from "mathjs";

// Helper functions

const modInverse = (a: number, b: number) => {
  a %= b;
  let x = 1;
  for (; x < b; x++) {
    if ((a * x) % b == 1) {
      return x;
    }
  }
};

// Do the actual thing
const p: number = 61;
const q: number = 53;
const n: number = p * q;
const λ: number = lcm(p - 1, q - 1);
const e: number = 17; // Random number smaller is larger than 1, smaller than λ and coprime to λ
const d: number = modInverse(e, λ);

console.log(`----------------
p: ${p}, 
q: ${q}, 
n: ${n}, 
λ: ${λ}, 
d: ${d}
----------------`);

const message: number = 65;
const encrypt = (message: number) => {
  console.log(`Encrypt: ${message} ^ ${e} % ${n}`);

  return bigInt(message)
    .modPow(e, n)
    .toJSNumber();
};
const decrypt = (cipherText: number) => {
  console.log(`Decrypt: ${cipherText} ^ ${d} % ${n}`);

  return bigInt(cipherText)
    .modPow(d, n)
    .toJSNumber();
};

const cipherText = encrypt(message);
const decryptedText = decrypt(cipherText);

console.log("----------------");
console.log("The message to encrypt is", message);
console.log("Encrypted message", cipherText);
console.log("Decrypted message", decryptedText);
console.log("----------------");
