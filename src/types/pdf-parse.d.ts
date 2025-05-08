import type { NextApiRequest, NextApiResponse } from "next";
import pdfParse from "pdf-parse";
import { ParsedRow } from "@/types/convertType";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const file = req.body instanceof Buffer ? req.body : null;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdf = await pdfParse(file);
    const parsedData: ParsedRow[] = [{ Text: pdf.text }];
    res.status(200).json(parsedData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse PDF";
    res.status(500).json({ error: message });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};