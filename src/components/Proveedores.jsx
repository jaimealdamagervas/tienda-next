'use client';
import { useEffect } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CarritoProvider } from '@/contexts/CarritoContext';

// Si la sesión no se ha podido renovar (refresh token caducado), cerramos sesión
// y llevamos al usuario a /login en vez de dejarle con errores 401 por toda la tienda
function VigilanteSesion() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.error !== 'SesionCaducada') return;
    signOut({ redirect: false }).then(() => router.push('/login?error=SesionCaducada'));
  }, [session?.error, router]);

  return null;
}

export function Proveedores({ children }) {
  return (
    // refetchInterval: cada 5 min se pide la sesión otra vez, y con ello el servidor
    // renueva el token de la API antes de que caduque (dura 1 h)
    <SessionProvider refetchInterval={5 * 60}>
      <VigilanteSesion />
      <CarritoProvider>{children}</CarritoProvider>
    </SessionProvider>
  );
}
