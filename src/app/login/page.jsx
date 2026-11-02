'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

// Mensajes para los errores que NextAuth (o nosotros) ponen en ?error=
const ERRORES = {
  SesionCaducada: 'Tu sesión ha caducado. Vuelve a iniciar sesión.',
  OAuthSignin: 'No se pudo conectar con Google. Inténtalo de nuevo.',
  OAuthCallback: 'No se pudo completar el login con Google.',
  Callback: 'No se pudo completar el login con Google.',
  AccessDenied: 'Acceso denegado.',
};

// Solo dejamos volver a páginas de nuestra propia web (evita redirecciones a webs ajenas)
function destinoSeguro(callbackUrl) {
  if (!callbackUrl) return '/';
  try {
    const url = new URL(callbackUrl, window.location.origin);
    return url.origin === window.location.origin ? url.pathname + url.search : '/';
  } catch {
    return '/';
  }
}

function FormularioLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [entrando, setEntrando] = useState(false);

  const callbackUrl = params.get('callbackUrl');
  const errorUrl = params.get('error');
  const mensaje = error || (errorUrl && (ERRORES[errorUrl] ?? 'No se pudo iniciar sesión.'));

  async function handleSubmit(e) {
    e.preventDefault();
    setEntrando(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setError('Email o contraseña incorrectos');
      setEntrando(false);
    } else {
      // Vuelve a la página que se quería abrir (p. ej. /cuenta/pedidos)
      router.push(destinoSeguro(callbackUrl));
      router.refresh();
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>

      {mensaje && <p className="text-red-500 text-sm mb-4">{mensaje}</p>}

      <button onClick={() => signIn('google', { callbackUrl: callbackUrl ?? '/' })}
              className="w-full py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 mb-6">
        Continuar con Google
      </button>

      <div className="text-center text-gray-400 mb-6">— o —</div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} autoComplete="email"
               onChange={e => setEmail(e.target.value)} required
               className="w-full px-4 py-2 border rounded-lg" />
        <input type="password" placeholder="Contraseña" value={password} autoComplete="current-password"
               onChange={e => setPassword(e.target.value)} required
               className="w-full px-4 py-2 border rounded-lg" />
        <button type="submit" disabled={entrando}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60">
          {entrando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        ¿No tienes cuenta? <Link href="/registro" className="text-emerald-600 underline">Crear cuenta</Link>
      </p>
    </main>
  );
}

export default function PaginaLogin() {
  // useSearchParams necesita estar dentro de Suspense
  return (
    <Suspense>
      <FormularioLogin />
    </Suspense>
  );
}
