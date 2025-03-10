'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ 
    name: '',
    description: '' 
  });

  // Загрузка категорий
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Ошибка при загрузке категорий');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Не удалось загрузить категории');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Открытие модального окна для создания/редактирования
  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const body = editingCategory 
        ? { ...formData, _id: editingCategory._id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Ошибка при сохранении категории');

      await fetchCategories();
      closeModal();
    } catch (err) {
      setError('Не удалось сохранить категорию');
      console.error(err);
    }
  };

  // Удаление категории
  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Ошибка при удалении категории');

      await fetchCategories();
    } catch (err) {
      setError('Не удалось удалить категорию');
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="p-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Категории</h1>
        <button
          onClick={() => openModal()}
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Добавить категорию
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category._id}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.slug}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(category)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                  title="Редактировать"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                  title="Удалить"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            {category.description && (
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full rounded-lg border border-border p-8 text-center text-muted-foreground">
            Нет категорий
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6">
            <h2 className="mb-4 text-xl font-semibold">
              {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Название
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input w-full"
                    placeholder="Введите название категории"
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
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input w-full"
                    placeholder="Введите описание категории"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/10"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingCategory ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 