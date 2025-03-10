'use client';

import { useState, FormEvent } from 'react';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // В реальном проекте здесь будет отправка данных на сервер
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // Имитация задержки отправки
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Имитация успешной отправки
      setSubmitStatus({
        success: true,
        message: 'Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.',
      });
      
      // Сброс формы после успешной отправки
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      setSubmitStatus({
        success: false,
        message: 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз позже.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Контакты</h1>
      
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-medium">Свяжитесь с нами</h2>
          
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Если у вас есть вопросы о работах художника, интерес к приобретению произведений или предложения о сотрудничестве, пожалуйста, заполните форму или свяжитесь с нами напрямую.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <FiMail className="mr-4 h-5 w-5 text-accent" />
                <span>info@artgallery.com</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="mr-4 h-5 w-5 text-accent" />
                <span>+7 (999) 123-45-67</span>
              </div>
              <div className="flex items-center">
                <FiMapPin className="mr-4 h-5 w-5 text-accent" />
                <span>г. Москва, ул. Примерная, д. 123</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Социальные сети</h3>
              <div className="flex space-x-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-muted-foreground hover:text-foreground">
                  <FiInstagram className="mr-2 h-5 w-5" />
                  <span>Instagram</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-muted-foreground hover:text-foreground">
                  <FiTwitter className="mr-2 h-5 w-5" />
                  <span>Twitter</span>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-muted-foreground hover:text-foreground">
                  <FiFacebook className="mr-2 h-5 w-5" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="mb-6 text-2xl font-medium">Форма обратной связи</h2>
          
          {submitStatus && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                submitStatus.success
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Ваше имя <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input w-full"
                placeholder="Введите ваше имя"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input w-full"
                placeholder="Введите ваш email"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                Тема <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="input w-full"
              >
                <option value="">Выберите тему</option>
                <option value="purchase">Приобретение работы</option>
                <option value="commission">Заказ персональной работы</option>
                <option value="exhibition">Выставки и мероприятия</option>
                <option value="other">Другое</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium">
                Сообщение <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="input w-full"
                placeholder="Введите ваше сообщение"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 