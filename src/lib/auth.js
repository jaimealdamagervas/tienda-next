import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const API = process.env.API_URL;

// Momento (en ms) en que caduca un JWT, leyendo su campo "exp"
function caducidad(jwt) {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());
    return payload.exp * 1000;
  } catch {
    return 0;
  }
}

// Copia al token de NextAuth los datos que devuelve nuestra API
function guardarDatosApi(token, datos) {
  token.id = datos.id;
  token.rol = datos.rol;
  token.accessToken = datos.token;
  token.refreshToken = datos.refresh;
  token.accessTokenExpires = caducidad(datos.token);
  delete token.error;
  return token;
}

// Pide a la API un token de acceso nuevo usando el refresh token
async function renovarToken(token) {
  try {
    const r = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: token.refreshToken }),
    });
    if (!r.ok) throw new Error(`refresh: ${r.status}`);
    const { datos } = await r.json();
    return guardarDatosApi(token, datos);
  } catch {
    // El refresh token también ha caducado: hay que volver a iniciar sesión
    return { ...token, error: 'SesionCaducada' };
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const r = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        if (!r.ok) return null;
        const { datos } = await r.json();
        return { id: datos.id, name: datos.nombre, email: datos.email,
                 rol: datos.rol, accessToken: datos.token, refreshToken: datos.refresh };
      },
    }),
  ],
  callbacks: {
    // Añade datos propios (id, rol, tokens de nuestra API) al token de sesión
    async jwt({ token, user, account }) {
      // Login con email y contraseña
      if (user?.accessToken) {
        return guardarDatosApi(token, {
          id: user.id, rol: user.rol, token: user.accessToken, refresh: user.refreshToken,
        });
      }

      // Login con Google: la API verifica el id_token y nos da sus propios tokens
      if (account?.provider === 'google') {
        const r = await fetch(`${API}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: account.id_token }),
        });
        if (!r.ok) throw new Error(`No se pudo validar el login de Google (API: ${r.status})`);
        const { datos } = await r.json();
        return guardarDatosApi(token, datos);
      }

      // Peticiones siguientes: si el token de la API caduca en menos de 1 minuto, se renueva
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires - 60_000) {
        return renovarToken(token);
      }
      return token;
    },
    // Copia esos datos a la sesión que ven los componentes
    // (el refresh token NO se copia: no hace falta en el navegador)
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.rol = token.rol;
      session.accessToken = token.accessToken;
      if (token.error) session.error = token.error;
      return session;
    },
  },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};
