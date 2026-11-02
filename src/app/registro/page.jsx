'use client';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function PaginaRegistro() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden');

    setError('');
    setEnviando(true);
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: form.nombre, email: form.email, password: form.password }),
      });

      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        setEnviando(false);
        return setError(data.error ?? 'Error al registrar');
      }
    } catch {
      setEnviando(false);
      return setError('No se pudo conectar con el servidor. Inténtalo más tarde.');
    }

    await signIn('credentials', { email: form.email, password: form.password, callbackUrl: '/' });
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input name="nombre" placeholder="Nombre" value={form.nombre}
               onChange={cambiar} required className="w-full px-4 py-2 border rounded-lg" />
        <input name="email" type="email" placeholder="Email" value={form.email}
               onChange={cambiar} required className="w-full px-4 py-2 border rounded-lg" />
        <input name="password" type="password" placeholder="Contraseña" value={form.password}
               onChange={cambiar} required minLength={6} className="w-full px-4 py-2 border rounded-lg" />
        <input name="confirmar" type="password" placeholder="Confirmar contraseña" value={form.confirmar}
               onChange={cambiar} required className="w-full px-4 py-2 border rounded-lg" />
        <button type="submit" disabled={enviando}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60">
          {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        ¿Ya tienes cuenta? <Link href="/login" className="text-emerald-600 underline">Iniciar sesión</Link>
      </p>
    </main>
  );
}