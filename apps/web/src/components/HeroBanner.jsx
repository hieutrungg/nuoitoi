import { motion } from 'framer-motion';
import { useDonationStore } from '../stores/donation.store';
import PixelAvatar from './PixelAvatar';

export default function HeroBanner({ onOpenTiers }) {
  const pulse = useDonationStore((s) => s.avatarPulse);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-purple-800/50 bg-gradient-to-b from-purple-950/40 to-transparent px-6 py-12 text-center">
      <motion.div
        key={pulse} // re-mount mỗi lần donate -> giật nhẹ ăn mừng
        initial={{ scale: 1 }}
        animate={pulse > 0 ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-6 inline-block"
      >
        <PixelAvatar pulse={pulse} />
      </motion.div>

      <h1 className="font-pixel text-xl leading-relaxed text-yellow-300 sm:text-2xl">
        NUÔI TÔI
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm text-purple-200 sm:text-base">
        "Đừng để một coder tài năng (nhưng rỗng túi) gục ngã. Hãy chung tay nuôi tôi!"
      </p>

      <button
        onClick={onOpenTiers}
        className="mt-8 rounded-full bg-yellow-400 px-8 py-3 font-pixel text-[10px] text-purple-950 transition hover:bg-yellow-300 active:scale-95"
      >
        CỨU TÔI NGAY 🍜
      </button>
    </section>
  );
}
