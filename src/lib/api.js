const BASE = process.env.API_URL;

// Llama a la API Express desde el servidor de Next.
// - Por defecto cachea 60 s (catálogo público).
// - Con `token`, envía la cabecera Authorization y NO cachea (datos privados).
// - Con `cache: 'no-store'`, siempre pide datos frescos.
export async function apiFetch(ruta, opciones = {}) {
  const { token, headers, ...resto } = opciones;
  const cacheo = token
    ? { cache: 'no-store' }
    : resto.cache ? {} : { next: { revalidate: 60 } };

  const r = await fetch(`${BASE}${ruta}`, {
    ...cacheo,
    ...resto,
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!r.ok) {
    const error = new Error(`API error: ${r.status}`);
    error.status = r.status; // Para distinguir "no existe" (404) de "la API ha fallado"
    throw error;
  }
  return r.json();
}

// La API devuelve un objeto (no un array) cuando solo hay un resultado.
// Esto siempre devuelve un array.
export function comoLista(datos) {
  if (Array.isArray(datos)) return datos;
  return datos ? [datos] : [];
}
