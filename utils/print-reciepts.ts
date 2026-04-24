import { Receipt } from "@/app/pay/payment-collection-form";

export default function printReceipts(receiptList: Receipt[]) {
    const receiptRows = (r: Receipt) => `
      <tr><td>Name</td><td>${r.name}</td></tr>
      <tr><td>Email</td><td>${r.email}</td></tr>
      ${Object.entries(r.fields).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}
    `;
    const slips = receiptList.map((r) => `
      <div class="slip">
        <div class="header">
          <p class="title">${r.instanceName}</p>
          <p class="sub">${r.paymentType}</p>
        </div>
        <hr class="divider"/>
        <table><tbody>${receiptRows(r)}</tbody></table>
        <hr class="divider"/>
        <div class="amount"><span>Amount Paid</span><span>&#x20A6;${r.unitAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span></div>
        ${r.quantity > 1 ? `<p class="note">Person ${r.index + 1} of ${r.quantity} &middot; Total &#x20A6;${r.totalAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>` : ""}
        <hr class="divider"/>
        <p class="ref">Ref: ${r.reference}</p>
        <p class="date">${r.collectedAt}</p>
        <p class="footer">Thank you</p>
      </div>
    `).join("");

    const win = window.open("", "_blank", "width=500,height=700");
    if (!win) { alert("Popup blocked. Please allow popups for this site."); return; }
    win.document.write(`<!DOCTYPE html><html><head><title>Receipt</title><style>
      @page { size: 80mm auto; margin: 4mm; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Courier New', Courier, monospace; font-size: 9pt; color: #000; width: 72mm; }
      .slip { width: 72mm; padding: 2mm 0; page-break-after: always; }
      .slip:last-child { page-break-after: avoid; }
      .header { text-align: center; margin-bottom: 2mm; }
      .title { font-size: 11pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5mm; }
      .sub { font-size: 9pt; margin-top: 1mm; }
      .divider { border: none; border-top: 1px dashed #000; margin: 2mm 0; }
      table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
      td:first-child { color: #555; white-space: nowrap; padding-right: 3mm; width: 28mm; vertical-align: top; }
      td:last-child { font-weight: bold; word-break: break-word; }
      .amount { display: flex; justify-content: space-between; font-size: 10pt; font-weight: bold; margin: 1mm 0; }
      .note { font-size: 7.5pt; text-align: center; color: #555; margin-top: 1mm; }
      .ref { font-size: 7pt; word-break: break-all; text-align: center; margin-top: 1mm; }
      .date { font-size: 7pt; text-align: center; color: #555; }
      .footer { font-size: 9pt; text-align: center; font-weight: bold; margin-top: 3mm; letter-spacing: 1mm; text-transform: uppercase; }
    </style></head><body>${slips}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  }