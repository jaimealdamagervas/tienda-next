'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function Buscador() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buscarActual = searchParams.get('buscar') ?? '';
  const [texto, setTexto] = useState(buscarActual);

  useEffect(() => {
    // Si el texto coincide con lo que ya hay en la URL, no navegamos.
    // Así el buscador no te saca de la página en la que estás al cargarla.
    if (texto.trim() === buscarActual) return;

    const timer = setTimeout(() => {
      if (texto.trim()) {
        router.push(`/productos?buscar=${encodeURIComponent(texto)}`);
      } else {
        router.push('/productos');
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [texto, buscarActual, router]);

  return (
    <input type="search" value={texto}
           onChange={e => setTexto(e.target.value)}
           placeholder="Buscar productos..."
           className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
  );
}