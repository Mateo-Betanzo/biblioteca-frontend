import Link from 'next/link';

interface LibroDetalle {
  id: number;
  titulo: string;
  autor: string;
  anio_publicacion: number | null;
  disponible: boolean;
}

// URL del backend Laravel: en Vercel se define con la variable de entorno API_URL
const API_URL = process.env.API_URL ?? 'http://127.0.0.1:8000';

export default async function LibroDetallePage({ params }: { params: Promise<{ id: string }> }) {
  // En Next.js 15+, params es una Promesa, por lo que es buena práctica esperarla
  const { id } = await params;

  // Si la API no responde (ej: servidor apagado), fetch lanza error: lo convertimos en null
  const res = await fetch(`${API_URL}/api/libros/${id}`, {
    cache: 'no-store'
  }).catch(() => null);

  if (!res?.ok) {
    return (
      <div className="p-8">
        <p className="text-red-500 mb-4">Error al cargar el detalle del libro (o no existe).</p>
        <Link href="/libros" className="text-blue-500 underline">Volver al listado</Link>
      </div>
    );
  }

  const libro: LibroDetalle = await res.json();

  return (
    <div className="p-8">
      <Link href="/libros" className="text-blue-500 underline mb-6 inline-block">
        &larr; Volver al catálogo
      </Link>
      
      <div className="border p-6 rounded shadow-md max-w-md mt-4">
        <h1 className="text-3xl font-bold mb-2">{libro.titulo}</h1>
        <p className="text-lg text-gray-700 mb-1"><strong>Autor:</strong> {libro.autor}</p>
        <p className="text-gray-600 mb-1">
          <strong>Año de publicación:</strong> {libro.anio_publicacion ? libro.anio_publicacion : 'No registrado'}
        </p>
        <p className={`font-semibold mt-4 ${libro.disponible ? 'text-green-600' : 'text-red-500'}`}>
          {libro.disponible ? 'Disponible para préstamo' : 'Actualmente prestado / No disponible'}
        </p>
      </div>
    </div>
  );
}