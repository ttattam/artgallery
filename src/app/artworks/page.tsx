'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiFilter, FiX } from 'react-icons/fi';

interface Artwork {
  _id: string;
  title: string;
  imageUrl: string;
  categories: string[];
  year: number;
  technique: string;
  isSold: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Загрузка произведений искусства
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setIsLoading(true);
        const url = selectedCategory
          ? `/api/artworks?category=${selectedCategory}`
          : '/api/artworks';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить произведения искусства');
        }
        
        const data = await response.json();
        setArtworks(data);
        setError(null);
      } catch (err) {
        setError('Произошла ошибка при загрузке произведений искусства');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtworks();
  }, [selectedCategory]);

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

  // Обработчик выбора категории
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
  };

  // Переключение видимости фильтра на мобильных устройствах
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Произведения искусства</h1>
      
      <div className="mb-8 flex items-center justify-between">
        <p className="text-muted-foreground">
          {artworks.length} {artworks.length === 1 ? 'работа' : 
            artworks.length > 1 && artworks.length < 5 ? 'работы' : 'работ'}
        </p>
        
        {/* Кнопка фильтра для мобильных устройств */}
        <button
          className="flex items-center rounded-md border border-border bg-background px-4 py-2 md:hidden"
          onClick={toggleFilter}
        >
          {isFilterOpen ? <FiX className="mr-2" /> : <FiFilter className="mr-2" />}
          Фильтры
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Фильтр по категориям */}
        <aside className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
          <div className="sticky top-20 rounded-lg border border-border bg-card p-4">
            <h2 className="mb-4 text-xl font-medium">Категории</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <button
                  className={`w-full text-left ${
                    selectedCategory === '' ? 'font-medium text-foreground' : 'text-muted-foreground'
                  }`}
                  onClick={() => setSelectedCategory('')}
                >
                  Все категории
                </button>
              </div>
              
              {categories.map((category) => (
                <div key={category._id} className="flex items-center">
                  <button
                    className={`w-full text-left ${
                      selectedCategory === category._id ? 'font-medium text-foreground' : 'text-muted-foreground'
                    }`}
                    onClick={() => handleCategoryChange(category._id)}
                  >
                    {category.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
        
        {/* Список произведений искусства */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-accent"></div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : artworks.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">Произведения искусства не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artworks.map((artwork) => (
                <Link
                  key={artwork._id}
                  href={`/artworks/${artwork._id}`}
                  className="group overflow-hidden rounded-lg border border-border bg-background transition-all hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {artwork.isSold && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white">
                          Продано
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 text-xl font-medium">{artwork.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{artwork.technique}</span>
                      <span className="text-sm text-muted-foreground">{artwork.year}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 