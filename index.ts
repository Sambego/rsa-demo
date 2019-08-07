// Imports
import bigInt, { BaseArray } from "big-integer";

// Helper functions
const getRandomPrime = (bits: number): bigInt.BigInteger => {
  const min = bigInt(6074001000).shiftLeft(bits - 33);
  const max = bigInt.one.shiftLeft(bits).minus(1);

  while (true) {
    const p = bigInt.randBetween(min, max); // WARNING: not a cryptographically secure RNG!
    if (p.isProbablePrime(256)) {
      return p;
    }
  }
};

const getCoprime = (nr: bigInt.BigInteger) => {
  while (true) {
    const rand = getRandomPrime(32);
    if (bigInt.gcd(rand, nr).equals(1)) {
      return rand;
    }
  }
};

const stringToBin = (str: string) => {
  return str
    .split("")
    .map((char: string, index: number) => str.charCodeAt(index));
};

const binToString = (bin: bigInt.BaseArray): string => {
  return Array.prototype.reduce.call(
    bin.value,
    (str: string, charCode: number) => {
      return (str += String.fromCharCode(charCode));
    },
    ""
  );
};

// Do the actual thing
const keySize = 1024;
const p: bigInt.BigInteger = getRandomPrime(keySize / 2);
const q: bigInt.BigInteger = getRandomPrime(keySize / 2);
const n: bigInt.BigInteger = p.multiply(q);
const λ: bigInt.BigInteger = bigInt.lcm(p.minus(1), q.minus(1));
const e: bigInt.BigInteger = getCoprime(λ);
const d: bigInt.BigInteger = e.modInv(λ);

console.log(`----------------
p: ${p}, 
q: ${q}, 
n: ${n}, 
λ: ${λ}, 
d: ${d}
----------------`);

const message: string = "This is a secret message";
const encrypt = (message: string): bigInt.BigInteger => {
  const messageBin = stringToBin(message);
  const messageBigInt = bigInt.fromArray(messageBin, 256);
  console.log(`Encrypt: ${messageBigInt} ^ ${e} % ${n}`);

  return bigInt(messageBigInt).modPow(e, n);
};

const decrypt = (cipherText: bigInt.BigInteger): string => {
  console.log(`Decrypt: ${cipherText} ^ ${d} % ${n}`);
  const decryptedBigInt = bigInt(cipherText).modPow(d, n);
  const decryptedBin = decryptedBigInt.toArray(256);
  return binToString(decryptedBin);
};

const cipherText: bigInt.BigInteger = encrypt(message);
const decryptedText: string = decrypt(cipherText);

console.log("----------------");
console.log(`The message to encrypt is: "${message}"`);
console.log(`Encrypted message: ${cipherText.toString(16)}`);
console.log(`Decrypted message: ${decryptedText}`);
console.log("----------------");
