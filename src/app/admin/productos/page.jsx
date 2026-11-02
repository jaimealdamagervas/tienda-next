import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { BotonBorrar } from '@/components/BotonBorrar';
import { euros } from '@/lib/formato';

export const metadata = { title: 'Admin — Productos' };

export default async function AdminProductos() {
  // no-store: tras crear, editar o borrar, la tabla debe verse al momento
  const { datos } = await apiFetch('/productos', { cache: 'no-store' });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin — Productos</h1>
        <Link href="/admin/productos/nuevo"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">+ Nuevo</Link>
      </div>

      {/* En móvil la tabla se desplaza en horizontal en vez de romper la página */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr className="border-b">
            <th className="py-2 pr-4">Nombre</th><th className="pr-4">Precio</th><th className="pr-4">Stock</th><th></th>
          </tr></thead>
          <tbody>
            {datos.map(p => (
              <tr key={p.id} className="border-b">
                <td className="py-2 pr-4">{p.nombre}</td>
                <td className="pr-4">{euros(p.precio)}</td>
                <td className="pr-4">{p.stock}</td>
                <td>
                  <div className="flex gap-3 justify-end">
                    <Link href={`/admin/productos/${p.id}/editar`}
                          className="text-blue-500 text-sm hover:text-blue-700">Editar</Link>
                    <BotonBorrar id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
