import { useEffect, useRef } from 'react';

// STUB: hook lắng nghe WebSocket cho 1 giao dịch.
// Hiện chưa cắm backend nên chỉ log + để sẵn chỗ reconnect.
// Khi có API: connect tới ws server, nghe event `tx:${txCode}`,
// nhận { status: 'SUCCESS' } -> gọi onSuccess().
export function usePaymentSocket(txCode, onSuccess) {
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (!txCode) return;

    // --- TODO: thay bằng kết nối thật ---
    // const url = `${import.meta.env.VITE_WS_URL}?tx=${txCode}`;
    // const ws = new WebSocket(url);
    // ws.onmessage = (e) => {
    //   const data = JSON.parse(e.data);
    //   if (data.status === 'SUCCESS') onSuccessRef.current?.(data);
    // };
    // return () => ws.close();

    console.debug('[usePaymentSocket] (stub) đang chờ tx:', txCode);
  }, [txCode]);
}
