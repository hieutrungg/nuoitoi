// Cấu hình công khai (các giá trị này in trên QR, ai cũng thấy — KHÔNG phải bí mật).
// Token SePay là bí mật và chỉ nằm ở serverless (api/status.js), không ở đây.
const BASE = import.meta.env.VITE_API_URL || '/api';
const BANK_BIN = import.meta.env.VITE_BANK_BIN || '970422'; // MB Bank
const ACCOUNT_NUMBER = import.meta.env.VITE_ACCOUNT_NUMBER || '';
const ACCOUNT_NAME = import.meta.env.VITE_ACCOUNT_NAME || '';

// txCode chỉ gồm CHỮ HOA + SỐ (không gạch dưới/khoảng trắng) để ngân hàng
// không cắt mất khi đưa vào nội dung CK. Bỏ các ký tự dễ nhìn nhầm (0/O, 1/I).
const randomCode = (n = 6) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

// Tạo phiên donate: sinh txCode + dựng URL VietQR đã NHÚNG SẴN số tiền và nội dung.
// Khi donor quét, app ngân hàng tự điền số tiền + nội dung "NUOITOIxxxxxx".
export async function createDonation({ amount }) {
  const txCode = 'NUOITOI' + randomCode(6);
  const qrUrl =
    `https://img.vietqr.io/image/${BANK_BIN}-${ACCOUNT_NUMBER}-compact2.png` +
    `?amount=${amount}&addInfo=${encodeURIComponent(txCode)}` +
    `&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
  return { txCode, amount, qrUrl, accountNumber: ACCOUNT_NUMBER, accountName: ACCOUNT_NAME };
}

// Hỏi serverless xem giao dịch đã tới chưa. Lỗi/không phải JSON -> coi như PENDING
// để dev (chưa có serverless) không vỡ; nút demo vẫn dùng được.
export async function checkDonationStatus(txCode, amount = 0) {
  try {
    const res = await fetch(`${BASE}/status?tx=${encodeURIComponent(txCode)}&amount=${amount}`);
    if (!res.ok) return { status: 'PENDING' };
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return { status: 'PENDING' };
    return await res.json();
  } catch {
    return { status: 'PENDING' };
  }
}
