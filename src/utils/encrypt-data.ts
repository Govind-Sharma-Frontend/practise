import CryptoJS from "crypto-js";

import { secretKey } from "./other";

export function encrypt(data: object): string {
    try {
        const iv = CryptoJS.lib.WordArray.random(16); // Random 16-byte IV
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return (
            iv.toString(CryptoJS.enc.Hex) +
            ":" +
            encrypted.ciphertext.toString(CryptoJS.enc.Hex)
        );
    } catch (error) {
        console.error("Encryption error:", error);
        return "";
    }
}