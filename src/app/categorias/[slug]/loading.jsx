import { Cargando } from '@/components/Cargando';

// Next.js muestra esto automáticamente mientras la página carga sus datos
export default function Loading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="h-9 w-48 mb-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      <Cargando filas={8} />
    </main>
  );
}
