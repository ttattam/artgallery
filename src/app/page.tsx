import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { connectToDatabase } from '@/lib/mongodb';
import Artwork from '@/models/Artwork';

async function getFeaturedArtworks() {
  try {
    await connectToDatabase();
    const artworks = await Artwork.find({ isFeatured: true }).limit(3).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(artworks));
  } catch (error) {
    console.error('Ошибка при получении избранных работ:', error);
    return [];
  }
}

export default async function Home() {
  const featuredArtworks = await getFeaturedArtworks();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Art Gallery Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/90" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl md:text-6xl">
            Уникальные произведения современного искусства
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-black dark:text-white">
            Откройте для себя коллекцию работ талантливого художника, отражающих глубину эмоций и красоту окружающего мира
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link href="/artworks" className="btn bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400 text-lg px-8 py-4">
              Оставить заявку
            </Link>
            <Link href="/about" className="btn btn-secondary">
              О художнике
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="section bg-card">
        <div className="container">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Избранные работы</h2>
            <Link href="/artworks" className="flex items-center text-accent hover:underline">
              Все работы <FiArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredArtworks.map((artwork: {
              _id: string;
              title: string;
              imageUrl: string;
              technique: string;
              year: number;
            }) => (
              <Link key={artwork._id} href={`/artworks/${artwork._id}`} className="group overflow-hidden rounded-lg border border-border bg-background transition-all hover:shadow-md">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-1 text-xl font-medium">{artwork.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{artwork.technique}</span>
                    <span className="text-sm text-muted-foreground">{artwork.year}</span>
                  </div>
                </div>
              </Link>
            ))}
            {featuredArtworks.length === 0 && (
              <div className="col-span-3 text-center text-muted-foreground py-12">
                Пока нет избранных работ
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 text-3xl font-bold tracking-tight">О художнике</h2>
              <p className="mb-4 text-muted-foreground">
                Талантливый современный художник, чьи работы отражают уникальное видение мира через призму эмоций и впечатлений. Каждое произведение — это история, рассказанная языком цвета и формы.
              </p>
              <p className="mb-6 text-muted-foreground">
                Работы художника находятся в частных коллекциях по всему миру и регулярно экспонируются на международных выставках современного искусства.
              </p>
              <Link href="/about" className="btn btn-primary self-start">
                Подробнее
              </Link>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Художник за работой"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section bg-card">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground dark:text-white">Категории работ</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Абстракция',
                description: 'Беспредметное искусство, основанное на цвете и форме'
              },
              {
                title: 'Акварель',
                description: 'Картины, написанные акварельными красками'
              },
              {
                title: 'Брендинг',
                description: 'Разработка логотипов, фирменного стиля и брендбуков'
              },
              {
                title: 'Графика',
                description: 'Рисунки карандашом, тушью, пастелью'
              },
              {
                title: 'Граффити - Интерьерный дизайн',
                description: 'Художественное оформление внутренних помещений в стиле граффити'
              },
              {
                title: 'Граффити - Оформление фасадов',
                description: 'Художественное оформление внешних стен зданий и сооружений'
              },
              {
                title: 'Живопись',
                description: 'Картины, написанные маслом, акрилом и другими красками'
              },
              {
                title: 'Инсталляция',
                description: 'Пространственные композиции из различных материалов'
              }
            ].map((category) => (
              <Link
                key={category.title}
                href={`/categories/${category.title.toLowerCase()}`}
                className="group flex flex-col items-center rounded-lg border border-border bg-background p-6 text-center transition-all hover:shadow-md hover:bg-accent/5 dark:hover:bg-accent/20"
              >
                <h3 className="mb-3 text-xl font-medium text-foreground dark:text-white">{category.title}</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-300">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section bg-accent text-white">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white">Заинтересованы в приобретении?</h2>
          <p className="mb-8 mx-auto max-w-2xl text-white/90">
            Свяжитесь с нами для получения дополнительной информации о работах, ценах и возможности заказа персональных произведений.
          </p>
          <Link href="/contact" className="btn bg-white text-accent hover:bg-white/90">
            Связаться
          </Link>
        </div>
      </section>
    </div>
  );
}
