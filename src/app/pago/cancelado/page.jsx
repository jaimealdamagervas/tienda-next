import Link from 'next/link';

export const metadata = { title: 'Pago cancelado — TiendaNext' };

export default function PagoCancelado() {
  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-red-500">Pago cancelado</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">No se ha realizado ningún cobro.</p>
      <Link href="/productos"
            className="mt-6 inline-block px-6 py-3 bg-gray-200 dark:bg-gray-800 rounded-lg">
        Volver a la tienda
      </Link>
    </main>
  );
}
