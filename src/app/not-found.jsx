import Link from 'next/link';

export const metadata = { title: 'Página no encontrada — TiendaNext' };

export default function NoEncontrado() {
  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">No encontramos esta página</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Puede que el producto ya no exista o que el enlace esté mal.
      </p>
      <Link href="/productos"
            className="mt-6 inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
        Ver catálogo
      </Link>
    </main>
  );
}
