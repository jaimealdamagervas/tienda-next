'use client';
import { useCarrito } from '@/contexts/CarritoContext';
import { BotonPagar } from '@/components/BotonPagar';
import { euros } from '@/lib/formato';

export function CarritoDrawer({ abierto, cerrar }) {
  const { items, quitar, actualizarCantidad, total } = useCarrito();

  return (
    <div className={`fixed inset-0 z-50 ${abierto ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/40 transition ${abierto ? 'opacity-100' : 'opacity-0'}`}
           onClick={cerrar} />

      <aside className={`absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto
                         transition-transform ${abierto ? '' : 'translate-x-full'}`}>
        <h2 className="text-xl font-bold mb-4">Carrito</h2>
        {items.length === 0
          ? <p className="text-gray-400">Carrito vacío</p>
          : items.map(item => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium">{item.nombre}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{euros(item.precio)} × {item.cantidad}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-800">−</button>
                <span>{item.cantidad}</span>
                <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-800">+</button>
                <button onClick={() => quitar(item.id)}
                        className="text-red-400 text-xs ml-2">Quitar</button>
              </div>
            </div>
          ))}
        <p className="mt-4 text-lg font-bold">Total: {euros(total)}</p>
        <BotonPagar />
      </aside>
    </div>
  );
}