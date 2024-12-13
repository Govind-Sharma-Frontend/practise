import { useEffect, useState } from "react";

import { fetchAndDecrypt, sendEncryptedData } from "@/utils";
import { ApiStateData, ResponseApiStateData } from "@/types";

const GetEncryptData = () => {
  const [apiData, setApiData] = useState<ApiStateData>({
    firstName: "",
    lastName: "",
  });

  const [responseApiData, setResponseApiData] = useState<ResponseApiStateData>({
    firstName: "",
    lastName: "",
    sirName: "",
  });

  useEffect(() => {
    fetchAndDecrypt(setApiData);
    sendEncryptedData(setResponseApiData);
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
