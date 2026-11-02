import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { apiFetch, comoLista } from '@/lib/api';
import { euros } from '@/lib/formato';

export const metadata = { title: 'Mis pedidos — TiendaNext' };

export default async function MisPedidos() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login'); // El proxy ya protege la ruta; esto es por si acaso

  let pedidos = [];
  let error = false;
  try {
    // Con token, apiFetch no cachea: cada compra añade un pedido nuevo
    const { datos } = await apiFetch('/pedidos', { token: session.accessToken });
    pedidos = comoLista(datos); // Con un solo pedido la API devuelve un objeto
  } catch {
    error = true;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis pedidos</h1>

      {error && <p className="text-red-500">No se pudieron cargar tus pedidos. Inténtalo más tarde.</p>}

      {!error && pedidos.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          Aún no tienes pedidos. <Link href="/productos" className="text-emerald-600 underline">Ver catálogo</Link>
        </p>
      )}

      {pedidos.map(p => (
        <div key={p.id} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between gap-4">
            <span className="font-semibold">Pedido #{p.id}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(p.creado_en).toLocaleDateString('es-ES')}
            </span>
          </div>
          <p className="text-emerald-600 font-bold">{euros(p.total)} — {p.estado}</p>
        </div>
      ))}
    </main>
  );
}
