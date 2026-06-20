// Vercel Serverless Function — GET /api/status?tx=...&amount=...
// Hỏi SePay xem giao dịch (theo nội dung CK chứa txCode) đã tới chưa.
// Token SePay GIỮ BÍ MẬT trong biến môi trường, không bao giờ ra frontend.

// Bỏ mọi ký tự không phải chữ/số rồi viết hoa -> so khớp "miễn nhiễm" với
// việc ngân hàng chèn thêm khoảng trắng / bỏ dấu gạch dưới trong nội dung CK.
const norm = (s) => (s || '').toString().toUpperCase().replace(/[^A-Z0-9]/g, '');

function extractSenderName(content) {
  if (!content) return '';
  // "NGUYEN TRUNG HIEU chuyen tien ..." -> lấy phần trước "chuyen tien"
  const m = content.match(/^(.*?)\s+chuyen tien/i);
  return (m ? m[1] : '').trim();
}

export default async function handler(req, res) {
  const tx = (req.query.tx || '').toString().trim();
  const amount = Number(req.query.amount || 0);

  res.setHeader('Cache-Control', 'no-store');

  if (!tx) {
    res.status(400).json({ status: 'ERROR', message: 'Thiếu tham số tx' });
    return;
  }

  const token = process.env.SEPAY_TOKEN;
  const account = process.env.SEPAY_ACCOUNT_NUMBER;
  if (!token || !account) {
    res.status(500).json({ status: 'ERROR', message: 'Server chưa cấu hình SEPAY_TOKEN / SEPAY_ACCOUNT_NUMBER' });
    return;
  }

  try {
    const url = `https://my.sepay.vn/userapi/transactions/list?account_number=${encodeURIComponent(
      account
    )}&limit=50`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await r.json();
    const list = Array.isArray(data.transactions) ? data.transactions : [];

    const target = norm(tx);
    const hit = list.find((t) => {
      const okCode = norm(t.transaction_content).includes(target);
      const okAmount = !amount || Number(t.amount_in) >= amount; // tiền vào >= số yêu cầu
      return okCode && okAmount;
    });

    if (hit) {
      res.status(200).json({
        status: 'SUCCESS',
        amount: Number(hit.amount_in),
        name: extractSenderName(hit.transaction_content) || 'Ẩn danh',
        at: hit.transaction_date,
      });
    } else {
      res.status(200).json({ status: 'PENDING' });
    }
  } catch (e) {
    res.status(502).json({ status: 'ERROR', message: 'Không gọi được SePay' });
  }
}
