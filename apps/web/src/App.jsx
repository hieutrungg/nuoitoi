import { useRef, useState } from 'react';
import HeroBanner from './components/HeroBanner';
import SurvivalProgress from './components/SurvivalProgress';
import DonationTierCard from './components/DonationTierCard';
import QRModal from './components/QRModal';
import Leaderboard from './components/Leaderboard';
import LiveFeed from './components/LiveFeed';
import ExpenseChart from './components/ExpenseChart';
import { TIERS } from './data/mock';

export default function App() {
  const [selectedTier, setSelectedTier] = useState(null);
  const tiersRef = useRef(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <HeroBanner onOpenTiers={() => tiersRef.current?.scrollIntoView({ behavior: 'smooth' })} />

      <div className="mt-6">
        <SurvivalProgress />
      </div>

      <h2 ref={tiersRef} className="mt-12 font-pixel text-sm text-yellow-300">
        CÁC GÓI BẢO TRỢ
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TIERS.map((tier) => (
          <DonationTierCard key={tier.key} tier={tier} onSelect={setSelectedTier} />
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Leaderboard />
        <LiveFeed />
      </div>

      <div className="mt-6">
        <ExpenseChart />
      </div>

      <footer className="mt-12 text-center font-pixel text-[7px] leading-relaxed text-purple-500">
        🍜 NUÔI TÔI · MỘT DỰ ÁN VỪA HỌC VỪA KIẾM CƠM
      </footer>

      <QRModal tier={selectedTier} onClose={() => setSelectedTier(null)} />
    </div>
  );
}
