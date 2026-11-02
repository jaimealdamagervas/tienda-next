import { FormProducto } from '@/components/FormProducto';

export const metadata = { title: 'Nuevo producto — Admin' };

export default function NuevoProducto() {
  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nuevo producto</h1>
      <FormProducto metodo="POST" ruta="/productos" textoBoton="Crear producto" />
    </main>
  );
}
