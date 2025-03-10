'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiLock } from 'react-icons/fi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // В реальном проекте здесь будет отправка данных на сервер для аутентификации
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // Имитация задержки аутентификации
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Имитация успешной аутентификации
      // В реальном проекте здесь будет проверка ответа от сервера
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.error || 'Ошибка аутентификации');
      // }
      
      // Перенаправление на панель управления
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Ошибка при входе:', err);
      setError(err.message || 'Неверный email или пароль');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <FiLock size={24} />
          </div>
          <h1 className="text-2xl font-bold">Вход в панель управления</h1>
          <p className="text-center text-muted-foreground">
            Введите свои учетные данные для доступа к панели управления
          </p>
        </div>
        
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input w-full"
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input w-full"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="text-accent hover:underline">
            Вернуться на главную страницу
          </Link>
        </div>
      </div>
    </div>
  );
} 