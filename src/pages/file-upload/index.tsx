import React, { useRef } from "react";
import dynamic from "next/dynamic";
import UploadAnimationIcon from "@/assets/icons/ic_file_upload.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const FileUpload: React.FC = () => {
  const ref = useRef<HTMLInputElement | null>(null);

  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files); // Convert FileList to Array for easier manipulation

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file); // Key must match the API handler

      try {
        const res = await fetch("/api/compress-pdf", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Failed to compress the file: ${file.name}`);
        }

        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;

        // Dynamic filename based on original name
        const fileExtension = file.name.split(".").pop();
        const compressedFileName = `${file.name.replace(
          `.${fileExtension}`,
          ""
        )}_compressed.${fileExtension}`;

        link.download = compressedFileName;
        document.body.appendChild(link); // Append to the DOM for Firefox compatibility
        link.click();
        document.body.removeChild(link); // Clean up after download
        console.log(
          `File ${file.name} compressed and downloaded successfully.`
        );
      } catch (error) {
        console.error(
          `An error occurred while compressing the file ${file.name}:`,
          error
        );
      }
    }
  };

  return (
    <div>
      <h1 className="text-center my-20 font-semibold text-3xl">
        Upload files Images Docs PDF For Compress
      </h1>

      <input
        multiple
        ref={ref}
        type="file"
        className="hidden"
        onChange={handleUploadFile}
      />

      <section className="border border-gray-500 rounded-2xl w-[350px] h-72 mx-auto text-center">
        <div
          className="size-48 mx-auto pointer-cursor"
          onClick={() => ref.current?.click()}
        >
          <Lottie animationData={UploadAnimationIcon} loop={true} />
        </div>
        <span className="text-gray-600 font-bold">Upload your file here </span>
      </section>
    </div>
  );
};

export default FileUpload;
