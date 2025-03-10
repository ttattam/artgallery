import Link from 'next/link';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background py-8">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium">Art Gallery</h3>
            <p className="text-sm text-muted-foreground">
              Галерея современного искусства с уникальными произведениями от талантливых художников.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium">Навигация</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Главная
              </Link>
              <Link href="/artworks" className="text-sm text-muted-foreground hover:text-foreground">
                Работы
              </Link>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground">
                Категории
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                О художнике
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Контакты
              </Link>
            </nav>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium">Контакты</h3>
            <p className="text-sm text-muted-foreground">
              Email: info@artgallery.com
            </p>
            <p className="text-sm text-muted-foreground">
              Телефон: +7 (999) 123-45-67
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <FiInstagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <FiTwitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <FiFacebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border/40 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Art Gallery. Все права защищены.
          </p>
          <Link href="/admin/login" className="mt-2 inline-block text-sm text-muted-foreground hover:text-foreground">
            Вход для администратора
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 