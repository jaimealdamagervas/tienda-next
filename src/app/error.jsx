'use client';
import Link from 'next/link';

// Next.js muestra esto si una página falla al cargar (por ejemplo, si la API
// no responde: en el plan gratuito de Render tarda ~30 s en "despertar")
export default function Error({ reset }) {
  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Algo ha fallado</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        No hemos podido cargar esta página. Si la tienda acaba de arrancar,
        espera unos segundos y vuelve a intentarlo.
      </p>
      <div className="mt-6 flex gap-3 justify-center">
        <button onClick={() => reset()}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          Reintentar
        </button>
        <Link href="/" className="px-6 py-3 bg-gray-200 dark:bg-gray-800 rounded-lg">
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
