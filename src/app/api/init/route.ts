import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

const defaultCategories = [
  {
    name: 'Живопись',
    description: 'Картины, написанные маслом, акрилом и другими красками'
  },
  {
    name: 'Графика',
    description: 'Рисунки карандашом, тушью, пастелью'
  },
  {
    name: 'Скульптура',
    description: 'Трехмерные произведения искусства'
  },
  {
    name: 'Фотография',
    description: 'Художественная и документальная фотография'
  },
  {
    name: 'Цифровое искусство',
    description: 'Произведения, созданные с помощью компьютерных технологий'
  },
  {
    name: 'Инсталляция',
    description: 'Пространственные композиции из различных материалов'
  },
  {
    name: 'Акварель',
    description: 'Картины, написанные акварельными красками'
  },
  {
    name: 'Портрет',
    description: 'Изображения людей в различных техниках'
  },
  {
    name: 'Пейзаж',
    description: 'Изображения природы и городских видов'
  },
  {
    name: 'Абстракция',
    description: 'Беспредметное искусство, основанное на цвете и форме'
  },
  {
    name: 'Граффити - Оформление фасадов',
    description: 'Художественное оформление внешних стен зданий и сооружений'
  },
  {
    name: 'Граффити - Интерьерный дизайн',
    description: 'Художественное оформление внутренних помещений в стиле граффити'
  },
  {
    name: 'Стикеры Telegram',
    description: 'Разработка наборов стикеров для мессенджера Telegram'
  },
  {
    name: 'Брендинг',
    description: 'Разработка логотипов, фирменного стиля и брендбуков'
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Проверяем, есть ли уже категории в базе
    const existingCategories = await Category.find();
    
    if (existingCategories.length === 0) {
      // Если категорий нет, создаем базовые
      await Category.insertMany(defaultCategories);
      return NextResponse.json({ 
        message: 'Базовые категории успешно созданы',
        categories: defaultCategories
      });
    }
    
    return NextResponse.json({ 
      message: 'Категории уже существуют',
      categories: existingCategories
    });
  } catch (error) {
    console.error('Ошибка при инициализации категорий:', error);
    return NextResponse.json(
      { error: 'Ошибка при инициализации категорий' },
      { status: 500 }
    );
  }
} 