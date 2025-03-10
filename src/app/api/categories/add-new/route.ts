import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

const newCategories = [
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

export async function POST() {
  try {
    await connectToDatabase();
    
    // Добавляем каждую категорию, пропуская те, которые уже существуют
    for (const category of newCategories) {
      const exists = await Category.findOne({ name: category.name });
      if (!exists) {
        await Category.create(category);
      }
    }
    
    // Получаем обновленный список всех категорий
    const allCategories = await Category.find().sort({ name: 1 });
    
    return NextResponse.json({ 
      message: 'Новые категории успешно добавлены',
      categories: allCategories
    });
  } catch (error) {
    console.error('Ошибка при добавлении новых категорий:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении новых категорий' },
      { status: 500 }
    );
  }
} 