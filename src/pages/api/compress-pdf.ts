import { NextApiRequest, NextApiResponse } from "next";

import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import formidable from "formidable";

export const config = {
    api: {
        bodyParser: false, // Required for formidable
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    if (req.method === "POST") {
        const form = formidable({ multiples: false });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error parsing form data", err);
                res.status(500).send("Error parsing form data");
                return;
            }

            // Ensure we have a file
            const file = Array.isArray(files.file) ? files.file[0] : files.file;
            if (!file) {
                res.status(400).send("File is required");
                return;
            }

            try {
                const tempDir = os.tmpdir();
                const inputPath = file.filepath; // Formidable saves the uploaded file here
                const outputPath = path.join(tempDir, `output_${Date.now()}.pdf`);

                // Construct the Ghostscript command with aggressive compression
                const command = [
                    "gs",
                    "-q",
                    "-dNOPAUSE",
                    "-dBATCH",
                    "-dSAFER",
                    "-sDEVICE=pdfwrite",
                    "-dPDFSETTINGS=/screen", // Aggressive compression
                    "-dEmbedAllFonts=true",
                    "-dSubsetFonts=true",
                    "-dColorImageDownsampleType=/Bicubic",
                    "-dColorImageResolution=72", // Reduce image resolution
                    "-dGrayImageDownsampleType=/Bicubic",
                    "-dGrayImageResolution=72",
                    "-dMonoImageDownsampleType=/Bicubic",
                    "-dMonoImageResolution=72",
                    `-sOutputFile=${outputPath}`,
                    inputPath,
                ].join(" ");

                // Execute the Ghostscript command
                await new Promise<void>((resolve, reject) => {
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            reject(new Error(`Ghostscript error: ${stderr || stdout}`));
                        } else {
                            resolve();
                        }
                    });
                });

                // Read the compressed file and send it back
                const outputBuffer = await fs.readFile(outputPath);

                // Clean up temporary files
                await fs.unlink(outputPath);

                res.status(200).send(outputBuffer);
            } catch (error) {
                console.error("Error processing PDF", error);
                res.status(500).send("Error processing PDF");
            }
        });
    } else {
        res.status(405).send("Method not allowed");
    }
}
