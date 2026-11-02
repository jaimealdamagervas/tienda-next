import { ImagenProducto } from '@/components/ImagenProducto';
import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { BotonAgregar } from '@/components/BotonAgregar';
import { euros } from '@/lib/formato';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const { datos: p } = await apiFetch(`/productos/${id}`);
    return { title: `${p.nombre} — TiendaNext`, description: p.descripcion };
  } catch {
    return { title: 'Producto no encontrado' };
  }
}

export default async function PaginaProducto({ params }) {
  const { id } = await params;
  let producto;
  try {
    const res = await apiFetch(`/productos/${id}`);
    producto = res.datos;
  } catch (e) {
    // Solo es "no encontrado" si la API dice 404; si la API falla, se muestra error.jsx
    if (e.status === 404) notFound();
    throw e;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
          <ImagenProducto src={producto.imagen} alt={producto.nombre} priority
                 sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{producto.nombre}</h1>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{euros(producto.precio)}</p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{producto.descripcion}</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Stock: {producto.stock} unidades</p>
          <BotonAgregar producto={producto} />
        </div>
      </div>
    </main>
  );
}