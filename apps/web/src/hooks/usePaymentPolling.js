import { useEffect, useRef, useState } from 'react';
import { checkDonationStatus } from '../services/api';

// Hỏi backend (serverless proxy SePay) xem giao dịch đã tới chưa.
// Thiết kế tiết kiệm lời gọi để giữ free-tier:
//   - chỉ chạy khi có txCode (modal mở), unmount/đóng modal là dừng
//   - tạm dừng khi user chuyển tab (Page Visibility), quay lại thì hỏi ngay
//   - hết `timeoutMs` (mặc định 2 phút 30s) thì tự ngừng -> state 'expired'
//
// State: 'idle' | 'waiting' | 'paid' | 'expired'
export function usePaymentPolling(
  txCode,
  { onPaid, amount = 0, intervalMs = 15000, timeoutMs = 150000 } = {}
) {
  const [state, setState] = useState('idle');
  const [secondsLeft, setSecondsLeft] = useState(Math.round(timeoutMs / 1000));
  const onPaidRef = useRef(onPaid);
  onPaidRef.current = onPaid;

  useEffect(() => {
    if (!txCode) {
      setState('idle');
      return;
    }

    setState('waiting');
    setSecondsLeft(Math.round(timeoutMs / 1000));

    const deadline = Date.now() + timeoutMs;
    let pollTimer = null;
    let countdownTimer = null;
    let stopped = false;

    const stop = () => {
      stopped = true;
      clearTimeout(pollTimer);
      clearInterval(countdownTimer);
      document.removeEventListener('visibilitychange', onVisible);
    };

    const schedule = () => {
      if (stopped) return;
      pollTimer = setTimeout(poll, intervalMs);
    };

    async function poll() {
      if (stopped) return;
      if (Date.now() >= deadline) {
        setState('expired');
        stop();
        return;
      }
      // Đổi tab -> tạm dừng, onVisible sẽ gọi lại khi quay về.
      if (document.hidden) return;

      try {
        const res = await checkDonationStatus(txCode, amount);
        if (stopped) return;
        if (res?.status === 'SUCCESS') {
          setState('paid');
          stop();
          onPaidRef.current?.(res);
          return;
        }
      } catch {
        // lỗi mạng -> im lặng, thử lại nhịp sau
      }
      if (!stopped && !document.hidden) schedule();
    }

    function onVisible() {
      if (document.hidden || stopped) return;
      if (Date.now() >= deadline) {
        setState('expired');
        stop();
        return;
      }
      clearTimeout(pollTimer);
      poll(); // quay lại tab -> hỏi ngay rồi tự lên lịch tiếp
    }

    // Đồng hồ đếm ngược (độc lập với polling, vẫn chạy khi đang ẩn tab).
    countdownTimer = setInterval(() => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0 && !stopped) {
        setState((s) => (s === 'paid' ? s : 'expired'));
        stop();
      }
    }, 1000);

    document.addEventListener('visibilitychange', onVisible);
    schedule(); // nhịp hỏi đầu tiên sau intervalMs (cho người ta kịp CK)

    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txCode]);

  return { state, secondsLeft };
}
