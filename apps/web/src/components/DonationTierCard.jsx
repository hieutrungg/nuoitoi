const fmt = (n) => n.toLocaleString('vi-VN') + 'đ';

export default function DonationTierCard({ tier, onSelect }) {
  return (
    <button
      onClick={() => onSelect(tier)}
      className="group flex flex-col items-start gap-2 rounded-2xl border border-purple-800/50 bg-purple-950/30 p-5 text-left transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-purple-900/40"
    >
      <div className="text-3xl">{tier.emoji}</div>
      <div className="font-pixel text-base text-yellow-300">{tier.name}</div>
      <div className="font-bold text-white">{fmt(tier.amount)}</div>
      <p className="text-xs leading-relaxed text-purple-300">{tier.desc}</p>
      <span className="mt-2 font-pixel text-sm text-purple-400 group-hover:text-yellow-300">
        CHỌN GÓI →
      </span>
    </button>
  );
}
