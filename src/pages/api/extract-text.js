import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form with uploaded file
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    if (!files.pdf) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Get the temporary path of the uploaded file
    const filePath = files.pdf.filepath;
    
    // Read the file
    const pdfBytes = fs.readFileSync(filePath);
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Get the number of pages
    const numPages = pdfDoc.getPageCount();
    
    // Extract text from each page
    // Note: This is a simplified approach - PDF.js provides more accurate text extraction
    // For production use, consider using pdf.js on the server or sending the PDF to a service
    
    // Return metadata about the PDF
    return res.status(200).json({
      numPages,
      message: 'File processed successfully',
    });
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return res.status(500).json({ error: 'Error processing the PDF' });
  }
}