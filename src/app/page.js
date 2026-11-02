import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { TarjetaProducto } from '@/components/TarjetaProducto';

export const metadata = {
  title: 'TiendaNext — Tu tienda online',
  description: 'Ecommerce con Next.js, Tailwind y Stripe',
};

export default async function PaginaInicio() {
  const { datos: destacados } = await apiFetch('/productos?destacado=true');
  const { datos: categorias } = await apiFetch('/categorias');

  return (
    <main>
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black">TiendaNext</h1>
          <p className="mt-4 text-xl text-emerald-100">
            Tu tienda online con Next.js, Tailwind y Stripe
          </p>
          <Link href="/productos"
                className="mt-8 inline-block px-8 py-3 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition">
            Ver catálogo
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">Categorías</h2>
        <div className="flex gap-3 flex-wrap">
          {categorias.map(c => (
            <Link key={c.id} href={`/categorias/${c.slug}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900 transition">
              {c.nombre}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map(p => <TarjetaProducto key={p.id} producto={p} />)}
        </div>
      </section>
    </main>
  );
}