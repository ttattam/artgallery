'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiHome, 
  FiImage, 
  FiGrid, 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX 
} from 'react-icons/fi';

// Компонент для элемента бокового меню
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, href, isActive, onClick }: SidebarItemProps) => (
  <Link
    href={href}
    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-accent text-white'
        : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
    }`}
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </Link>
);

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Проверка, находимся ли мы на странице входа
  const isLoginPage = pathname === '/admin/login';

  // Эффект для установки isClient в true после монтирования компонента
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Если мы на странице входа, просто отображаем содержимое без административного интерфейса
  if (isLoginPage || !isClient) {
    return <>{children}</>;
  }

  // Обработчик выхода из системы
  const handleLogout = () => {
    // В реальном проекте здесь будет логика выхода из системы
    router.push('/admin/login');
  };

  // Переключение видимости бокового меню на мобильных устройствах
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Закрытие бокового меню после перехода по ссылке на мобильных устройствах
  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  // Элементы бокового меню
  const sidebarItems = [
    { icon: <FiHome size={18} />, label: 'Панель управления', href: '/admin/dashboard' },
    { icon: <FiImage size={18} />, label: 'Произведения', href: '/admin/artworks' },
    { icon: <FiGrid size={18} />, label: 'Категории', href: '/admin/categories' },
    { icon: <FiUser size={18} />, label: 'Профиль', href: '/admin/profile' },
    { icon: <FiSettings size={18} />, label: 'Настройки', href: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Верхняя панель */}
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
            {/* Кнопка меню для мобильных устройств */}
            <button
              className="mr-4 rounded-md p-2 text-muted-foreground hover:bg-accent/10 hover:text-foreground md:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            
            <Link href="/admin/dashboard" className="flex items-center space-x-2 no-underline">
              <span className="text-xl font-semibold tracking-tight">Art Gallery</span>
              <span className="rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                Админ
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Просмотр сайта
            </Link>
            <button
              className="flex items-center text-sm text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <FiLogOut className="mr-2" size={16} />
              Выйти
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Боковое меню */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 mt-16 w-64 transform border-r border-border bg-background transition-transform duration-300 md:static md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="flex flex-col space-y-1 p-4">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={pathname === item.href}
                onClick={closeSidebar}
              />
            ))}
          </nav>
        </aside>
        
        {/* Основное содержимое */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 