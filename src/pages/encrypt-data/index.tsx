import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";

// Function to derive the key (must match backend logic)
function deriveKey(sharedSecret: string): CryptoJS.lib.WordArray {
  return CryptoJS.SHA256(sharedSecret); // Generate 32-byte key
}

const sharedSecret = "my256bitsharedkey"; // Shared secret known to both backend and frontend
const secretKey = deriveKey(sharedSecret);

console.log(
  "Derived Frontend Secret Key (Hex):",
  secretKey.toString(CryptoJS.enc.Hex)
);

// Function to decrypt the encrypted text
function decrypt(encryptedText: string): string | null {
  try {
    // Split the IV and encrypted data
    const [ivHex, encryptedHex] = encryptedText.split(":");
    if (!ivHex || !encryptedHex) {
      throw new Error("Invalid encrypted text format");
    }

    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encryptedData = CryptoJS.enc.Hex.parse(encryptedHex); // Parse ciphertext as Hex

    console.log("Frontend IV (Hex):", ivHex);
    console.log("Frontend Encrypted Data (Hex):", encryptedHex);

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

const GetEncryptData = () => {
  const [apiData, setApiData] = useState<{
    firstName: string;
    lastName: string;
  }>({ firstName: "", lastName: "" });
  useEffect(() => {
    async function fetchAndDecrypt(): Promise<void> {
      try {
        const response = await fetch("http://localhost:4001/users", {
          method: "GET",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log("Response Data:", responseData);

        const decryptedData = decrypt(responseData.encryptDataString);
        if (decryptedData) {
          setApiData(JSON.parse(decryptedData));
        } else {
          console.error("Failed to decrypt data.");
        }
      } catch (error) {
        console.error("Error fetching or decrypting data:", error);
      }
    }

    // Call the function to fetch and decrypt the data
    fetchAndDecrypt();
  }, []);

  return (
    <div>
      GetEncryptData
      <br />
      <br />
      {apiData.firstName + " " + apiData.lastName}
    </div>
  );
};

export default GetEncryptData;
