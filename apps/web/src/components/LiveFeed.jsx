import { motion, AnimatePresence } from 'framer-motion';
import { useDonationStore } from '../stores/donation.store';

const fmt = (n) => n.toLocaleString('vi-VN') + 'đ';

export default function LiveFeed() {
  const feed = useDonationStore((s) => s.feed);

  return (
    <section className="rounded-2xl border border-purple-800/50 bg-purple-950/30 p-6">
      <h2 className="font-pixel text-[11px] text-green-300">📢 LIVE DONATE</h2>
      <ul className="mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {feed.map((d, i) => (
            <motion.li
              key={d.name + d.amount + i}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-lg bg-purple-950/40 px-3 py-2 text-sm"
            >
              <span className="font-bold text-white">{d.name}</span>{' '}
              <span className="text-purple-300">vừa donate</span>{' '}
              <span className="font-bold text-yellow-300">{fmt(d.amount)}</span>
              {d.message && (
                <div className="mt-0.5 text-xs italic text-purple-400">"{d.message}"</div>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}
