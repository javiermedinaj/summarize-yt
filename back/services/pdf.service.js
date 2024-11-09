import { PDFExtract } from 'pdf.js-extract';
import dotenv from 'dotenv';
dotenv.config();

const pdfExtract = new PDFExtract();
const MAX_FILE_SIZE = 8 * 1024 * 1024;

export async function extractTextFromPDF(file) {
    if (!file || !file.buffer) {
        throw new Error('Invalid file or missing buffer');
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
    }

    const data = await pdfExtract.extractBuffer(file.buffer);
    let fullText = data.pages
        .map(page => page.content.map(item => item.str).join(' '))
        .join('\n');

    return { fullText };
}