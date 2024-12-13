import { useEffect, useState } from "react";

import { decrypt, encrypt } from "@/utils";

const GetEncryptData = () => {
  const [apiData, setApiData] = useState<{
    firstName: string;
    lastName: string;
  }>({ firstName: "", lastName: "" });

  const [responseApiData, setResponseApiData] = useState<{
    firstName: string;
    lastName: string;
    sirName: string;
  }>({ firstName: "", lastName: "", sirName: "" });

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

    fetchAndDecrypt();
  }, []);

  useEffect(() => {
    async function sendEncryptedData() {
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

    sendEncryptedData();
  }, []);

  return (
    <div>
      Get encrypt data: &nbsp;{apiData.firstName + " " + apiData.lastName}{" "}
      <br />
      <br />
      Api response data: &nbsp;
      {responseApiData.firstName +
        " " +
        responseApiData.lastName +
        " " +
        responseApiData.sirName}
    </div>
  );
};

export default GetEncryptData;
