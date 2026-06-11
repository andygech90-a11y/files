import { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export default function Toast() {
  const { toast } = useContext(AppContext);

  if (!toast.visible) return null;

  return (
    <div className={`toast ${toast.type} show`}>
      {toast.message}
    </div>
  );
}
