import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
    api: {
        bodyParser: false,
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

            const file = Array.isArray(files.file) ? files.file[0] : files.file;
            if (!file) {
                res.status(400).send("File is required");
                return;
            }

            try {
                const tempDir = os.tmpdir();
                const inputPath = file.filepath;
                const outputPath = path.join(tempDir, `output_${Date.now()}.pdf`);

                // Run Ghostscript for compression
                const gsCommand = [
                    "gs",
                    "-q",
                    "-dNOPAUSE",
                    "-dBATCH",
                    "-dSAFER",
                    "-sDEVICE=pdfwrite",
                    "-dPDFSETTINGS=/ebook",
                    "-dEmbedAllFonts=true",
                    "-dSubsetFonts=true",
                    "-dColorImageResolution=150",
                    "-dGrayImageResolution=150",
                    "-dMonoImageResolution=150",
                    `-sOutputFile=${outputPath}`,
                    inputPath,
                ].join(" ");

                await new Promise<void>((resolve, reject) => {
                    exec(gsCommand, (error, stdout, stderr) => {
                        if (error) {
                            reject(new Error(`Ghostscript error: ${stderr || stdout}`));
                        } else {
                            resolve();
                        }
                    });
                });

                // Post-process with qpdf for linearization
                const linearizedOutputPath = path.join(tempDir, `linearized_${Date.now()}.pdf`);
                const qpdfCommand = `qpdf ${outputPath} --linearize ${linearizedOutputPath}`;

                await new Promise<void>((resolve, reject) => {
                    exec(qpdfCommand, (error, stdout, stderr) => {
                        if (error) {
                            reject(new Error(`qpdf error: ${stderr || stdout}`));
                        } else {
                            resolve();
                        }
                    });
                });

                // Read the linearized file and send it back
                const outputBuffer = await fs.readFile(linearizedOutputPath);

                // Clean up temporary files
                await fs.unlink(outputPath);
                await fs.unlink(linearizedOutputPath);

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
