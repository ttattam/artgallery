'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiUpload, FiX, FiCheck } from 'react-icons/fi';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  categories: string[];
  year: number;
  technique: string;
  dimensions: string;
  price: string;
  isSold: boolean;
  isFeatured: boolean;
}

export default function NewArtworkPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  
  // Состояние для предварительного просмотра изображения
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  
  // Состояние формы
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    imageUrl: '',
    categories: [],
    year: new Date().getFullYear(),
    technique: '',
    dimensions: '',
    price: '',
    isSold: false,
    isFeatured: false,
  });

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Ошибка при загрузке категорий');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
        setError('Не удалось загрузить категории');
      }
    };

    fetchCategories();
  }, []);

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      // Разрешаем только числа и пустую строку для цены
      if (value === '' || /^\d+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === 'year') {
      // Разрешаем только числа для года
      if (/^\d+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Обработчик изменения категорий
  const handleCategoryChange = (categoryId: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  // Получение выбранных категорий
  const getSelectedCategories = () => {
    return categories.filter(cat => formData.categories.includes(cat._id));
  };

  // Обработчик загрузки изображения
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      try {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке изображения');
        }

        const data = await response.json();
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      } catch (err) {
        console.error('Ошибка при загрузке изображения:', err);
        setError('Ошибка при загрузке изображения');
        setImagePreview(undefined);
      }
    }
  };

  // Удаление предварительного просмотра изображения
  const handleRemoveImage = () => {
    setImagePreview(undefined);
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Произошла ошибка при создании произведения');
      }

      // После успешного создания перенаправляем на страницу со списком
      router.push('/admin/artworks');
      
    } catch (err: any) {
      console.error('Ошибка при создании произведения:', err);
      setError(err.message || 'Произошла ошибка при создании произведения');
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Добавить произведение</h1>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Левая колонка - основная информация */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium">
                Название
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input w-full"
                placeholder="Введите название произведения"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="input w-full"
                placeholder="Введите описание произведения"
              ></textarea>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium">
                Категории
              </label>
              
              {/* Отображение выбранных категорий */}
              {getSelectedCategories().length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {getSelectedCategories().map(category => (
                    <span
                      key={category._id}
                      className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm"
                    >
                      {category.name}
                      <button
                        type="button"
                        onClick={() => handleCategoryChange(category._id)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Список всех категорий */}
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category._id}
                    className="flex items-center rounded-lg border border-border p-3 hover:bg-accent/5"
                  >
                    <input
                      type="checkbox"
                      className="mr-3 h-4 w-4 rounded border-border"
                      checked={formData.categories.includes(category._id)}
                      onChange={() => handleCategoryChange(category._id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-muted-foreground">
                          {category.description}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
                {categories.length === 0 && (
                  <div className="rounded-lg border border-border p-4 text-center text-muted-foreground">
                    Нет доступных категорий
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Правая колонка - дополнительная информация и изображение */}
          <div className="space-y-6">
            <div>
              <label htmlFor="image" className="mb-2 block text-sm font-medium">
                Изображение
              </label>
              {imagePreview ? (
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Предварительный просмотр"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                    title="Удалить изображение"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div className="mb-4 flex aspect-square w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-6">
                  <FiUpload className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    Перетащите изображение сюда или нажмите для выбора
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG или WEBP (макс. 5MB)
                  </p>
                </div>
              )}
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                required={!imagePreview}
              />
              <label
                htmlFor="image"
                className="inline-flex cursor-pointer items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/10"
              >
                <FiUpload className="mr-2" /> Выбрать изображение
              </label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="year" className="mb-2 block text-sm font-medium">
                  Год создания
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="input w-full"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              
              <div>
                <label htmlFor="technique" className="mb-2 block text-sm font-medium">
                  Техника
                </label>
                <input
                  type="text"
                  id="technique"
                  name="technique"
                  value={formData.technique}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Масло, холст"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dimensions" className="mb-2 block text-sm font-medium">
                  Размеры
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="100x80 см"
                />
              </div>
              
              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-medium">
                  Цена (₽)
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Оставьте пустым, если не для продажи"
                />
              </div>
            </div>
            
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isSold"
                  checked={formData.isSold}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 rounded border-border"
                />
                <span className="text-sm">Продано</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 rounded border-border"
                />
                <span className="text-sm">Избранное (отображать на главной)</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/artworks"
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/10"
          >
            Отмена
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
} 