"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
// Imports
var big_integer_1 = __importDefault(require("big-integer"));
// Helper functions
var getRandomPrime = function (bits) {
    var min = big_integer_1["default"](6074001000).shiftLeft(bits - 33);
    var max = big_integer_1["default"].one.shiftLeft(bits).minus(1);
    while (true) {
        var p_1 = big_integer_1["default"].randBetween(min, max); // WARNING: not a cryptographically secure RNG!
        if (p_1.isProbablePrime(256)) {
            return p_1;
        }
    }
};
var getCoprime = function (nr) {
    while (true) {
        var rand = getRandomPrime(32);
        console.log("Random gcd:", big_integer_1["default"].gcd(rand, nr));
        if (big_integer_1["default"].gcd(rand, nr).equals(1)) {
            return rand;
        }
    }
};
// Do the actual thing
var keySize = 1024;
var p = getRandomPrime(keySize / 2);
var q = getRandomPrime(keySize / 2);
var n = p.multiply(q);
var λ = big_integer_1["default"].lcm(p.minus(1), q.minus(1));
var e = getCoprime(λ);
var d = e.modInv(λ);
console.log("----------------\np: " + p + ", \nq: " + q + ", \nn: " + n + ", \n\u03BB: " + λ + ", \nd: " + d + "\n----------------");
var message = big_integer_1["default"](65);
var encrypt = function (message) {
    console.log("Encrypt: " + message + " ^ " + e + " % " + n);
    return big_integer_1["default"](message).modPow(e, n);
};
var decrypt = function (cipherText) {
    console.log("Decrypt: " + cipherText + " ^ " + d + " % " + n);
    return big_integer_1["default"](cipherText).modPow(d, n);
};
var cipherText = encrypt(message);
var decryptedText = decrypt(cipherText);
console.log("----------------");
console.log("The message to encrypt is", message.toJSNumber());
console.log("Encrypted message", cipherText.toJSNumber());
console.log("Decrypted message", decryptedText.toJSNumber());
console.log("----------------");
