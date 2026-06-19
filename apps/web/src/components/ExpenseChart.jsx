import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MOCK_EXPENSES } from '../data/mock';

const COLORS = ['#facc15', '#a855f7', '#34d399'];

export default function ExpenseChart() {
  return (
    <section className="rounded-2xl border border-purple-800/50 bg-purple-950/30 p-6">
      <h2 className="font-pixel text-[11px] text-purple-300">🔥 ĐỐT TIỀN VÀO ĐÂU</h2>
      <div className="mt-2 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={MOCK_EXPENSES}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label={(e) => `${e.category} ${e.amount}%`}
            >
              {MOCK_EXPENSES.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1e1133', border: '1px solid #6b21a8', borderRadius: 8 }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
