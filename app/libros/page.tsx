import Link from 'next/link';

// Definimos la estructura que esperamos de Laravel
interface Libro {
  id: number;
  titulo: string;
  autor: string;
  disponible: boolean;
}

// URL del backend Laravel: en Vercel se define con la variable de entorno API_URL
const API_URL = process.env.API_URL ?? 'http://127.0.0.1:8000';

export default async function LibrosPage() {
  // Si la API no responde (ej: servidor apagado), fetch lanza error: lo convertimos en null
  const res = await fetch(`${API_URL}/api/libros`, {
    cache: 'no-store' // Para que no cachee y veamos cambios en vivo
  }).catch(() => null);

  if (!res?.ok) {
    return <p className="p-4 text-red-500">No se pudieron cargar los libros. Intentá nuevamente más tarde.</p>;
  }

  const libros: Libro[] = await res.json();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Catálogo de Biblioteca</h1>
      <ul className="space-y-3">
        {libros.map((libro) => (
          <li key={libro.id} className="p-4 border rounded shadow-sm hover:bg-gray-50 hover:text-black">
            <Link href={`/libros/${libro.id}`} className="block">
              <span className="font-semibold">{libro.titulo}</span>
              {!libro.disponible && <span className="text-red-500 text-sm ml-2">(No disponible)</span>}
              <br />
              <span className="text-gray-600 text-sm">Por {libro.autor}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}