'use client';
import { createContext, useContext, useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { useSession } from 'next-auth/react';

const Ctx = createContext();
export const useCarrito = () => useContext(Ctx);

const CLAVE = 'carrito';
const MAX_CANTIDAD = 99; // El mismo límite que aplica la API
const API = process.env.NEXT_PUBLIC_API_URL;

// ---------- Almacén del carrito ----------
// El carrito vive en memoria. Sin sesión, además se guarda en localStorage
// para no perderlo al recargar. Con sesión, la fuente de verdad es la API
// (Stripe cobra lo que hay en la base de datos).
let memoria = null;       // array de items (null = aún sin leer)
let modoInvitado = true;  // true = sin sesión, se guarda en localStorage
const oyentes = new Set();

function leerLocal() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function guardarLocal(items) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(items));
  } catch {
    // Si el navegador bloquea el guardado, seguimos solo en memoria
  }
}

function avisar() {
  oyentes.forEach(fn => fn());
}

function leerCarrito() {
  if (memoria === null) memoria = leerLocal();
  return memoria;
}

function escribirCarrito(items) {
  memoria = items;
  if (modoInvitado) guardarLocal(items);
  avisar();
}

function suscribir(fn) {
  oyentes.add(fn);
  // Si otra pestaña cambia el carrito de invitado, lo recogemos aquí
  const alCambiarOtraPestana = (e) => {
    if (e.key === CLAVE && modoInvitado) {
      memoria = leerLocal();
      fn();
    }
  };
  window.addEventListener('storage', alCambiarOtraPestana);
  return () => {
    oyentes.delete(fn);
    window.removeEventListener('storage', alCambiarOtraPestana);
  };
}

const VACIO = [];
const leerEnServidor = () => VACIO; // En el servidor no hay carrito

// La API devuelve filas de carrito_items: su "id" es el de la fila,
// el del producto viene en "producto_id". Aquí usamos siempre el del producto.
function normalizar(fila) {
  return {
    id: fila.producto_id ?? fila.id,
    nombre: fila.nombre,
    precio: fila.precio,
    imagen: fila.imagen,
    cantidad: fila.cantidad,
  };
}

// ---------- Provider ----------
export function CarritoProvider({ children }) {
  const { data: session, status } = useSession();
  const items = useSyncExternalStore(suscribir, leerCarrito, leerEnServidor);
  const tokenAnterior = useRef(null);
  const tokenActual = useRef(null);

  // Llama a /carrito de la API con el token de la sesión
  const llamarApi = useCallback(async (ruta, opciones = {}) => {
    const r = await fetch(`${API}/carrito${ruta}`, {
      ...opciones,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenActual.current}`,
      },
    });
    if (!r.ok) throw new Error(`${opciones.method ?? 'GET'} /carrito${ruta}: ${r.status}`);
    return r.status === 204 ? null : r.json();
  }, []);

  // Con sesión, repite el cambio en la API (sin bloquear la pantalla)
  const enviarSiHaySesion = useCallback((ruta, opciones) => {
    if (!tokenActual.current) return;
    llamarApi(ruta, opciones).catch(error =>
      console.error('No se pudo guardar el carrito en la API:', error));
  }, [llamarApi]);

  // Acepta un array nuevo o una función (prev => nuevo), como useState.
  // Solo cambia el carrito en el navegador, no llama a la API.
  const setItems = useCallback((nuevo) => {
    const siguiente = typeof nuevo === 'function' ? nuevo(leerCarrito()) : nuevo;
    escribirCarrito(Array.isArray(siguiente) ? siguiente : []);
  }, []);

  // Sincronizar cuando cambia la sesión
  useEffect(() => {
    if (status === 'loading') return;

    const token = session?.accessToken ?? null;
    const anterior = tokenAnterior.current;
    tokenAnterior.current = token;
    tokenActual.current = token;
    if (token === anterior) return; // Nada ha cambiado

    // LOGOUT: guarda el carrito en localStorage y vacía el estado
    if (!token) {
      modoInvitado = true;
      guardarLocal(leerCarrito());
      memoria = [];
      avisar();
      return;
    }

    // LOGIN (o recarga con sesión): envía los items locales y carga el de la API
    modoInvitado = false;
    async function sincronizar() {
      try {
        const { datos: enApi } = await llamarApi('');
        const deLaApi = (Array.isArray(enApi) ? enApi : []).map(normalizar);

        // POST /carrito SUMA cantidades. Solo enviamos lo que le falta a la API,
        // así no se duplica lo que ya estaba (por ejemplo tras cerrar y abrir sesión).
        let enviado = false;
        for (const item of leerLocal()) {
          const yaEnApi = deLaApi.find(i => i.id === item.id)?.cantidad ?? 0;
          const falta = item.cantidad - yaEnApi;
          if (falta > 0) {
            await llamarApi('', {
              method: 'POST',
              body: JSON.stringify({ productoId: item.id, cantidad: falta }),
            });
            enviado = true;
          }
        }

        // Cargar el carrito unificado desde la API
        let final = deLaApi;
        if (enviado) {
          const { datos } = await llamarApi('');
          final = (Array.isArray(datos) ? datos : []).map(normalizar);
        }

        // Solo borramos la copia local cuando la API ya tiene el carrito
        try { localStorage.removeItem(CLAVE); } catch {}
        escribirCarrito(final);
      } catch (error) {
        // Si falla, dejamos el carrito local tal cual para no perder nada
        console.error('No se pudo sincronizar el carrito:', error);
      }
    }
    sincronizar();
  }, [session?.accessToken, status, llamarApi]);

  // Si el producto ya está, suma 1 a la cantidad; si no, lo añade
  const agregar = useCallback((producto) => {
    const existe = leerCarrito().find(i => i.id === producto.id);
    if (existe?.cantidad >= MAX_CANTIDAD) return; // La API no acepta más de 99
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) return prev.map(i =>
        i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
      );
      const { id, nombre, precio, imagen } = producto;
      return [...prev, { id, nombre, precio, imagen, cantidad: 1 }];
    });
    enviarSiHaySesion('', {
      method: 'POST',
      body: JSON.stringify({ productoId: producto.id, cantidad: 1 }),
    });
  }, [setItems, enviarSiHaySesion]);

  const quitar = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    enviarSiHaySesion(`/${id}`, { method: 'DELETE' });
  }, [setItems, enviarSiHaySesion]);

  // Si la cantidad baja de 1, quita el producto
  const actualizarCantidad = useCallback((id, cantidad) => {
    if (cantidad < 1) return quitar(id);
    if (cantidad > MAX_CANTIDAD) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i));
    enviarSiHaySesion(`/${id}`, { method: 'PUT', body: JSON.stringify({ cantidad }) });
  }, [setItems, quitar, enviarSiHaySesion]);

  const total = items.reduce((s, i) => s + Number(i.precio) * i.cantidad, 0);
  const totalItems = items.reduce((s, i) => s + i.cantidad, 0);

  return (
    <Ctx.Provider value={{ items, agregar, quitar, actualizarCantidad, total, totalItems, setItems }}>
      {children}
    </Ctx.Provider>
  );
}
