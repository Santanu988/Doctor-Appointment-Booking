const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDF = async (data, fileName) => {
  if (typeof fileName !== "string") {
    throw new Error("Invalid fileName: expected a string.");
  }

  const folderPath = "pdfs";

  // Ensure folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const pdfPath = path.join(folderPath, fileName);

  const doc = new PDFDocument({ margin: 50 });
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // Optional: Load logo if it exists
  const logoPath = path.join(__dirname, "assets", "logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, {
      fit: [80, 80],
      align: "left",
      valign: "top"
    });
  }

  doc.moveDown(1);

  // Hospital Header
  doc
    .fontSize(20)
    .fillColor("#2c3e50")
    .font("Helvetica-Bold")
    .text("Lifeline Hospital", { align: "center" });

  doc
    .fontSize(12)
    .fillColor("#555")
    .font("Helvetica")
    .text("123 Health St, Medical City, Country", { align: "center" })
    .moveDown(2);

  // Title
  doc
    .fontSize(16)
    .fillColor("#000")
    .font("Helvetica-Bold")
    .text("Appointment Confirmation", { align: "center", underline: true })
    .moveDown(1.5);

  // Patient Info
  doc
    .fontSize(14)
    .fillColor("#333")
    .font("Helvetica")
    .text(`Patient Name: ${data.name}`)
    .text(`Age: ${data.age}`)
    .text(`Blood Type: ${data.blood}`)
    .text(`Phone: ${data.phone}`)
    .text(`Appointment Date: ${data.date}`)
    .text(`Appointment Time: ${data.time}`)
    .moveDown(1.5);

  // Doctor Info
  doc
    .fontSize(14)
    .fillColor("#000")
    .font("Helvetica-Bold")
    .text("Doctor Details", { underline: true });

  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor("#333")
    .text(`Doctor: ${data.doctor}`)
    .text(`Department: ${data.dept}`)
    .moveDown(1.5);

  // Prescription
  doc
    .fontSize(14)
    .fillColor("#000")
    .font("Helvetica-Bold")
    .text("Prescription Details", { underline: true });

  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor("#333")
    .moveDown(1);

  // Messages
  doc
    .fontSize(12)
    .text(`Message: ${data.message || "No additional message provided"}`)
    .text(`Hospital Message: ${data.admi_msg || ""}`)
    .text(`Other Message: ${data.msg || ""}`)
    .moveDown(2);

  // Footer
  doc
    .fontSize(12)
    .fillColor("#000")
    .text("Please arrive at the hospital at the mentioned time.", {
      align: "center",
    })
    .text("If you have any queries, feel free to contact us.", {
      align: "center",
    })
    .moveDown(2);

  doc
    .fontSize(12)
    .text("This is System Genarate pdf Signature NOt Required ", { align: "left" })
    .text("Date: " + new Date().toLocaleDateString(), { align: "right" });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(pdfPath));
    writeStream.on("error", reject);
  });
};

module.exports = { generatePDF };
