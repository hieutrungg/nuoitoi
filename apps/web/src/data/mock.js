// Mock data để dựng sườn UI trước khi có backend.
// Khi cắm API thật thì thay bằng dữ liệu từ services/api.js.

export const TIERS = [
  {
    key: 'CUU_DOI',
    emoji: '🥖',
    name: 'Cứu Đói',
    amount: 15000,
    desc: 'Một ổ bánh mì trứng — kéo dài sự sống thêm nửa ngày để fix nốt đống bug.',
  },
  {
    key: 'BOM_DAM',
    emoji: '💪',
    name: 'Bơm Đạm',
    amount: 50000,
    desc: 'Thân 80kg cày PPL tốn calo, xin một muỗng Whey để cơ không teo khi code.',
  },
  {
    key: 'BAO_TRI_GEAR',
    emoji: '⌨️',
    name: 'Bảo Trì Gear',
    amount: 200000,
    desc: 'Lube lại mấy con Dream switch trên Dareu EK75 — phím êm thì code mới mượt.',
  },
  {
    key: 'DAI_GIA',
    emoji: '👑',
    name: 'Đại Gia Bao Nuôi',
    amount: 500000,
    desc: 'Vinh danh Bảng Vàng trang chủ với hiệu ứng lấp lánh.',
  },
];

export const MOCK_LEADERBOARD = [
  { name: 'Phú Ông Ẩn Danh', amount: 500000 },
  { name: 'Anh Hàng Xóm Tốt Bụng', amount: 300000 },
  { name: 'Crush Năm 2', amount: 200000 },
];

export const MOCK_FEED = [
  { name: 'Ẩn danh', amount: 15000, message: 'Ăn mì tôm bớt bỏ hành nha' },
  { name: 'Long', amount: 50000, message: 'Cố lên ông tướng' },
  { name: 'Mai', amount: 200000, message: 'Mua switch mới đi' },
];

export const MOCK_EXPENSES = [
  { category: 'Ăn uống', amount: 40 },
  { category: 'Điện', amount: 30 },
  { category: 'Gear', amount: 30 },
];

// 4 trạng thái thanh sinh tồn theo tổng tiền nhận được.
export const SURVIVAL_STAGES = [
  { label: 'Đang hấp hối', min: 0 },
  { label: 'Đủ tiền úp mì', min: 300000 },
  { label: 'Được ăn cơm sườn', min: 700000 },
  { label: 'Bắt đầu rủng rỉnh', min: 1500000 },
];

export const SURVIVAL_GOAL = 1500000;
