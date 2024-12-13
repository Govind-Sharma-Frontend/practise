import { Dispatch, SetStateAction } from "react";

import { ApiStateData } from "@/types";
import { decrypt } from "../decrypt-data";

export async function fetchAndDecrypt(setApiData: Dispatch<SetStateAction<ApiStateData>>): Promise<void> {
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

        const decryptedData = decrypt(responseData.encryptData);
        if (decryptedData) {
            setApiData(JSON.parse(decryptedData));
        } else {
            console.error("Failed to decrypt data.");
        }
    } catch (error) {
        console.error("Error fetching or decrypting data:", error);
    }
}