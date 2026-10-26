import PDFDocument from "pdfkit";
import Token from "./meal-token.model.js";
import Menu from "../menu/menu.model.js";
import AppError from "../../shared/utils/appError.js";

const createReceiptPdf = (token, user) => new Promise((resolve, reject) => {
  const doc = new PDFDocument({ size: [226, 600], margin: 10 });
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => resolve(Buffer.concat(chunks)));
  doc.on("error", reject);

  doc.font("Helvetica-Bold").fontSize(14).text(user.hotelName || "Hotel", { align: "center" });
  doc.font("Helvetica").fontSize(10).text(user.address || "Address", { align: "center" });
  doc.text(user.phone || "Phone", { align: "center" }).moveDown(0.5);
  doc.fontSize(9)
    .text(`Date: ${token.date}`)
    .text(`Time: ${token.createdAt.toLocaleTimeString()}`)
    .text(`Table No: ${token.tableNumber}`)
    .text(`Token No: ${token.tokenNumber}`)
    .text(`Payment Method: ${token.paymentMethod}`)
    .moveDown();

  const x = 10;
  const widths = { name: 100, qty: 30, price: 40, total: 40 };
  let y = doc.y;
  doc.font("Helvetica-Bold").fontSize(9);
  doc.text("Item", x, y, { width: widths.name });
  doc.text("Qty", x + widths.name, y, { width: widths.qty, align: "center" });
  doc.text("Price", x + widths.name + widths.qty, y, { width: widths.price, align: "right" });
  doc.text("Total", x + widths.name + widths.qty + widths.price, y, { width: widths.total, align: "right" });
  doc.moveDown(0.4);
  doc.moveTo(x, doc.y).lineTo(216, doc.y).stroke().moveDown(0.4);

  doc.font("Helvetica").fontSize(9);
  for (const item of token.items) {
    y = doc.y;
    doc.text(item.name, x, y, { width: widths.name, ellipsis: true });
    doc.text(String(item.qty), x + widths.name, y, { width: widths.qty, align: "center" });
    doc.text(item.price.toFixed(2), x + widths.name + widths.qty, y, { width: widths.price, align: "right" });
    doc.text((item.price * item.qty).toFixed(2), x + widths.name + widths.qty + widths.price, y, { width: widths.total, align: "right" });
    doc.moveDown(0.5);
  }

  const subtotal = token.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  doc.moveDown(0.3).font("Helvetica-Bold").fontSize(10)
    .text(`Subtotal: ${subtotal.toFixed(2)}`, x, doc.y, { align: "right" })
    .moveDown(0.6)
    .text("Thank you!", { align: "center" });
  doc.font("Helvetica").fontSize(9)
    .text("Please Come Again", { align: "center" })
    .text(user.hotelName || "Hotel Name", { align: "center" });
  doc.end();
});

export const generateToken = async (user, { tableNumber, items }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError(400, "Please provide menu items");
  }

  const date = new Date().toISOString().split("T")[0];
  const menu = await Menu.findOne({ userId: user._id });
  if (!menu) throw new AppError(404, "Menu not found for this admin");

  const resolvedItems = items.map((requestedItem) => {
    const menuItem = menu.items.find((item) => item.menuItemId === requestedItem.menuItemId);
    if (!menuItem) throw new AppError(404, `Menu item with code ${requestedItem.menuItemId} not found`);
    return { name: menuItem.name, price: menuItem.price, qty: requestedItem.qty || 1 };
  });

  const lastToken = await Token.findOne({ adminId: user._id, date }).sort({ tokenNumber: -1 });
  const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;
  const token = await Token.create({
    adminId: user._id,
    date,
    tokenNumber,
    items: resolvedItems,
    tableNumber,
    hotelName: user.hotelName || "Hotel",
    paymentMethod: "cash",
  });
  const pdf = await createReceiptPdf(token, user);
  return { tokenNumber, pdf };
};

export const getTokensByDate = async (adminId, { year, month, day }) => {
  const date = `${year}-${month}-${day}`;
  const tokens = await Token.find({ date, adminId }).populate("adminId", "name email hotelName");
  if (!tokens.length) throw new AppError(404, "No tokens found for this date");
  return tokens;
};

export const getMyTokens = (adminId) => Token.find({ adminId });
