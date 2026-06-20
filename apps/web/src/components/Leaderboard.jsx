import { motion } from 'framer-motion';
import { useDonationStore } from '../stores/donation.store';

const fmt = (n) => n.toLocaleString('vi-VN') + 'đ';
const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const leaderboard = useDonationStore((s) => s.leaderboard);

  return (
    <section className="rounded-2xl border border-yellow-700/40 bg-gradient-to-b from-yellow-900/20 to-purple-950/30 p-6">
      <h2 className="font-pixel text-lg text-yellow-300">👑 BẢNG VÀNG ĐẠI GIA</h2>
      <ul className="mt-4 space-y-2">
        {leaderboard.map((d, i) => (
          <motion.li
            key={d.name + i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between rounded-lg bg-purple-950/40 px-3 py-2"
          >
            <span className="flex items-center gap-2 text-sm text-white">
              <span>{MEDALS[i] || `#${i + 1}`}</span>
              {d.name}
            </span>
            <span className="font-bold text-yellow-300">{fmt(d.amount)}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
