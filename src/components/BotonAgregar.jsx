'use client';
import { useCarrito } from '@/contexts/CarritoContext';

export function BotonAgregar({ producto }) {
  const { agregar } = useCarrito();
  return (
    <button onClick={() => agregar(producto)}
            className="mt-4 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
      Agregar al carrito
    </button>
  );
}