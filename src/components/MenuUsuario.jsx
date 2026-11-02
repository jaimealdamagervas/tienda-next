'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function MenuUsuario() {
  const { data: session } = useSession();
  const router = useRouter();

  // Sin recargar la página: así el carrito tiene tiempo de guardarse
  // en localStorage al detectar el cierre de sesión
  async function cerrarSesion() {
    await signOut({ redirect: false });
    router.refresh();
  }

  if (!session) return <Link href="/login" className="text-sm">Iniciar sesión</Link>;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm hidden sm:inline">{session.user.name}</span>
      {session.user.rol === 'admin' &&
        <Link href="/admin/productos" className="text-xs text-emerald-500">Admin</Link>}
      <button onClick={cerrarSesion} className="text-xs text-gray-400 hover:text-red-400">Salir</button>
    </div>
  );
}