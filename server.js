const express = require('express');
const multer  = require('multer');
const pdf     = require('pdf-parse');
const path    = require('path');
const os      = require('os');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Storage temporal en memoria + disco
const tempDir = path.join(os.tmpdir(), 'proposalmatch');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, tempDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pdf`)
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_, file, cb) =>
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('Solo PDFs'), false)
});

function extractPrice(text) {
  const t = text.replace(/\n/g, ' ');
  const patterns = [
    /precio\s*unitario[^0-9$€]*[\$€]?\s*(\d[\d,\.]+)/i,
    /unit(?:ario)?\s*price[^0-9$€]*[\$€]?\s*(\d[\d,\.]+)/i,
    /precio[^0-9$€]*[\$€]\s*(\d[\d,\.]+)/i,
    /por\s*unidad[^0-9$€]*[\$€]?\s*(\d[\d,\.]+)/i,
    /costo[^0-9$€]*[\$€]?\s*(\d[\d,\.]+)/i,
    /[\$€]\s*(\d{1,4}[,\.]?\d{0,2})\s*(?:\/|por|each|unidad)/i,
    /(\d{1,4}[,\.]?\d{0,2})\s*[\$€]\s*(?:\/|por|each|unidad)/i,
  ];
  for (const p of patterns) {
    const m = t.match(p);
    if (m) {
      const val = parseFloat(m[1].replace(/,/g, '.').replace(/\.(?=\d{3})/g, ''));
      if (val > 0 && val < 100000) return val;
    }
  }
  return null;
}

function extractDelivery(text) {
  const t = text.replace(/\n/g, ' ');
  const patterns = [
    /plazo\s*de\s*entrega[^0-9]*(\d{1,3})\s*d/i,
    /tiempo\s*de\s*entrega[^0-9]*(\d{1,3})\s*d/i,
    /entrega[^0-9]*(\d{1,3})\s*d[ií]/i,
    /delivery\s*(?:time|in)[^0-9]*(\d{1,3})\s*d/i,
    /lead\s*time[^0-9]*(\d{1,3})\s*d/i,
    /(\d{1,3})\s*d[ií]as?\s*de\s*entrega/i,
    /(\d{1,3})\s*(?:días?|days?)\s*(?:hábiles?|calendarios?)?/i,
  ];
  for (const p of patterns) {
    const m = t.match(p);
    if (m) {
      const val = parseInt(m[1]);
      if (val > 0 && val <= 365) return val;
    }
  }
  return null;
}

function extractMinVolume(text) {
  const t = text.replace(/\n/g, ' ');
  const patterns = [
    /(?:cantidad|volumen|orden?)\s*m[ií]n(?:ima)?[^0-9]*(\d[\d,\.]+)/i,
    /m[ií]n(?:imo)?\s*(?:de\s*)?(?:orden?|compra|pedido)[^0-9]*(\d[\d,\.]+)/i,
    /moq[^0-9]*(\d[\d,\.]+)/i,
    /minimum\s*order\s*quantity[^0-9]*(\d[\d,\.]+)/i,
    /pedido\s*m[ií]nimo[^0-9]*(\d[\d,\.]+)/i,
    /(\d[\d,\.]+)\s*(?:unidades?|units?|kg)\s*(?:m[ií]nimo?)/i,
  ];
  for (const p of patterns) {
    const m = t.match(p);
    if (m) {
      const val = parseInt(m[1].replace(/[,.]/g, ''));
      if (val > 0 && val < 10000000) return val;
    }
  }
  return null;
}

function extractPaymentTerms(text) {
  const t = text.replace(/\n/g, ' ');
  const patterns = [
    /t[eé]rminos?\s*de\s*pago[^:\n]*[:\s]+([^\n.]{5,60})/i,
    /condiciones?\s*de\s*pago[^:\n]*[:\s]+([^\n.]{5,60})/i,
    /payment\s*terms?[^:\n]*[:\s]+([^\n.]{5,60})/i,
    /((?:net|neto?)\s*\d{2,3})/i,
    /(\d{1,3}\s*d[ií]as?\s*(?:neto?|plazo|crédito))/i,
    /(pago\s*(?:anticipado|adelantado|al\s*contado|al\s*recibir|contra\s*entrega))/i,
  ];
  for (const p of patterns) {
    const m = t.match(p);
    if (m) retur
