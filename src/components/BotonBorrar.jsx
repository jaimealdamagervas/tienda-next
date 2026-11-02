'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function BotonBorrar({ id }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [borrando, setBorrando] = useState(false);

  async function borrar() {
    // Confirmar antes de borrar — evita borrar por error
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;

    setBorrando(true);
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    }).catch(() => null);
    setBorrando(false);

    if (!r?.ok) {
      // Por ejemplo: el producto está en algún pedido y la base de datos no deja borrarlo
      const { error } = (await r?.json().catch(() => ({}))) ?? {};
      return alert(`No se pudo borrar el producto${error ? `: ${error}` : ''}`);
    }
    // router.refresh() recarga los datos del server component sin recargar toda la página
    router.refresh();
  }

  return (
    <button onClick={borrar} disabled={borrando}
            className="text-red-500 text-sm hover:text-red-700 disabled:opacity-50">
      {borrando ? 'Borrando...' : 'Borrar'}
    </button>
  );
}
