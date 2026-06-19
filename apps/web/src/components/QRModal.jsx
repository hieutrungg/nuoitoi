import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createDonation } from '../services/api';
import { usePaymentSocket } from '../hooks/usePaymentSocket';
import { useDonationStore } from '../stores/donation.store';

const fmt = (n) => n.toLocaleString('vi-VN') + 'đ';

export default function QRModal({ tier, onClose }) {
  const [tx, setTx] = useState(null);
  const receiveDonation = useDonationStore((s) => s.receiveDonation);

  useEffect(() => {
    if (!tier) return;
    setTx(null);
    createDonation({ tier: tier.key, amount: tier.amount }).then(setTx);
  }, [tier]);

  // Lắng nghe WS cho txCode (hiện là stub).
  usePaymentSocket(tx?.txCode, () => {
    receiveDonation({ amount: tier.amount });
    onClose();
  });

  // DEMO: giả lập webhook báo thành công (thay cho việc quét QR thật).
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
            <div className="font-pixel text-[10px] text-yellow-300">
              {tier.emoji} {tier.name} — {fmt(tier.amount)}
            </div>

            <div className="mx-auto mt-4 flex h-60 w-60 items-center justify-center rounded-xl bg-white">
              {tx ? (
                <img src={tx.qrUrl} alt="QR" className="h-56 w-56" />
              ) : (
                <span className="text-purple-900">Đang tạo mã QR...</span>
              )}
            </div>

            {tx && (
              <p className="mt-3 text-xs text-purple-300">
                Nội dung CK: <span className="font-mono text-white">{tx.txCode}</span>
              </p>
            )}

            <button
              onClick={simulatePaid}
              className="mt-5 w-full rounded-lg bg-green-500 py-2 font-pixel text-[9px] text-purple-950 hover:bg-green-400"
            >
              ✅ GIẢ LẬP ĐÃ THANH TOÁN (DEMO)
            </button>
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
