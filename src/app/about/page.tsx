import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">О художнике</h1>
      
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Художник за работой"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="flex flex-col justify-center">
          <h2 className="mb-4 text-2xl font-medium">Имя Художника</h2>
          
          <div className="space-y-4 text-muted-foreground">
            <p>
              Талантливый современный художник, чьи работы отражают уникальное видение мира через призму эмоций и впечатлений. Каждое произведение — это история, рассказанная языком цвета и формы.
            </p>
            <p>
              Родился в [год] в [город]. Окончил [учебное заведение] по специальности [специальность]. С [год] активно участвует в выставках современного искусства в России и за рубежом.
            </p>
            <p>
              Работы художника находятся в частных коллекциях по всему миру и регулярно экспонируются на международных выставках современного искусства.
            </p>
          </div>
          
          <div className="mt-8">
            <Link href="/contact" className="btn btn-primary">
              Связаться с художником
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="mb-8 text-3xl font-bold tracking-tight">Творческий путь</h2>
        
        <div className="space-y-8">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-2 text-xl font-medium">Образование</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>[Год] - [Учебное заведение], [Специальность]</li>
              <li>[Год] - [Курс/Мастер-класс], [Место проведения]</li>
              <li>[Год] - [Стажировка], [Место проведения]</li>
            </ul>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-2 text-xl font-medium">Выставки</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>[Год] - [Название выставки], [Место проведения]</li>
              <li>[Год] - [Название выставки], [Место проведения]</li>
              <li>[Год] - [Название выставки], [Место проведения]</li>
              <li>[Год] - [Название выставки], [Место проведения]</li>
              <li>[Год] - [Название выставки], [Место проведения]</li>
            </ul>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-2 text-xl font-medium">Награды и признание</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>[Год] - [Название награды/премии]</li>
              <li>[Год] - [Название награды/премии]</li>
              <li>[Год] - [Название награды/премии]</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="mb-8 text-3xl font-bold tracking-tight">Художественный стиль</h2>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4 text-muted-foreground">
            <p>
              Творчество художника характеризуется уникальным сочетанием традиционных техник и современных подходов к искусству. В своих работах автор исследует темы [тема 1], [тема 2] и [тема 3], создавая многослойные произведения, которые приглашают зрителя к диалогу и размышлению.
            </p>
            <p>
              Отличительной чертой стиля является [особенность стиля], а также особое внимание к [элемент творчества]. Каждая работа — это результат глубокого исследования и эмоционального переживания, воплощенного в материальной форме.
            </p>
            <p>
              Художник работает в различных техниках, включая [техника 1], [техника 2] и [техника 3], постоянно экспериментируя с материалами и методами для достижения наиболее выразительного результата.
            </p>
          </div>
          
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
              alt="Произведение искусства"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Интересуетесь работами художника?</h2>
        <p className="mb-8 text-muted-foreground">
          Свяжитесь с нами для получения дополнительной информации о работах, ценах и возможности заказа персональных произведений.
        </p>
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link href="/artworks" className="btn btn-primary">
            Смотреть работы
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Связаться
          </Link>
        </div>
      </div>
    </div>
  );
} 