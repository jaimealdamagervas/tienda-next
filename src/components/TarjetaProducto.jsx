import Link from 'next/link';
import { ImagenProducto } from '@/components/ImagenProducto';
import { euros } from '@/lib/formato';

export function TarjetaProducto({ producto }) {
  return (
    <Link href={`/productos/${producto.id}`}
          className="group bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
        <ImagenProducto src={producto.imagen} alt={producto.nombre}
               sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
               className="object-cover group-hover:scale-105 transition" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold truncate">{producto.nombre}</h3>
        <p className="text-lg font-bold text-emerald-600">{euros(producto.precio)}</p>
      </div>
    </Link>
  );
}