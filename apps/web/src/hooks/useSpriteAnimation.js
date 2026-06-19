import { useEffect, useRef, useState } from 'react';

// Hook điều khiển frame của pixel avatar bằng JS (không dùng CSS steps()),
// để kiểm soát chính xác thời điểm bật animation "Active" khi có donate.
//
// CÁCH DÙNG KHI ĐÃ CÓ SPRITE SHEET:
//   const { frame, trigger } = useSpriteAnimation({
//     idleFrames:   [0, 1],           // index frame trong sprite sheet
//     activeFrames: [2, 3, 4, 5],
//     idleFps: 4,
//     activeFps: 10,
//   });
//   -> dùng `frame` để set backgroundPosition = `-${frame * SIZE}px 0`
//   -> gọi `trigger()` khi nhận donate; chạy hết 1 vòng Active rồi tự về Idle.
export function useSpriteAnimation({
  idleFrames = [0, 1],
  activeFrames = [2, 3, 4, 5],
  idleFps = 4,
  activeFps = 10,
} = {}) {
  const [mode, setMode] = useState('idle');
  const [frame, setFrame] = useState(idleFrames[0]);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const frames = mode === 'idle' ? idleFrames : activeFrames;
    const fps = mode === 'idle' ? idleFps : activeFps;
    let i = 0;
    let last = 0;
    let raf;

    const tick = (t) => {
      if (t - last > 1000 / fps) {
        i = (i + 1) % frames.length;
        setFrame(frames[i]);
        last = t;
        // Active chạy đủ 1 vòng (quay lại frame đầu) -> trở về Idle.
        if (modeRef.current === 'active' && i === 0) setMode('idle');
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return {
    frame,
    mode,
    trigger: () => setMode('active'),
  };
}
