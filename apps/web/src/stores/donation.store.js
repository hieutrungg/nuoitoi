import { create } from 'zustand';
import { MOCK_FEED, MOCK_LEADERBOARD } from '../data/mock';

// Store trung tâm cho trạng thái donate.
// avatarPulse: tăng mỗi lần có donate thành công -> HeroBanner nghe để bật animation Active.
export const useDonationStore = create((set, get) => ({
  total: 850000, // tổng tiền đã nhận (mock)
  feed: MOCK_FEED,
  leaderboard: MOCK_LEADERBOARD,
  avatarPulse: 0,

  // Gọi khi nhận event tx SUCCESS (từ usePaymentSocket hoặc nút demo).
  receiveDonation: ({ name = 'Ẩn danh', amount, message = '' }) => {
    const next = {
      total: get().total + amount,
      feed: [{ name, amount, message }, ...get().feed].slice(0, 20),
      avatarPulse: get().avatarPulse + 1,
    };
    // Đại gia (>=500k) thì lên bảng vàng
    if (amount >= 500000) {
      next.leaderboard = [...get().leaderboard, { name, amount }]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10);
    }
    set(next);
  },
}));
