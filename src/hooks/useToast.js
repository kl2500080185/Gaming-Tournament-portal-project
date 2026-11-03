import { useCallback, useState } from 'react';

export default function useToast() {
  const [toast, setToast] = useState(null);
  const notify = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const dismiss = useCallback(() => setToast(null), []);
  return { toast, notify, dismiss };
}
