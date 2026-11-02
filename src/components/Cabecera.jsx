'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { Buscador } from '@/components/Buscador';
import { CarritoDrawer } from '@/components/CarritoDrawer';
import { MenuUsuario } from '@/components/MenuUsuario';
import { NavMovil } from '@/components/NavMovil';
import { BotonTema } from '@/components/BotonTema';
import { useCarrito } from '@/contexts/CarritoContext';

export function Cabecera() {
  const { totalItems } = useCarrito();
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b">
        {/* relative: el menú móvil se coloca justo debajo de esta barra */}
        <div className="relative max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <NavMovil />

          <Link href="/" className="text-xl font-black text-emerald-700 dark:text-emerald-400 shrink-0">
            TiendaNext
          </Link>

          {/* En móvil el buscador baja a su propia fila, a todo el ancho */}
          <div className="order-last w-full md:order-none md:w-auto md:flex-1 md:max-w-md">
            {/* useSearchParams necesita estar dentro de Suspense */}
            <Suspense fallback={null}>
              <Buscador />
            </Suspense>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4 ml-auto">
            <Link href="/productos" className="text-sm hidden md:inline">Catálogo</Link>
            <Link href="/cuenta/pedidos" className="text-sm hidden md:inline">Mis pedidos</Link>
            <BotonTema />
            <button onClick={() => setCarritoAbierto(true)}
                    className="relative px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">
              Carrito
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-500 text-xs leading-5 text-center">
                  {totalItems}
                </span>
              )}
            </button>
            <MenuUsuario />
          </nav>
        </div>
      </header>

      <CarritoDrawer abierto={carritoAbierto} cerrar={() => setCarritoAbierto(false)} />
    </>
  );
}
