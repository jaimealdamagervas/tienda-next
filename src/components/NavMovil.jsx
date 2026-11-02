'use client';
import { useState } from 'react';
import Link from 'next/link';

// Menú hamburguesa: solo aparece en pantallas pequeñas (md:hidden)
export function NavMovil() {
  const [abierto, setAbierto] = useState(false);
  const cerrar = () => setAbierto(false);

  return (
    <>
      <button onClick={() => setAbierto(!abierto)}
              className="md:hidden p-2 -ml-2" aria-label="Menú" aria-expanded={abierto}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeWidth={2}
                d={abierto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      {abierto && (
        // top-full: justo debajo de la cabecera, mida lo que mida
        <nav className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b shadow-lg p-4 space-y-3">
          <Link href="/productos" onClick={cerrar} className="block">Catálogo</Link>
          <Link href="/cuenta/pedidos" onClick={cerrar} className="block">Mis pedidos</Link>
        </nav>
      )}
    </>
  );
}
