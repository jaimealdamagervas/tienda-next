import { apiFetch } from '@/lib/api';
import { TarjetaProducto } from '@/components/TarjetaProducto';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const nombre = slug.charAt(0).toUpperCase() + slug.slice(1);
  return { title: `${nombre} — TiendaNext` };
}

export default async function PaginaCategoria({ params }) {
  const { slug } = await params;
  const { datos } = await apiFetch(`/productos?categoria=${slug}`);
  const nombre = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{nombre}</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {datos.map(p => <TarjetaProducto key={p.id} producto={p} />)}
      </div>
    </main>
  );
}