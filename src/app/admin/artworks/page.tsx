'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiFilter, FiX } from 'react-icons/fi';

interface Category {
  _id: string;
  name: string;
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
  createdAt: string;
}

export default function AdminArtworksPage() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для фильтрации и поиска
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSold, setShowSold] = useState(true);
  const [showFeatured, setShowFeatured] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Загрузка произведений искусства
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setIsLoading(true);
        
        // Формируем URL с параметрами фильтрации
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (selectedCategory) queryParams.append('category', selectedCategory);
        if (showFeatured) queryParams.append('featured', 'true');
        
        // Запрос к API
        const response = await fetch(`/api/artworks?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить произведения искусства');
        }
        
        const data = await response.json();
        setArtworks(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке произведений искусства:', err);
        setError('Произошла ошибка при загрузке произведений искусства');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtworks();
  }, [searchTerm, selectedCategory, showSold, showFeatured]);

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // В реальном проекте здесь будет запрос к API
        // const response = await fetch('/api/categories');
        
        // Имитация данных категорий
        const mockCategories = [
          { _id: '1', name: 'Живопись' },
          { _id: '2', name: 'Акварель' },
          { _id: '3', name: 'Портрет' },
          { _id: '4', name: 'Пейзаж' },
          { _id: '5', name: 'Абстракция' },
        ];
        
        setCategories(mockCategories);
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
      }
    };

    fetchCategories();
  }, []);

  // Получение названия категории по ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : '';
  };

  // Обработчик удаления произведения
  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить это произведение?')) {
      return;
    }
    
    try {
      // В реальном проекте здесь будет запрос к API для удаления
      // await fetch(`/api/artworks/${id}`, { method: 'DELETE' });
      
      // Имитация удаления
      setArtworks(artworks.filter(artwork => artwork._id !== id));
      
      alert('Произведение успешно удалено');
    } catch (err) {
      console.error('Ошибка при удалении произведения:', err);
      alert('Произошла ошибка при удалении произведения');
    }
  };

  // Переключение видимости фильтра на мобильных устройствах
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setShowSold(true);
    setShowFeatured(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Произведения искусства</h1>
        <Link href="/admin/artworks/new" className="btn btn-primary inline-flex items-center">
          <FiPlus className="mr-2" /> Добавить произведение
        </Link>
      </div>
      
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        {/* Поиск */}
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск по названию..."
            className="input pl-10 w-full"
          />
        </div>
        
        {/* Кнопка фильтра для мобильных устройств */}
        <button
          className="flex items-center rounded-md border border-border bg-background px-4 py-2 md:hidden"
          onClick={toggleFilter}
        >
          {isFilterOpen ? <FiX className="mr-2" /> : <FiFilter className="mr-2" />}
          Фильтры
        </button>
      </div>
      
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Фильтры */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-4 text-lg font-medium">Фильтры</h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Категория</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Все категории</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showSold}
                    onChange={() => setShowSold(!showSold)}
                    className="mr-2 h-4 w-4 rounded border-border"
                  />
                  <span className="text-sm">Показывать проданные</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showFeatured}
                    onChange={() => setShowFeatured(!showFeatured)}
                    className="mr-2 h-4 w-4 rounded border-border"
                  />
                  <span className="text-sm">Только избранные</span>
                </label>
              </div>
              
              <button
                onClick={resetFilters}
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm text-muted-foreground hover:bg-accent/10"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        </div>
        
        {/* Список произведений */}
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
              {(searchTerm || selectedCategory || showFeatured) && (
                <button
                  onClick={resetFilters}
                  className="mt-4 rounded-md bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full">
                <thead className="bg-card">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Изображение</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Название</th>
                    <th className="hidden px-4 py-3 text-left text-sm font-medium text-muted-foreground md:table-cell">Категория</th>
                    <th className="hidden px-4 py-3 text-left text-sm font-medium text-muted-foreground md:table-cell">Год</th>
                    <th className="hidden px-4 py-3 text-left text-sm font-medium text-muted-foreground md:table-cell">Статус</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {artworks.map((artwork) => (
                    <tr key={artwork._id} className="bg-background hover:bg-card/50">
                      <td className="px-4 py-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <Image
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{artwork.title}</div>
                        <div className="text-sm text-muted-foreground md:hidden">
                          {artwork.categories.map(cat => getCategoryName(cat._id)).join(', ')}
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                        {artwork.categories.map(cat => getCategoryName(cat._id)).join(', ')}
                      </td>
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                        {artwork.year}
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <div className="flex items-center">
                          {artwork.isSold ? (
                            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-200">
                              Продано
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
                              Доступно
                            </span>
                          )}
                          {artwork.isFeatured && (
                            <span className="ml-2 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                              Избранное
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/artworks/${artwork._id}`}
                            className="rounded-md p-2 text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                            title="Просмотр"
                          >
                            <FiEye size={18} />
                          </Link>
                          <Link
                            href={`/admin/artworks/${artwork._id}/edit`}
                            className="rounded-md p-2 text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                            title="Редактировать"
                          >
                            <FiEdit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(artwork._id)}
                            className="rounded-md p-2 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                            title="Удалить"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 