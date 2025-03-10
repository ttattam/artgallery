'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiRefreshCw, FiPlusCircle } from 'react-icons/fi';

interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загрузка категорий
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      
      // Сначала пытаемся инициализировать категории
      await fetch('/api/init');
      
      // Затем загружаем список категорий
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить категории');
      }
      
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке категорий:', err);
      setError('Произошла ошибка при загрузке категорий');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Добавление новой категории
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при создании категории');
      }
      
      // Очищаем форму и обновляем список категорий
      setNewCategory({ name: '', description: '' });
      await fetchCategories();
    } catch (err: any) {
      console.error('Ошибка при создании категории:', err);
      setError(err.message || 'Произошла ошибка при создании категории');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Удаление категории
  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Не удалось удалить категорию');
      }
      
      // Обновляем список категорий
      await fetchCategories();
    } catch (err) {
      console.error('Ошибка при удалении категории:', err);
      setError('Произошла ошибка при удалении категории');
    }
  };

  // Сброс категорий
  const handleReset = async () => {
    if (!window.confirm('Вы уверены, что хотите сбросить все категории? Это действие нельзя отменить.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Сначала удаляем все категории
      const resetResponse = await fetch('/api/categories/reset', {
        method: 'POST'
      });
      
      if (!resetResponse.ok) {
        throw new Error('Не удалось сбросить категории');
      }
      
      // Затем заново инициализируем базовые категории
      await fetch('/api/init');
      
      // И обновляем список
      await fetchCategories();
      
    } catch (err) {
      console.error('Ошибка при сбросе категорий:', err);
      setError('Произошла ошибка при сбросе категорий');
    } finally {
      setIsLoading(false);
    }
  };

  // Добавление новых категорий
  const handleAddNewCategories = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/categories/add-new', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Не удалось добавить новые категории');
      }
      
      // Обновляем список категорий
      await fetchCategories();
      
    } catch (err) {
      console.error('Ошибка при добавлении новых категорий:', err);
      setError('Произошла ошибка при добавлении новых категорий');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Управление категориями</h1>
        <div className="flex gap-4">
          <button
            onClick={handleAddNewCategories}
            className="btn btn-primary inline-flex items-center"
            disabled={isLoading}
          >
            <FiPlusCircle className="mr-2" />
            Добавить новые категории
          </button>
          <button
            onClick={handleReset}
            className="btn btn-secondary inline-flex items-center"
            disabled={isLoading}
          >
            <FiRefreshCw className="mr-2" />
            Сбросить категории
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}
      
      {/* Форма добавления категории */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Название категории
            </label>
            <input
              type="text"
              id="name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="input w-full"
              placeholder="Введите название категории"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium">
              Описание (необязательно)
            </label>
            <input
              type="text"
              id="description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="input w-full"
              placeholder="Введите описание категории"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary mt-4 inline-flex items-center"
        >
          <FiPlus className="mr-2" />
          {isSubmitting ? 'Добавление...' : 'Добавить категорию'}
        </button>
      </form>
      
      {/* Список категорий */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-accent"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Нет доступных категорий</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full">
            <thead className="bg-card">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Название</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Описание</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((category) => (
                <tr key={category._id} className="bg-background hover:bg-card/50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{category.name}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {category.description || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="rounded-md p-2 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      title="Удалить"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 