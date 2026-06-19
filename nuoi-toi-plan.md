# 🍜 Nuôi Tôi — Project Plan

> *"Đừng để một coder tài năng (nhưng rỗng túi) gục ngã. Hãy chung tay nuôi tôi!"*

---

## 1. Tech Stack

| Layer | Công nghệ | Lý do |
|---|---|---|
| Frontend | React + Vite | Nhẹ, HMR nhanh, đủ dùng cho side project |
| Styling | Tailwind CSS | Không cần design system phức tạp |
| Animation | Framer Motion | Hiệu ứng pháo hoa, avatar đổi trạng thái |
| Charts | Recharts | Pie chart "đốt tiền" |
| State | Zustand | Nhẹ hơn Redux, đủ cho scale này |
| Backend | Node.js + Fastify | Nhanh hơn Express, built-in schema validation |
| Database | PostgreSQL + Prisma ORM | Dễ migrate, type-safe queries |
| Realtime | WebSocket (`ws` lib) | Lắng nghe webhook → push xuống client |
| Payment | VietQR + SePay webhook | 0 phí giao dịch |
| Infra | Docker Compose | Dev environment chuẩn, 1 lệnh chạy |
| Version Control | GitLab + SourceTree | Theo workflow hiện tại |

---

## 2. Database Schema (Prisma)

```prisma
model Donor {
  id        String     @id @default(cuid())
  name      String?    // null = ẩn danh
  email     String?
  donations Donation[]
  createdAt DateTime   @default(now())
}

model Donation {
  id        String       @id @default(cuid())
  donor     Donor?       @relation(fields: [donorId], references: [id])
  donorId   String?
  tier      DonationTier
  amount    Int          // VNĐ
  message   String?
  txCode    String       @unique // "NUOITOI_ABC123"
  status    TxStatus     @default(PENDING)
  paidAt    DateTime?
  createdAt DateTime     @default(now())
}

model Expense {
  id        String   @id @default(cuid())
  category  String   // "Ăn uống", "Điện", "Gear"
  amount    Int
  note      String?
  createdAt DateTime @default(now())
}

enum DonationTier {
  CUU_DOI       // 15k
  BOM_DAM       // 50k
  BAO_TRI_GEAR  // 200k
  DAI_GIA       // 500k+
}

enum TxStatus {
  PENDING
  SUCCESS
  FAILED
}
```

---

## 3. Project Structure

```
nuoi-toi/
├── apps/
│   ├── web/                          # React + Vite
│   │   └── src/
│   │       ├── components/
│   │       │   ├── HeroBanner.jsx
│   │       │   ├── SurvivalProgress.jsx
│   │       │   ├── DonationTierCard.jsx
│   │       │   ├── QRModal.jsx           # Hiện QR + lắng nghe WS
│   │       │   ├── Leaderboard.jsx       # Bảng vàng Đại Gia
│   │       │   └── ExpenseChart.jsx      # Pie chart đốt tiền
│   │       ├── stores/
│   │       │   └── donation.store.js     # Zustand
│   │       ├── services/
│   │       │   └── api.js
│   │       └── hooks/
│   │           └── usePaymentSocket.js   # WebSocket listener
│   │
│   └── api/                          # Fastify + Prisma
│       └── src/
│           ├── routes/
│           │   ├── donation.routes.js
│           │   └── webhook.routes.js     # SePay POST về đây
│           ├── services/
│           │   ├── vietqr.service.js     # Gen QR động
│           │   ├── webhook.service.js    # Verify + xử lý
│           │   └── socket.service.js     # Broadcast realtime
│           └── plugins/
│               └── prisma.plugin.js
│
├── docker-compose.yml
└── .env
```

---

## 4. Các Gói Bảo Trợ

| Gói | Giá | Mô tả |
|---|---|---|
| 🥖 Cứu Đói | 15,000đ | Một ổ bánh mì trứng — kéo dài sự sống thêm nửa ngày để fix nốt đống bug |
| 💪 Bơm Đạm | 50,000đ | Thân 80kg cày PPL tốn calo quá, xin một muỗng Whey để cơ không teo khi code |
| ⌨️ Bảo Trì Gear | 200,000đ | Lube lại mấy cái Dream switch trên Dareu EK75 — phím êm thì code mới mượt |
| 👑 Đại Gia Bao Nuôi | 500,000đ+ | Vinh danh Bảng Vàng trang chủ với hiệu ứng lấp lánh Framer Motion |

---

## 5. Flow Thanh Toán (VietQR + SePay + TPBank)

```
1. User click gói "Bơm Đạm 50k"
         ↓
2. React  →  POST /api/donations/create
   Backend gen txCode = "NUOITOI_" + nanoid(8)
   Lưu Donation { status: PENDING }
   Trả về { qrUrl, txCode, amount }
         ↓
3. QRModal hiện mã QR
   usePaymentSocket lắng nghe WS event `tx:${txCode}`
         ↓
4. User quét QR, chuyển khoản TPBank
   Nội dung: "NUOITOI_ABC123"
         ↓
5. SePay detect biến động số dư TPBank
   →  POST /api/webhook/sepay
         ↓
6. Backend verify webhook secret
   Parse nội dung, match txCode
   UPDATE Donation { status: SUCCESS, paidAt: now() }
   ws.broadcast(`tx:NUOITOI_ABC123`, { status: "SUCCESS" })
         ↓
7. Frontend nhận WS event
   → Đóng QRModal
   → Bắn pháo hoa 🎉
   → Đổi avatar "héo hon" → "tươi rói"
   → Pop-up: "Đa tạ phú ông đã cứu rỗi sinh linh này!"
```

---

## 6. UI Features

- **Hero Banner** — Ảnh gục ngã bên màn hình code + tagline xin tài trợ
- **Survival Progress Bar** — 4 trạng thái: *Đang hấp hối → Đủ tiền úp mì → Được ăn cơm sườn → Bắt đầu rủng rỉnh*
- **Live Donate Feed** — *"Ẩn danh vừa donate 15k — Lời nhắn: Ăn mì tôm bớt bỏ hành nha"*
- **Pie Chart Đốt Tiền** — Recharts: 40% ăn uống / 30% điện / 30% gear
- **Bảng Vàng Đại Gia** — Top donors với hiệu ứng lấp lánh + animation tiền rớt

---

## 7. Roadmap (Solo Dev — ~5 tuần)

### Tuần 1 — Setup & Foundation
- [ ] Init monorepo, Docker Compose (Postgres + API + Web)
- [ ] Prisma schema + migration
- [ ] Fastify boilerplate: CORS, env config, error handler
- [ ] React + Vite + Tailwind + Zustand setup

### Tuần 2 — Core UI
- [ ] HeroBanner + SurvivalProgress bar (4 trạng thái)
- [ ] DonationTierCard component (4 gói)
- [ ] Layout tổng thể, responsive mobile

### Tuần 3 — Payment Integration
- [ ] `vietqr.service.js` — gen QR URL theo chuẩn VietQR
- [ ] API `/donations/create` + `/donations/:txCode/status`
- [ ] Đăng ký SePay, config webhook endpoint
- [ ] `webhook.service.js` — verify signature, update DB

### Tuần 4 — Realtime + Fun Features
- [ ] WebSocket setup + `usePaymentSocket` hook
- [ ] Framer Motion: pháo hoa, avatar transition, tiền rớt
- [ ] Leaderboard Đại Gia
- [ ] Live feed donate + Pie chart Recharts

### Tuần 5 — Polish & Deploy
- [ ] Error handling, loading states toàn bộ
- [ ] Ngrok → test webhook end-to-end thật với TPBank
- [ ] Deploy lên Railway / Render (free tier đủ dùng)
- [ ] Viết README ngáo ngơ để quăng lên mạng xã hội

---

## 8. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/nuoitoi

# TPBank
TPBANK_ACCOUNT_NUMBER=your_account_number
TPBANK_ACCOUNT_NAME=YOUR_NAME

# SePay Webhook
SEPAY_WEBHOOK_SECRET=your_sepay_secret

# App
PORT=3000
WS_PORT=3001
CLIENT_URL=http://localhost:5173
```

---

## 9. Lưu Ý Quan Trọng

| Vấn đề | Giải pháp |
|---|---|
| Webhook cần public URL | Dùng `ngrok http 3000` trong dev |
| txCode phải unique | `nanoid(8)` + prefix `NUOITOI_` |
| SePay parse nội dung | Nội dung chuyển khoản phải **không dấu, không space** |
| Duplicate webhook | Idempotency check — skip nếu `status === SUCCESS` |
| WebSocket reconnect | Client tự reconnect với exponential backoff |

---

*"Một dự án vừa học được kỹ thuật, vừa có cơ hội kiếm tiền ăn — win-win."* 🍜
