import { useEffect } from 'react';
import { useSpriteAnimation } from '../hooks/useSpriteAnimation';

const FRAME_SIZE = 48; // px gốc của 1 frame trong sprite sheet
const SCALE = 5; // scale nguyên để pixel sắc (48 -> 240px)

// Avatar pixel art của "dev gục ngã".
// HIỆN TẠI: dùng placeholder (emoji + box) để thấy state machine chạy.
// KHI CÓ SPRITE SHEET: bỏ block PLACEHOLDER, mở block SPRITE bên dưới
// và đặt file vào /public/avatar-spritesheet.png.
export default function PixelAvatar({ pulse }) {
  const { frame, mode, trigger } = useSpriteAnimation({
    idleFrames: [0, 1],
    activeFrames: [2, 3, 4, 5],
    idleFps: 3,
    activeFps: 10,
  });

  // Mỗi lần `pulse` đổi (có donate) -> bật animation Active.
  useEffect(() => {
    if (pulse > 0) trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pulse]);

  const isActive = mode === 'active';

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: FRAME_SIZE * SCALE, height: FRAME_SIZE * SCALE }}
    >
      {/* ===================== PLACEHOLDER (xoá khi có sprite) ===================== */}
      <div
        className={`pixelated flex h-full w-full flex-col items-center justify-center rounded-xl border-4 transition-colors duration-200 ${
          isActive
            ? 'border-green-400 bg-green-500/10'
            : 'border-purple-700 bg-purple-900/20 animate-breathe'
        }`}
      >
        <div className="text-6xl">{isActive ? '🤓' : '😵'}</div>
        <div className="mt-2 text-3xl">⌨️</div>
        <div className="mt-3 font-pixel text-sm text-purple-300">
          {isActive ? 'TYPING...' : 'idle'} · f{frame}
        </div>
      </div>
      {/* ===================== HẾT PLACEHOLDER ===================== */}

      {/* ===================== SPRITE THẬT (mở khi có asset) =====================
      <div
        className="pixelated"
        style={{
          width: FRAME_SIZE,
          height: FRAME_SIZE,
          transform: `scale(${SCALE})`,
          transformOrigin: 'center',
          backgroundImage: "url('/avatar-spritesheet.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `-${frame * FRAME_SIZE}px 0`,
        }}
      />
      ======================================================================= */}
    </div>
  );
}
