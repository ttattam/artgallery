'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';

interface Category {
  _id: string;
  name: string;
}

export default function NewArtworkPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для предварительного просмотра изображения
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Состояние формы
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    categories: [] as string[],
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

  // Обработчик изменения категорий (множественный выбор)
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedCategories: string[] = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedCategories.push(options[i].value);
      }
    }
    
    setFormData((prev) => ({ ...prev, categories: selectedCategories }));
  };

  // Обработчик загрузки изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Создаем URL для предварительного просмотра
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // В реальном проекте здесь будет загрузка изображения на сервер
      // и получение URL для сохранения в базе данных
      // Для демонстрации просто используем URL предварительного просмотра
      setFormData((prev) => ({ ...prev, imageUrl: previewUrl }));
    }
  };

  // Удаление предварительного просмотра изображения
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Проверка обязательных полей
      if (!formData.title || !formData.description || !formData.imageUrl || formData.categories.length === 0 || !formData.technique || !formData.dimensions) {
        throw new Error('Пожалуйста, заполните все обязательные поля');
      }
      
      // В реальном проекте здесь будет отправка данных на сервер
      // const response = await fetch('/api/artworks', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // Имитация задержки отправки
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Имитация успешного создания
      // В реальном проекте здесь будет проверка ответа от сервера
      
      // Перенаправление на страницу со списком произведений
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
                Название <span className="text-red-500">*</span>
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
                Описание <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="input w-full"
                placeholder="Введите описание произведения"
                required
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="categories" className="mb-2 block text-sm font-medium">
                Категории <span className="text-red-500">*</span>
              </label>
              <select
                id="categories"
                name="categories"
                value={formData.categories}
                onChange={handleCategoryChange}
                className="input w-full"
                multiple
                size={5}
                required
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Удерживайте Ctrl (Cmd на Mac) для выбора нескольких категорий
              </p>
            </div>
          </div>
          
          {/* Правая колонка - дополнительная информация и изображение */}
          <div className="space-y-6">
            <div>
              <label htmlFor="image" className="mb-2 block text-sm font-medium">
                Изображение <span className="text-red-500">*</span>
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
                  Год создания <span className="text-red-500">*</span>
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
                  required
                />
              </div>
              
              <div>
                <label htmlFor="technique" className="mb-2 block text-sm font-medium">
                  Техника <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="technique"
                  name="technique"
                  value={formData.technique}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Масло, холст"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dimensions" className="mb-2 block text-sm font-medium">
                  Размеры <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="100x80 см"
                  required
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