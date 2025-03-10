'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiImage, FiGrid, FiEye, FiPlus, FiTrendingUp, FiCalendar } from 'react-icons/fi';

// Компонент карточки статистики
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const StatCard = ({ title, value, icon, description, color }: StatCardProps) => (
  <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="mt-2 text-3xl font-bold">{value}</h3>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}>
        {icon}
      </div>
    </div>
    <p className="mt-4 text-sm text-muted-foreground">{description}</p>
  </div>
);

// Компонент карточки действия
interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const ActionCard = ({ title, description, icon, href, color }: ActionCardProps) => (
  <Link
    href={href}
    className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
  >
    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${color}`}>
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-medium">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Link>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalCategories: 0,
    totalViews: 0,
    recentlyAdded: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка статистики
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // В реальном проекте здесь будет запрос к API для получения статистики
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();
        
        // Имитация задержки загрузки данных
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Имитация данных статистики
        setStats({
          totalArtworks: 24,
          totalCategories: 5,
          totalViews: 1250,
          recentlyAdded: 3,
        });
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Карточки статистики
  const statCards = [
    {
      title: 'Всего произведений',
      value: stats.totalArtworks,
      icon: <FiImage className="h-6 w-6 text-white" />,
      description: 'Общее количество произведений в галерее',
      color: 'bg-blue-500',
    },
    {
      title: 'Категории',
      value: stats.totalCategories,
      icon: <FiGrid className="h-6 w-6 text-white" />,
      description: 'Количество категорий произведений',
      color: 'bg-purple-500',
    },
    {
      title: 'Просмотры',
      value: stats.totalViews,
      icon: <FiEye className="h-6 w-6 text-white" />,
      description: 'Общее количество просмотров произведений',
      color: 'bg-green-500',
    },
    {
      title: 'Недавно добавлено',
      value: stats.recentlyAdded,
      icon: <FiCalendar className="h-6 w-6 text-white" />,
      description: 'Произведения, добавленные за последние 30 дней',
      color: 'bg-amber-500',
    },
  ];

  // Карточки действий
  const actionCards = [
    {
      title: 'Добавить произведение',
      description: 'Загрузите новое произведение искусства в галерею',
      icon: <FiPlus className="h-6 w-6 text-white" />,
      href: '/admin/artworks/new',
      color: 'bg-accent',
    },
    {
      title: 'Управление категориями',
      description: 'Создавайте и редактируйте категории произведений',
      icon: <FiGrid className="h-6 w-6 text-white" />,
      href: '/admin/categories',
      color: 'bg-purple-500',
    },
    {
      title: 'Аналитика',
      description: 'Просмотр статистики посещений и популярности работ',
      icon: <FiTrendingUp className="h-6 w-6 text-white" />,
      href: '/admin/analytics',
      color: 'bg-green-500',
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Панель управления</h1>
      
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-accent"></div>
        </div>
      ) : (
        <>
          {/* Статистика */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-medium">Статистика</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card, index) => (
                <StatCard key={index} {...card} />
              ))}
            </div>
          </section>
          
          {/* Быстрые действия */}
          <section>
            <h2 className="mb-4 text-xl font-medium">Быстрые действия</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {actionCards.map((card, index) => (
                <ActionCard key={index} {...card} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
} 