import { create } from 'zustand';
import { MOCK_FEED, MOCK_LEADERBOARD } from '../data/mock';

// --- Lọc dữ liệu đầu vào (defense-in-depth) ---
// React đã tự escape khi render text, nhưng vẫn chuẩn hoá ở đây để chặn
// chuỗi rác/khổng lồ hoặc ký tự điều khiển từ payload WebSocket không tin cậy.
const MAX_NAME = 40;
const MAX_MESSAGE = 140;
const MAX_AMOUNT = 1000000000; // 1 tỷ, chặn số phi lý

// Bỏ ký tự điều khiển C0 (U+0000–U+001F) và DEL (U+007F).
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\x00-\x1F\x7F]/g;

const cleanText = (s, max) =>
  String(s ?? '')
    .replace(CONTROL_CHARS, '')
    .trim()
    .slice(0, max);

const cleanAmount = (n) => {
  const v = Math.floor(Number(n));
  return Number.isFinite(v) && v > 0 && v <= MAX_AMOUNT ? v : 0;
};

// Store trung tâm cho trạng thái donate.
// avatarPulse: tăng mỗi lần có donate thành công -> HeroBanner nghe để bật animation Active.
export const useDonationStore = create((set, get) => ({
  total: 850000, // tổng tiền đã nhận (mock)
  feed: MOCK_FEED,
  leaderboard: MOCK_LEADERBOARD,
  avatarPulse: 0,

  // Gọi khi nhận event tx SUCCESS (từ usePaymentSocket hoặc nút demo).
  receiveDonation: (raw = {}) => {
    const amount = cleanAmount(raw.amount);
    if (amount === 0) return; // bỏ qua payload không hợp lệ

    const name = cleanText(raw.name, MAX_NAME) || 'Ẩn danh';
    const message = cleanText(raw.message, MAX_MESSAGE);

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
