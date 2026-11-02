'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FormProducto } from '@/components/FormProducto';

export default function EditarProducto() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(false);

  // Cargar los datos actuales del producto al montar
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`)
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(({ datos }) => setForm({
        nombre: datos.nombre,
        descripcion: datos.descripcion ?? '',
        precio: datos.precio,
        imagen: datos.imagen ?? '',
        stock: datos.stock,
        categoria_id: datos.categoria_id ?? '',
        destacado: Boolean(datos.destacado),
      }))
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <main className="max-w-lg mx-auto px-4 py-8">
        <p className="text-red-500">No se encontró el producto.</p>
        <Link href="/admin/productos" className="text-emerald-600 underline">Volver a la lista</Link>
      </main>
    );
  }

  if (!form) return <p className="p-8">Cargando...</p>;

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar producto</h1>
      {/* Pre-rellenado con los valores existentes; al enviar hace PUT /productos/:id */}
      <FormProducto inicial={form} metodo="PUT" ruta={`/productos/${id}`} textoBoton="Guardar cambios" />
    </main>
  );
}
