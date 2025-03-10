'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiTag } from 'react-icons/fi';

interface Artwork {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  categories: string[];
  year: number;
  technique: string;
  dimensions: string;
  price?: number;
  isSold: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка произведения искусства
  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/artworks/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Произведение искусства не найдено');
          }
          throw new Error('Не удалось загрузить произведение искусства');
        }
        
        const data = await response.json();
        setArtwork(data);
        setError(null);
      } catch (err) {
        setError('Произошла ошибка при загрузке произведения искусства');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchArtwork();
    }
  }, [id]);

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить категории');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
      }
    };

    fetchCategories();
  }, []);

  // Получение названий категорий по их ID
  const getCategoryNames = (categoryIds: string[]) => {
    if (!categories.length) return [];
    return categoryIds.map(
      (categoryId) => categories.find((cat) => cat._id === categoryId)?.name || ''
    ).filter(Boolean);
  };

  // Обработчик возврата к списку произведений
  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="container flex h-96 items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-accent"></div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="container py-12">
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-red-500">{error || 'Произведение искусства не найдено'}</p>
          <button
            onClick={handleBack}
            className="mt-4 inline-flex items-center text-accent hover:underline"
          >
            <FiArrowLeft className="mr-2" /> Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const categoryNames = getCategoryNames(artwork.categories);

  return (
    <div className="container py-12">
      <button
        onClick={handleBack}
        className="mb-8 inline-flex items-center text-accent hover:underline"
      >
        <FiArrowLeft className="mr-2" /> Вернуться к списку
      </button>
      
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Изображение */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-cover"
            priority
          />
          {artwork.isSold && (
            <div className="absolute right-4 top-4">
              <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white">
                Продано
              </span>
            </div>
          )}
        </div>
        
        {/* Информация о произведении */}
        <div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{artwork.title}</h1>
          
          <div className="mb-6 flex flex-wrap gap-2">
            {categoryNames.map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
              >
                <FiTag className="mr-1" /> {category}
              </span>
            ))}
          </div>
          
          <div className="mb-8 space-y-4 border-b border-border pb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Год создания</p>
                <p className="font-medium">{artwork.year}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Техника</p>
                <p className="font-medium">{artwork.technique}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Размеры</p>
                <p className="font-medium">{artwork.dimensions}</p>
              </div>
              {artwork.price && !artwork.isSold && (
                <div>
                  <p className="text-sm text-muted-foreground">Цена</p>
                  <p className="font-medium">{artwork.price.toLocaleString()} ₽</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Описание</h2>
            <p className="whitespace-pre-line text-muted-foreground">{artwork.description}</p>
          </div>
          
          {!artwork.isSold && (
            <div className="mt-8">
              <Link href="/contact" className="btn btn-primary">
                Связаться для приобретения
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 