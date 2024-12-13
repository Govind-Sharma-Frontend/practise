import CryptoJS from "crypto-js";

export function deriveKey(sharedSecret: string): CryptoJS.lib.WordArray {
    return CryptoJS.SHA256(sharedSecret); // Generate 32-byte key
}

export const sharedSecret = "my256bitsharedkey"; // Shared secret known to both backend and frontend
export const secretKey = deriveKey(sharedSecret);
