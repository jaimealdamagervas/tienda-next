'use client';
import { useSyncExternalStore } from 'react';

// El tema vive en la clase "dark" de <html>. Un script en layout.js la pone
// antes de pintar la página (leyendo localStorage), así no hay parpadeo blanco.
// Aquí solo observamos esa clase para saber qué icono mostrar.
function suscribir(avisar) {
  const observador = new MutationObserver(avisar);
  observador.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observador.disconnect();
}
const esOscuro = () => document.documentElement.classList.contains('dark');
const enServidor = () => false;

export function BotonTema() {
  const oscuro = useSyncExternalStore(suscribir, esOscuro, enServidor);

  function toggle() {
    const nuevo = !oscuro;
    document.documentElement.classList.toggle('dark', nuevo);
    try {
      localStorage.setItem('tema', nuevo ? 'dark' : 'light');
    } catch {
      // Si el navegador bloquea localStorage, el tema dura hasta recargar
    }
  }

  return (
    <button onClick={toggle} aria-label={oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
      {oscuro ? '☀' : '☾'}
    </button>
  );
}
