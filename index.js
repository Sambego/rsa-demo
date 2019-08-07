"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var big_integer_1 = __importDefault(require("big-integer"));
var mathjs_1 = require("mathjs");
// Helper functions
var modInverse = function (a, b) {
    a %= b;
    var x = 1;
    for (; x < b; x++) {
        if ((a * x) % b == 1) {
            return x;
        }
    }
};
// Do the actual thing
var p = 61;
var q = 53;
var n = p * q;
var λ = mathjs_1.lcm(p - 1, q - 1);
var e = 17; // Random number smaller is larger than 1, smaller than λ and coprime to λ
var d = modInverse(e, λ);
console.log("----------------\np: " + p + ", \nq: " + q + ", \nn: " + n + ", \n\u03BB: " + λ + ", \nd: " + d + "\n----------------");
var message = 65;
var encrypt = function (message) {
    console.log("Encrypt: " + message + " ^ " + e + " % " + n);
    return big_integer_1["default"](message)
        .modPow(e, n)
        .toJSNumber();
};
var decrypt = function (cipherText) {
    console.log("Decrypt: " + cipherText + " ^ " + d + " % " + n);
    return big_integer_1["default"](cipherText)
        .modPow(d, n)
        .toJSNumber();
};
var cipherText = encrypt(message);
var decryptedText = decrypt(cipherText);
console.log("----------------");
console.log("The message to encrypt is", message);
console.log("Encrypted message", cipherText);
console.log("Decrypted message", decryptedText);
console.log("----------------");
