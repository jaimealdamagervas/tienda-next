// Skeleton del detalle de producto (si no, se usaría el de la lista)
export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-7 w-1/4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
      </div>
    </main>
  );
}
