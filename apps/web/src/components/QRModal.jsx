import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createDonation } from '../services/api';
import { usePaymentPolling } from '../hooks/usePaymentPolling';
import { useDonationStore } from '../stores/donation.store';

const fmt = (n) => n.toLocaleString('vi-VN') + 'đ';
const mmss = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function QRModal({ tier, onClose }) {
  const [tx, setTx] = useState(null);
  const receiveDonation = useDonationStore((s) => s.receiveDonation);

  useEffect(() => {
    if (!tier) return;
    setTx(null);
    createDonation({ amount: tier.amount }).then(setTx);
  }, [tier]);

  // Poll SePay (qua serverless) mỗi 15s, tự ngừng sau 2 phút 30s.
  const { state, secondsLeft } = usePaymentPolling(tx?.txCode, {
    amount: tier?.amount,
    intervalMs: 15000,
    timeoutMs: 150000,
    onPaid: (res) => {
      receiveDonation({ amount: res?.amount || tier.amount, name: res?.name });
      onClose();
    },
  });

  // DEMO: giả lập SePay báo thành công (thay cho việc quét QR thật).
  const simulatePaid = () => {
    receiveDonation({ amount: tier.amount, name: 'Demo Donor', message: 'Test cho vui' });
    onClose();
  };

  return (
    <AnimatePresence>
      {tier && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm rounded-2xl border border-purple-700 bg-purple-950 p-6 text-center"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-pixel text-lg text-yellow-300">
              {tier.emoji} {tier.name} — {fmt(tier.amount)}
            </div>

            <div className="mx-auto mt-4 flex h-60 w-60 items-center justify-center rounded-xl bg-white">
              {tx ? (
                <img
                  src={tx.qrUrl}
                  alt="Mã QR thanh toán"
                  className="h-56 w-56"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-purple-900">Đang tạo mã QR...</span>
              )}
            </div>

            {tx && (
              <p className="mt-3 text-xs text-purple-300">
                Nội dung CK: <span className="font-mono text-white">{tx.txCode}</span>
              </p>
            )}

            {/* Trạng thái chờ xác nhận từ SePay */}
            {tx && state === 'waiting' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-200">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                Đang chờ xác nhận... <span className="font-mono text-white">{mmss(secondsLeft)}</span>
              </div>
            )}

            {tx && state === 'expired' && (
              <p className="mt-4 text-sm text-yellow-300">
                Chưa thấy giao dịch nào. Nếu bạn đã chuyển khoản, đợi thêm chút hoặc kiểm tra lại
                nội dung CK nhé.
              </p>
            )}

            {/* Nút demo CHỈ hiện khi chạy dev (npm run dev), tự ẩn ở bản build
                production để tránh người lạ tự bấm "đã thanh toán". */}
            {import.meta.env.DEV && (
              <button
                onClick={simulatePaid}
                className="mt-5 w-full rounded-lg bg-green-500 py-2 font-pixel text-base font-bold text-purple-950 hover:bg-green-400"
              >
                ✅ GIẢ LẬP ĐÃ THANH TOÁN (DEMO)
              </button>
            )}
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-lg border border-purple-700 py-2 text-xs text-purple-300 hover:bg-purple-900"
            >
              Đóng
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
