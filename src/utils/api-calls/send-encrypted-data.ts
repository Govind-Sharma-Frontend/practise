import { Dispatch, SetStateAction } from "react";

import { ResponseApiStateData } from "@/types";
import { encrypt, decrypt } from '@/utils'

export async function sendEncryptedData(setResponseApiData: Dispatch<SetStateAction<ResponseApiStateData>>) {
    const data = { firstName: "Jai", lastName: "Kumar" };
    const encryptedPayload = encrypt(data);

    try {
        const response = await fetch(
            "http://localhost:4001/users/decrypt-data",
            {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ encryptedPayload }),
            }
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const responseData = await response.json();

        const decryptedData = decrypt(responseData.data);

        if (decryptedData) {
            setResponseApiData(JSON.parse(decryptedData));
        }
    } catch (error) {
        console.error("Error sending data:", error);
    }
}