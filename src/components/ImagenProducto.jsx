'use client';
import { useState } from 'react';
import Image from 'next/image';

// Imagen de producto con reserva: si no hay imagen o no carga,
// muestra un recuadro con un icono en vez de una imagen rota.
// Va dentro de un contenedor con position: relative (usa "fill").
export function ImagenProducto({ src, alt, sizes, priority = false, className = '' }) {
  const [rota, setRota] = useState(false);

  if (!src || rota) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600"
           role="img" aria-label={alt}>
        <svg className="w-1/3 h-1/3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority}
           onError={() => setRota(true)} className={className} />
  );
}
