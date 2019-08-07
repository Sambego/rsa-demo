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
        if (big_integer_1["default"].gcd(rand, nr).equals(1)) {
            return rand;
        }
    }
};
var stringToBin = function (str) {
    return str
        .split("")
        .map(function (char, index) { return str.charCodeAt(index); });
};
var binToString = function (bin) {
    return Array.prototype.reduce.call(bin.value, function (str, charCode) {
        return (str += String.fromCharCode(charCode));
    }, "");
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
var message = "This is a secret message";
var encrypt = function (message) {
    var messageBin = stringToBin(message);
    var messageBigInt = big_integer_1["default"].fromArray(messageBin, 256); // UTF8 is 8 bit, so max 256 characters
    console.log("Encrypt: " + messageBigInt + " ^ " + e + " % " + n);
    return big_integer_1["default"](messageBigInt).modPow(e, n);
};
var decrypt = function (cipherText) {
    console.log("Decrypt: " + cipherText + " ^ " + d + " % " + n);
    var decryptedBigInt = big_integer_1["default"](cipherText).modPow(d, n);
    var decryptedBin = decryptedBigInt.toArray(256); // UTF8 is 8 bit, so max 256 characters
    return binToString(decryptedBin);
};
var cipherText = encrypt(message);
var decryptedText = decrypt(cipherText);
console.log("----------------");
console.log("The message to encrypt is: \"" + message + "\"");
console.log("Encrypted message: " + cipherText.toString(16));
console.log("Decrypted message: " + decryptedText);
console.log("----------------");
