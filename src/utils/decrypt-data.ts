import CryptoJS from "crypto-js";

import { secretKey } from "./other";

export function decrypt(encryptedText: string): string | null {
    try {
        if (!encryptedText || encryptedText == null) {
            return "";
        }

        const [ivHex, encryptedHex] = encryptedText?.split(":");

        if (!ivHex || !encryptedHex) {
            throw new Error("Invalid encrypted text format");
        }

        const iv = CryptoJS.enc.Hex.parse(ivHex);
        const encryptedData = CryptoJS.enc.Hex.parse(encryptedHex);

        // Decrypt using CryptoJS
        const bytes = CryptoJS.AES.decrypt(
            { ciphertext: encryptedData },
            secretKey,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            }
        );

        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) {
            throw new Error("Decryption resulted in invalid UTF-8 data");
        }

        return decrypted;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}