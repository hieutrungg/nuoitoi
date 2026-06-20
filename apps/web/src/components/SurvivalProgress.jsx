import { useDonationStore } from '../stores/donation.store';
import { SURVIVAL_STAGES, SURVIVAL_GOAL } from '../data/mock';

const fmt = (n) => n.toLocaleString('vi-VN') + 'đ';

export default function SurvivalProgress() {
  const total = useDonationStore((s) => s.total);
  const pct = Math.min(100, (total / SURVIVAL_GOAL) * 100);

  const stage = [...SURVIVAL_STAGES].reverse().find((s) => total >= s.min) || SURVIVAL_STAGES[0];

  return (
    <section className="rounded-2xl border border-purple-800/50 bg-purple-950/30 p-6">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="font-pixel text-sm text-purple-300">TRẠNG THÁI SINH TỒN</div>
          <div className="mt-1 text-lg font-bold text-yellow-300">{stage.label}</div>
        </div>
        <div className="text-right text-sm text-purple-200">
          <span className="font-bold text-white">{fmt(total)}</span> / {fmt(SURVIVAL_GOAL)}
        </div>
      </div>

      <div className="h-5 w-full overflow-hidden rounded-full bg-purple-900/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-green-400 to-yellow-300 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap justify-between gap-1 font-pixel text-xs text-purple-400">
        {SURVIVAL_STAGES.map((s) => (
          <span key={s.label} className={total >= s.min ? 'text-green-400' : ''}>
            {s.label}
          </span>
        ))}
      </div>
    </section>
  );
}
