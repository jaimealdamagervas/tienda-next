'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCarrito } from '@/contexts/CarritoContext';

export function BotonPagar() {
  const router = useRouter();
  const { totalItems } = useCarrito();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function pagar() {
    setCargando(true);
    setError('');
    try {
      const r = await fetch('/api/checkout', { method: 'POST' });

      // Sin sesión no se puede pagar: lo mandamos a iniciar sesión
      if (r.status === 401) return router.push('/login');

      const { url, error } = await r.json();
      if (url) return (window.location.href = url); // Redirige a Stripe
      setError(error ?? 'No se pudo iniciar el pago');
    } catch {
      setError('No se pudo iniciar el pago');
    }
    setCargando(false);
  }

  if (!totalItems) return null;

  return (
    <>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      <button onClick={pagar} disabled={cargando}
              className="w-full py-3 mt-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 disabled:opacity-60">
        {cargando ? 'Redirigiendo...' : 'Pagar con Stripe'}
      </button>
    </>
  );
}
