import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { VaciarCarrito } from '@/components/VaciarCarrito';
import { euros } from '@/lib/formato';

export const metadata = { title: 'Pago exitoso — TiendaNext' };

export default async function PagoExito({ searchParams }) {
  const { session_id } = await searchParams;
  const session = await getServerSession(authOptions);
  let pedido = null;

  // /pedidos necesita el token del usuario: sin él la API responde 401
  if (session_id && session?.accessToken) {
    try {
      const res = await apiFetch(
        `/pedidos?stripe_session=${encodeURIComponent(session_id)}`,
        { token: session.accessToken }
      );
      // Si el pedido existe, la API devuelve un objeto; si aún no, un array vacío
      if (res.datos && !Array.isArray(res.datos)) pedido = res.datos;
    } catch {}
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-16">
      <VaciarCarrito />
      <h1 className="text-3xl font-bold text-emerald-600 text-center">Pago exitoso</h1>

      {pedido ? (
        <div className="mt-8 border rounded-lg p-6">
          <h2 className="font-bold mb-4">Resumen del pedido #{pedido.id}</h2>
          {(pedido.lineas ?? []).map(l => (
            <div key={l.id} className="flex justify-between gap-4 py-2 border-b">
              <span>{l.nombre} × {l.cantidad}</span>
              <span>{euros(Number(l.precio_unit) * l.cantidad)}</span>
            </div>
          ))}
          <p className="mt-4 text-right text-lg font-bold">
            Total: {euros(pedido.total)}
          </p>
        </div>
      ) : (
        // El webhook de Stripe puede tardar unos segundos en crear el pedido
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Tu pago se ha recibido. Estamos confirmando el pedido; aparecerá en
          «Mis pedidos» en unos segundos.
        </p>
      )}

      <Link href="/cuenta/pedidos"
            className="mt-6 block text-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
        Ver mis pedidos
      </Link>
    </main>
  );
}
