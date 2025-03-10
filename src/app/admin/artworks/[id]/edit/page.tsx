'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import ArtworkForm from '@/components/ArtworkForm';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Artwork {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  categories: Category[];
  year: number;
  technique: string;
  dimensions: string;
  price: string;
  isSold: boolean;
  isFeatured: boolean;
}

export default function EditArtworkPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  // Загрузка работы
  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await fetch(`/api/artworks/${params.id}`);
        if (!response.ok) throw new Error('Ошибка при загрузке работы');
        const data = await response.json();
        setArtwork(data);
      } catch (err) {
        console.error('Ошибка при загрузке работы:', err);
        setError('Не удалось загрузить работу');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtwork();
  }, [params.id]);

  if (isLoading) {
    return <div className="p-8">Загрузка...</div>;
  }

  if (error || !artwork) {
    return (
      <div className="rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        {error || 'Работа не найдена'}
      </div>
    );
  }

  // Преобразуем данные для формы
  const formData = {
    ...artwork,
    categories: artwork.categories.map(cat => cat._id)
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/admin/artworks"
            className="mr-4 flex items-center text-accent hover:underline"
          >
            <FiArrowLeft className="mr-2" /> Назад
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Редактировать работу
          </h1>
        </div>
      </div>

      <ArtworkForm
        initialData={formData}
        onSubmit={async (data) => {
          try {
            const response = await fetch(`/api/artworks/${params.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Ошибка при обновлении работы');
            }

            router.push('/admin/artworks');
          } catch (err: any) {
            setError(err.message);
          }
        }}
      />
    </div>
  );
} 