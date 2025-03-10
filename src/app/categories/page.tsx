'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить категории');
        }
        
        const data = await response.json();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Произошла ошибка при загрузке категорий');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Категории</h1>
      
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-accent"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Категории не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/artworks?category=${category._id}`}
              className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md"
            >
              <h2 className="mb-2 text-2xl font-medium">{category.name}</h2>
              {category.description && (
                <p className="mb-4 flex-grow text-muted-foreground">{category.description}</p>
              )}
              <div className="mt-auto flex items-center text-accent">
                Смотреть работы
                <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 