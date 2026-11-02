// Skeleton: cajas grises animadas mientras llegan los datos de la API
export function Cargando({ filas = 4 }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" aria-label="Cargando">
      {Array.from({ length: filas }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-800 aspect-square rounded-xl" />
          <div className="mt-3 h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
