'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const PRODUCTO_VACIO = {
  nombre: '', descripcion: '', precio: '', imagen: '', stock: '', categoria_id: '', destacado: false,
};

const estiloCampo = 'w-full px-4 py-2 border rounded-lg';

// Formulario compartido por "Nuevo producto" y "Editar producto".
// metodo: 'POST' (crear) o 'PUT' (editar); ruta: '/productos' o '/productos/:id'
export function FormProducto({ inicial = PRODUCTO_VACIO, metodo, ruta, textoBoton }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState(inicial);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Categorías para el desplegable
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`)
      .then(r => r.json())
      .then(({ datos }) => setCategorias(datos ?? []))
      .catch(() => {});
  }, []);

  function cambiar(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGuardando(true);
    setError('');

    // Los inputs HTML siempre devuelven strings: convertimos a número.
    // Solo enviamos los campos que existen en la tabla productos.
    const datos = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      imagen: form.imagen,
      stock: Number(form.stock),
      categoria_id: form.categoria_id === '' ? null : Number(form.categoria_id),
      destacado: Boolean(form.destacado),
    };

    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${ruta}`, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(datos),
      });
      if (!r.ok) {
        const { error } = await r.json().catch(() => ({}));
        throw new Error(error ?? `Error ${r.status}`);
      }
      router.push('/admin/productos');
      router.refresh();
    } catch (e) {
      setError(`No se pudo guardar: ${e.message}`);
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <label className="block">
        <span className="text-sm font-medium">Nombre</span>
        <input name="nombre" value={form.nombre} onChange={cambiar} required className={estiloCampo} />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Descripción</span>
        <textarea name="descripcion" value={form.descripcion} onChange={cambiar} rows={3} className={estiloCampo} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Precio</span>
          <input name="precio" type="number" step="0.01" min="0" value={form.precio}
                 onChange={cambiar} required className={estiloCampo} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Stock</span>
          <input name="stock" type="number" min="0" value={form.stock}
                 onChange={cambiar} required className={estiloCampo} />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">URL imagen</span>
        <input name="imagen" value={form.imagen} onChange={cambiar}
               placeholder="/img/producto.jpg o https://..." className={estiloCampo} />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Categoría</span>
        <select name="categoria_id" value={form.categoria_id} onChange={cambiar} className={estiloCampo}>
          <option value="">Sin categoría</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </label>

      <label className="flex items-center gap-2">
        <input name="destacado" type="checkbox" checked={form.destacado} onChange={cambiar} />
        <span className="text-sm">Producto destacado (sale en la portada)</span>
      </label>

      <button type="submit" disabled={guardando}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60">
        {guardando ? 'Guardando...' : textoBoton}
      </button>
    </form>
  );
}
