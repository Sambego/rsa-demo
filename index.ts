// Imports
import bigInt from "big-integer";

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
    console.log("Random gcd:", bigInt.gcd(rand, nr));
    if (bigInt.gcd(rand, nr).equals(1)) {
      return rand;
    }
  }
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

const message: bigInt.BigInteger = bigInt(65);
const encrypt = (message: bigInt.BigInteger) => {
  console.log(`Encrypt: ${message} ^ ${e} % ${n}`);

  return bigInt(message).modPow(e, n);
};
const decrypt = (cipherText: bigInt.BigInteger) => {
  console.log(`Decrypt: ${cipherText} ^ ${d} % ${n}`);

  return bigInt(cipherText).modPow(d, n);
};

const cipherText: bigInt.BigInteger = encrypt(message);
const decryptedText: bigInt.BigInteger = decrypt(cipherText);

console.log("----------------");
console.log("The message to encrypt is", message.toJSNumber());
console.log("Encrypted message", cipherText.toJSNumber());
console.log("Decrypted message", decryptedText.toJSNumber());
console.log("----------------");
