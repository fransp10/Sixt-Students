import PDFDocument from "pdfkit";

// month is "YYYY-MM". The month is written as numbers on purpose: the built-in PDF font
// has no č/ć/đ, which names like "siječanj" or "veljača" would need.
export function buildContractPdf(studentName: string, month: string): Promise<Buffer> {
  const [year, mm] = month.split("-");

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 60 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(24).text("Studentski ugovor", { align: "center" });
    doc.moveDown(2).fontSize(12);
    doc.text(`Student: ${studentName}`);
    doc.text(`Mjesec: ${mm}/${year}`);
    doc.text("Radno mjesto: Rent a car referent");
    doc.end();
  });
}
