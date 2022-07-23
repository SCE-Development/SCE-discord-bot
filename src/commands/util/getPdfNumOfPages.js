const {PDFDocument} = require('pdf-lib');
const fetch = require('node-fetch');
/**
 * Returns the number of pages in a PDF file.
 * @param {string} pdfPath - path to the pdf file
 * @returns {number} - number of pages in the pdf
 */
async function getPdfNumOfPages( url ) {
  const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pageCount = await pdfDoc.getPageCount();
  console.log(pageCount);
  return pageCount;
}
module.exports = {getPdfNumOfPages};
