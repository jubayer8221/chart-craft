import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import type { ParsedRow } from "@/types/convertType";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ maxFileSize: 10 * 1024 * 1024 }); // 10MB limit
  try {
    const { files } = await new Promise<{ files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ files });
      });
    });
    const file = files.file as formidable.File | undefined;
    if (!file || !file.filepath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Placeholder for PDF parsing
    // In production, use a library like `pdf2json` or an external service
    await fs.readFile(file.filepath);
    const parsedData: ParsedRow[] = [
      { Text: "PDF parsing not implemented. Use a third-party service." },
    ];

    await fs.unlink(file.filepath); // Clean up
    res.status(200).json(parsedData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse PDF";
    res.status(500).json({ error: message });
  }
}