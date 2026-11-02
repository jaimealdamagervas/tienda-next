import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/checkout → pide a la API Express una sesión de Stripe Checkout
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'No autenticado' }, { status: 401 });

  try {
    const r = await fetch(`${process.env.API_URL}/stripe/crear-sesion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    const data = await r.json().catch(() => ({}));
    // Devolvemos el mismo código que la API (200, 400, 500...)
    return Response.json(data, { status: r.status });
  } catch {
    return Response.json({ error: 'No se pudo conectar con la API' }, { status: 502 });
  }
}
