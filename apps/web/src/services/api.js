// STUB API client. Khi có backend Fastify thì điền base URL + fetch thật.
const BASE = import.meta.env.VITE_API_URL || '/api';

export async function createDonation({ tier, amount, message, name }) {
  // TODO: POST ${BASE}/donations/create
  // Trả về { qrUrl, txCode, amount }
  console.debug('[api] (stub) createDonation', { tier, amount, message, name });
  const txCode = 'NUOITOI_' + Math.random().toString(36).slice(2, 10).toUpperCase();
  return {
    txCode,
    amount,
    // QR placeholder: tạm encode txCode để có hình QR thật cho UI demo.
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
      txCode
    )}`,
  };
}
