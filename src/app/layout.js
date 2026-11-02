import './globals.css';
import { Proveedores } from '@/components/Proveedores';
import { Cabecera } from '@/components/Cabecera';

export const metadata = { title: 'TiendaNext', description: 'Ecommerce con Next.js' };

// Se ejecuta antes de pintar: aplica el tema guardado y evita un parpadeo claro
const scriptTema = `try{if(localStorage.getItem('tema')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: el script cambia la clase de <html> antes de que cargue React
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body>
        <Proveedores>
          <Cabecera />
          {children}
        </Proveedores>
      </body>
    </html>
  );
}
